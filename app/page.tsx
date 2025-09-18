"use client";

import { useState } from "react";
import HelloWorld from "@/src/components/HelloWorld";
import MqttPanel from "@/src/components/MqttPanel";
import { ConnectionStatus } from "@/src/lib/mqtt-client";

export default function Home() {
  const [mqttStatus, setMqttStatus] = useState<ConnectionStatus>("disconnected");

  return (
    <div className="w-[1920px] h-[1080px] bg-base-200 overflow-hidden">
      <div className="h-full p-8 flex flex-col">
        {/* Header - Fixed height */}
        <div className="text-center mb-6">
          <h1 className="text-6xl font-bold mb-3">Hello World Reference Application</h1>
          <p className="text-2xl text-base-content/70">
            React 18 • Next.js 15 • MQTT.js 5 • DaisyUI • Node.js 18
          </p>
        </div>

        {/* Main Content - Flex grow to fill space */}
        <div className="flex-1 grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Hello World Card */}
            <HelloWorld connectionStatus={mqttStatus} />

            {/* Application Information */}
            <div className="card bg-base-100 shadow-xl flex-1">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">System Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3">Runtime Environment</h3>
                    <ul className="text-lg space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="text-success">✓</span> Node.js 18.x
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-success">✓</span> Chromium 120
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-success">✓</span> 1920x1080 Display
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-3">Technology Stack</h3>
                    <ul className="text-lg space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="text-info">◆</span> React 18
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-info">◆</span> Next.js 15
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-info">◆</span> MQTT WebSocket
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* MQTT Panel - Takes most of the space */}
            <div className="flex-1">
              <MqttPanel onStatusChange={setMqttStatus} />
            </div>

            {/* UI Components Demo - Fixed height */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">UI Components</h2>
                <div className="flex flex-wrap gap-3">
                  <button className="btn btn-primary btn-lg">Primary</button>
                  <button className="btn btn-secondary btn-lg">Secondary</button>
                  <button className="btn btn-accent btn-lg">Accent</button>
                  <button className="btn btn-ghost btn-lg">Ghost</button>
                  <button className="btn btn-outline btn-lg">Outline</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}