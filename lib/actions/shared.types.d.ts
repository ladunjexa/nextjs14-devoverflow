import { Schema } from "mongoose";

import { IUser } from "@/database/user.model";

/**
 * Common interfaces used in actions
 */
interface ClerkId {
  clerkId: string;
}

interface UserId {
  userId: string;
}

interface QuestionId {
  questionId: string;
}

interface AnswerId {
  answerId: string;
}

interface OptionalPage {
  page?: number;
}

interface OptionalPageSize {
  pageSize?: number;
}

interface OptionalSearch {
  searchQuery?: string;
}

interface OptionalFilter {
  filter?: string;
}

interface Path {
  path: string;
}

interface Content {
  content: string;
}

interface Voting {
  hasupVoted: boolean;
  hasdownVoted: boolean;
}

interface Searchable
  extends OptionalPage,
    OptionalPageSize,
    OptionalSearch,
    OptionalFilter {}

/**
 * Interfaces for user actions
 */
export interface CreateUserParams extends ClerkId {
  name: string;
  username: string;
  email: string;
  picture: string;
}

export interface GetUserByIdParams extends UserId {}

export interface GetAllUsersParams extends Searchable {}

export interface GetAllJobsParams extends Searchable {}

export interface UpdateUserParams extends ClerkId, Path {
  updateData: Partial<IUser>;
}

export interface DeleteUserParams extends ClerkId {}

export interface GetUserStatsParams
  extends UserId,
    OptionalPage,
    OptionalPageSize {}

export interface ToggleSaveQuestionParams extends UserId, QuestionId, Path {}

export interface GetSavedQuestionParams
  extends ClerkId,
    OptionalPage,
    OptionalPageSize,
    OptionalSearch,
    OptionalFilter {}

/**
 * Interfaces for question actions
 */
export interface GetQuestionsParams extends Searchable {}

export interface CreateQuestionParams extends Path, Content {
  title: string;
  tags: string[];
  author: Schema.Types.ObjectId | IUser;
}

export interface GetQuestionByIdParams extends QuestionId {}

export interface QuestionVoteParams extends QuestionId, UserId, Path, Voting {}

export interface DeleteQuestionParams extends QuestionId, Path {
  isQuestionPath?: boolean;
}

export interface EditQuestionParams extends QuestionId, Path, Content {
  title: string;
  tags?: string[];
}

/**
 * Interfaces for answer actions
 */
export interface CreateAnswerParams extends Path, Content {
  author: string;
  question: string;
}

export interface GetAnswersParams
  extends OptionalPage,
    OptionalPageSize,
    QuestionId {
  sortBy?: string;
}

export interface GetAnswerByIdParams extends AnswerId {}

export interface AnswerVoteParams extends AnswerId, UserId, Path, Voting {}

export interface DeleteAnswerParams extends Path, AnswerId {}

export interface EditAnswerParams extends Path, AnswerId, Content {}

/**
 * Interfaces for interaction actions
 */
export interface ViewQuestionParams extends UserId, QuestionId {}

/**
 * Interfaces for tag actions
 */
export interface GetTopInteractedTagsParams extends UserId {
  limit?: number;
}

export interface GetAllTagsParams extends Searchable {}

export interface GetQuestionByTagIdParams
  extends OptionalPage,
    OptionalPageSize,
    OptionalSearch {
  tagId: string;
}

export interface GetTagByIdParams {
  tagId: string;
}

/**
 *
 */
export interface SearchParams {
  query?: string | null;
  type?: string | null;
}

export interface RecommendedParams
  extends UserId,
    OptionalPage,
    OptionalPageSize,
    OptionalSearch {}

export interface JobFilterParams {
  query: string;
  page: string;
}
