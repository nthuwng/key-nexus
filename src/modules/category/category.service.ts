import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import mongoose, { Model } from 'mongoose';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class CategoryService {
  @InjectModel(Category.name)
  private categoryModel: Model<CategoryDocument>;

  async create(createCategoryDto: CreateCategoryDto, user: IUser) {
    const newCategory = await this.categoryModel.create({
      ...createCategoryDto,
      createdBy: { _id: user._id, email: user.email },
    });
    return {
      id: newCategory._id,
      createdAt: newCategory.createdAt,
    };
  }

  async findAll(currentPage: string, limit: string, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.categoryModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.categoryModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID không hợp lệ`);
    }

    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new BadRequestException(`Không tìm thấy danh mục`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: IUser) {
    const existingCategory = await this.categoryModel.findById(id);
    if (!existingCategory) {
      throw new BadRequestException(`Không tìm thấy danh mục`);
    }

    return this.categoryModel.findByIdAndUpdate(
      id,
      { ...updateCategoryDto, updatedBy: { _id: user._id, email: user.email } },
      { new: true },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID không hợp lệ`);
    }

    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new BadRequestException(`Không tìm thấy danh mục`);
    }

    return await this.categoryModel.updateOne(
      { _id: id },
      {
        deletedBy: { _id: user._id, email: user.email },
        deletedAt: new Date(),
        isDeleted: true,
      },
    );
  }
}
