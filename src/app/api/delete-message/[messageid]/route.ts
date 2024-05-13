import { DBconnection } from "@/lib/connection";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { usernameInput } from "@/inputSchema/signupSchema";
import { z } from "zod";
import { UserModel } from "@/model/User";
import { messageInput } from "@/inputSchema/message";
import { Message } from "@/model/Message";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      messageid: string;
    };
  }
) {
  await DBconnection();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json({
        msg: "User not authenticated",
        success: false,
        status: "401",
      });
    }

    const sessionUser = session?.user;

    const messageId = params.messageid;

    const updatedResult = await UserModel.updateOne(
      { _id: sessionUser._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json({
        msg: "Message not deleted",
        success: false,
        status: "404",
      });
    } else {
      return Response.json({
        msg: "Message Deleted",
        success: true,
        status: "200",
      });
    }
  } catch (error: any) {
    console.error("An unexpected error occurred:", error);

    return Response.json({
      msg: error.message,
      status: "500",
      success: false,
    });
  }
}
