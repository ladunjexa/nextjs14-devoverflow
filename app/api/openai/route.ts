import { NextResponse } from "next/server";

const config = {
  apiKey: process.env.OPENAI_API_KEY as string,
  apiHost: "https://api.openai.com/v1/chat/completions",
  systemContent:
    "You are a knowlegeable assistant that provides quality information.",
  userContent: (question: string) => `Tell me ${question}`,
};

export const POST = async (request: Request) => {
  const { question } = await request.json();

  try {
    const response = await fetch(config.apiHost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: config.systemContent,
          },
          {
            role: "user",
            content: config.userContent(question),
          },
        ],
      }),
    });

    const responseData = await response.json();
    const reply = responseData.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
