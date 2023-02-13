import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Regex } from '../../shared';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true, validate: Regex.email })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  birthDate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

//#region Hooks
UserSchema.pre('save', async function () {
  // Hash Password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Save Date
  this.birthDate = new Date(this.birthDate).toISOString();
});
//#endregion
