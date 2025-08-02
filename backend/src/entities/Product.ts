// src/entities/Product.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Admin } from './Admin';
import { ProductImage } from './ProductImage';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  sku!: string;

  @Column()
  name!: string;

  @Column('decimal')
  price!: number;

  @ManyToOne(() => Admin, (admin) => admin.products, { onDelete: 'CASCADE' })
  @JoinColumn()
  admin!: Admin;

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
    eager: true,
  })
  images!: ProductImage[];
}
