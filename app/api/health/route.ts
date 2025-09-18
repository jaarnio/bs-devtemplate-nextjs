import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: Date.now(),
    uptime: process.uptime(),
    node_version: process.version,
  });
}