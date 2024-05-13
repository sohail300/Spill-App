import { acceptingMessagesInput } from "@/inputSchema/acceptingMessagesSchema";
import { emailInput } from "@/inputSchema/signupSchema";
import { DBconnection } from "@/lib/connection";
import { UserModel } from "@/model/User";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
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
    const id = sessionUser._id;

    const user = await UserModel.findById(id);

    if (user) {
      return Response.json({
        msg: "User found",
        success: true,
        status: "200",
        isAcceptingMessage: user.isAcceptingMessage,
      });
    } else {
      return Response.json({
        msg: "User not found",
        success: false,
        status: "404",
      });
    }
  } catch (error: any) {
    console.error("An unexpected error occurred:", error);

    return Response.json({ msg: error.message, success: false, status: "500" });
  }
}

export async function PUT(req: NextRequest) {
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
    const id = sessionUser._id;

    const parsedInput = acceptingMessagesInput.safeParse(await req.json());

    if (parsedInput.success === false) {
      return Response.json({
        msg: parsedInput.error.issues[0].message,
        success: false,
        status: "401",
      });
    }

    const { acceptingMessages } = parsedInput.data;

    const user = await UserModel.findById(id);

    if (user) {
      return Response.json({
        msg: "Status Changed",
        success: true,
        status: "200",
        isAcceptingMessage: acceptingMessages,
      });
    } else {
      return Response.json({
        msg: "User not found",
        success: false,
        status: "404",
      });
    }
  } catch (error: any) {
    console.error("An unexpected error occurred:", error);

    return Response.json({ msg: error.message, success: false, status: "500" });
  }
}
