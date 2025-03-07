import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  Get,
} from '@nestjs/common'
import { Public } from 'decorators/public.decorator' // Adjust the import path as necessary
import { User } from 'entities/user.entity' // Adjust the import path as necessary
import { Request, Response } from 'express'
import { RequestWhitUser } from 'interface/auth.interface'

import { AuthService } from './auth.service'
import { RegisterUserDto } from './dto/register-user.dto' // Adjust the import path as necessary
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body)
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: RequestWhitUser, @Res({ passthrough: true }) res: Response): Promise<User> {
    // Generisanje JWT tokena
    const access_token = await this.authService.generateJwt(req.user)

    // Postavljanje tokena u kolačiće
    res.cookie('access_token', access_token, { httpOnly: true })

    // Vraćanje korisnika
    return req.user
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAuthInfo(@Req() req: Request): Promise<{ message: string }> {
    // Ova ruta je sada dostupna za proveru statusa autentičnosti
    return { message: 'Auth service is running' }
  }

  @Get('login')
  @HttpCode(HttpStatus.OK)
  async user(@Req() req: Request): Promise<User> {
    // Generisanje JWT tokena
    const cookie = req.cookies['access_token']

    // Vraćanje korisnika
    return this.authService.user(cookie)
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@Res({ passthrough: true }) res: Response): Promise<{ msg: string }> {
    res.clearCookie('access_token')
    return { msg: 'Ok' }
  }
}
