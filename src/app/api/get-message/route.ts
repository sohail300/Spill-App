import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { DBconnection } from "@/lib/connection";
import { UserModel } from "@/model/User";

export async function GET(request: Request) {
  await DBconnection();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json({
        message: "Not authenticated",
        success: false,
        status: 401,
      });
    }

    const sessionUser = session?.user;

    const userId = new mongoose.Types.ObjectId(sessionUser._id);

    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    if (!user) {
      return Response.json({
        message: "Messages not found!",
        success: false,
        status: 404,
      });
    }

    return Response.json({
      msg: "Messages Found",
      status: 200,
      success: true,
      messages: user[0]?.messages || [],
    });
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return Response.json({
      msg: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
