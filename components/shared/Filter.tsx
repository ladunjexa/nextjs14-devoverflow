"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formUrlQuery } from "@/lib/utils";

import type { FilterProps } from "@/types";

interface Props {
  filters: FilterProps[];
  otherClasses?: string;
  containerClasses?: string;
  jobFilter?: boolean;
}
const Filter = ({
  filters,
  otherClasses,
  containerClasses,
  jobFilter = false,
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchParamKey = jobFilter ? "location" : "filter";
  const paramFilter = searchParams.get(searchParamKey);

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: searchParamKey,
      value: jobFilter ? value.toLowerCase() : value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue
              placeholder={jobFilter ? "Select Location" : "Select a Filter"}
            />
          </div>
        </SelectTrigger>
        <SelectContent
          className={`text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300 ${
            jobFilter && "max-h-[12rem] overflow-y-auto"
          }`}
        >
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem
                key={filter.value}
                value={filter.value}
                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
              >
                {jobFilter && (
                  <Image
                    src={`https://flagsapi.com/${filter.value}/flat/64.png`}
                    width={16}
                    height={16}
                    alt="flag"
                    className="mr-2 inline-flex rounded-lg"
                  />
                )}
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
