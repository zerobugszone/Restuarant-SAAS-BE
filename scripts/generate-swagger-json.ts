import { swaggerSpec } from '../src/core/config/swagger.config';
import { writeFileSync } from 'fs';

writeFileSync('swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('swagger.json generated');
