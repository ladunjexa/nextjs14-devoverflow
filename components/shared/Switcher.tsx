"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface Props {
  searchParamKey?: string;
  label?: string;
}

const Switcher = ({
  searchParamKey = "remote",
  label = "Remote jobs only",
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramFilter = searchParams.get(searchParamKey);

  const handleUpdateParams = (value: string) => {
    let newUrl;

    if (!value) {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: [searchParamKey],
      });
    } else {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: searchParamKey,
        value,
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <>
      <Switch
        id="remote-only"
        className="ml-4 mr-2"
        checked={paramFilter === "true"}
        // @ts-expect-error
        onCheckedChange={handleUpdateParams}
      />
      <Label htmlFor="remote-only" className="text-light-500">
        {label}
      </Label>
    </>
  );
};

export default Switcher;
