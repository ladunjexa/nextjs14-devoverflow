"use server";

import Question from "@/database/question.model";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";

const SearchableTypes = ["question", "user", "answer", "tag"];

export async function globalSearch(params: SearchParams) {
  try {
    connectToDatabase();

    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };

    let results = [];

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeLower = type?.toLowerCase();

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // Search across all types

      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(8);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answer containing "${query}"`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                ? [item.question, item._id]
                : item._id,
          }))
        );
      }
    } else {
      // Search only in the specified model type

      const modelInfo = modelsAndTypes.find((item) => item.type === type);

      if (!modelInfo) {
        throw new Error("Invalid type specified");
      }

      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8);

      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing "${query}"`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
            ? [item.question, item._id]
            : item._id,
      }));
    }

    return JSON.stringify(results);
  } catch (error: any) {
    console.log(`Error fetching the global results: ${error}`);
    throw error;
  }
}
