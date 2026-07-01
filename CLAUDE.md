@.claude/memory/project-context.md
@.claude/memory/coding-style.md

# CLAUDE.md — 행동 및 통제 프로세스 지침

## 기본 명령어
세션 시작 시 프로젝트 루트의 파일을 확인해 아래 CASE 중 하나를 자동 적용한다.
빌드 명령 실행 전 SENSITIVE_DATA_FILE 목록의 파일이 스테이징되어 있는지 반드시 확인하고, 있으면 즉시 중단하고 담당자에게 보고한다.

### CASE 1 — JavaScript / TypeScript (Next.js)
- **식별 기준**: `package.json`, `tsconfig.json`, `next.config.ts` 존재 ✅ 이 프로젝트
- **검증 명령**: `tsc --noEmit && npm run lint`
- **빌드 명령**: `npm run build`
- **민감 파일**: `.env.local`, `.env`, `secrets.json`

## 1. 단일·팀 하이브리드 운영 원칙 (토큰 비용 핵심 규칙)
- **기획·구현은 메인 세션(나 자신)이 직접 수행한다.** 서브에이전트를 기획/구현 단계에 호출하지 않는다.
  서브에이전트 호출은 매 라운드트립이 과금되며, 남용 시 단일 스레드 대비 최대 7배 토큰을 소모한다.
- **작업 규모에 따라 검증 방식이 달라진다** (아래 2번 참조).
- `qa-reviewer`가 "ESCALATE"로 응답하면 동일 영역을 sonnet 모델로 직접 재검토한다 (opus 즉시 호출 금지 —
  단계적 에스컬레이션으로 비용 통제).

## 2. 작업 규모별 프로세스

### 소규모 작업 (isTrivial = true)
> hook이 자동 판별: 80자 미만 + 수정/변경 키워드 포함
1. 게이트 없이 바로 구현한다 (subtask 등록·"고" 대기 생략).
2. 구현 완료 → **빌드/타입체크 명령 실행해 에러 0 확인** (컴파일러가 예상 못한 부작용을 잡아준다).
3. `task-ctl.js complete <taskId> --force`로 폐쇄.

### 중간~대형 작업 (isTrivial = false)
1. Write/Edit 절대 금지 → 먼저 `node .claude/scripts/task-ctl.js subtasks <taskId> "..."` 로 세부 단계 등록.
2. 체크리스트와 함께 **작업 등급 + 호출 사유 + 예상 모델 사용**을 아래 형식으로 보여주고 대기한다.
3. "고" 승인 후 complexity에 따라 진행한다.

### 컨펌 메시지 출력 형식 (반드시 준수)

large인 경우:
```
🔍 작업 등급: LARGE
   호출 사유: <감지된 키워드 또는 판단 근거>
   → [구현 전] architect(sonnet) PHASE:PRE — 방향성 검증
   → [구현 후] architect(sonnet) PHASE:POST + qa-reviewer-ts(haiku) 병렬
   → security-reviewer(haiku): auth/api/db/input/token/route 관련 변경 시만 추가
   예상 모델: sonnet 2회 + haiku 1~2회

위 단계대로 시작해도 될까요? '고'를 입력해 주세요!
등급 변경: '고 medium' 또는 '고 small'로 직접 조정 가능
보안 리뷰 강제: '고 security'로 security-reviewer 무조건 추가
```

medium인 경우:
```
🔍 작업 등급: MEDIUM
   호출 사유: <감지된 키워드 또는 판단 근거>
   → [구현 후] qa-reviewer-ts(haiku)만 호출 (architect 없음)
   예상 모델: haiku 1회

위 단계대로 시작해도 될까요? '고'를 입력해 주세요!
```

small인 경우:
```
🔍 작업 등급: SMALL
   → 에이전트 팀 없음, 빌드 검증만 실행
   예상 모델: 없음

바로 시작해도 될까요? '고'를 입력해 주세요!
```

### complexity별 검증 흐름

| complexity | 구현 전 | 구현 후 |
|-----------|---------|---------|
| `large` | architect PHASE:PRE | architect PHASE:POST + qa-reviewer-ts 병렬 + security-reviewer (보안 관련 변경 시만) |
| `medium` | 없음 | qa-reviewer-ts만 |
| `small` | 없음 | 빌드 검증만 |

## 2-1. 초기 아키텍처 설정 운영 규칙
이 프로젝트는 `INIT_COMPLETE: true` 상태입니다.
모든 architect 호출은 `architect(sonnet)` 을 사용합니다.

## 3. 외과적 수술 원칙
- 원인 지점만 정확히 수정한다. 인접 코드의 광범위한 리팩토링은 금지.
- 소규모든 대형이든 빌드 명령 에러 0 확인은 공통 필수 단계다.

## 4. 외부 라이브러리 제약
독단적 설치 금지. 3줄 규격으로 허락 요청:
1. 패키지명 및 버전
2. 내장 구현 대비 명확한 이점
3. 용량 및 빌드 영향

## 5. 태스크 폐쇄 조건
- **소규모**: 빌드 에러 0 → `task-ctl.js complete <taskId> --force`
- **대형**: 모든 subtask ☑ + architect/qa-reviewer 동시 PASS + 빌드 성공 → `task-ctl.js complete <taskId>`
→ 생성된 마크다운 회고록 3문항을 성의 있게 작성 후 대화 종료.

## 6. 컨텍스트 비용 관리 (Pro 플랜 필수)
**`/compact` 실행 타이밍:**
- medium/large 태스크 complete 직후 → 항상 실행
- small 작업 5회 연속 완료 → 권장 메시지 출력 후 실행

## 7. 하네스 운영 정책
중단 사유 5종: `[TOKEN_LIMIT]` `[RUNTIME_ERROR]` `[MISSING_DEPENDENCY]` `[USER_INTERRUPTION]` `[VERIFICATION_FAILED]`
- `blocked` 태스크 발견 시 사유를 브리핑하고 "고" 승인 후 재개한다.
- 세션 종료 시 Stop hook이 자동으로 진행 중 태스크를 `blocked` 처리한다.
- 새 세션 시작 시 `node .claude/scripts/task-ctl.js list`로 상태 확인이 첫 번째 액션이다.

## 8. task-ctl.js 명령어 치트시트

| 명령 | 용도 |
|------|------|
| `list` | 전체 태스크 상태 확인 |
| `subtasks task-NNN "단계1" "단계2"` | 세부 단계 등록 |
| `done task-NNN task-NNN-01` | 단계 완료 처리 |
| `complete task-NNN` | 최종 폐쇄 + 리포트 생성 |
| `complete task-NNN --force` | 강제 폐쇄 |
| `resume task-NNN` | 블록 재개 |

### 채팅 입력 명령

| 입력 | 동작 |
|------|------|
| `고 architect --opus` | PATTERN_BREAK 감지 시 opus 1회 추가 호출 |
| `고 large / medium / small` | hook 판별 등급 수동 조정 |
| `고 security` | security-reviewer 강제 추가 |
