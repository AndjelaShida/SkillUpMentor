import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Permission } from 'entities/permission.entity'
import Logging from 'libary/Logging'
import { AbstractService } from 'modules/common/abstract.service'
import { Repository } from 'typeorm'

import { CreatePermissionDto } from './dto/create-permission.dto'

@Injectable()
export class PermissionsService extends AbstractService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    // Prosljeđivanje repozitorijuma roditeljskoj klasi
    super(permissionRepository)
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    try {
      // Kreiranje novog entiteta koristeći DTO
      const permission = this.permissionRepository.create(createPermissionDto)

      // Čuvanje entiteta u bazi podataka
      return await this.permissionRepository.save(permission)
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('Something went wrong while creating a new permission')
    }
  }
}
