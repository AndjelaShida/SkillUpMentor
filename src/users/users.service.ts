import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PostgressErrorCode } from 'helpers/postgresErrorCode.erum'
import Logging from 'libary/logging' //
import { AbstractService } from 'modules/common/abstract.service'
import { Repository } from 'typeorm'
import { compareHash, hash } from 'utils/bcrypt'

import { User } from '../entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './update-user.dto'

@Injectable()
export class UsersService extends AbstractService {
  findOne(arg0: { where: { email: string } }) {
    throw new Error('Method not implemented.')
  }
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super(userRepository) // Ispravka: super poziva repository
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findBy({ email: createUserDto.email }, [])

    if (user) {
      throw new BadRequestException('User with that email already exists')
    }

    try {
      const newUser = this.userRepository.create({ ...createUserDto, role: { id: createUserDto.role_id } })

      // Spremamo novog korisnika u bazu
      return this.userRepository.save(newUser)
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('Something went wrong while creating new user')
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = (await this.findById(id, [])) as User
    const { email, password, confirm_password, role_id, ...data } = updateUserDto
    if (user.email !== email && email) {
      user.email = email
    } else if (email && user.email === email) {
      throw new BadRequestException('User whit that email already exist')
    }
    if (password && confirm_password) {
      if (password !== confirm_password) {
        throw new BadRequestException('Password do not match')
      }
      if (await compareHash(password, user.password)) {
        throw new BadRequestException('New password cannot be the same as your old passowrd')
      }
      user.password = await hash(password)
    }
    if (role_id) {
      user.role = { ...user.role, id: role_id }
    }
    try {
      Object.entries(data).map((entry) => {
        user[entry[0]] = entry[1]
      })
      return this.userRepository.save(user)
    } catch (error) {
      Logging.error(error)
      if (error?.code === PostgressErrorCode.UniqueViolation) {
        throw new BadRequestException('User whit thaat email already exist')
      }
      throw new InternalServerErrorException('Something went wrong while updating the user')
    }
  }

  async updateUserImageId(id: string, avatar: string): Promise<User> {
    const user = await this.findById(id, [])
    return this.update(user.id, { avatar })
  }
}
