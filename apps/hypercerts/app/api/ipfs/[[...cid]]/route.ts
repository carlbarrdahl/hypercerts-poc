import { NextResponse, NextRequest } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { createHash } from "crypto";
import { existsSync } from "fs";

const STORAGE_DIR = join(process.cwd(), ".ipfs-storage");

// Ensure storage directory exists
async function ensureStorageDir() {
  if (!existsSync(STORAGE_DIR)) {
    await mkdir(STORAGE_DIR, { recursive: true });
  }
}

// Generate a hash (CID) for the file content
function generateCID(content: Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    await ensureStorageDir();

    const form = await request.formData();
    const file = form.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate CID from content
    const cid = generateCID(buffer);

    // Store file with metadata
    const metadata = {
      name: file.name,
      type: file.type,
      size: file.size,
      content: buffer.toString("base64"),
    };

    const filePath = join(STORAGE_DIR, `${cid}.json`);
    await writeFile(filePath, JSON.stringify(metadata));

    const url = `http://localhost:3000/api/ipfs/${cid}`;

    console.log("ipfs url", url);
    return NextResponse.json({ cid, url, mime: file.type }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("GET IPFS");
    await ensureStorageDir();
    // Extract CID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const cid = pathParts[pathParts.length - 1];

    if (!cid) {
      return NextResponse.json({ error: "No CID provided" }, { status: 400 });
    }

    const filePath = join(STORAGE_DIR, `${cid}.json`);
    console.log({ filePath });
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const content = await readFile(filePath, "utf-8");
    const metadata = JSON.parse(content);
    console.log("metadata", metadata);

    // Decode the base64 content
    const decodedContent = Buffer.from(metadata.content, "base64").toString(
      "utf-8"
    );

    // If the content is JSON, parse and return it
    if (metadata.type === "application/json") {
      try {
        const jsonContent = JSON.parse(decodedContent);
        return NextResponse.json(jsonContent, { status: 200 });
      } catch (e) {
        console.error("Failed to parse JSON content:", e);
        return NextResponse.json(
          { error: "Invalid JSON content" },
          { status: 500 }
        );
      }
    }

    // For non-JSON content, return the decoded text
    return new NextResponse(decodedContent, {
      status: 200,
      headers: {
        "Content-Type": metadata.type || "text/plain",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
