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

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  birthDate: string;

  @Prop({ type: Boolean, required: false, default: false })
  isEmailVerified: boolean;

  @Prop({ type: String, required: false })
  verificationCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

//#region Hooks
UserSchema.pre('save', async function () {
  if (this.password) {
    // Hash Password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.birthDate) {
    // Save Date
    this.birthDate = new Date(this.birthDate).toISOString();
  }

  if (this.email) {
    // Generate Code and save it
    this.verificationCode = generateCode();

    // Set isEmailVerified to false
    this.isEmailVerified = false;
  }
});

UserSchema.pre(/^find/, async function (next) {
  console.log(this);

  next();
});
//#endregion
