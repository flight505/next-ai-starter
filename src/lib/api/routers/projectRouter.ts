import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import os from "os";

export const projectRouter = createTRPCRouter({
  // Create a new project
  createProject: publicProcedure
    .input(
      z.object({
        projectName: z.string(),
        projectDescription: z.string(),
        projectPath: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const projectId = uuidv4();
        const projectConfigPath = path.join(input.projectPath, "forq.json");

        // Create project metadata
        const projectData = {
          id: projectId,
          name: input.projectName,
          description: input.projectDescription,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Create project directory if it doesn't exist
        await fs.mkdir(input.projectPath, { recursive: true });

        // Save project metadata
        await fs.writeFile(
          projectConfigPath,
          JSON.stringify(projectData, null, 2),
        );

        return {
          success: true,
          projectId,
          projectPath: input.projectPath,
        };
      } catch (error) {
        console.error("Error creating project:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  // Clone next-ai-starter repository
  cloneRepository: publicProcedure
    .input(
      z.object({
        projectPath: z.string(),
        repositoryUrl: z
          .string()
          .default("git@github.com:kleneway/next-ai-starter.git"),
        branch: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return new Promise((resolve) => {
        // Prepare git command
        let command = `git clone ${input.repositoryUrl} ${input.projectPath}`;

        // Add branch if specified
        if (input.branch) {
          command += ` --branch ${input.branch}`;
        }

        // Execute git clone
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error("Error cloning repository:", error);
            resolve({
              success: false,
              error: error.message,
              stderr,
            });
            return;
          }

          resolve({
            success: true,
            stdout,
            stderr,
          });
        });
      });
    }),

  // Get project details
  getProject: publicProcedure
    .input(
      z.object({
        projectPath: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const projectConfigPath = path.join(input.projectPath, "forq.json");
        const projectDataRaw = await fs.readFile(projectConfigPath, "utf-8");
        const projectData = JSON.parse(projectDataRaw);

        return {
          success: true,
          project: projectData,
        };
      } catch (error) {
        console.error("Error getting project:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  // Get task lists in project
  getTaskLists: publicProcedure
    .input(
      z.object({
        projectPath: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const docsDir = path.join(input.projectPath, "docs");

        // Ensure docs directory exists
        try {
          await fs.access(docsDir);
        } catch {
          await fs.mkdir(docsDir, { recursive: true });
          return {
            success: true,
            taskLists: [],
          };
        }

        // Get list of task files
        const files = await fs.readdir(docsDir);
        const taskLists = files
          .filter((file) => file.startsWith("tasks_") && file.endsWith(".md"))
          .map((file) => ({
            id: file.replace(".md", ""),
            name: file,
            path: path.join(docsDir, file),
          }));

        return {
          success: true,
          taskLists,
        };
      } catch (error) {
        console.error("Error getting task lists:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          taskLists: [],
        };
      }
    }),

  // Export project as ZIP
  exportProject: publicProcedure
    .input(
      z.object({
        projectPath: z.string(),
        exportPath: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // This would be implemented with a ZIP library
        // For now, we'll just return a success message
        return {
          success: true,
          message:
            "Project export functionality will be implemented with a ZIP library",
        };
      } catch (error) {
        console.error("Error exporting project:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  // Get project details from forq.json
  getProjectDetails: publicProcedure
    .input(
      z.object({
        projectPath: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const forqJsonPath = path.join(input.projectPath, "forq.json");

        // Check if forq.json exists
        try {
          await fs.access(forqJsonPath);
        } catch (error) {
          return {
            success: false,
            error: "forq.json not found in the specified directory",
          };
        }

        // Read and parse forq.json
        const content = await fs.readFile(forqJsonPath, "utf-8");
        const projectData = JSON.parse(content);

        return {
          success: true,
          project: {
            id: projectData.id || "",
            name: projectData.name || "(Unnamed Project)",
            description: projectData.description || "",
            createdAt: projectData.createdAt || "",
            updatedAt: projectData.updatedAt || "",
          },
        };
      } catch (error) {
        console.error("Error getting project details:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  executeGitClone: publicProcedure
    .input(
      z.object({
        repoUrl: z.string(),
        destinationPath: z.string().optional(),
        projectName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Sanitize project name for directory name
        const sanitizedName = input.projectName
          .toLowerCase()
          .replace(/[^a-z0-9-_]/g, "-");

        // Use the sanitized name for the directory
        const projectDir = path.join(
          os.homedir(),
          "Projects",
          sanitizedName
        );

        // Make sure the parent directory exists
        await fs.mkdir(path.dirname(projectDir), { recursive: true });

        // Check if the directory already exists
        try {
          await fs.access(projectDir);
          // If we get here, directory exists
          return {
            success: false,
            message: `Directory already exists: ${projectDir}`,
            path: projectDir,
          };
        } catch {
          // Directory doesn't exist, continue with clone
        }

        // Perform git clone
        const { stdout, stderr } = await exec(
          `git clone ${input.repoUrl} ${projectDir}`
        );

        return {
          success: true,
          message: `Repository cloned successfully to ${projectDir}`,
          stdout,
          stderr,
          path: projectDir,
        };
      } catch (error) {
        return {
          success: false,
          message: `Failed to clone repository: ${(error as Error).message}`,
          path: "",
        };
      }
    }),
});
