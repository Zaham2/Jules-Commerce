import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from 'src/users/entities/user.entity';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productsService: ProductsService,
  ) {}

  async getCart(user: User): Promise<Cart> {
    let cart = await this.cartRepository.findOne({ where: { user: { id: user.id } }, relations: ['items', 'items.product'] });
    if (!cart) {
      cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  async addItemToCart(user: User, addItemToCartDto: AddItemToCartDto): Promise<Cart> {
    const cart = await this.getCart(user);
    const product = await this.productsService.findOne(addItemToCartDto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cartItem = await this.cartItemRepository.findOne({ where: { cart: { id: cart.id }, product: { id: product.id } } });

    if (cartItem) {
      cartItem.quantity += addItemToCartDto.quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity: addItemToCartDto.quantity,
      });
    }

    await this.cartItemRepository.save(cartItem);
    return this.getCart(user);
  }

  async removeItemFromCart(user: User, cartItemId: number): Promise<Cart> {
    const cart = await this.getCart(user);
    const cartItem = await this.cartItemRepository.findOne({ where: { id: cartItemId, cart: { id: cart.id } } });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);
    return this.getCart(user);
  }

  async clearCart(user: User): Promise<Cart> {
    const cart = await this.getCart(user);
    await this.cartItemRepository.remove(cart.items);
    cart.items = [];
    return cart;
  }
}
