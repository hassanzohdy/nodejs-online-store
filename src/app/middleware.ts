import auth from "core/auth/middleware/auth";
import guarded from "core/auth/middleware/guarded";
import middlewareList from "core/router/middleware";

middlewareList.add([auth]);
