import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    const user = await this.usersService.findOne(req.user.userId);
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    // I should also add logic to check if the user owns the product
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    // I should also add logic to check if the user owns the product
    return this.productsService.remove(+id);
  }
}
