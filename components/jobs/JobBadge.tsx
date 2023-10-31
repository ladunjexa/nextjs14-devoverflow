import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

const JobBadge = ({
  data,
  badgeStyles,
  isLocation,
}: {
  data: any;
  badgeStyles?: string;
  isLocation?: boolean;
}) => {
  if (isLocation && !data.location) return null;

  const classNames = isLocation
    ? "`subtle-regular background-light800_dark300 text-light400_light500 gap-2 rounded-full border-none px-4 py-2"
    : "background-light800_dark400 relative h-16 w-16 rounded-lg";
  return (
    <Badge className={`${classNames} ${badgeStyles}`}>
      {isLocation ? (
        <>
          {data.location}
          {data.country && (
            <Image
              src={`https://flagsapi.com/${data.country}/flat/64.png`}
              width={16}
              height={16}
              alt="flag"
              className="rounded-full"
            />
          )}
        </>
      ) : (
        <Link href={data.website || "/"}>
          <Image
            src={data.logo}
            fill
            alt="logo"
            className="object-contain p-2"
          />
        </Link>
      )}
    </Badge>
  );
};

export default JobBadge;
