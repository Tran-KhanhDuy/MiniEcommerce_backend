import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './users.dto';
import { LoginDto } from './users.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new user',
  })
  createUser(
    @Body() createUserDto: CreateUserDto,
    @Headers('language') language = 'vi',
  ) {
    return this.usersService.createUser(createUserDto, language);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
  })
  login(@Body() loginDto: LoginDto, @Headers('language') language = 'vi') {
    return this.usersService.login(loginDto, language);
  }
}
