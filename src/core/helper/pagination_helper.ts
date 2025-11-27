import _ from 'lodash';
import { Request } from 'express';
import { addDays, parseISO } from 'date-fns';
import { SQL, sql, and, gte, lt, eq, inArray, ne, desc, asc } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';

interface PaginationResult<T> {
  totalRecords: number;
  records: T[];
  perPage: number;
  currentPage: number;
  next: number | null;
  prev: number | null;
  totalPages: number;
  pagingCounter: number;
  hasPrevious: boolean;
  hasNext: boolean;
  recordShown: number;
}

export interface PopulateConfig {
  path: string;
  field: string;
  table: any;
  select?: any;
}

export const paginatedData = async <T extends PgTable, TResult = any>(
  db: any,
  table: T,
  match: Record<string, any> = {},
  sort: Record<string, any> = {},
  page: number = 1,
  perPage: number = 10,
  selectFields?: any,
  populate?: PopulateConfig[]
): Promise<PaginationResult<TResult>> => {
  let sortField: string | null = null;
  let sortOrder: 'asc' | 'desc' = 'desc';

  if (Object.keys(sort).length === 1) {
    const key = Object.keys(sort)[0];
    const value = sort[key];
    sortOrder = value === 1 ? 'asc' : 'desc';

    if (key === 'createdDate') {
      sortField = 'createdAt';
    } else if (key === 'updatedDate') {
      sortField = 'updatedAt';
    } else if (key === 'id') {
      sortField = 'id';
    } else {
      sortField = key;
    }
  }

  // Handle match field mapping
  let matchConditions: Record<string, any> = { ...match };

  if (match.createdDate) {
    matchConditions.createdAt = match.createdDate;
    delete matchConditions.createdDate;
  }

  if (match.updatedDate) {
    matchConditions.updatedAt = match.updatedDate;
    delete matchConditions.updatedDate;
  }

  if (match.id) {
    matchConditions.id = match.id;
  }

  // Build WHERE conditions
  const whereConditions: (SQL | undefined)[] = [];

  // Add deleted = false condition (soft delete)
  if ('deleted' in table) {
    whereConditions.push(eq(table.deleted as any, false));
  }

  // Add match conditions
  Object.entries(matchConditions).forEach(([key, value]) => {
    if (!(key in table)) return;

    const column = table[key as keyof typeof table] as any;

    if (value === null) {
      whereConditions.push(sql`${column} IS NULL`);
      return;
    }

    if (value === undefined) {
      return;
    }

    if (value instanceof Date) {
      whereConditions.push(eq(column, value));
      return;
    }

    if (Array.isArray(value)) {
      whereConditions.push(inArray(column, value));
      return;
    }

    if (typeof value === 'object' && value !== null) {
      const conditions: (SQL | undefined)[] = [];

      if (value.$gte !== undefined) {
        conditions.push(gte(column, value.$gte));
      }
      if (value.$gt !== undefined) {
        conditions.push(sql`${column} > ${value.$gt}`);
      }
      if (value.$lte !== undefined) {
        conditions.push(sql`${column} <= ${value.$lte}`);
      }
      if (value.$lt !== undefined) {
        conditions.push(lt(column, value.$lt));
      }
      if (value.$ne !== undefined) {
        conditions.push(ne(column, value.$ne));
      }
      if (value.$in !== undefined && Array.isArray(value.$in)) {
        conditions.push(inArray(column, value.$in));
      }
      if (value.$nin !== undefined && Array.isArray(value.$nin)) {
        conditions.push(sql`${column} NOT IN ${value.$nin}`);
      }
      if (value.$exists !== undefined) {
        if (value.$exists) {
          conditions.push(sql`${column} IS NOT NULL`);
        } else {
          conditions.push(sql`${column} IS NULL`);
        }
      }
      if (value.$regex !== undefined) {
        const pattern = value.$regex.toString().replace(/^\/|\/[gimuy]*$/g, '');
        conditions.push(sql`${column} ~* ${pattern}`);
      }

      if (conditions.length > 0) {
        const filtered = conditions.filter((c): c is SQL => c !== undefined);
        if (filtered.length === 1) {
          whereConditions.push(filtered[0]);
        } else if (filtered.length > 1) {
          whereConditions.push(and(...filtered));
        }
      }
    } else {
      whereConditions.push(eq(column, value));
    }
  });

  const filteredConditions = whereConditions.filter((c): c is SQL => c !== undefined);
  const whereClause = filteredConditions.length > 0 ? and(...filteredConditions) : undefined;

  const offset = (page - 1) * perPage;

  // Build query with joins
  let query = db.select(selectFields).from(table);

  // Add LEFT JOINs for populate
  if (populate && populate.length > 0) {
    populate.forEach(pop => {
      const foreignKeyColumn = table[pop.field as keyof typeof table] as any;
      const joinedTableIdColumn = (pop.table as any).id;

      if (foreignKeyColumn && joinedTableIdColumn) {
        query = query.leftJoin(pop.table, eq(foreignKeyColumn, joinedTableIdColumn));
      }
    });
  }

  if (whereClause) {
    query = query.where(whereClause);
  }

  // Add sorting
  if (sortField && sortField in table) {
    const sortColumn = table[sortField as keyof typeof table] as any;
    query = query.orderBy(sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn));
  } else if ('createdAt' in table) {
    query = query.orderBy(desc(table.createdAt as any));
  }

  query = query.limit(perPage).offset(offset);

  const rawRecords = await query;

  // Transform records - flatten and replace foreign key fields with populated objects
  const records = rawRecords.map((record: any) => {
    if (!populate || populate.length === 0) {
      return record;
    }

    const result: any = {};

    // Extract main table data - find the key that's not in populate paths
    const populatePaths = populate.map(p => p.path);
    const mainTableKey = Object.keys(record).find(key => !populatePaths.includes(key));

    // Copy main table data to result
    if (mainTableKey && record[mainTableKey]) {
      Object.assign(result, record[mainTableKey]);
    }

    // Replace foreign key fields with populated data
    populate.forEach(pop => {
      // Look for the populated data using the path name
      if (record[pop.path]) {
        const hasData = Object.values(record[pop.path]).some(v => v !== null);

        if (hasData) {
          const populatedObj = { ...record[pop.path] };

          // Apply select filter if specified
          if (pop.select) {
            const selectKeys = Object.keys(pop.select);
            const isExclusion = selectKeys.some(key => pop.select[key] === 0);

            if (isExclusion) {
              // Exclusion mode: remove fields with 0
              selectKeys.forEach(key => {
                if (pop.select[key] === 0) {
                  delete populatedObj[key];
                }
              });
              result[pop.field] = populatedObj;
            } else {
              // Inclusion mode: only include fields with 1
              const filteredObj: any = {};
              selectKeys.forEach(key => {
                if (pop.select[key] === 1 && key in populatedObj) {
                  filteredObj[key] = populatedObj[key];
                }
              });
              result[pop.field] = filteredObj;
            }
          } else {
            result[pop.field] = populatedObj;
          }
        } else {
          result[pop.field] = null;
        }
      } else {
        // Keep the original foreign key value if no populated data
        result[pop.field] = result[pop.field] || null;
      }
    });

    return result;
  });

  // Get total count
  let countQuery = db.select({ count: sql<number>`cast(count(*) as integer)` }).from(table);
  if (whereClause) {
    countQuery = countQuery.where(whereClause);
  }

  const countResult = await countQuery;
  const totalRecords = countResult[0]?.count ? Number(countResult[0].count) : 0;

  const totalPages = Math.ceil(totalRecords / perPage);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;
  const next = hasNext ? page + 1 : null;
  const prev = hasPrevious ? page - 1 : null;
  const pagingCounter = offset + 1;
  const recordShown = records.length > 0 ? records.length + pagingCounter - 1 : totalRecords;

  return {
    records: records as TResult[],
    perPage,
    currentPage: page,
    next,
    prev,
    totalPages,
    totalRecords,
    pagingCounter,
    hasPrevious,
    hasNext,
    recordShown,
  };
};

