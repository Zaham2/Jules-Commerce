import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];
}
