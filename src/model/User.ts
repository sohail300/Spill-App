import mongoose, { Schema } from "mongoose";
import { messageSchema } from "./Message";
import { Message } from "./Message";

// !
export interface User extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  anonymousLink: string;
  messages: Message[];
  isAcceptingMessage: boolean;
  isVerified: boolean;
  verifyToken: string | null;
  verifyTokenExpiry: Date | null;
  forgotPasswordToken: string;
  forgotPasswordTokenExpiry: Date;
}

// !
const userSchema: Schema<User> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi, "Email must be valid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  anonymousLink: {
    type: String,
    required: [true, "anonymousLink is required"],
    unique: true,
  },
  messages: {
    type: [messageSchema],
  },
  isAcceptingMessage: {
    type: Boolean,
    required: [true, "isAcceptingMessage is required"],
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: String,
  verifyTokenExpiry: Date,
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
});

// !
export const UserModel =
  (mongoose.models.users as mongoose.Model<User>) ||
  mongoose.model<User>("users", userSchema);
