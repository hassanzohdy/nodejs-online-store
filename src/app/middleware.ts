import cors from "cors";
import auth from "core/auth/middleware/auth";
import middlewareList from "core/router/middleware";
import trimStrings from "core/router/middleware/trimStrings";
import logRequest from "core/router/middleware/log-reqeusts";
import staticPath from "core/router/middleware/static-path";

// static files requests middleware
middlewareList.file([logRequest, staticPath]);

// all requests except file requests
middlewareList.add([cors(), trimStrings, logRequest, auth]);
