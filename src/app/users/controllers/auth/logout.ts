import { Request } from "core/http/request";
import { Response } from "core/http/response";
import { authLogout, user } from "core/auth/guard";

export default async function logout(request: Request, response: Response) {
  const currentUser: any = user();

  if (!currentUser) return;

  await (
    await currentUser.logout(request.authorization("Bearer") as string)
  ).save();

  authLogout();

  return response.success({
    success: true,
  });
}
