import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly usersService: UsersService,
    ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getCart(@Request() req) {
    const user = await this.usersService.findOne(req.user.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.cartService.getCart(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addItemToCart(@Request() req, @Body() addItemToCartDto: AddItemToCartDto) {
    const user = await this.usersService.findOne(req.user.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.cartService.addItemToCart(user, addItemToCartDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('item/:id')
  async removeItemFromCart(@Request() req, @Param('id') id: string) {
    const user = await this.usersService.findOne(req.user.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.cartService.removeItemFromCart(user, +id);
  }
}
