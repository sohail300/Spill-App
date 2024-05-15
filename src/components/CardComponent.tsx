import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { X } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { toast } from "./ui/use-toast";

const CardComponent = ({
  id,
  content,
  date,
  getMessFunction,
}: {
  id: string;
  content: string;
  date: any;
  getMessFunction: any;
}) => {
  async function deleteMessage() {
    try {
      const response = await axios.delete(`/api/delete-message/${id}`);

      if (response.data.success) {
        console.log(response.data.msg);
        await getMessFunction();
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
    }
  }

  return (
    <Card className=" p-4 w-full">
      <CardHeader className=" flex flex-row justify-between ">
        <CardTitle className=" w-3/4">{content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <X />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Do you want to delete this?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                message and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteMessage()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className=" mt-[-16px]">
        <p>{date}</p>
      </CardContent>
    </Card>
  );
};

export default CardComponent;
