import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  gender: string;

  @IsString()
  phone?: string;

  @IsNotEmpty({ message: 'permissions không được để trống' })
  roleId?: mongoose.Schema.Types.ObjectId[];
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsString()
  gender: string;

  @IsString()
  phone?: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty()
  password: string;
}
