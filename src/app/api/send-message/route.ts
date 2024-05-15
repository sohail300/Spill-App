import { DBconnection } from "@/lib/connection";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { usernameInput } from "@/inputSchema/signupSchema";
import { z } from "zod";
import { UserModel } from "@/model/User";
import { messageInput } from "@/inputSchema/message";
import { Message } from "@/model/Message";

const usernameInputZod = z.object({
  username: usernameInput,
});

export async function POST(req: NextRequest) {
  await DBconnection();

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    console.log(queryParam);

    // Username
    const parsedInputUsername = usernameInputZod.safeParse(queryParam);

    if (parsedInputUsername.success === false) {
      return Response.json({
        msg: parsedInputUsername.error.issues[0].message,
        success: false,
        status: "401",
      });
    }

    const { username } = parsedInputUsername.data;
    const user = await UserModel.findOne({ username });
    console.log(user);

    // Message
    const parsedInputMessage = messageInput.safeParse(await req.json());
    console.log(parsedInputMessage);

    if (parsedInputMessage.success === false) {
      return Response.json({
        msg: parsedInputMessage.error.issues[0].message,
        success: false,
        status: "401",
      });
    }

    const { content } = parsedInputMessage.data;
    const createdOn = new Date();

    if (user) {
      if (!user.isAcceptingMessage) {
        return Response.json({
          msg: "User is not receiving messages right now",
          success: false,
          status: "404",
        });
      } else {
        const obj = {
          content,
          createdOn,
        };

        user.messages.push(obj as Message);
        console.log("pushed");
        await user.save();

        console.log("Message Sent");
        return Response.json({
          msg: "Message Sent",
          success: true,
          status: "204",
        });
      }
    } else {
      console.log("User not found");
      return Response.json({
        msg: "User not found",
        success: false,
        status: "404",
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
