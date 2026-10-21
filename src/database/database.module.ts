import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST') || 'localhost';
        const dbPort = Number(configService.get<string>('DB_PORT') || 3306);
        const dbUsername = configService.get<string>('DB_USERNAME') || 'root';
        const dbPassword = configService.get<string>('DB_PASSWORD') || '';
        const dbDatabase =
          configService.get<string>('DB_DATABASE') || 'miniecommerce';

        return {
          dialect: 'mysql',
          host: dbHost,
          port: dbPort,
          username: dbUsername,
          password: dbPassword,
          database: dbDatabase,
          autoLoadModels: true,
          synchronize: false,
          logging: false,
          define: {
            timestamps: true,
            freezeTableName: true,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
