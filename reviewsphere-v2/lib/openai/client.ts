// OpenAI client + reply generation function
// Only used server-side in /api/generate

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TONE_INSTRUCTIONS: Record<string, string> = {
  Professional: "Write in a formal, polished, business-appropriate tone.",
  Friendly:     "Write in a warm, approachable, conversational tone.",
  Empathetic:   "Write with genuine understanding and care for the reviewer's experience.",
  Concise:      "Keep the reply brief — 2-3 sentences maximum.",
  "SEO Local":  "Naturally include the business type and local area to support local SEO.",
};

export async function generateReply(
  reviewText: string,
  tone: string
): Promise<string> {
  const toneInstruction =
    TONE_INSTRUCTIONS[tone] ?? TONE_INSTRUCTIONS.Professional;

  const completion = await openai.chat.completions.create({
    model:      "gpt-4o-mini",
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: `You are an expert at writing Google Business Profile review replies on behalf of business owners.
${toneInstruction}
Rules:
- Never invent details not in the review
- Do not use [Reviewer's Name] placeholders — just say "Thank you"
- Do not start with "I"
- Keep replies under 100 words unless the review is very detailed
- Sound human, not like an AI`,
      },
      {
        role: "user",
        content: `Write a reply to this Google review:\n\n"${reviewText}"`,
      },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() ?? "";
}