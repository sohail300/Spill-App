"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/apiResponse";
import { loginInput } from "@/inputSchema/loginSchema";
import { signIn } from "next-auth/react";

export default function Signin() {
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginInput>>({
    resolver: zodResolver(loginInput),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginInput>) {
    try {
      setIsSubmiting(true);
      console.log(values);

      const response = await signIn("credentials", {
        redirect: false,
        identifier: values.identifier,
        password: values.password,
      });

      console.log(response);

      if (response?.error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.error,
        });
      } else {
        toast({
          title: "Yayy! Success.",
          description: "Logged In",
          style: {
            backgroundColor: "#dff0e0",
            borderColor: "#7f9f7f",
            color: "#388e3c",
          },
        });
      }

      if (response?.ok) {
        router.replace(`/dashboard`);
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Sign in to Spill
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Username */}
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Username or Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
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

            <div className="text-center mt-4">
              Not a member?{" "}
              <Link
                href={"/signup"}
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
