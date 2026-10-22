export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const progress = (time: number, start: number, end: number) => clamp((time - start) / (end - start));
export const ease = (value: number) => value * value * (3 - 2 * value);
export const introduction = 50;
export const inspection = 21;

export const agents = Object.freeze({
  planner: Object.freeze({ identity: "requirement-agent", model: "Claude", roleRevision: 1 }),
  developer: Object.freeze({ identity: "developer-agent", model: "GPT", harness: "Codex CLI", roleRevision: 1 }),
  verifier: Object.freeze({ identity: "verification-agent", model: "DeepSeek", roleRevision: 1 }),
});
const publishedV1 = Object.freeze({
  requirementID: "REQ-014", requirementVersion: 1, version: 1, roleRevision: 1, methodRevision: 0, status: "released",
});

/** A finite elapsed clock produces a fresh snapshot; inspection only changes attention, never history. */
export function frameAt(elapsed: number) {
  if (typeof elapsed !== "number" || !Number.isFinite(elapsed)) throw new TypeError("elapsed must be a finite number of seconds");
  const time = Math.max(0, elapsed);
  const inspecting = time >= introduction;
  const act = inspecting ? Math.floor((time - introduction) / 7) % 3 : time < 10 ? 0 : time < 28 ? 1 : 2;
  return {
    time, act, inspecting, cycle: inspecting ? Math.floor((time - introduction) / inspection) : 0,
    goal: progress(time, 1, 3), clarify: progress(time, 3, 5), scopeEdit: progress(time, 5.5, 6.8),
    scopeConfirmed: time >= 7.5, planReady: time >= 9,
    developer: progress(time, 10, 12), prototype: progress(time, 12, 14), implementation: progress(time, 14, 17),
    tester: progress(time, 17, 18), defect: time >= 18, fix: progress(time, 18.5, 21), retest: progress(time, 21, 23),
    tested: time >= 23, accepted: time >= 24, releaseApproved: time >= 25.5, released: time >= 26.5,
    archive: progress(time, 26.5, 28), feedback: time >= 29, summary: progress(time, 30, 32), summaryReady: time >= 32,
    humanEdit: progress(time, 33, 34.5), learningConfirmed: time >= 35.5, learningAdopted: time >= 36.5,
    store: progress(time, 36.5, 38), stored: time >= 38, reference: progress(time, 38, 39), referenced: time >= 39,
    acceptanceUpdate: progress(time, 39, 40), v2Build: progress(time, 40, 43), v2Verify: progress(time, 43, 45), v2Review: time >= 46,
    requirementID: "REQ-014", roleRevision: 1, requirementVersion: time >= 39 ? 2 : 1,
    v1MethodRevision: 0, v2MethodRevision: time >= 39 ? 1 : null,
    releasedVersion: time >= 26.5 ? 1 : null, v1PublishedSnapshot: time >= 26.5 ? publishedV1 : null,
    learnedMethodRevision: time >= 38 ? 1 : null, methodCount: time >= 38 ? 1 : 0, referencedMethodRevision: time >= 39 ? 1 : null,
    v2Status: time >= 46 ? "pending-human-review" : time >= 45 ? "verified" : time >= 43 ? "verifying" : time >= 40 ? "building" : "not-started",
    v2Accepted: false, v2Released: false,
  };
}

export type LifecycleFrame = ReturnType<typeof frameAt>;
