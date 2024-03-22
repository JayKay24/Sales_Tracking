import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  AGENT = 'agent',
}

type UserDocument = HydratedDocument<User>;

@Schema()
class User {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  phone_number: string;

  @Prop({ default: '' })
  county: string;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema, UserDocument, User, UserRole };
