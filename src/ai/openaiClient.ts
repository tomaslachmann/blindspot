import OpenAI from "openai";

export type ChatCompletionRequestMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

let openai: OpenAI | null = null;

export function initOpenAI(apiKey: string) {
  openai = new OpenAI({
    apiKey,
  });
}

export async function chatCompletion(
  messages: ChatCompletionRequestMessage[],
  model = "gpt-3.5-turbo",
  temperature = 0.7,
): Promise<string> {
  if (!openai) {
    throw new Error(
      "OpenAI client not initialized. Call initOpenAI(apiKey) first.",
    );
  }

  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
    });

    return response.choices[0].message?.content ?? "";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}
