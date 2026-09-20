import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RolesGuard} from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Users } from 'src/users/users.model';
import { ProductsController } from './products.controller';
import { Products } from './products.model';
import { ProductsService } from './products.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Products, Users]),

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
  controllers: [ProductsController],
  providers: [ProductsService, JwtAuthGuard, RolesGuard],
  exports: [ProductsService],
})
export class ProductsModule {}