import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  cost?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  stock?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
