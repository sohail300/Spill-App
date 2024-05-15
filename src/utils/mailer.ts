import { NextResponse } from "next/server";
import { Resend } from "resend";
import VerificationEmail from "@/components/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";
import otpGenerator from "otp-generator";
import { UserModel } from "@/model/User";
import nodemailer from "nodemailer";
import { transporter } from "./transporter";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function mailer(email: string) {
  try {
    const otp = otpGenerator.generate(6, { specialChars: false });

    const mailOptions = {
      from: `"Spill" <help@spill.com>`,
      to: `${email}`,
      subject: "OTP Verification",
      html: `<body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
          <table role="presentation"
            style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
            <tbody>
              <tr>
                <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                  <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                    <tbody>
                      <tr>
                        <td style="padding: 40px 0px 0px;">
      
                          <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                            <div style="color: rgb(0, 0, 0); text-align: left;">
                              <h1 style="margin: 1rem 0">Verification code</h1>
                              <p style="padding-bottom: 16px">Please use the verification code below to activate your account.</p>
                              <p style="padding-bottom: 16px"><strong style="font-size: 130%">${otp}</strong></p>
                              <p style="padding-bottom: 16px">If you didn’t ask to verify this address, you can ignore
                              this email.</p>
                              <p style="padding-bottom: 16px">Thanks,<br>Spill Team</p>
                            </div>
                          </div>
                          <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                            <p style="padding-bottom: 16px">Made with ♥ by Sohail</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
        `,
    };

    const response = await transporter.sendMail(mailOptions);

    console.log(response);
    if (response.rejected.length > 0) {
      return Response.json({
        msg: "Error in sending mail, please ask for another one in your profile",
        success: false,
        status: "400",
      });
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