export const getMatchAndSortData = async (req: Request) => {
  let matchData: Record<string, any> = {};
  let sortData: Record<string, any> = { createdAt: -1 };

  if (req.query.sortBy || req.query.orderBy) {
    const orderBy = req.query.orderBy ? req.query.orderBy : 'desc';
    sortData[req.query.sortBy as string] = orderBy === 'desc' ? -1 : 1;
  }

  if (req.query.startDate && req.query.endDate) {
    matchData['createdAt'] = {
      $gte: parseISO(req.query.startDate as string),
      $lt: addDays(parseISO(req.query.endDate as string), 1),
    };
  } else if (req.query.startDate) {
    matchData['createdAt'] = {
      $gte: parseISO(req.query.startDate as string),
    };
  } else if (req.query.endDate) {
    matchData['createdAt'] = {
      $lt: addDays(parseISO(req.query.endDate as string), 1),
    };
  }

  if (req.query.createdDate) {
    matchData['createdAt'] = {
      $gte: parseISO(req.query.createdDate as string),
      $lt: addDays(parseISO(req.query.createdDate as string), 1),
    };
  }

  if (req.query.updatedDate) {
    matchData['updatedAt'] = {
      $gte: parseISO(req.query.updatedDate as string),
      $lt: addDays(parseISO(req.query.updatedDate as string), 1),
    };
  }

  return {
    matchData,
    sortData,
  };
};

