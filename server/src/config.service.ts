import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotEnv from 'dotenv';
dotEnv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string): string {
    const value = this.env[key];
    if (!value) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  private getOptionalValue(key: string, defaultValue: string): string {
    return this.env[key] ?? defaultValue;
  }

  public requiresValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k));
    return this;
  }

  get hostname() {
    return this.getValue('APP_SERVER_HOSTNAME');
  }

  get port() {
    return this.getValue('APP_SERVER_PORT');
  }

  get isProduction() {
    const mode = this.getOptionalValue('MODE', 'DEV');
    return mode !== 'DEV';
  }

  get dbConfig(): any {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT'), 10),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: ['dist/app/**/*.entity.js'],
      ssl: this.isProduction,
      autoLoadEntities: true,
      synchronize: false,
      migrations: ['dist/infra/database/typeorm/migrations/*.js'],
      cli: {
        migrationsDir: 'src/db/migrations',
      },
      logging: true,
    };
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    return this.dbConfig;
  }
}

const configService = new ConfigService(process.env).requiresValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
]);

export { configService };
