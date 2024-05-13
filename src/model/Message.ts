import mongoose, { Schema } from "mongoose";

//! interface for messageSchema
export interface Message extends Document {
  content: string;
  createdOn: Date;
}

//! return type is Schema<Message>
export const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

//! mongoose.Model<Message> and <Message>
export const Message =
  mongoose.models.messages as mongoose.Model<Message> || mongoose.model<Message>("messages", messageSchema);
