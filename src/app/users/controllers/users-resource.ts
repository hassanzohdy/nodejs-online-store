import { ModelInterface } from "core/db/model";
import { Request } from "core/http/request";
import { Response } from "core/http/response";

export function list(model: ModelInterface<any>, options: any = {}) {
  return async function (request: Request, response: Response) {
    const query = model._;
    if (typeof options === "function") {
      options(query, request, response);
    } else {
      const select = options.select || request.input("select") || [];

      query.select(select);
    }

    const size = options.limit || request.input("limit") || 25;

    const page = options.page || request.input("page") || 1;

    const records = await query.paginate({ page, size });

    return response.success({
      records: records.records,
      paginationInfo: records.info,
    });
  };
}
