import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { hash } from 'bcrypt'
import { User } from 'entities/user.entity'
import Logging from 'libary/Logging'
import { UsersService } from 'users/users.service'
import { compareHash } from 'utils/bcrypt'

import { RegisterUserDto } from './dto/register-user.dto'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  // Validacija korisnika
  async validateUser(email: string, password: string): Promise<User> {
    Logging.info('Validating user...')
    const user = await this.usersService.findBy({ email: email }, [])
    if (!user) {
      throw new BadRequestException('Invalid credentials')
    }
    if (!(await compareHash(password, user.password))) {
      throw new BadRequestException('Invalid credentials')
    }
    Logging.info('User is valid')
    return user
  }

  // Registracija korisnika
  async register(RegisterUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword = await hash(RegisterUserDto.password, 10)
    return await this.usersService.create({
      role_id: null,
      ...RegisterUserDto,
      password: hashedPassword,
    })
  }

  // Generisanje JWT tokena
  async generateJwt(user: User): Promise<string> {
    return this.jwtService.signAsync({ sub: user.id, name: user.email })
  }

  // Dohvatanje korisnika sa JWT tokenom
  async user(cookie: string): Promise<User> {
    const data = await this.jwtService.verifyAsync(cookie)
    return this.usersService.findById(data['sub'], [])
  }

  // Dobijanje ID-a korisnika sa request objekta
  getUserId(request: any) {
    return request.user?.id // Ovo zavisi od toga kako middleware postavlja korisničke podatke
  }
}
