"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import GlobalResult from "@/components/shared/search/GlobalResult";

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef<HTMLInputElement | null>(null);

  const query = searchParams.get("q");

  const [search, setSearch] = useState<string>(query || "");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    setIsOpen(false);

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (!query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, pathname, router, searchParams, query]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          type="text"
          placeholder="Search globally..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            if (!isOpen) setIsOpen(true);

            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className="text-dark400_light700 paragraph-regular no-focus placeholder border-none bg-transparent shadow-none outline-none"
        />
      </div>

      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
