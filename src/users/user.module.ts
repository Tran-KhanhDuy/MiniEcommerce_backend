import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Products } from 'src/products/products.model';
import { Users } from './user.model';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([Users, Products]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard],
  exports: [UsersService],
})
export class UsersModule {}
