#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "../..");
const CURRENT_TASK_PATH = path.join(ROOT, "docs/current-task.json");

function getGitUser() {
  try {
    return execSync("git config user.name", { encoding: "utf8" }).trim() || process.env.USER || "Developer";
  } catch {
    return process.env.USER || "Developer";
  }
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", c => (raw += c));
process.stdin.on("end", () => {
  try { run(raw); } catch { process.exit(0); }
});

function run(rawInput) {
  if (!fs.existsSync(CURRENT_TASK_PATH)) {
    fs.mkdirSync(path.dirname(CURRENT_TASK_PATH), { recursive: true });
    fs.writeFileSync(CURRENT_TASK_PATH, JSON.stringify({ tasks: [] }, null, 2));
  }

  let data = { tasks: [] };
  try { data = JSON.parse(fs.readFileSync(CURRENT_TASK_PATH, "utf8")); } catch { process.exit(0); }
  data.tasks = data.tasks || [];

  const blocked = data.tasks.find(t => t.status === "blocked");
  if (blocked) {
    process.stdout.write(`[시스템 알림] 지난 작업이 [${blocked.reason}] 사유로 중단되었습니다. 재개하려면 'resume' 명령을 수행하세요.`);
    process.exit(0);
  }

  // pending 태스크가 있고 in-progress가 없으면 자동 승격
  const pendingTask = data.tasks.find(t => t.status === "pending");
  const activeCount = data.tasks.filter(t => t.status === "in-progress").length;
  if (pendingTask && activeCount === 0) {
    pendingTask.status = "in-progress";
    pendingTask.updatedAt = new Date().toISOString();
    fs.writeFileSync(CURRENT_TASK_PATH, JSON.stringify(data, null, 2));
  }

  const inProgress = data.tasks.filter(t => t.status === "in-progress");
  let userPrompt = "";
  try {
    const event = JSON.parse(rawInput.trim() || "{}");
    userPrompt = (event.prompt || "").trim();
  } catch { userPrompt = ""; }

  // 작업 규모 분류
  const TRIVIAL_KEYWORDS = ["고쳐", "수정", "바꿔", "변경", "지워", "삭제", "추가해", "rename", "fix", "change", "remove", "delete", "update"];
  const isTrivial = userPrompt.length < 80 && TRIVIAL_KEYWORDS.some(k => userPrompt.includes(k));

  // architect 사전 호출 필요도 분류 (isTrivial이 아닌 경우에만 의미 있음)
  const LARGE_KEYWORDS = ["시스템", "전체", "리팩토링", "교체", "설계", "구조", "마이그레이션", "schema", "refactor", "redesign", "architecture"];
  const NEW_FILE_KEYWORDS = ["만들어줘", "생성해", "새로", "create", "새 파일", "새 모듈", "새 컴포넌트"];
  const API_KEYWORDS = ["api", "endpoint", "인터페이스", "스키마", "db", "database", "테이블"];
  const complexityScore =
    (LARGE_KEYWORDS.some(k => userPrompt.toLowerCase().includes(k)) ? 2 : 0) +
    (NEW_FILE_KEYWORDS.some(k => userPrompt.includes(k)) ? 1 : 0) +
    (API_KEYWORDS.some(k => userPrompt.toLowerCase().includes(k)) ? 1 : 0);
  // large(2): architect 자동 호출 / medium(1): architect 호출 여부 사람에게 물어봄 / small(0): 바로 구현
  const complexity = complexityScore >= 2 ? "large" : complexityScore === 1 ? "medium" : "small";

  if (inProgress.length === 0 && userPrompt.length > 30) {
    const title = userPrompt.slice(0, 60).replace(/\n/g, " ");
    const maxNum = data.tasks.reduce((m, t) => {
      const n = parseInt((t.id || "").replace(/\D/g, ""), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    const newId = `task-${String(maxNum + 1).padStart(3, "0")}`;

    const newTask = {
      id: newId,
      title,
      description: userPrompt,
      status: "in-progress",
      reason: null,
      updatedAt: new Date().toISOString(),
      requestedBy: getGitUser(),
      createdAt: new Date().toISOString(),
      isTrivial,
      complexity: isTrivial ? "small" : complexity,
      needsSubtaskBreakdown: !isTrivial,
      subtasks: []
    };
    data.tasks.push(newTask);
    fs.writeFileSync(CURRENT_TASK_PATH, JSON.stringify(data, null, 2));
    inProgress.push(newTask);
  }

  const currentTask = inProgress[0] || null;
  const ctx = ["━━━ 하네스 작업 OS ━━━"];

  if (currentTask) {
    ctx.push(`▶ [${currentTask.id}] ${currentTask.title} (요청자: ${currentTask.requestedBy})`);
    const subs = currentTask.subtasks || [];

    if (currentTask.isTrivial) {
      ctx.push(`\n⚡ [소규모 작업] 게이트 없이 바로 구현합니다.`);
      ctx.push(`   구현 완료 후 빌드 명령으로 에러 0 확인 → task-ctl.js complete ${currentTask.id} --force`);
    } else if (currentTask.needsSubtaskBreakdown) {
      ctx.push(`\n🔧 REQUIRED FIRST ACTION (설계 합의 대기):`);
      ctx.push(`   아래 터미널 명령을 통해 세부 체크리스트를 먼저 등록하고 인간의 승인을 받으세요.`);
      ctx.push(`   node .claude/scripts/task-ctl.js subtasks ${currentTask.id} "세부작업1" "세부작업2" ...`);
    } else {
      const doneCount = subs.filter(s => s.status === "completed").length;
      ctx.push(`   진행률: ${doneCount}/${subs.length}`);
      subs.forEach(s => {
        const box = s.status === "completed" ? "☑" : "☐";
        ctx.push(`   ${box} [${s.id}] ${s.title}`);
      });
      const nextSub = subs.find(s => s.status === "todo");
      if (nextSub) {
        ctx.push(`\n→ 다음 액션 가이드: [${nextSub.id}] ${nextSub.title}`);
        ctx.push(`   완료 처리 명령어: node .claude/scripts/task-ctl.js done ${currentTask.id} ${nextSub.id}`);
      } else {
        ctx.push(`\n✅ 모든 세부 작업 완료! 검증(architect + qa-reviewer 병렬 호출) 후 폐쇄하세요:`);
        ctx.push(`   node .claude/scripts/task-ctl.js complete ${currentTask.id}`);
      }
    }
  } else {
    ctx.push("   진행 중인 활성 태스크가 없습니다. 새로운 지시를 내리면 자동으로 로킹됩니다.");
  }
  ctx.push("━━━━━━━━━━━━━━━━━━━━━━━");

  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: ctx.join("\n") } }));
  process.exit(0);
}
