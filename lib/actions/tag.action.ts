"use server";

import Tag from "@/database/tag.model";

import { connectToDatabase } from "@/lib/mongoose";

import type { GetAllTagsParams } from "./shared.types";
import console from "console";

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
