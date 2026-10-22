import { agents, ease, frameAt, introduction, progress } from "./model";
import type { LifecycleCopy } from "./copy";

type Point = readonly [number, number];
const mix = (start: number, end: number, amount: number) => start + (end - start) * amount;
const arc = (start: Point, end: Point, amount: number, lift = 22): Point => [mix(start[0], end[0], amount), mix(start[1], end[1], amount) - Math.sin(Math.PI * amount) * lift];
const pulse = (time: number, start: number, end: number) => Math.sin(Math.PI * progress(time, start, end));

/** Cache the owned scene once; animation never measures layout or asks React to render. */
export function createLifecyclePainter(root: HTMLElement, copy: LifecycleCopy) {
  const parts = Object.fromEntries([...root.querySelectorAll<SVGGElement>("[data-part]")].map(node => [node.dataset.part!, node]));
  const text = Object.fromEntries(Object.entries(parts).map(([key, node]) => [key, node.querySelector("text")]));
  const paths = Object.fromEntries(Object.entries(parts).map(([key, node]) => [key, node.querySelector("path")]));
  const headings = [...root.querySelectorAll<HTMLElement>("[data-act-heading]")];
  const tracks = [...root.querySelectorAll<HTMLElement>("[data-act-track]")];
  const status = root.querySelector<HTMLElement>("[data-lifecycle-status]")!;
  const points = new Map<string, Point>();
  const point = (key: string, field = "home"): Point => {
    const id = key + field;
    if (!points.has(id)) {
      const [x, y] = parts[key].dataset[field]!.split(",").map(Number);
      points.set(id, [x, y]);
    }
    return points.get(id)!;
  };
  const set = (key: string, attribute: string, value: string | number) => parts[key].setAttribute(attribute, String(value));
  const show = (key: string, visible: boolean) => {
    set(key, "visibility", visible ? "visible" : "hidden");
    parts[key].style.display = visible ? "inline" : "none";
  };
  const move = (key: string, position: Point, scale = 1, extra = "") => set(key, "transform", `translate(${position[0]} ${position[1]}) scale(${scale}) ${extra}`);
  const say = (key: string, value: string) => { if (text[key]!.textContent !== value) text[key]!.textContent = value; };
  const stroke = (key: string, amount: number) => {
    paths[key]!.setAttribute("stroke-dasharray", "1");
    paths[key]!.setAttribute("stroke-dashoffset", String(1 - amount));
  };
  const write = (key: string, amount: number) => { parts[key].style.clipPath = `inset(0 ${100 * (1 - amount)}% 0 0)`; };
  let lastAct = -1;
  return (elapsed: number, still: boolean, compact = false) => {
    // Match the mobile CSS layout so every moving sheet still meets its physical source and shelf.
    const folioPoint = ([x, y]: Point): Point => compact ? [x * 1.4 - 160, y * 1.4 - 70] : [x, y];
    const archiveStart = (position: Point): Point => {
      const [x, y] = folioPoint(position);
      return compact ? [x - 20, y - 15] : [x, y];
    };
    const frame = frameAt(still ? introduction : elapsed), time = frame.time, act = still ? 2 : frame.act;
    const attention = frame.inspecting && !still ? Math.sin(Math.PI * ((time - introduction) % 7) / 7) ** 2 : 0;
    if (act !== lastAct) {
      headings.forEach(node => { node.hidden = Number(node.dataset.actHeading) !== act; });
      tracks.forEach(node => { node.dataset.active = String(Number(node.dataset.actTrack) === act); });
      lastAct = act;
    }
    const statusKey = time < 3 ? "goal" : time < 10 ? "scope" : time < 23 ? "build" : time < 29 ? "release" : time < 35.5 ? "feedback" : time < 39 ? "adopt" : time < 46 ? "reuse" : "pending";
    if (status.textContent !== copy.status[statusKey]) status.textContent = copy.status[statusKey];
    const page = time < 12 ? "scope" : time < 14 ? "prototype" : time < 17 ? "code" : time < 23 ? "test" : time < 29 ? "release" : time < 30 ? "feedback" : time < 38 ? "learning" : "v2";
    for (const key of ["scope", "prototype", "code", "test", "release", "feedback", "learning", "v2"]) show(`${key}-page`, key === page);
    say("document-version", frame.requirementVersion === 2 ? "v2" : "v1");
    parts.folio.dataset.version = String(frame.requirementVersion);
    const lift = pulse(time, 5.2, 8.5) + pulse(time, 23.5, 26.5) + pulse(time, 32.5, 36.5);
    set("folio", "transform", `matrix(1 .05 ${-.1 + .03 * lift} ${.85 + .045 * lift} ${350 - 4.65 * lift} ${280 - 6.975 * lift})`);
    show("scope-page", page === "scope" && time >= 3);
    stroke("scope-lines", ease(frame.clarify)); stroke("scope-strike", ease(frame.scopeEdit));
    show("scope-edit", frame.scopeEdit > 0); write("scope-edit", ease(frame.scopeEdit));
    stroke("prototype-lines", ease(frame.prototype));
    for (let index = 0; index < 4; index++) stroke(`code-line-${index}`, ease(progress(time, 14 + index * .35, 15.5 + index * .4)));
    show("test-pass", time >= 17.7); show("defect-cross", frame.defect && frame.retest === 0);
    show("fix-note", frame.fix > 0); write("fix-note", ease(frame.fix));
    say("defect-label", frame.fix === 1 ? copy.scene.prevented : copy.scene.duplicate);
    stroke("retest-pass", ease(frame.retest));
    say("release-verdict", frame.accepted ? copy.scene.accepted : copy.scene.pending);
    show("release-approved", frame.releaseApproved); show("release-seal", frame.released);
    show("v1-history", frame.released);
    move("v1-history", arc(archiveStart([350, 294]), point("v1-history"), ease(frame.archive), 24), mix(compact ? 1.4 : 1, .8, ease(frame.archive)));
    show("learning-page", page === "learning" && frame.summary > 0); write("learning-page", ease(frame.summary));
    show("learning-edit", frame.humanEdit > 0); write("learning-edit", ease(frame.humanEdit));
    const scopeEditing = time >= 5.5 && time < 6.8, learningEditing = time >= 33 && time < 34.5;
    show("pencil", scopeEditing || learningEditing);
    const edit = ease(scopeEditing ? frame.scopeEdit : frame.humanEdit);
    move("pencil", [17 + 145 * edit - 77, scopeEditing ? 92 : 114], 1, "rotate(-25 77 3.5)");
    const scopeStamp = frame.scopeConfirmed && time < 10, releaseStamp = frame.accepted && time < 26.5, learnStamp = frame.learningConfirmed && time < 38;
    show("approval", scopeStamp || releaseStamp || learnStamp);
    say("approval", learnStamp ? (frame.learningAdopted ? copy.scene.adopted : copy.scene.confirmed) : releaseStamp && frame.releaseApproved ? copy.scene.approved : copy.scene.confirmed);
    move("approval", [215, 129], 1, `translate(0 ${-7 * pulse(time, learnStamp ? 35.5 : releaseStamp ? 24 : 7.5, learnStamp ? 36 : releaseStamp ? 24.5 : 8)})`);
    show("goal", time >= 1 && time < 3); move("goal", arc([280, 290], folioPoint(point("goal")), ease(frame.goal), 27), mix(1, compact ? 1.4 : 1, ease(frame.goal)));
    const park = ease(progress(time, 10, 10.9));
    move("planner", [mix(626, 748, park), mix(265, 239, park)]); set("planner-support", "transform", `scale(1 ${park})`);
    show("developer", frame.developer > 0);
    move("developer", [626 + 90 * (1 - ease(progress(time, 10, 11))), 265 + 150 * (1 - ease(progress(time, 11, 12)))]);
    show("tester", frame.tester > 0); move("tester", [740 + 70 * (1 - ease(frame.tester)), 414]);
    set("planner-active", "opacity", (time >= 3 && time < 5) || (time >= 30 && time < 32) ? 1 : 0);
    set("developer-active", "opacity", (time >= 14 && time < 17) || (time >= 18.5 && time < 21) || (time >= 40 && time < 43) ? 1 : 0);
    set("tester-active", "opacity", (time >= 18 && time < 23) || (time >= 43 && time < 45) ? 1 : 0);
    const [humanX, humanY] = point("human", "pivot");
    set("human", "transform", `rotate(${-3 * (pulse(time, 5.5, 6.8) + pulse(time, 7.5, 8.3) + pulse(time, 24, 25.5) + pulse(time, 33, 34.5) + pulse(time, 35.5, 36.5))} ${humanX} ${humanY})`);
    show("method", frame.learningAdopted); show("experience", frame.learningAdopted);
    const store = ease(frame.store);
    move("method", arc(archiveStart([440, 360]), point("method"), store, 35), mix(compact ? 1.26 : .9, 1, store));
    move("experience", arc(archiveStart([350, 330]), point("experience"), store, 18), mix(compact ? .84 : .6, .42, store));
    const reading = time >= 38 && time < 39 ? pulse(time, 38, 39) : frame.learningAdopted && time < 38 ? .75 * (1 - ease(progress(time, 36.5, 37.3))) : act === 2 ? .25 * attention : 0;
    set("method-cover", "transform", `translate(${-6 * reading} 0) skewY(${-13 * reading}) scale(${1 - .32 * reading} 1)`);
    const [methodX, methodY] = point("method");
    const referenceStart: Point = compact ? [methodX + 20, methodY + 15] : [methodX, methodY];
    show("reference", frame.stored); move("reference", arc(referenceStart, point("reference"), ease(frame.reference), 46), mix(1, .8, ease(frame.reference)));
    show("v2-criteria", frame.acceptanceUpdate > 0); write("v2-criteria", ease(frame.acceptanceUpdate));
    show("mobile-entry", frame.v2Build > 0); write("mobile-entry", ease(frame.v2Build));
    stroke("v2-check-0", ease(progress(time, 43, 44))); stroke("v2-check-1", ease(progress(time, 44, 45)));
    show("review-label", frame.v2Review);
    const curl = [12, 14, 17, 23, 29, 30, 38].reduce((value, start) => Math.max(value, pulse(time, start, start + .6)), 0);
    set("page-curl", "opacity", curl * .85);
    const [focusX, focusY] = [[455, 355], [600, 310], [220, 550]][act], zoom = 1 + .014 * attention;
    set("world", "transform", `translate(${(1 - zoom) * focusX} ${(1 - zoom) * focusY}) scale(${zoom})`);
    set("shelf-edge", "opacity", act === 2 ? attention * .65 : 0);
    Object.assign(root.dataset, {
      act: String(act), elapsed: elapsed.toFixed(3), static: String(still), cycle: String(frame.cycle),
      requirement: frame.requirementID, version: String(frame.requirementVersion), scopeConfirmed: String(frame.scopeConfirmed), tested: String(frame.tested),
      accepted: String(frame.accepted), releaseApproved: String(frame.releaseApproved), released: String(frame.released), releasedVersion: String(frame.releasedVersion),
      summaryReady: String(frame.summaryReady), learningConfirmed: String(frame.learningConfirmed), learningAdopted: String(frame.learningAdopted), stored: String(frame.stored),
      referenced: String(frame.referenced), v2Review: String(frame.v2Review), v2Accepted: String(frame.v2Accepted), v2Released: String(frame.v2Released),
      v1Method: String(frame.v1MethodRevision), v2Method: String(frame.v2MethodRevision), roleRevision: String(frame.roleRevision),
      plannerModel: agents.planner.model, developerModel: agents.developer.model, verifierModel: agents.verifier.model,
    });
  };
}
