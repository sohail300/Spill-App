"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { acceptingMessagesInput } from "@/inputSchema/acceptingMessagesSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/apiResponse";
import { Loader2, RefreshCcw, SquareX } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardComponent from "@/components/CardComponent";
import { Separator } from "@radix-ui/react-separator";

const Dashboard = () => {
  const { data: session } = useSession();
  const user = session?.user;
  let profileUrl = "";

  if (typeof window !== "undefined") {
    profileUrl = `${window.location.origin}/u/${user?.username}`;
  } else {
    profileUrl = `spill.heysohail.me/u/${user?.username}`;
  }

  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof acceptingMessagesInput>>({
    resolver: zodResolver(acceptingMessagesInput),
    defaultValues: {
      acceptingMessages: true,
    },
  });

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(profileUrl);

      toast({
        title: "Yayy! Success.",
        description: "Profile URL has been copied to clipboard",
        style: {
          backgroundColor: "#dff0e0",
          borderColor: "#7f9f7f",
          color: "#388e3c",
        },
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error,
      });
    }
  }

  async function changeAcceptingMessage() {
    try {
      const response = await axios.put("/api/accept-message", {
        acceptingMessages: form.getValues("acceptingMessages"),
      });

      console.log(form.getValues("acceptingMessages"));

      if (response.data.success) {
        toast({
          description: "Accepting message status changed",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.data.msg,
        });
      }
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error,
      });
    }
  }

  async function getMessages() {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/get-message");

      if (response.data.success) {
        setMessages(response.data.messages);
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
      setIsLoading(false);
    }
  }

  async function getIsAccepting() {
    try {
      console.log(form.getValues("acceptingMessages"));

      const response = await axios.get("/api/accept-message");

      if (response.data.success) {
        console.log(response.data.isAcceptingMessage);
        form.setValue("acceptingMessages", response.data.isAcceptingMessage);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Messages not loaded",
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

  useEffect(() => {
    getMessages();
    getIsAccepting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl py-12 pt-32 ">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button
            onClick={() => {
              copyToClipboard();
            }}
          >
            Copy
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form className="w-full space-y-6">
          <FormField
            control={form.control}
            name="acceptingMessages"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-1/4">
                <FormDescription>Accept Messages</FormDescription>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(e) => {
                      field.onChange(e);
                      changeAcceptingMessage();
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>

      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={() => {
          getMessages();
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0
          ? messages.map((item, index) => {
              const dateObj = new Date(item.createdOn);

              const formattedDate = dateObj.toLocaleString("en-US", {
                month: "long", // Full month name
                day: "numeric", // Day of the month with padding (01-31)
                year: "numeric", // Year
                hour: "numeric", // Hour in 24-hour format (0-23)
                minute: "numeric", // Minutes with padding (00-59)
                hour12: true, // Use 12-hour format with AM/PM
              });

              return (
                <div key={item._id}>
                  <CardComponent
                    id={item._id}
                    date={formattedDate}
                    content={item.content}
                    getMessFunction={getMessages}
                  />
                </div>
              );
            })
          : "No messages to display"}
      </div>
    </div>
  );
};

export default Dashboard;
