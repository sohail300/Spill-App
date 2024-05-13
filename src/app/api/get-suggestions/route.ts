import { DBconnection } from "@/lib/connection";
import { NextRequest } from "next/server";
import { questions } from "@/utils/questions";

export async function GET(req: NextRequest) {
  await DBconnection();

  try {
    const questionsArray: Array<string> = [];

    const randomNumberArray: Array<number> = [];

    while (randomNumberArray.length < 3) {
      const randomNumber = Math.floor(Math.random() * 50);

      if (!randomNumberArray.includes(randomNumber)) {
        randomNumberArray.push(randomNumber);
        questionsArray.push(questions[randomNumber]);
      }
    }

    return Response.json({
      msg: "Suggestions Loaded",
      status: "200",
      success: true,
      questions: questionsArray,
    });
  } catch (error: any) {
    console.error("An unexpected error occurred:", error);

    return Response.json({
      msg: error.message,
      status: "500",
      success: false,
    });
  }
}
