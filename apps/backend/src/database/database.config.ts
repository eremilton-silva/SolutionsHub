import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigService } from '../common/config/app-config.service';

export const createTypeOrmConfig = (
  appConfigService: AppConfigService,
): TypeOrmModuleOptions => {
  const dbConfig = appConfigService.databaseConfig;
  const appConfig = appConfigService.appConfig;

  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: appConfig.nodeEnv === 'development',
    logging: appConfig.nodeEnv === 'development',
    ssl: appConfig.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  };
};
