import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '@app/shared';
import { AddressesController } from './controllers/addresses.controller';
import { AddressesService } from './services/addresses.service';
import { Address, AddressSchema } from './entities/address.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
    SharedModule,
  ],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService, MongooseModule],
})
export class AddressesModule {}
