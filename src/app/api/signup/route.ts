import { DBconnection } from "@/lib/connection";
import { NextRequest, NextResponse } from "next/server";
import { signupInput } from "@/inputSchema/signupSchema";
import { UserModel } from "@/model/User";
import bcryptjs from "bcryptjs";
import { mailer } from "@/utils/mailer";

export async function POST(req: NextRequest, res: NextResponse) {
  await DBconnection();

  try {
    const parsedInput = signupInput.safeParse(await req.json());

    if (parsedInput.success === false) {
      return Response.json({
        msg: parsedInput.error.issues[0].message,
        success: false,
        status: "401",
      });
    }

    const { name, username, email, password } = parsedInput.data;

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json({
        msg: "Username already taken",
        success: false,
        status: "409",
      });
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    if (existingUserByEmail) {
      return Response.json({
        msg: "User already exists with this email",
        success: false,
        status: "409",
      });
    } else {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const obj = {
        name,
        username,
        email,
        password: hashedPassword,
      };

      const newUser = new UserModel(obj);
      await newUser.save();
      console.log("User Registered");

      const response = await mailer(req, res, email);

      return response;
    }
  } catch (error: any) {
    console.error(error);
    return Response.json({
      msg: error.message,
      success: false,
      status: "500",
    });
  }
}
