"use client";
import { signupInput } from "@/inputSchema/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/apiResponse";

export default function Signup() {
  const [username, setUsername] = useState("");
  const debounce = useDebounceCallback(setUsername);

  const [usernameStatus, setUsernameStatus] = useState({
    msg: "",
    success: false,
  });
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupInput>>({
    resolver: zodResolver(signupInput),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    async function checkUniqueUsername() {
      try {
        if (username) {
          setIsCheckingUsername(true);
          setUsernameStatus({
            msg: "",
            success: false,
          });
          const response = await axios.get(
            `/api/check-unique-username?username=${username}`
          );
          setUsernameStatus({
            msg: response.data.msg,
            success: response.data.success,
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.msg;
        console.log(errorMessage);
        setUsernameStatus({
          msg: errorMessage || "Try refreshing the page",
          success: false,
        });
      } finally {
        setIsCheckingUsername(false);
      }
    }

    checkUniqueUsername();
  }, [username]);

  async function onSubmit(values: z.infer<typeof signupInput>) {
    try {
      setIsSubmiting(true);
      console.log(values);

      const response = await axios.post("/api/signup", values);

      console.log(response.data);

      if (response.data.success) {
        router.replace(`/verify/${username}`);
        toast({
          title: "Yayy! Success.",
          description: response.data.msg,
          style: {
            backgroundColor: "#dff0e0",
            borderColor: "#7f9f7f",
            color: "#388e3c",
          },
        });
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Sign up to Spill
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounce(e.target.value);
                      }}
                    />
                  </FormControl>
                  <div>
                    {isCheckingUsername ? (
                      "Checking username availability"
                    ) : (
                      <p
                        className={`text-sm ${
                          usernameStatus.success === true
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {usernameStatus.msg}
                      </p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
                    <Input placeholder="Password" {...field} />
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
              <p>
                Already a member?{" "}
                <Link
                  href={"/signin"}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
