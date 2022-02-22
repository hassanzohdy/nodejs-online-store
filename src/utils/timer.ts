import chalk from "chalk";

export default function timer(lap: string = "") {
  if (lap)
    console.log(
      `${chalk.blue(lap)} in: ${chalk.green(
        (performance.now() - timer.prev).toFixed(3) + "ms"
      )}`
    );
  timer.prev = performance.now();
}

timer.prev = null as any;
