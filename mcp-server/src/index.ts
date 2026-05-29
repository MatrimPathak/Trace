import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { verifyToken, extractBearerToken } from "./auth.js";
import { getTasks, GetTasksInput } from "./tools/getTasks.js";
import { getTask, GetTaskInput } from "./tools/getTask.js";
import { createTask, CreateTaskInput } from "./tools/createTask.js";
import { updateTask, UpdateTaskInput } from "./tools/updateTask.js";
import { attachScreenshot, AttachScreenshotInput } from "./tools/attachScreenshot.js";
import { uploadArtifact, UploadArtifactInput } from "./tools/uploadArtifact.js";
import { searchTasks, SearchTasksInput } from "./tools/searchTasks.js";

const FIREBASE_ID_TOKEN = process.env.TRACE_FIREBASE_TOKEN;

async function getUser() {
  if (!FIREBASE_ID_TOKEN) {
    throw new Error(
      "TRACE_FIREBASE_TOKEN environment variable not set. " +
      "Get your token from the Trace app → Settings → MCP Setup."
    );
  }
  return verifyToken(FIREBASE_ID_TOKEN);
}

const server = new McpServer({
  name: "trace",
  version: "0.1.0",
});

server.tool(
  "getTasks",
  "List tasks from the Trace archive. Optionally filter by type (bug/story/spike).",
  GetTasksInput.shape,
  async (input) => {
    const user = await getUser();
    const tasks = await getTasks(user, input as z.infer<typeof GetTasksInput>);
    return {
      content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }],
    };
  }
);

server.tool(
  "getTask",
  "Get a specific task by ID from the Trace archive.",
  GetTaskInput.shape,
  async (input) => {
    const user = await getUser();
    const task = await getTask(user, input as z.infer<typeof GetTaskInput>);
    return {
      content: [{ type: "text", text: JSON.stringify(task, null, 2) }],
    };
  }
);

server.tool(
  "createTask",
  "Create a new task document in the Trace archive. Use this after completing engineering work.",
  CreateTaskInput.shape,
  async (input) => {
    const user = await getUser();
    const result = await createTask(user, input as z.infer<typeof CreateTaskInput>);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  }
);

server.tool(
  "updateTask",
  "Update an existing task in the Trace archive.",
  UpdateTaskInput.shape,
  async (input) => {
    const user = await getUser();
    const result = await updateTask(user, input as z.infer<typeof UpdateTaskInput>);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  }
);

server.tool(
  "attachScreenshot",
  "Attach a screenshot (base64 encoded) to a task in the Trace archive.",
  AttachScreenshotInput.shape,
  async (input) => {
    const user = await getUser();
    const result = await attachScreenshot(user, input as z.infer<typeof AttachScreenshotInput>);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  }
);

server.tool(
  "uploadArtifact",
  "Upload a file artifact (base64 encoded) to a task in the Trace archive.",
  UploadArtifactInput.shape,
  async (input) => {
    const user = await getUser();
    const result = await uploadArtifact(user, input as z.infer<typeof UploadArtifactInput>);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  }
);

server.tool(
  "searchTasks",
  "Search tasks in the Trace archive by keyword. Searches title, summary, and tags.",
  SearchTasksInput.shape,
  async (input) => {
    const user = await getUser();
    const results = await searchTasks(user, input as z.infer<typeof SearchTasksInput>);
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Trace MCP server running on stdio");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
