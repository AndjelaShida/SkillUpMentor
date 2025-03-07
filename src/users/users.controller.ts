import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { HasPermission } from 'decorators/has-permision.decorator'
import { join } from 'path' // Dodato za join

import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { User } from '../entities/user.entity' // Ispravljen import za user.entity
import { saveImageToStorage } from '../helpers/imageStorage' // Pretpostavljam da je ovo tačan put za helper
import { removeFile } from '../helpers/imageStorage' // Pretpostavljam da je ovo tačan put za helper
import { CreateUserDto } from './dto/create-user.dto' // Pretpostavljam da se DTO nalazi ovde
import { UpdateUserDto } from './update-user.dto'
import { UsersService } from './users.service'

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  isFileExtensionSafe: any
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({ description: 'List all users' })
  @ApiBadRequestResponse({ description: 'Error for list of users' })
  @Get()
  @HasPermission('users')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<any> {
    // Privremeno koristite any dok ne implementirate PaginateResult
    return this.usersService.paginate(page, ['role']) // Dodajte prazan niz za relations
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id, []) // Dodajte prazan niz za relations
  }

  @ApiCreatedResponse({ description: 'Create new user' })
  @ApiBadRequestResponse({ description: '<Error for creating a new user' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto) // Uverite se da create metoda postoji u UsersService
  }

  @Post('upload/:id') // Ispravljeno
  @UseInterceptors(FileInterceptor('avatar', saveImageToStorage))
  @HttpCode(HttpStatus.CREATED) // Ispravljeno
  async uploadedFile(@UploadedFile() file: Express.Multer.File, @Param('id') id: string): Promise<User> {
    // Ispravljeno ime metode
    const filename = file?.filename

    if (!filename) throw new BadRequestException('File must be a png, jpg/jpeg')

    const imagesFolderPath = join(process.cwd(), 'files')
    const fullImagePath = join(imagesFolderPath, file.filename) // Ispravljeno join

    if (await this.isFileExtensionSafe(fullImagePath)) {
      return this.usersService.updateUserImageId(id, filename) // Ispravljeno usersService
    }

    removeFile(fullImagePath) // Ispravljeno removeFile
    throw new BadRequestException('File content does not match extension')
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto) // Popravka: usersService umesto userService
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id) // Popravka: usersService umesto userService
  }

  // Pretpostavljam da je ovo funkcija za proveru ekstenzije fajla
  private async idFileExtensionSafe(fullFilePath: string): Promise<boolean> {
    // Implementacija ove funkcije
    // Na primer, možeš da koristiš 'file-type' biblioteku da proveriš ekstenziju fajla
    return true // Ovo je samo primer
  }
}