/**
 * Transform a single record with populated joins into a flat structure
 * @param record - The record with joined tables (e.g., { application: {...}, profile: {...}, user: {...} })
 * @param mainKey - The key of the main table data (e.g., 'application')
 * @param populate - Array of populate configs to transform joined data
 * @returns Flattened record with populated data replacing foreign key fields
 *
 * @example
 * const result = await db.select({
 *   application: applications,
 *   profile: profiles,
 *   user: users
 * })
 * .from(applications)
 * .leftJoin(profiles, eq(applications.profileId, profiles.id))
 * .leftJoin(users, eq(applications.userId, users.id))
 * .where(eq(applications.id, id))
 * .limit(1);
 *
 * const transformed = transformPopulatedRecord(result[0], 'application', [
 *   { path: 'profile', field: 'profileId', table: profiles },
 *   { path: 'user', field: 'userId', table: users, select: { password: 0 } }
 * ]);
 *
 * // Result: { id, applicationNo, ..., profileId: {...profile data}, userId: {...user data without password} }
 */
export const transformPopulatedRecord = <T = any>(
  record: any,
  mainKey: string,
  populate: PopulateConfig[]
): T | null => {
  if (!record) return null;

  const result: any = {};

  // Copy main table data to result
  if (record[mainKey]) {
    Object.assign(result, record[mainKey]);
  }

  // Replace foreign key fields with populated data
  populate.forEach(pop => {
    if (record[pop.path]) {
      const hasData = Object.values(record[pop.path]).some(v => v !== null);

      if (hasData) {
        const populatedObj = { ...record[pop.path] };

        // Apply select filter if specified
        if (pop.select) {
          const selectKeys = Object.keys(pop.select);
          const isExclusion = selectKeys.some(key => pop.select[key] === 0);

          if (isExclusion) {
            // Exclusion mode: remove fields with 0
            selectKeys.forEach(key => {
              if (pop.select[key] === 0) {
                delete populatedObj[key];
              }
            });
            result[pop.field] = populatedObj;
          } else {
            // Inclusion mode: only include fields with 1
            const filteredObj: any = {};
            selectKeys.forEach(key => {
              if (pop.select[key] === 1 && key in populatedObj) {
                filteredObj[key] = populatedObj[key];
              }
            });
            result[pop.field] = filteredObj;
          }
        } else {
          result[pop.field] = populatedObj;
        }
      } else {
        result[pop.field] = null;
      }
    } else {
      result[pop.field] = result[pop.field] || null;
    }
  });

  return result as T;
};

