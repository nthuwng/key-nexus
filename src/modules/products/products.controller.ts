import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Permissions, ResponseMessage, User } from 'src/decorator/customize';
import type { IUser } from '../users/users.interface';
import {
  PermissionAction,
  PermissionModule,
} from 'src/common/constants/permission.constant';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ResponseMessage('Thêm mới sản phẩm thành công')
  @Permissions(`${PermissionModule.PRODUCTS}.${PermissionAction.CREATE}`)
  create(@Body() createProductDto: CreateProductDto, @User() user: IUser) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách sản phẩm thành công')
  @Permissions(`${PermissionModule.PRODUCTS}.${PermissionAction.VIEW}`)
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.productsService.findAll(currentPage, limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Lấy sản phẩm theo ID thành công')
  @Permissions(`${PermissionModule.PRODUCTS}.${PermissionAction.DETAIL}`)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

 @Patch(':id')
  @ResponseMessage('Cập nhật sản phẩm thành công')
  @Permissions(`${PermissionModule.PRODUCTS}.${PermissionAction.UPDATE}`)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: IUser,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }
   @Delete(':id')
  @ResponseMessage('Xóa sản phẩm thành công')
  @Permissions(`${PermissionModule.PRODUCTS}.${PermissionAction.DELETE}`)
  remove(@Param('id') id: string , @User() user: IUser) {
    return this.productsService.remove(id, user);
  }
}
