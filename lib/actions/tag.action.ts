"use server";

import { FilterQuery } from "mongoose";

import Tag from "@/database/tag.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";

import { connectToDatabase } from "@/lib/mongoose";

import type {
  GetAllTagsParams,
  GetQuestionByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery } = params;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    const tags = await Tag.find(query);

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, searchQuery } = params;

    const tagFilter: FilterQuery<typeof Tag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
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

export async function getTopPopularTags() {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId, limit = 3 } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // find interactions for the user and groups by tags
    const interactions = await Question.aggregate([
      { $match: { author: userId } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    // find the tags from the interactions
    const tags = await Tag.find({
      _id: { $in: interactions.map((i) => i._id) },
    });

    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
