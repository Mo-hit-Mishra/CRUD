import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  fullname: string;
  username: string;
  email: string;
  password: string;
  resetToken?: string; 
  resetTokenExpiration?: Date;
}

const userSchema = new Schema<IUser>({
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date }, 
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
