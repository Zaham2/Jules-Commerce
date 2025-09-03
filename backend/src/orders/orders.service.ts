import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from 'src/cart/cart.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly cartService: CartService,
    private readonly configService: ConfigService,
  ) {
    const secret = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secret) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    this.stripe = new Stripe(secret, {
      apiVersion: '2024-06-20',
    });
  }

  async createOrder(user: User, createOrderDto: CreateOrderDto) {
    const cart = await this.cartService.getCart(user);
    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const total = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: total * 100, // amount in cents
      currency: 'usd',
      payment_method: createOrderDto.paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    if (paymentIntent.status !== 'succeeded') {
      throw new InternalServerErrorException('Payment failed');
    }

    const order = this.orderRepository.create({
      user,
      items: cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total,
      status: OrderStatus.COMPLETED,
      stripePaymentIntentId: paymentIntent.id,
    });

    await this.orderRepository.save(order);
    await this.cartService.clearCart(user);
    return order;
  }
}
