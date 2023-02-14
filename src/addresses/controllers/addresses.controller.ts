import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AddressesService } from '../services/addresses.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { GetUser, JWTPayload, PraseObjectIdPipe } from '@app/shared';
import { AddressDocument } from '../entities/address.entity';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Controller('users/addresses')
export class AddressesController {
  constructor(
    @Inject(AddressesService) private addressesService: AddressesService,
  ) {}

  //#region Create Address
  @Post('/')
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @GetUser() user: JWTPayload,
  ): Promise<AddressDocument> {
    return this.addressesService.createAddress(user.id, createAddressDto);
  }
  //#endregion

  //#region Get Users Addresses
  @Get('/')
  async getUserAddresses(
    @GetUser() user: JWTPayload,
  ): Promise<{ total: number; addresses: AddressDocument[] }> {
    const addresses = await this.addressesService.getUserAddresses(user.id);

    return {
      total: addresses.length,
      addresses,
    };
  }
  //#endregion

  //#region Get Address By ID
  @Get('/:addressId')
  async getAddressById(
    @Param('addressId', PraseObjectIdPipe) addressId: string,
    @GetUser() user: JWTPayload,
  ): Promise<AddressDocument> {
    return this.addressesService.getAddressById(user.id, addressId);
  }
  //#endregion

  //#region Delete Address By ID
  @Delete('/:addressId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAddress(
    @Param('addressId', PraseObjectIdPipe) addressId: string,
    @GetUser() user: JWTPayload,
  ): Promise<void> {
    return await this.addressesService.deleteAddressById(user.id, addressId);
  }
  //#endregion

  //#region Update Address
  @Patch('/:addressId')
  async updateAddress(
    @Param('addressId', PraseObjectIdPipe) addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @GetUser() user: JWTPayload,
  ): Promise<AddressDocument> {
    return this.addressesService.updateAddress(
      user.id,
      addressId,
      updateAddressDto,
    );
  }
  //#endregion
}
