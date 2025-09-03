import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddItemToCartDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
