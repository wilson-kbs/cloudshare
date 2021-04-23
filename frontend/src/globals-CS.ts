import { FileItem } from "./models";
import { sortFileItem } from "./_utils";
export {};

declare global {
  interface Array<T> {
    sortFileItemByName(direction?: "up" | "down"): Array<FileItem>;
    sortFileItemBySize(direction?: "up" | "down"): Array<FileItem>;
  }
  interface Number {
    formatToStringFileSize(to?: string): string;
  }
}

export const Size = {
  TB: 2 ** 40,
  GB: 2 ** 30,
  MB: 2 ** 20,
  KB: 2 ** 10,
};

if (!Array.prototype.sortFileItemByName) {
  Array.prototype.sortFileItemByName = function (
    direction = "up"
  ): Array<FileItem> {
    for (const item of this) {
      if (!(item instanceof FileItem)) {
        return this;
      }
    }
    return sortFileItem(this, { index: "name", direction });
  };
}

if (!Array.prototype.sortFileItemBySize) {
  Array.prototype.sortFileItemBySize = function (
    direction = "up"
  ): Array<FileItem> {
    for (const item of this) {
      if (!(item instanceof FileItem)) {
        return this;
      }
    }
    return sortFileItem(this, { index: "size", direction });
  };
}

if (!Number.prototype.formatToStringFileSize) {
  Number.prototype.formatToStringFileSize = function (to) {
    let result = "";
    const value = this.valueOf();
    switch (true) {
      case value > Size.TB:
        result = (value / Size.TB).toFixed(1) + " To";
        break;
      case value > Size.GB:
        result = (value / Size.GB).toFixed(1) + " Go";
        break;
      case value > Size.MB:
        result = (value / Size.MB).toFixed(1) + " Mo";
        break;
      case value > Size.KB:
        result = (value / Size.KB).toFixed(1) + " Ko";
        break;
      default:
        result = value + " Octet";
    }
    return result;
  };
}
