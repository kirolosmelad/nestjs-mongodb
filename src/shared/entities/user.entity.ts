import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Regex, generateCode } from '@app/shared';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true, validate: Regex.email })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: String, required: true })
  birthDate: string;

  @Prop({ type: Boolean, required: false, default: false })
  isEmailVerified: boolean;

  @Prop({ type: String, required: false, select: false })
  verificationCode: string;

  @Prop({ type: String, required: false, select: false })
  setPasswordToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

//#region Hooks
UserSchema.pre('save', async function () {
  // if password is changed then hash it
  if (this.isModified('password')) {
    // Hash Password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isModified('birthDate')) {
    // Save Date
    this.birthDate = new Date(this.birthDate).toISOString();
  }

  if (this.isModified('email')) {
    // Lowercase email
    this.email = this.email.toLowerCase();

    // Generate Code and save it
    this.verificationCode = generateCode();

    // Set isEmailVerified to false
    this.isEmailVerified = false;
  }
});
//#endregion
