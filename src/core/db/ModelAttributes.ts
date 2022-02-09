import { DateTime } from "luxon";
import { Obj } from "@mongez/reinforcements";
import Is from "@mongez/supportive-is";
import { AttributesCasts, CastType } from "./types";
import { applicationConfigurations } from "config";
import date from "utils/date";
import { DynamicObject } from "utils/types";

export default class ModelAttributes<Schema> {
  /**
   * Model attributes
   */
  public attributes: any = {};

  /**
   * Default casts list
   */
  protected defaultCasts: AttributesCasts = {};

  /**
   * Casts Types
   */
  protected casts: AttributesCasts = {};

  /**
   * Prepare and mutate attributes
   */
  protected prepareAttributes(attributes: DynamicObject): DynamicObject {
    return { ...attributes };
  }

  /**
   * Cast the given attribute key based on the value in the attributes list
   */
  public castAttribute(attribute: string): any {
    const castsList = { ...this.defaultCasts, ...this.casts };

    const castMode: CastType = castsList[attribute];

    let value = this.attributes[attribute];

    if (!castMode) return value;

    switch (castMode) {
      case "bool":
      case "boolean":
        value = Boolean(value);
        break;
      case "int":
      case "integer":
        value = Number(value);
        break;
      case "string":
        value = String(value);
        break;
      case "float":
      case "double":
        value = parseFloat(value);
        break;
      case "date":
        value = date(value);

        break;
    }

    return value;
  }

  /**
   * Cast the given attribute key based on the value in the attributes list to be stored in database
   */
  public castAttributesIn(attributes: any): any {
    const castsList = { ...this.defaultCasts, ...this.casts };
    const newAttributes: DynamicObject = {};

    for (let attribute in attributes) {
      let value = attributes[attribute];

      if (Is.plainObject(value)) {
        value = this.castAttributesIn(value);
      }

      const castMode: CastType = castsList[attribute];

      if (!castMode) {
        newAttributes[attribute] = value;
        continue;
      }

      switch (castMode) {
        case "bool":
        case "boolean":
          value = Boolean(value);
          break;
        case "int":
        case "integer":
          value = Number(value);
          break;
        case "string":
          value = String(value);
          break;
        case "float":
        case "double":
          value = parseFloat(value);
          break;
        case "date":
          value = date(value).toJSDate();
          break;
      }

      newAttributes[attribute] = value;
    }

    return newAttributes;
  }

  /**
   * An alias to set an attribute
   */
  public setAttribute(column: string, value: any): ModelAttributes<Schema> {
    Obj.set(this.attributes, column, value);
    return this;
  }

  /**
   * Merge the given attributes to current attributes
   */
  public setAttributes<T>(attributes: T): ModelAttributes<Schema> {
    this.attributes = { ...this.attributes, ...attributes };
    return this;
  }

  /**
   * Get attribute value
   */
  public getAttribute(attribute: string, defaultValue: any = null): any {
    return Obj.get(this.attributes, attribute, defaultValue);
  }

  /**
   * Get attributes data
   */
  public get data(): Schema {
    return this.castAttributes(this.attributes) as Schema;
  }

  /**
   * Cast the given attributes based on the model castings
   */
  public castAttributes(attributes: DynamicObject): any {
    const newAttributes: DynamicObject = {};

    for (let attribute in attributes) {
      newAttributes[attribute] = this.castAttribute(attribute);
    }

    return newAttributes;
  }

  /**
   * Get only the values of the given attributes
   */
  public only<T>(...attributes: (keyof T)[]): T {
    const alteredAttributes = Obj.only(this.attributes, attributes as any);
    return this.castAttributes(alteredAttributes) as T;
  }

  /**
   * Associate the given data to the given column as embedded document of array of inner documents
   */
  public associate(
    column: string,
    document: any,
    sharedDataMethod: string = "sharedData"
  ): ModelAttributes<Schema> {
    let documents: any = this.getAttribute(column);

    if (!Is.empty(documents) && !Is.array(documents)) return this;

    if (!documents) {
      documents = [];
    }

    let documentData = null;

    if (document[sharedDataMethod]) {
      documentData = document[sharedDataMethod];
    } else {
      documentData = document;
    }

    documents.push(documentData);

    this.setAttribute(column, documents);

    return this;
  }

  /**
   * Reassociate the given data as inner document in the given column
   */
  public reassociate(
    column: string,
    updatingDocument: any,
    sharedDataMethod: string = "sharedData",
    innerDocumentColumn: string = "id"
  ): ModelAttributes<Schema> {
    let documents: any = this.getAttribute(column);

    if (!Is.empty(documents) && !Is.array(documents)) return this;

    let updatedDocumentIndex: number = -1;

    const storedDocumentData =
      updatingDocument[sharedDataMethod] || updatingDocument;

    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      if (
        Obj.get(document, innerDocumentColumn) ===
        Obj.get(updatingDocument, innerDocumentColumn)
      ) {
        documents[i] = storedDocumentData;
        updatedDocumentIndex = i;
      }
    }

    if (updatedDocumentIndex === -1) {
      documents.push(storedDocumentData);
    }

    this.setAttribute(column, documents);

    return this;
  }

  /**
   * Pull from the given column the given value
   */
  public pullFrom(
    column: string,
    value: any,
    subDocumentColumn: string = "id"
  ): ModelAttributes<Schema> {
    const documents = this.getAttribute(column);

    if (!documents || Is.empty(documents) || !Is.array(documents)) return this;

    const newDocuments = [];

    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      if (document === value) continue;

      const subDocumentColumnValue = Obj.get(document, subDocumentColumn);
      if (subDocumentColumnValue === value) continue;

      newDocuments.push(document);
    }

    return this;
  }

  /**
   * @alias pullFrom
   */
  public disassociate(
    column: string,
    value: any,
    subDocumentColumn: string = "id"
  ): ModelAttributes<Schema> {
    return this.pullFrom(column, value, subDocumentColumn);
  }

  /**
   * Get the data for th given columns and unset the columns from the model
   */
  public pull(...attributes: string[]): any {
    const values = this.only(...attributes);
    this.unset(...attributes);

    return this;
  }

  /**
   * Unset the given columns from data
   */
  public removeAttributes(...attributes: string[]): void {
    let finalAttributes: DynamicObject = {};
    for (let attribute in this.attributes) {
      if (attributes.includes(attribute)) continue;

      finalAttributes[attribute] = this.attributes[attribute];
    }

    this.attributes = finalAttributes;
  }

  /**
   * @alias removeAttributes
   */
  public unset(...attributes: string[]): void {
    this.removeAttributes(...attributes);
  }
}
