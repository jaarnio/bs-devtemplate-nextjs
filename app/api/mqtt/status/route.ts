import { NextResponse } from "next/server";
import { getServerMqttStatus } from "@/src/lib/mqtt-server";

export async function GET() {
  const status = getServerMqttStatus();
  return NextResponse.json(status);
}