import type { PartPose } from "@/components/employee-motion-model";

export interface MachineLayer {
  box: number[];
  motions: { name: string; vector: number[] }[];
}

/** 等距相机朝向的三个分量均为正。分离的轴决定前后，反向分离表示投影不相交。 */
export function machineOrder(layers: MachineLayer[], poses: Record<string, PartPose>) {
  const bounds = layers.map(({ box: [x, y, w, d, z, h], motions }) => {
    const offset = [0, 0, 0];
    let alpha = 1;
    for (const { name, vector } of motions) {
      const pose = poses[name];
      alpha *= pose?.opacity ?? 1;
      for (let k = 0; k < 3; k++) offset[k] += vector[k] * (pose?.shift ?? 0);
    }
    return { min: [x + offset[0], y + offset[1], z + offset[2]], max: [x + w + offset[0], y + d + offset[1], z + h + offset[2]], alpha };
  });
  const edges = layers.map(() => [] as number[]);
  const incoming = new Int32Array(layers.length);
  for (let a = 0; a < bounds.length; a++) {
    if (bounds[a].alpha <= .02) continue;
    for (let b = a + 1; b < bounds.length; b++) {
      if (bounds[b].alpha <= .02) continue;
      let direction = 0, opposed = false;
      for (let axis = 0; axis < 3; axis++) {
        const sign = bounds[a].max[axis] <= bounds[b].min[axis] + .001 ? 1 : bounds[b].max[axis] <= bounds[a].min[axis] + .001 ? -1 : 0;
        if (sign && direction && sign !== direction) opposed = true;
        if (sign) direction = sign;
      }
      if (!direction || opposed) continue;
      const from = direction === 1 ? a : b, to = direction === 1 ? b : a;
      edges[from].push(to);
      incoming[to]++;
    }
  }
  const order: number[] = [];
  const ready = Array.from(incoming.keys()).filter(index => incoming[index] === 0);
  while (ready.length) {
    const index = ready.shift()!;
    order.push(index);
    for (const next of edges[index]) if (--incoming[next] === 0) ready.push(next);
  }
  const cycles = layers.length - order.length;
  if (cycles) for (let i = 0; i < layers.length; i++) if (incoming[i] > 0) order.push(i);
  return { order, cycles };
}
