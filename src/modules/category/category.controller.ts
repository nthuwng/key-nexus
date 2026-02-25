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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Permissions, ResponseMessage, User } from 'src/decorator/customize';
import {
  PermissionAction,
  PermissionModule,
} from 'src/common/constants/permission.constant';
import type { IUser } from '../users/users.interface';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ResponseMessage('Thêm mới danh mục thành công')
  @Permissions(`${PermissionModule.CATEGORIES}.${PermissionAction.CREATE}`)
  create(@Body() createCategoryDto: CreateCategoryDto, @User() user: IUser) {
    return this.categoryService.create(createCategoryDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách danh mục thành công')
  @Permissions(`${PermissionModule.CATEGORIES}.${PermissionAction.VIEW}`)
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.categoryService.findAll(currentPage, limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Lấy danh mục theo ID thành công')
  @Permissions(`${PermissionModule.CATEGORIES}.${PermissionAction.DETAIL}`)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật danh mục thành công')
  @Permissions(`${PermissionModule.CATEGORIES}.${PermissionAction.UPDATE}`)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user: IUser,
  ) {
    return this.categoryService.update(id, updateCategoryDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa danh mục thành công')
  @Permissions(`${PermissionModule.CATEGORIES}.${PermissionAction.DELETE}`)
  remove(@Param('id') id: string , @User() user: IUser) {
    return this.categoryService.remove(id, user);
  }
}
