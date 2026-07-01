#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "../..");
const CURRENT_TASK_PATH = path.join(ROOT, "docs/current-task.json");

if (!fs.existsSync(CURRENT_TASK_PATH)) process.exit(0);

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", c => (input += c));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(fs.readFileSync(CURRENT_TASK_PATH, "utf8"));
    const currentTask = (data.tasks || []).find(t => t.status === "in-progress");
    if (!currentTask || currentTask.needsSubtaskBreakdown) process.exit(0);

    const subs = currentTask.subtasks || [];
    const doneCount = subs.filter(s => s.status === "completed").length;

    const ctx = [
      `[실시간 하네스 싱크] ▶ [${currentTask.id}] ${currentTask.title}`,
      `진행률: ${doneCount}/${subs.length}`
    ];
    subs.forEach(s => {
      ctx.push(`  ${s.status === "completed" ? "☑" : "☐"} ${s.title}`);
    });

    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: ctx.join("\n") } }));
  } catch (syncError) {
    // hook 실패는 조용히 무시 — 메인 세션 방해 금지
    void syncError;
  }
  process.exit(0);
});
