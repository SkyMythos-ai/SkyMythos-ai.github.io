import { boxCorners, fitProjection, iso, onTop, planOutline, slabOf, topMatrix, sideMatrix, axisVector, type Plan, type Point3 } from "@/components/employee-iso-kit";

/** 三个物件共用相机和尺度；预留顶部角色名与底部实时状态的位置。 */
export const machineProjection = fitProjection(boxCorners({ x: -174, y: -142, w: 348, d: 284, r: 0 }, -5, 92), 640, 494, { pad: 37, azimuth: 45, elevation: 35 });

export const machinePoint = (p: Point3) => iso(p, machineProjection);
export const machineVector = (v: Point3) => axisVector(machineProjection, v);
export const machineTop = (x: number, y: number, z: number) => topMatrix([x, y], z, machineProjection);
export const machineSide = (x: number, y: number, z: number, face: "left" | "right") => sideMatrix([x, y], z, machineProjection, face);
export const machineLine = (points: [number, number][], z: number, closed = false) => onTop(points, z, machineProjection, closed);
export const machineOutline = (plan: Plan, z: number) => planOutline(plan, z, machineProjection, 4);
export const machineBlock = (x: number, y: number, w: number, d: number, z: number, h: number, r = 1.2) => slabOf({ x, y, w, d, r }, z, h, machineProjection, 4, Math.min(.7, h * .3));
