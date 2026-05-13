import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(data: CreateSaleDto) {
    return await this.dataSource.transaction(async manager => {
      const product = await manager.findOne(Product, { where: { id: data.product_id } });
      if (!product || product.stock < data.quantity) {
        throw new Error('Stock insuficiente');
      }

      product.stock -= data.quantity;
      product.needs_sync = true;
      await manager.save(product);

      const sale = manager.create(Sale, {
        ...data,
        total: data.quantity * data.unit_price,
        needs_sync: true,
      });
      return manager.save(sale);
    });
  }

  findAll() {
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: any) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}