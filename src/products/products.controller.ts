import {
  BadRequestException,
  Body,
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
import { Product } from 'entities/product.entity'
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'helpers/imageStorage'
import { PaginatedResult } from 'interface/paginated-result.interface'
import { join } from 'path'

import { CreateUpdateProductDto } from './dto/create-update-product.dto'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.productService.paginate(page)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id, [])
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createProductDto: CreateUpdateProductDto): Promise<Product> {
    return this.productService.create(createProductDto)
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', saveImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(@UploadedFile() file: Express.Multer.File, @Param('id') productId: string): Promise<Product> {
    const filename = file?.filename

    if (!filename) throw new BadRequestException('File must be a png, jpg/jpeg')

    const imagesFolderPath = join(process.cwd(), 'files')
    const fullImagePath = join(imagesFolderPath, file.filename)

    if (await isFileExtensionSafe(fullImagePath)) {
      return this.productService.updateProductImage(productId, filename)
    }

    removeFile(fullImagePath)
    throw new BadRequestException('File content does not match extension')
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateProductDto: CreateUpdateProductDto): Promise<Product> {
    return this.productService.update(id, updateProductDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productService.remove(id)
  }
}
