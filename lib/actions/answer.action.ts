"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";

import { connectToDatabase } from "@/lib/mongoose";

import type {
  CreateAnswerParams,
  DeleteAnswerParams,
  EditAnswerParams,
  GetAnswerByIdParams,
  GetAnswersParams,
} from "./shared.types";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({
      content,
      author,
      question,
      path,
    });

    // add the answer to the question's answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // todo: create an interaction record for the user's create_answer action

    // todo: author's reputation by +S for creating a answer

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editAnswer(params: EditAnswerParams) {
  try {
    connectToDatabase();

    const { answerId, content, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    answer.content = content;

    await answer.save();

    redirect(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const answers = await Answer.find({ question: questionId }).populate(
      "author",
      "_id clerkId name picture"
    );

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
