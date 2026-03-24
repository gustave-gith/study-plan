import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "tasks.json");

interface Task {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
  subject: string;
  priority?: "low" | "medium" | "high";
}

function readTasks(): Task[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Task[];
}

function writeTasks(tasks: Task[]): void {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), "utf-8");
}

// GET /api/tasks — return all tasks
export async function GET() {
  try {
    const tasks = readTasks();
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json(
      { error: "Failed to read tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks — add a new task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, dueDate, completed, subject, priority } = body as Omit<Task, "id">;

    if (!title || !dueDate || !subject) {
      return NextResponse.json(
        { error: "Missing required fields: title, dueDate, subject" },
        { status: 400 }
      );
    }

    const tasks = readTasks();
    const newId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

    const newTask: Task = {
      id: newId,
      title,
      dueDate,
      completed: completed ?? false,
      subject,
      priority,
    };

    tasks.push(newTask);
    writeTasks(tasks);

    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
