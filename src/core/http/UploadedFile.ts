import fs from "@mongez/fs";
import { Random } from "@mongez/reinforcements";
import path from "path";
import { storage } from "utils/path";

const RandomName = Symbol("random");

export default class UploadedFile {
  /**
   * Save file as
   *
   * @default original file name
   */
  protected saveFileAs!: string | Symbol;

  /**
   * Constructor
   */
  public constructor(protected file: any) {}

  /**
   * Save file as the given new name
   */
  public saveAs(newFileName: string): UploadedFile {
    this.saveFileAs = newFileName;
    return this;
  }

  /**
   * Get file extension
   */
  public get extension(): string {
    const [type, extension] = this.mimeType.split("/");

    return extension.toLocaleLowerCase();
  }

  /**
   * Get file size
   */
  public size(sizeType: "kb" | "mb" | "b" = "b"): number {
    switch (sizeType) {
      case "kb":
        return this.file.size / 1024;
      case "mb":
        return this.file.size / (1024 * 1024);
      default:
        return this.file.size;
    }
  }

  /**
   * Get mime type
   */
  public get mimeType(): string {
    return this.file.mimetype;
  }

  /**
   * Get file original name
   */
  public get originalName(): string {
    return this.file.name;
  }

  /**
   * If called, then it will save the file with random string
   */
  public get random(): UploadedFile {
    this.saveFileAs = RandomName;
    return this;
  }

  /**
   * Save file to the given destination and return its path
   */
  public async saveTo(destination: string): Promise<string> {
    let fileName: string;
    if (!this.saveFileAs) {
      fileName = this.originalName;
    } else if (this.saveFileAs === RandomName) {
      fileName = Random.string(128) + "." + this.extension;
    } else {
      fileName = this.saveFileAs as string;
    }

    const filePath: string = destination + "/" + fileName;

    const fullStoragePath: string = storage("uploads", filePath);

    fs.makeDirectory(path.dirname(fullStoragePath), 0x777);

    await this.file.mv(fullStoragePath);

    return filePath;
  }

  /**
   * {@inheritDoc}
   */
  public toJSON(): any {
    return this.file;
  }
}

export class UploadedFileList {
  /**
   * Files list
   */
  public filesList: UploadedFile[] = [];

  /**
   * Constructor
   */
  public constructor(files: any) {
    for (let file of files) {
      this.filesList.push(new UploadedFile(file));
    }
  }

  /**
   * Map over files
   */
  public map(callback: (file: UploadedFile) => any): any[] {
    return this.filesList.map(callback);
  }

  /**
   * Perform some action on all files
   */
  public each(
    callback: (file: UploadedFile, index: number) => any
  ): UploadedFileList {
    this.filesList.forEach(callback);

    return this;
  }

  /**
   * Get files length
   */
  public get length(): number {
    return this.filesList.length;
  }

  /**
   * Make the class iterable
   */
  [Symbol.iterator](): Iterator<UploadedFile> {
    let index: number = -1;

    return {
      next: () => {
        index++;
        return {
          done: index === this.filesList.length,
          value: this.filesList[index],
        };
      },
    };
  }

  /**
   * {@inheritdoc}
   */
  public toJSON(): any {
    return this.filesList;
  }

  /**
   * Get all file sizes
   */
  /**
   * Save file as the given new name
   */
  public saveAs(
    newFileName: string | ((file: UploadedFile, index: number) => string)
  ): UploadedFileList {
    this.each((file, index) => {
      if (typeof newFileName === "string") {
        newFileName = (file: UploadedFile, index: number): string => {
          return index + "_" + newFileName;
        };
      }

      file.saveAs(newFileName(file, index));
    });

    return this;
  }

  /**
   * Get file extension
   */
  public get extension(): string[] {
    return this.map((file) => file.extension);
  }

  /**
   * Get file size
   */
  public size(sizeType: "kb" | "mb" | "b" = "b"): number[] {
    return this.map((file) => file.size(sizeType));
  }

  /**
   * Get mime type
   */
  public get mimeType(): string[] {
    return this.map((file) => file.mimeType);
  }

  /**
   * Get file original name
   */
  public get originalName(): string[] {
    return this.map((file) => file.originalName);
  }

  /**
   * If called, then it will save the file with random string
   */
  public get random(): UploadedFileList {
    this.each((file) => file.random);
    return this;
  }

  /**
   * Save file to the given destination and return its path
   */
  public async saveTo(destination: string): Promise<string[]> {
    let paths: string[] = [];

    for (let file of this.filesList) {
      paths.push(await file.saveTo(destination));
    }

    return paths;
  }
}
