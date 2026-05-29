import { NextRequest, NextResponse } from "next/server";

// This endpoint documents the MCP connection.
// The actual MCP server runs as a separate stdio process (see /mcp-server).
// VS Code can also connect via this HTTP endpoint for remote sessions.
export async function GET(_request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://your-trace-app.vercel.app";

  return NextResponse.json({
    name: "trace",
    version: "0.1.0",
    description: "Trace MCP server — engineering archive for GitHub Copilot",
    transport: "stdio",
    setup: {
      instructions: "Install the Trace MCP server package and configure with your Firebase token.",
      vsCodeConfig: {
        "github.copilot.mcp.servers": {
          trace: {
            command: "npx",
            args: ["trace-mcp-server"],
            env: {
              TRACE_FIREBASE_TOKEN: "<your-firebase-id-token>",
              FIREBASE_ADMIN_PROJECT_ID: "<your-project-id>",
              FIREBASE_ADMIN_CLIENT_EMAIL: "<your-client-email>",
              FIREBASE_ADMIN_PRIVATE_KEY: "<your-private-key>",
            },
          },
        },
      },
    },
    tools: [
      "getTasks",
      "getTask",
      "createTask",
      "updateTask",
      "attachScreenshot",
      "uploadArtifact",
      "searchTasks",
    ],
  });
}
