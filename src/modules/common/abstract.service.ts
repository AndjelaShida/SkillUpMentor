import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import Logging from 'libary/logging'
import { Repository } from 'typeorm' // Ispravka importovanja Repository

interface PaginateResult {
  data: any[]
  meta: {
    total: number
    page: number
    last_page: number
  }
}

@Injectable()
export abstract class AbstractService {
  constructor(protected readonly repository: Repository<any>) {}

  async findAll(relations = []): Promise<any[]> {
    try {
      return this.repository.find({ relations })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong by searching for a list of elements')
    }
  }

  async findBy(condition: any, relations: string[]): Promise<any> {
    try {
      return this.repository.findOne({
        where: condition,
        relations,
      })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException(
        `Something went wrong while searching for an element with condition: ${JSON.stringify(condition)}`,
      )
    }
  }

  async findById(id: string, relations: string[]): Promise<any> {
    try {
      const element = await this.repository.findOne({
        where: { id }, // Ispravka u načinu traženja po id
        relations,
      })

      if (!element) {
        throw new BadRequestException(`Cannot find element with id: ${id}`)
      }
      return element
    } catch (error) {
      Logging.error(error)
      Logging.error(`Something went wrong while searching for an element with id: ${id}`)
      throw new InternalServerErrorException(`Something went wrong while searching for an element with id: ${id}`)
    }
  }

  async remove(id: string): Promise<any> {
    const element = await this.findById(id, []) // Proveriti kako koristite 'relations' za remove
    try {
      return this.repository.remove(element)
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while deleting an element.')
    }
  }

  async paginate(page = 1, relations: string[] = []): Promise<PaginateResult> {
    const take = 10

    try {
      const [data, total] = await this.repository.findAndCount({
        take,
        skip: (page - 1) * take,
        relations,
      })

      return {
        data,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / take),
        },
      }
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while searching for a paginated element.')
    }
  }
}
