"use client";

import { useEffect, useState } from "react";

interface HelloWorldProps {
  connectionStatus: "connected" | "disconnected" | "connecting";
}

export default function HelloWorld({ connectionStatus }: HelloWorldProps) {
  const [timestamp, setTimestamp] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    setTimestamp(new Date().toLocaleString());

    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return <span className="badge badge-success badge-lg text-lg px-4 py-3">● Connected</span>;
      case "disconnected":
        return <span className="badge badge-error badge-lg text-lg px-4 py-3">○ Disconnected</span>;
      case "connecting":
        return <span className="badge badge-warning badge-lg text-lg px-4 py-3">◐ Connecting...</span>;
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title text-5xl font-bold mb-4">Hello World!</h1>
        <p className="text-2xl text-base-content/80 mb-4">Welcome to BrightSign Display</p>
        <div className="divider"></div>
        <div className="space-y-4">
          <div>
            <p className="text-lg text-base-content/60">Page Loaded</p>
            <p className="text-xl font-semibold">{timestamp}</p>
          </div>
          <div>
            <p className="text-lg text-base-content/60">Current Time</p>
            <p className="text-3xl font-bold font-mono">{currentTime || "..."}</p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xl">MQTT Status:</span>
            {getStatusBadge()}
          </div>
        </div>
      </div>
    </div>
  );
}