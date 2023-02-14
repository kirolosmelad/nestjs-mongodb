import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address, AddressDocument } from '../entities/address.entity';
import { Model } from 'mongoose';
import { CreateAddressDto } from '../dto/create-address.dto';
import { User, UserDocument } from '@app/shared';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  //#region Create Address
  async createAddress(
    userId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<AddressDocument> {
    const address = new this.addressModel({
      ...createAddressDto,
      user: userId,
    });

    return address.save();
  }
  //#endregion

  //#region Get All User Addresses
  async getUserAddresses(userId: string): Promise<AddressDocument[]> {
    return this.addressModel.find({ user: userId });
  }
  //#endregion

  //#region Get Address By ID
  async getAddressById(
    userId: string,
    addressId: string,
  ): Promise<AddressDocument> {
    const address = await this.addressModel
      .findOne({
        _id: addressId,
        user: userId,
      })
      .populate('user', 'firstName lastName isEmailVerified', this.userModel);

    if (!address) throw new NotFoundException('Address is not exist');

    return address;
  }
  //#endregion

  //#region Delete Address By Id
  async deleteAddressById(userId: string, addressId: string): Promise<void> {
    // Check Address Existence
    await this.getAddressById(userId, addressId);
    // Delete Address
    await this.addressModel.deleteOne({ _id: addressId, user: userId });
  }
  //#endregion

  //#region Update Address Data
  async updateAddress(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<AddressDocument> {
    // Check Address Existence & update it if exist
    const address = await this.addressModel.findOneAndUpdate(
      { _id: addressId, user: userId },
      updateAddressDto,
      { returnOriginal: false },
    );
    if (!address) throw new NotFoundException('Address is not exist');

    return address;
  }
  //#endregion
}
