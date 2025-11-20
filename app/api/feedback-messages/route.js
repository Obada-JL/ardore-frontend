import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale");

  if (!locale || !["en", "tr", "ar"].includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  try {
    const messageFile = path.join(
      process.cwd(),
      "messages",
      locale,
      "common.json"
    );
    const messages = await fs.readFile(messageFile, "utf-8");
    const data = JSON.parse(messages);

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }
}
