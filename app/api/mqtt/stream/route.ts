import { NextRequest } from "next/server";
import { initServerMqttClient } from "@/src/lib/mqtt-server";
import { config } from "@/src/lib/config";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const client = initServerMqttClient();

  if (client) {
    client.subscribe(config.mqtt.topic);

    client.on("message", async (topic: string, payload: Buffer) => {
      const message = {
        topic,
        message: payload.toString(),
        timestamp: new Date().toISOString(),
      };

      try {
        await writer.write(
          encoder.encode(`data: ${JSON.stringify(message)}\n\n`)
        );
      } catch (error) {
        console.error("Failed to write to stream:", error);
      }
    });

    // Clean up on disconnect
    request.signal.addEventListener("abort", () => {
      client.removeAllListeners("message");
      writer.close();
    });
  }

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}