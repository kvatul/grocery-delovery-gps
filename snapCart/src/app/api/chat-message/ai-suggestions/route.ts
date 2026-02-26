import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { message, role } = await req.json();
    console.log("message, role", message, role);
    const prompt = `You are a professional delivery assistant chatbot.
You will be given:
role: either "user" or "delivery_boy"
last message: the last message sent in the conversation
Your task:
If role is "user" generate 3 short WhatsApp-style reply suggestions that a user could send to the delivery boy.
If role is "delivery_boy" generate 3 short WhatsApp-style reply suggestions that a delivery boy could send to the user.
▲ Follow these rules:
 Replies must match the context of the last message.
 Keep replies short, human-like (max 10 words).
 Use emojis naturally (max one per reply).
 No generic replies like "Okay" or "Thank you".
 Must be helpful, respectful, and relevant to delivery, status, help, or location.
 NO numbering, NO extra instructions, NO extra text.
 Just return comma-separated reply suggestions.
 
 Role:${role}
 Last message:${message}`;

    /*   const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, */

    //      in above medthod we are providing apike in url while in below method in header both are ok

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": `${process.env.GEMINI_API_KEY}`,
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    );
    const data = await response.json();
    const replyText = data?.candidates[0]?.content.parts[0]?.text || "";
    console.log(replyText);
    const suggestions = replyText.split(",").map((s: string) => s.trim());
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `error while getting AI suggestions ${error}` },
      { status: 501 },
    );
  }
}
