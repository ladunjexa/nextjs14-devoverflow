import qs from "query-string";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { BADGE_CRITERIA } from "@/constants";

import type {
  UrlQueryParams,
  RemoveUrlQueryParams,
  BadgeParams,
  BadgeCounts,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now: Date = new Date();
  const timeDifference: number = now.getTime() - createdAt.getTime();

  // Define time intervals in milliseconds
  const timeUnits: {
    unit: string;
    milliseconds: number;
  }[] = [
    { unit: "year", milliseconds: 365 * 24 * 60 * 60 * 1000 },
    { unit: "month", milliseconds: 30 * 24 * 60 * 60 * 1000 },
    { unit: "week", milliseconds: 7 * 24 * 60 * 60 * 1000 },
    { unit: "day", milliseconds: 24 * 60 * 60 * 1000 },
    { unit: "hour", milliseconds: 60 * 60 * 1000 },
    { unit: "minute", milliseconds: 60 * 1000 },
    { unit: "second", milliseconds: 1000 },
  ];

  for (const { unit, milliseconds } of timeUnits) {
    const time: number = Math.floor(timeDifference / milliseconds);
    if (time >= 1) {
      return `${time} ${unit}${time === 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

export const getFormattedNumber = (number: number): string => {
  if (number < 1000) return number.toString(); // Return the same number
  if (number < 1000000) return `${(number / 1000).toFixed(1)}K`; // Convert to K for number from 1000 < n < 1 million
  if (number < 1000000000) return `${(number / 1000000).toFixed(1)}M`; // Convert to M for number from 1 million < n < 1 billion
  return `${(number / 1000000000).toFixed(1)}B`; // Convert to B for number n > 1 billion
};

export const getFormattedJoinedDate = (date: Date): string => {
  const month: string = date.toLocaleString("en", { month: "long" });
  const year: number = date.getFullYear();

  return `Joined ${month} ${year}`;
};

export const formUrlQuery = ({
  params,
  key,
  value,
}: UrlQueryParams): string => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams): string => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const assignBadges = (params: BadgeParams): BadgeCounts => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};