/**
 * Fetch a single record with populated joins
 * @param db - Database instance
 * @param table - Main table to query
 * @param match - Match conditions for WHERE clause
 * @param populate - Array of populate configs for joins
 * @returns Single record with populated data or null
 *
 * @example
 * const application = await getPopulatedRecord(
 *   db,
 *   applications,
 *   { id: 'ba31c446-f134-40ef-9665-eac22c082d53' },
 *   [
 *     { path: 'users', field: 'userId', table: users, select: { password: 0 } },
 *     { path: 'profiles', field: 'profileId', table: profiles },
 *     { path: 'courses', field: 'courseId', table: courses }
 *   ]
 * );
 */
export const getPopulatedRecord = async <T extends PgTable, TResult = any>(
  db: any,
  table: T,
  match: Record<string, any> = {},
  populate?: PopulateConfig[]
): Promise<TResult | null> => {
  // Build WHERE conditions (reuse logic from paginatedData)
  const whereConditions: (SQL | undefined)[] = [];

  // Add deleted = false condition (soft delete)
  if ('deleted' in table) {
    whereConditions.push(eq(table.deleted as any, false));
  }

  // Add match conditions
  Object.entries(match).forEach(([key, value]) => {
    if (!(key in table)) return;

    const column = table[key as keyof typeof table] as any;

    if (value === null) {
      whereConditions.push(sql`${column} IS NULL`);
      return;
    }

    if (value === undefined) {
      return;
    }

    if (value instanceof Date) {
      whereConditions.push(eq(column, value));
      return;
    }

    if (Array.isArray(value)) {
      whereConditions.push(inArray(column, value));
      return;
    }

    whereConditions.push(eq(column, value));
  });

  const filteredConditions = whereConditions.filter((c): c is SQL => c !== undefined);
  const whereClause = filteredConditions.length > 0 ? and(...filteredConditions) : undefined;

  // Build query with joins
  let query = db.select().from(table);

  // Add LEFT JOINs for populate
  if (populate && populate.length > 0) {
    populate.forEach(pop => {
      const foreignKeyColumn = table[pop.field as keyof typeof table] as any;
      const joinedTableIdColumn = (pop.table as any).id;

      if (foreignKeyColumn && joinedTableIdColumn) {
        query = query.leftJoin(pop.table, eq(foreignKeyColumn, joinedTableIdColumn));
      }
    });
  }

  if (whereClause) {
    query = query.where(whereClause);
  }

  query = query.limit(1);

  const result = await query;

  if (!result || result.length === 0) return null;

  const record = result[0];

  // If no populate, return as is
  if (!populate || populate.length === 0) {
    return record as TResult;
  }

  // Transform the record
  const transformedResult: any = {};

  // Extract main table data - find the key that's not in populate paths
  const populatePaths = populate.map(p => p.path);
  const mainTableKey = Object.keys(record).find(key => !populatePaths.includes(key));

  // Copy main table data to result
  if (mainTableKey && record[mainTableKey]) {
    Object.assign(transformedResult, record[mainTableKey]);
  }

  // Replace foreign key fields with populated data
  populate.forEach(pop => {
    if (record[pop.path]) {
      const hasData = Object.values(record[pop.path]).some(v => v !== null);

      if (hasData) {
        const populatedObj = { ...record[pop.path] };

        // Apply select filter if specified
        if (pop.select) {
          const selectKeys = Object.keys(pop.select);
          const isExclusion = selectKeys.some(key => pop.select[key] === 0);

          if (isExclusion) {
            selectKeys.forEach(key => {
              if (pop.select[key] === 0) {
                delete populatedObj[key];
              }
            });
            transformedResult[pop.field] = populatedObj;
          } else {
            const filteredObj: any = {};
            selectKeys.forEach(key => {
              if (pop.select[key] === 1 && key in populatedObj) {
                filteredObj[key] = populatedObj[key];
              }
            });
            transformedResult[pop.field] = filteredObj;
          }
        } else {
          transformedResult[pop.field] = populatedObj;
        }
      } else {
        transformedResult[pop.field] = null;
      }
    } else {
      transformedResult[pop.field] = transformedResult[pop.field] || null;
    }
  });

  return transformedResult as TResult;
};
