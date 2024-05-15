"use client";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/apiResponse";
import { sampleMessages } from "@/utils/sampleMessages";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { messageInput } from "@/inputSchema/message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import { useRouter } from "next/navigation";

const Public = () => {
  const [suggestMessages, setSuggestMessages] = useState(sampleMessages);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const pathname = usePathname();
  console.log(pathname);

  const username = pathname.split("/")[2];

  const router = useRouter();

  const form = useForm<z.infer<typeof messageInput>>({
    resolver: zodResolver(messageInput),
    defaultValues: {
      content: "",
    },
  });

  async function getSuggestions() {
    try {
      const response = await axios.get("/api/get-suggestions");

      if (response.data.success) {
        setSuggestMessages(response.data.questions);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Questions not loaded",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.msg;
      console.log(errorMessage);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage || "Try again",
      });
    }
  }

  function copyMessage(message: string) {
    form.setValue("content", message);
  }

  async function onSubmit(values: z.infer<typeof messageInput>) {
    try {
      if (values.content.length <= 0) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Empty Message",
        });
      } else {
        setIsSubmiting(true);

        const response = await axios.post(
          `/api/send-message?username=${username}`,
          values
        );

        if (response.data.success) {
          console.log(response.data.success);
          console.log(response.data.msg);
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
      }
    } catch (error) {
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
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            {isSubmiting ? (
              <Button type="submit" disabled>
                Sending
              </Button>
            ) : (
              <Button type="submit">Send</Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button className="my-4" onClick={() => getSuggestions()}>
            Suggest Messages
          </Button>
          <div>Click on any message below to select it.</div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {suggestMessages.map((message, index) => {
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="my-3 w-full"
                  onClick={() => copyMessage(message)}
                >
                  {message}
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="text-center">
        <div className=" mb-4">Get Your Message Board</div>
        <Button onClick={() => router.push("/signup")}>
          Create Your Account
        </Button>
      </div>
    </div>
  );
};

export default Public;
