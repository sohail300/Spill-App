import { NextRequest } from "next/server";
import { UserModel } from "@/model/User";
import { z } from "zod";
import { usernameInput } from "@/inputSchema/signupSchema";
import { ApiResponse } from "@/types/apiResponse";
import { DBconnection } from "@/lib/connection";

const usernameInputSchema = z.object({
  username: usernameInput,
});

export async function GET(req: NextRequest) {
  await DBconnection();

  try {
    const { searchParams } = new URL(req.nextUrl);
    const queryParams = {
      username: searchParams.get("username"),
    };

    // This is asking for an object
    const parsedInput = usernameInputSchema.safeParse(queryParams);

    if (parsedInput.success === false) {
      return Response.json({
        msg: parsedInput.error.issues[0].message,
        success: false,
        status: "401",
      });
    }
    const { username } = parsedInput.data;

    const user = await UserModel.findOne({ username, isVerified: true });

    if (user) {
      return Response.json({
        msg: "Username already in use",
        success: false,
        status: "409",
      });
    } else {
      return Response.json({
        msg: "Username available",
        success: true,
        status: "200",
      });
    }
  } catch (error: any) {
    console.error("An unexpected error occurred:", error);

    return Response.json({ msg: error.message, success: false, status: "500" });
  }
}
