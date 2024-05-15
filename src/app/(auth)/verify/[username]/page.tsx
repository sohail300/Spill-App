"use client";
import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { otpInput } from "@/inputSchema/otpInput";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const Verify = ({ params }: { params: { username: string } }) => {
  const username = params.username;
  const [isSubmiting, setIsSubmiting] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof otpInput>) {
    try {
      setIsSubmiting(true);

      console.log(values);

      const response = await axios.post("/api/verify-email", values);

      console.log(response.data);

      if (response.data.success) {
        toast({
          title: "Yayy! Success.",
          description: response.data.msg,
          style: {
            backgroundColor: "#dff0e0",
            borderColor: "#7f9f7f",
            color: "#388e3c",
          },
        });
        router.replace(`/signin`);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.data.msg,
        });
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage = axiosError.response?.data.msg;
      console.log(errorMessage);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage || "Try again",
      });
    } finally {
      setIsSubmiting(false);
    }
  }

  const form = useForm<z.infer<typeof otpInput>>({
    resolver: zodResolver(otpInput),
    defaultValues: {
      otp: "",
      username: username,
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md flex flex-col items-center p-8 space-y-8 bg-white rounded-lg shadow-md border-4">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify OTP
          </h1>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-4/5 space-y-6 flex flex-col items-center"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field} pattern="[\da-zA-Z]*">
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the OTP sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSubmiting ? (
              <Button type="submit" disabled className=" w-full">
                Submitting
              </Button>
            ) : (
              <Button type="submit" className=" w-full">
                Submit
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Verify;
