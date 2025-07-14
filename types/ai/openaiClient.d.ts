export type ChatCompletionRequestMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};
export declare function initOpenAI(apiKey: string): void;
export declare function chatCompletion(messages: ChatCompletionRequestMessage[], model?: string, temperature?: number): Promise<string>;
