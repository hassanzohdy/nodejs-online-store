import Model from "core/db/model";

export default class User extends Model {
  /**
   * {@inheritDoc}
   */
  protected collection: string = "users";
}
