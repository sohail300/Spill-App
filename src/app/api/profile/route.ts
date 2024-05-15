import { emailInput } from "@/inputSchema/signupSchema";
import { DBconnection } from "@/lib/connection";
import { UserModel } from "@/model/User";
import { NextRequest } from "next/server";
import { z } from "zod";

const emailInputSchema = z.object({
  email: emailInput,
});

export async function POST(req: NextRequest) {
  await DBconnection();

  try {
    const parsedInput = emailInputSchema.safeParse(await req.json());

    if (parsedInput.success === false) {
      return Response.json({
        msg: parsedInput.error.issues[0].message,
        success: false,
        status: "401",
      });
    }

    const { email } = parsedInput.data;

    const user = await UserModel.findOne({ email });

    if (user) {
      const obj = {
        name: user.name,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      };

      return Response.json({
        msg: "User found",
        success: true,
        status: "200",
        profile: obj,
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
