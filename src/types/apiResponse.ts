import { Message } from "@/model/Message";

export interface ApiResponse {
  msg: string;
  success: boolean;
  status: string;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
  anonymousLink?: string;
  questions?: [string];
  profile?: {
    name: string;
    username: string;
    email: string;
    anonymousLink: string;
    isVerified: boolean;
  };
}
