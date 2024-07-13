import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import VerificationEmail from "@/components/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";
import otpGenerator from "otp-generator";
import { UserModel } from "@/model/User";
import nodemailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function mailer(
  req: NextRequest,
  res: NextResponse,
  email: string
) {
  try {
    const otp = otpGenerator.generate(6, { specialChars: false });

    const { data, error } = await resend.emails.send({
      from: "Spill <contact@heysohail.me>",
      to: email,
      subject: "OTP Verification",
      react: VerificationEmail(otp),
    });

    if (error) {
      return NextResponse.json(error);
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return Response.json({
        msg: "User not found",
        success: false,
        status: "404",
      });
    } else {
      user.verifyToken = otp;
      user.verifyTokenExpiry = new Date(Date.now() + 3600000);
      await user.save();
    }

    return Response.json({
      msg: "User registered and mail sent successfully",
      success: true,
      status: "201",
    });
  } catch (error: any) {
    console.error(error);
    return Response.json({
      msg: error.message,
      success: false,
      status: "500",
    });
  }
}
