import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { Users } from './users.model';
import { UsersService } from './users.service';
import { UsersController } from './user.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Users]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mini-ecommerce-secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
