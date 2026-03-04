import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDetailDto } from './dto/create-cart-detail.dto';
import { UpdateCartDetailDto } from './dto/update-cart-detail.dto';
import { CartDetail, CartDetailDocument } from './schemas/cart-detail.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class CartDetailsService {
  @InjectModel(CartDetail.name)
  private cartDetailModel: Model<CartDetailDocument>;

  @InjectModel(Cart.name)
  private cartModel: Model<CartDocument>;

  @InjectModel(Product.name)
  private productModel: Model<ProductDocument>;

  async create(createCartDetailDto: CreateCartDetailDto, user: IUser) {
    const { cartId, price, quantity, productId } = createCartDetailDto;

    const [existCart, existProduct] = await Promise.all([
      this.cartModel.findById(cartId),
      this.productModel.findById(productId),
    ]);

    if (!existCart || existCart.isDeleted) {
      throw new BadRequestException(`Giỏ hàng không tồn tại hoặc đã bị xóa`);
    }

    if (!existProduct || existProduct.isDeleted) {
      throw new BadRequestException(`Sản phẩm không tồn tại hoặc đã bị xóa`);
    }

    const newCategory = await this.cartDetailModel.create({
      cartId,
      price,
      quantity,
      productId,
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

    const totalItems = await this.cartDetailModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.cartDetailModel
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

    const category = await this.cartDetailModel
      .findById(id)
      .populate('cartId')
      .populate('productId')
      .exec();

    if (!category) {
      throw new BadRequestException(`Không tìm thấy giỏ hàng`);
    }
    return category;
  }

  async update(
    id: string,
    updateCartDetailDto: UpdateCartDetailDto,
    user: IUser,
  ) {
    const { cartId, price, quantity, productId } = updateCartDetailDto;

    const [existCart, existProduct] = await Promise.all([
      this.cartModel.findById(cartId),
      this.productModel.findById(productId),
    ]);

    if (!existCart || existCart.isDeleted) {
      throw new BadRequestException(`Giỏ hàng không tồn tại hoặc đã bị xóa`);
    }

    if (!existProduct || existProduct.isDeleted) {
      throw new BadRequestException(`Sản phẩm không tồn tại hoặc đã bị xóa`);
    }

    const existingCartDetail = await this.cartDetailModel.findById(id);
    if (!existingCartDetail) {
      throw new BadRequestException(`Không tìm thấy giỏ hàng chi tiết`);
    }

    return this.cartDetailModel.findByIdAndUpdate(
      id,
      {
        cartId,
        price,
        quantity,
        productId,
        updatedBy: { _id: user._id, email: user.email },
      },
      { new: true },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID không hợp lệ`);
    }

    const category = await this.cartDetailModel.findById(id);

    if (!category) {
      throw new BadRequestException(`Không tìm thấy giỏ hàng chi tiết`);
    }

    return await this.cartDetailModel.updateOne(
      { _id: id },
      {
        deletedBy: { _id: user._id, email: user.email },
        deletedAt: new Date(),
        isDeleted: true,
      },
    );
  }
}
