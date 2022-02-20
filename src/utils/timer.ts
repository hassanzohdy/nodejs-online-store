export default function timer(lap: string = "") {
  if (lap)
    console.log(`${lap} in: ${(performance.now() - timer.prev).toFixed(3)}ms`);
  timer.prev = performance.now();
}

timer.prev = null as any;
