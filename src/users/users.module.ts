import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from '../entities/user.entity' // Ispravan import za User entitet
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Ispravka: koristi se 'imports' umesto 'import'
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Ako želite da izvezete UsersService za druge module
})
export class UsersModule {}
