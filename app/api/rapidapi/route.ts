import { NextResponse } from "next/server";

const config = {
  apiKey: process.env.RAPIDAPI_API_KEY as string,
  apiHost: "https://jsearch.p.rapidapi.com",
};

export const POST = async (request: Request) => {
  const {
    page = 1,
    pageSize = 1,
    filter = "us",
    searchQuery = "Software Engineer",
  } = await request.json();

  try {
    const response = await fetch(
      `${config.apiHost}/search?query=${searchQuery}&location=${filter}&page=${page}&num_pages=${pageSize}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": config.apiKey,
          "X-RapidAPI-Host": config.apiHost,
        },
      }
    );

    const responseData = await response.json();
    const result = responseData.result;

    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
