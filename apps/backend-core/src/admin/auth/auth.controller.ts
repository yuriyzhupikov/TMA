import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AdminAuthGuard)
  @Get('me')
  me(@CurrentUserId() userId: string) {
    return this.authService.me(userId);
  }
}
