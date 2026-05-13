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

  async findAll() {
    return await this.dataSource.getRepository(Sale).find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const sale = await this.dataSource.getRepository(Sale).findOne({
      where: { id },
    });
    if (!sale) {
      throw new Error(`Venta con ID ${id} no encontrada`);
    }
    return sale;
  }

  async update(id: number, updateSaleDto: any) {
    return await this.dataSource.transaction(async manager => {
      const sale = await manager.findOne(Sale, { where: { id } });
      if (!sale) {
        throw new Error(`Venta con ID ${id} no encontrada`);
      }

      Object.assign(sale, updateSaleDto);
      if (updateSaleDto.quantity || updateSaleDto.unit_price) {
        sale.total = sale.quantity * sale.unit_price;
      }
      sale.needs_sync = true;

      return manager.save(sale);
    });
  }

  async remove(id: number) {
    return await this.dataSource.transaction(async manager => {
      const sale = await manager.findOne(Sale, { where: { id } });
      if (!sale) {
        throw new Error(`Venta con ID ${id} no encontrada`);
      }

      const product = await manager.findOne(Product, { where: { id: sale.product_id } });
      if (product) {
        product.stock += sale.quantity;
        product.needs_sync = true;
        await manager.save(product);
      }

      await manager.remove(sale);
      return { message: `Venta con ID ${id} eliminada correctamente` };
    });
  }
}