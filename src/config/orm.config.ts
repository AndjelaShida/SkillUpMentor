import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const ORMConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
  const isSslEnabled = configService.get<string>('DATABASE_SSL') === 'true'

  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PWD'),
    database: configService.get<string>('DATABASE_NAME'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'], // Dinamička detekcija entiteta
    synchronize: true, // Samo za razvoj
    extra: isSslEnabled
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
  }
}
