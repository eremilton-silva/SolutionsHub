import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigService } from '../common/config/app-config.service';

export const createTypeOrmConfig = (
  appConfigService: AppConfigService,
): TypeOrmModuleOptions => {
  const dbConfig = appConfigService.databaseConfig;
  const appConfig = appConfigService.appConfig;

  // Use SQLite for development if PostgreSQL is not available
  if (appConfig.nodeEnv === 'development') {
    return {
      type: 'sqlite',
      database: './solution_hub_dev.sqlite',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: true,
      logging: true,
    };
  }

  // Production PostgreSQL configuration
  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: false,
    ssl: { rejectUnauthorized: false },
  };
};
