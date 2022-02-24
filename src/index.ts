// should be loaded at the very beginning
import "core/dot-env/load";
import "app";
import { startHttpApplication } from "core/application";

startHttpApplication();
