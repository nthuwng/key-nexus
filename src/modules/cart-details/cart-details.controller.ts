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
import { CartDetailsService } from './cart-details.service';
import { CreateCartDetailDto } from './dto/create-cart-detail.dto';
import { UpdateCartDetailDto } from './dto/update-cart-detail.dto';
import {
  PermissionAction,
  PermissionModule,
} from 'src/common/constants/permission.constant';
import { Permissions, ResponseMessage, User } from 'src/decorator/customize';
import type { IUser } from '../users/users.interface';

@Controller('cart-details')
export class CartDetailsController {
  constructor(private readonly cartDetailsService: CartDetailsService) {}

  @Post()
  @ResponseMessage('Thêm mới giỏ hàng chi tiết thành công')
  @Permissions(`${PermissionModule.CART_DETAILS}.${PermissionAction.CREATE}`)
  create(
    @Body() createCartDetailDto: CreateCartDetailDto,
    @User() user: IUser,
  ) {
    return this.cartDetailsService.create(createCartDetailDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách giỏ hàng chi tiết thành công')
  @Permissions(`${PermissionModule.CART_DETAILS}.${PermissionAction.VIEW}`)
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.cartDetailsService.findAll(currentPage, limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Lấy giỏ hàng chi tiết theo ID thành công')
  @Permissions(`${PermissionModule.CART_DETAILS}.${PermissionAction.DETAIL}`)
  findOne(@Param('id') id: string) {
    return this.cartDetailsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật giỏ hàng chi tiết thành công')
  @Permissions(`${PermissionModule.CART_DETAILS}.${PermissionAction.UPDATE}`)
  update(
    @Param('id') id: string,
    @Body() updateCartDetailDto: UpdateCartDetailDto,
    @User() user: IUser,
  ) {
    return this.cartDetailsService.update(id, updateCartDetailDto, user);
  }

 @Delete(':id')
  @ResponseMessage('Xóa giỏ hàng chi tiết thành công')
  @Permissions(`${PermissionModule.CART_DETAILS}.${PermissionAction.DELETE}`)
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.cartDetailsService.remove(id, user);
  }
}
