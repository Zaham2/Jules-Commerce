import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto, seller: User) {
    const product = this.productRepository.create({
      ...createProductDto,
      seller,
    });
    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({ relations: ['seller'] });
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id }, relations: ['seller'] });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
