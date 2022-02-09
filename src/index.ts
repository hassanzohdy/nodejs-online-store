import "core/dot-env/load";
import "app";
import startApplication from "core/application";
Error.stackTraceLimit = Infinity;

startApplication();
