import Filter from "@/components/shared/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

import JobFilters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import JobCard from "@/components/cards/JobCard";

import { getCountryFilters, getJobs } from "@/lib/actions/job.action";

import { JobPageFilters } from "@/constants/filters";

import type { SearchParamsProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs — DevOverflow",
};

const Page = async ({ searchParams }: SearchParamsProps) => {
  const CountryFilters = await getCountryFilters();

  const result = await getJobs({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    location: searchParams.location,
    remote: searchParams.remote,
    page: searchParams.page ? +searchParams.page : 1,
    wage: searchParams.wage,
    skills: searchParams.skills,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/jobs"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Job Title, Company, or Keywords"
          otherClasses="flex-1"
        />
        {CountryFilters && (
          <Filter
            filters={CountryFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            jobFilter
          />
        )}
      </div>

      <JobFilters filters={JobPageFilters} jobFilter />

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.data.length > 0 ? (
          result.data.map((jobItem: any) => (
            <JobCard
              key={jobItem.job_id}
              title={jobItem.job_title}
              description={jobItem.job_description}
              city={jobItem.job_city}
              state={jobItem.job_state}
              country={jobItem.job_country}
              requiredSkills={jobItem.job_required_skills?.slice(0, 5) || []}
              applyLink={jobItem.job_apply_link}
              employerLogo={jobItem.employer_logo}
              employerName={jobItem.employer_name}
              employerWebsite={jobItem.employer_website}
              employmentType={jobItem.job_employment_type?.toLowerCase()}
              isRemote={jobItem.job_is_remote}
              salary={{
                min: jobItem.job_min_salary,
                max: jobItem.job_max_salary,
                currency: jobItem.job_salary_currency,
                period: jobItem.job_salary_period,
              }}
              postedAt={jobItem.job_posted_at_datetime_utc}
            />
          ))
        ) : (
          <NoResult
            title="No Jobs Found"
            description="We couldn't find any jobs matching your search 🤔"
            link="/jobs"
            linkTitle="Explore Jobs"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default Page;
