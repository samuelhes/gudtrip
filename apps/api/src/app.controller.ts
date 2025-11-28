import { Controller, Get } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
    @Get('version')
    getVersion() {
        try {
            const packageJsonPath = path.join(process.cwd(), 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

            return {
                appVersion: packageJson.version,
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            return {
                appVersion: 'unknown',
                error: 'Could not read package.json',
            };
        }
    }
}
