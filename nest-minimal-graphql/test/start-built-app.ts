import { spawn, type ChildProcessByStdio } from "node:child_process";
import { once } from "node:events";
import type { Readable } from "node:stream";

export async function startBuiltApp(databaseUrl: string, extraEnv: NodeJS.ProcessEnv = {}) {
  const child = spawn(process.execPath, ["dist/main.mjs"], {
    env: {
      ...process.env,
      AUTH_URL: "",
      AUTH_SECRET: "",
      DATABASE_URL: databaseUrl,
      NODE_ENV: "production",
      PORT: "0",
      ...extraEnv,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const close = async () => {
    if (child.kill()) await once(child, "exit");
  };

  try {
    const graphqlUrl = await waitForGraphQL(child);
    return { url: new URL(graphqlUrl).origin, close };
  } catch (error) {
    await close();
    throw error;
  }
}

function waitForGraphQL(process: ChildProcessByStdio<null, Readable, Readable>): Promise<string> {
  return new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(
      () => reject(new Error(`GraphQL did not start:\n${output}`)),
      10_000,
    );
    const recordOutput = (chunk: Buffer) => {
      output += chunk.toString();
      const url = output.match(/GraphQL ready at (http:\/\/\S+\/graphql)/)?.[1];
      if (url) {
        clearTimeout(timeout);
        resolve(url);
      }
    };
    process.stdout.on("data", recordOutput);
    process.stderr.on("data", recordOutput);
    process.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    process.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`GraphQL exited (${code}):\n${output}`));
    });
  });
}
