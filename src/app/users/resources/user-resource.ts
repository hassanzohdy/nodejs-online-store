import {
  JsonResource,
  ResourceResourceType,
  ResourceType,
} from "core/http/resources";

export default class UserResource extends JsonResource {
  /**
   * {@inheritdoc}
   */
  public int: Array<ResourceType | string> = ["id"];

  /**
   * {@inheritdoc}
   */
  public boolean: Array<ResourceType | string> = ["isActive"];

  /**
   * {@inheritdoc}
   */
  public string: Array<ResourceType | string> = ["name", "email", "hola"];

  /**
   * {@inheritdoc}
   */
  public assets: Array<ResourceType | string> = ["image"];

  /**
   * {@inheritdoc}
   */
  public dates: Array<ResourceType | string> = ["createdAt"];

  /**
   * {@inheritdoc}
   */
  public presented: boolean = false;

  /**
   * {@inheritdoc}
   */
  public resources: Array<ResourceResourceType> = [
    {
      column: "createdBy",
      resource: UserResource,
    },
  ];
}
