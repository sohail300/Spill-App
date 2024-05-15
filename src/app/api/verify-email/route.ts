import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/model/User";
import { otpInput } from "@/inputSchema/otpInput";
import { ApiResponse } from "@/types/apiResponse";
import { DBconnection } from "@/lib/connection";

export async function POST(req: NextRequest) {
  await DBconnection();

  try {
    const parsedInput = otpInput.safeParse(await req.json());

    if (parsedInput.success === false) {
      return Response.json({
        msg: parsedInput.error.issues[0].message,
        success: false,
        status: "401",
      });
    }

    const { otp, username } = parsedInput.data;

    const user = await UserModel.findOne({ username });

    if (user) {
      if (
        user.verifyToken === otp &&
        user.verifyTokenExpiry !== null &&
        user.verifyTokenExpiry.getTime() >= Date.now()
      ) {
        user.isVerified = true;
        user.verifyToken = null;
        user.verifyTokenExpiry = null;
        await user.save();
        return Response.json({
          msg: "User verified",
          success: true,
          status: "200",
        });
      } else {
        return Response.json({
          msg: "Incorrect OTP or OTP expired",
          success: false,
          status: "404",
        });
      }
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
