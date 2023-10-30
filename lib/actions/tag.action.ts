"use server";

import Tag from "@/database/tag.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";

import { connectToDatabase } from "@/lib/mongoose";

import type {
  GetAllTagsParams,
  GetQuestionByTagIdParams,
} from "./shared.types";

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const tags = await Tag.find({});

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId } = params;

    const tag = await Tag.findOne({ _id: tagId }).populate({
      path: "questions",
      model: Question,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
