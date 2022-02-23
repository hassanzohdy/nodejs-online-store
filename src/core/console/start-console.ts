import "core/dot-env/load";
import startApplication from "core/application";
import listenToCommands from "./run-commands";

function startConsoleApplication() {
  startApplication({
    database: true,
    router: false,
  });

  listenToCommands();
}

export default startConsoleApplication;
