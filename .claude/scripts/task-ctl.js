#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const CURRENT_TASK_PATH = path.join(ROOT, "docs/current-task.json");
const HISTORY_DIR = path.join(ROOT, "docs/history");

if (!fs.existsSync(CURRENT_TASK_PATH)) {
  console.error("current-task.json 파일이 존재하지 않습니다.");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(CURRENT_TASK_PATH, "utf8"));
const [,, cmd, taskId, ...rest] = process.argv;

if (cmd === "list") {
  const tasks = data.tasks || [];
  if (tasks.length === 0) { console.log("진행 중인 태스크가 없습니다."); process.exit(0); }
  tasks.forEach(t => {
    const subs = t.subtasks || [];
    const done = subs.filter(s => s.status === "completed").length;
    const icon = t.status === "in-progress" ? "▶" : t.status === "blocked" ? "⛔" : "⏳";
    console.log(`${icon} [${t.id}] ${t.title} (${t.status}) ${subs.length ? `${done}/${subs.length}` : ""}`);
    if (t.reason) console.log(`   중단 사유: ${t.reason}`);
  });
  process.exit(0);
}

// 사용법: task-ctl.js create <taskId> "<제목>" "<요청 원문 전체>" [requestedBy]
if (cmd === "create") {
  const [title, description, requestedBy] = rest;
  if (!taskId || !title) {
    console.error("사용법: task-ctl.js create <taskId> <title> <description> [requestedBy]");
    process.exit(1);
  }
  if ((data.tasks || []).find(t => t.id === taskId)) {
    console.error(`이미 존재하는 태스크입니다: ${taskId}`);
    process.exit(1);
  }
  data.tasks = data.tasks || [];
  data.tasks.push({
    id: taskId,
    title: title.trim(),
    description: (description || "").trim(),
    status: "pending",
    reason: null,
    requestedBy: requestedBy || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    needsSubtaskBreakdown: true,
    subtasks: [],
  });
  save();
  console.log(`[하네스 OS] 태스크 ${taskId} 생성 완료.`);
  process.exit(0);
}

if (cmd === "switch") {
  const current = data.tasks.find(t => t.status === "in-progress");
  if (current) {
    current.status = "blocked";
    current.reason = "[USER_INTERRUPTION]";
    save();
  }
  process.exit(0);
}

if (cmd === "start") {
  const pendingToStart = (data.tasks || []).find(t => t.status === "pending" && t.id === taskId);
  if (!pendingToStart) {
    console.error(`pending 상태 태스크를 찾을 수 없습니다: ${taskId}`);
    process.exit(1);
  }
  pendingToStart.status = "in-progress";
  pendingToStart.updatedAt = new Date().toISOString();
  save();
  console.log(`[하네스 OS] 태스크 ${taskId} 시작 완료. (pending → in-progress)`);
  process.exit(0);
}

if (cmd === "resume") {
  const blocked = (data.tasks || []).find(t => t.status === "blocked" && t.id === taskId);
  if (!blocked) {
    console.error(`블록된 태스크를 찾을 수 없습니다: ${taskId}`);
    process.exit(1);
  }
  blocked.status = "in-progress";
  blocked.reason = null;
  save();
  console.log(`[하네스 OS] 태스크 ${taskId} 재개 완료. (blocked → in-progress)`);
  process.exit(0);
}

const task = (data.tasks || []).find(t => t.id === taskId);
if (!task) {
  console.error(`해당 태스크를 찾을 수 없습니다: ${taskId}`);
  process.exit(1);
}

if (cmd === "subtasks") {
  if (rest.length === 0) process.exit(1);
  const startIdx = (task.subtasks || []).length;
  const newSubs = rest.map((title, i) => ({
    id: `${taskId}-${String(startIdx + i + 1).padStart(2, "0")}`,
    title: title.trim(),
    status: "todo"
  }));
  task.subtasks = [...(task.subtasks || []), ...newSubs];
  task.needsSubtaskBreakdown = false;
  save();
  console.log(`[하네스 OS] ${newSubs.length}개의 세부 작업 단계가 정상 승인 및 등록되었습니다.`);
}

