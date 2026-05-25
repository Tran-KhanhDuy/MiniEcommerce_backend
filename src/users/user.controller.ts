import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  CreateUserDto,
  GetUsersFilterDto,
  LoginDto,
  UpdateUserDto,
} from './user.dto';
import { UsersService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { PagingDto } from 'src/common/dto/paging.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
  })
  login(@Body() loginDto: LoginDto, @Headers('language') language = 'vi') {
    return this.usersService.login(loginDto, language);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new user',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  createUser(
    @Body() createUserDto: CreateUserDto,
    @Headers('language') language = 'vi',
  ) {
    return this.usersService.createUser(createUserDto, language);
  }

  @Get()
  @ApiOperation({
    summary: 'Get users list',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAllUser(@Query() query: GetUsersFilterDto, @Query() paging: PagingDto) {
    return this.usersService.findAllUser(query, paging);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user detail',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  findOneUser(
    @Param('id', ParseIntPipe) id: number,
    @Headers('language') language = 'vi',
  ) {
    return this.usersService.findOneUser(id, language);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('language') language = 'vi',
  ) {
    return this.usersService.updateUser(id, updateUserDto, language);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Headers('language') language = 'vi',
  ) {
    return this.usersService.deleteUser(id, language);
  }
}
