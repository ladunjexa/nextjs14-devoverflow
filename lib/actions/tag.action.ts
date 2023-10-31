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
  GetTagByIdParams,
} from "./shared.types";

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 10, filter, searchQuery } = params;

    // Calculate the number of tags to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalTags = await Tag.countDocuments(query);

    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTagById(params: GetTagByIdParams) {
  try {
    connectToDatabase();

    const { tagId } = params;

    const tag = await Tag.findOne({
      _id: tagId,
    });

    return tag;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    // Calculate the number of questions to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<typeof Tag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1, // +1 to check if there is next page
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

    const isNext = tag.questions.length > pageSize;

    return { tagTitle: tag.name, questions, isNext };
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