else if (cmd === "done") {
  const subId = rest[0];
  const sub = (task.subtasks || []).find(s => s.id === subId);
  if (!sub) process.exit(1);
  sub.status = "completed";
  sub.completedAt = new Date().toISOString();
  save();
  console.log(`[하네스 OS] 단계 완료 처리 성공: ${subId}`);
}

else if (cmd === "complete") {
  const pending = (task.subtasks || []).filter(s => s.status !== "completed");
  if (pending.length > 0 && !rest.includes("--force")) {
    console.error("아직 완료되지 않은 subtask가 남아있어 폐쇄할 수 없습니다.");
    process.exit(1);
  }

  // small 작업 연속 카운팅
  const isSmall = task.complexity === "small" || task.isTrivial;
  if (isSmall) {
    data.smallCompletedStreak = (data.smallCompletedStreak || 0) + 1;
    if (data.smallCompletedStreak >= 5) {
      console.log(`\n⚠️  [컨텍스트 관리] small 작업 ${data.smallCompletedStreak}회 연속 완료.`);
      console.log(`   /compact 실행을 권장합니다. (실행 후 smallCompletedStreak 초기화됨)\n`);
    }
  } else {
    data.smallCompletedStreak = 0;
    console.log(`\n💡 [컨텍스트 관리] medium/large 태스크 완료 — /compact 실행을 권장합니다.\n`);
  }

  task.status = "completed";
  task.completedAt = new Date().toISOString();

  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const targetDir = path.join(HISTORY_DIR, ym);
  fs.mkdirSync(targetDir, { recursive: true });

  const baseFileName = `${ym}-${taskId}_${task.title
    .replace(/[\s\u{1F000}-\u{1FFFF}]/gu, "_")
    .replace(/[\/\\:*?"<>|.]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 80)}`;
  fs.writeFileSync(path.join(targetDir, `${baseFileName}.json`), JSON.stringify(task, null, 2));

  const mdReport = [
    `# 🏆 트러블슈팅 및 작업 완료 리포트 [${taskId}]`,
    `- **태스크명:** ${task.title}`,
    task.description ? `- **요청 원문:** ${task.description}` : null,
    `- **요청자:** ${task.requestedBy}`,
    `- **종결 일시:** ${task.completedAt}`,
    `\n## 📋 실행된 세부 체크리스트 이력`,
    (task.subtasks || []).map(s => ` - [x] [${s.id}] ${s.title} (완료: ${s.completedAt})`).join("\n"),
    `\n## 🧠 AI 개발자의 기술 회고록 (Harness Reflection)`,
    `> **본 섹션은 하네스 운영체제 규칙에 의해 종결 시 자동 유도되어 작성된 AI의 자체 부검 보고서입니다.**`,
    `\n### 1. 이번 트러블슈팅의 기술적 근본 원인 (Root Cause)`,
    `- (수정 도중 파악한 구조적 결함이나 코드 버그의 명확한 이유)`,
    `\n### 2. 시도했으나 실패했던 방안들과 그 이유 (Lessons Learned)`,
    `- (단판 승부를 방해할 뻔한 예외 케이스나 오작동 원인 분석)`,
    `\n### 3. 향후 재발 방지를 위한 아키텍처적 조언`,
    `- (참고할 파일 위치나 컴포넌트 간 결합도 주의점)\n`
  ].filter(l => l !== null).join("\n");

  fs.writeFileSync(path.join(targetDir, `${baseFileName}.md`), mdReport);

  data.tasks = data.tasks.filter(t => t.id !== taskId);
  fs.writeFileSync(CURRENT_TASK_PATH, JSON.stringify(data, null, 2));

  console.log(`\n======================================================`);
  console.log(`✅ [하네스 OS] 태스크 ${taskId} 종결 완료.`);
  console.log(`📂 경로: docs/history/${ym}/${baseFileName}.md`);
  console.log(`⚠️  NEXT: 마크다운 회고록 3개 문항 작성 후 대화 종료.`);
  console.log(`======================================================\n`);
}

function save() {
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(CURRENT_TASK_PATH, JSON.stringify(data, null, 2));
}
