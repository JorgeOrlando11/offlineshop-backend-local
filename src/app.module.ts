import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Product } from './products/product.entity';
import { ProductsModule } from './products/products.module';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(process.cwd(), 'data', 'offlineshop.db'),
      entities: [Product],
      synchronize: true,
      logging: false,
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
