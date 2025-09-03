import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const user = await this.usersService.findOne(req.user.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.ordersService.createOrder(user, createOrderDto);
  }
}
