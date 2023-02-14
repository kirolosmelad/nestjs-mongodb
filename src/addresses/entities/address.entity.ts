import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Regex } from '@app/shared';

export type AddressDocument = HydratedDocument<Address>;

@Schema({ versionKey: false })
export class Address {
  @Prop({ type: String, required: true })
  label: string;

  @Prop({ type: String, required: true })
  street: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({
    type: String,
    required: true,
    validate: [Regex.zipCode, 'Invalid zip code'],
  })
  zipCode: string;

  @Prop({
    type: String,
    required: false,
    validate: [Regex.egyptianPhoneNumber, 'Invalid Phone Number'],
  })
  phoneNumber: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
    index: true,
  })
  user: Types.ObjectId;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
