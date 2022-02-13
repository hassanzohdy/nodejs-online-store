import router from "core/router";
import { uploads } from "utils/path";
import { Request } from "core/http/request";
import { Response } from "core/http/response";
import { storageConfigurations } from "config";

router.file(
  `${storageConfigurations.uploadsRoute}/*`,
  (request: Request, response: Response) => {
    const [, filePath] = request.route.split(
      `${storageConfigurations.uploadsRoute}/`
    );

    let fileLocation: string = uploads(filePath);

    return response.sendFile(fileLocation);
  }
);
