"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { ReloadIcon } from "@radix-ui/react-icons";

import GlobalFilters from "@/components/shared/search/GlobalFilters";

import { globalSearch } from "@/lib/actions/general.action";

const GlobalResult = () => {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState([]);

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);

      try {
        const response = await globalSearch({ query: global, type });

        setResult(JSON.parse(response));
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    if (global) {
      fetchResult();
    }
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
      case "answer":
        return `/question/${Array.isArray(id) ? id[0] : id}`;
      // case "answer":
      //   return `/question/${id[0]}#${id[1]}`;
      case "user":
        return `/profile/${id}`;
      case "tag":
        return `/tags/${id}`;
      default:
        return "/";
    }
  };

  return (
    <div className="absolute top-full z-10 mt-3 w-full bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <GlobalFilters />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>
      </div>

      {isLoading ? (
        <div className="flex-center flex-col px-5">
          <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
          <p className="body-regular text-dark200_light800">
            Browsing the entire database...
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {result.length > 0 ? (
            result.map((item: any, index: number) => (
              <Link
                key={item.type + item.id + index}
                href={renderLink(item.type, item.id)}
                className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 hover:dark:bg-dark-500/50"
              >
                <Image
                  src="/assets/icons/tag.svg"
                  alt="tag"
                  width={18}
                  height={18}
                  className="invert-colors mt-1 object-contain"
                />

                <div className="flex flex-col">
                  <p className="body-medium text-dark200_light800 line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                    {item.type}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div>
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  No results found.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalResult;
