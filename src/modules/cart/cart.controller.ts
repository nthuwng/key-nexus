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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Permissions, ResponseMessage, User } from 'src/decorator/customize';
import {
  PermissionAction,
  PermissionModule,
} from 'src/common/constants/permission.constant';
import type { IUser } from '../users/users.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ResponseMessage('Thêm mới giỏ hàng thành công')
  @Permissions(`${PermissionModule.CARTS}.${PermissionAction.CREATE}`)
  create(@Body() createCartDto: CreateCartDto, @User() user: IUser) {
    return this.cartService.create(createCartDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách giỏ hàng thành công')
  @Permissions(`${PermissionModule.CARTS}.${PermissionAction.VIEW}`)
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.cartService.findAll(currentPage, limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Lấy giỏ hàng theo ID thành công')
  @Permissions(`${PermissionModule.CARTS}.${PermissionAction.DETAIL}`)
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật giỏ hàng thành công')
  @Permissions(`${PermissionModule.CARTS}.${PermissionAction.UPDATE}`)
  update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
    @User() user: IUser,
  ) {
    return this.cartService.update(id, updateCartDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa giỏ hàng thành công')
  @Permissions(`${PermissionModule.CARTS}.${PermissionAction.DELETE}`)
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.cartService.remove(id, user);
  }
}
