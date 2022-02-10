import router from "core/router";
import { uploads } from "utils/path";
import { Request } from "core/http/request";
import { Response } from "core/http/response";

router.file("/uploads/*", (request: Request, response: Response) => {
  const [, filePath] = request.route.split("/uploads/");

  let fileLocation: string = uploads(filePath);

  return response.sendFile(fileLocation);
});
