import { MetaFile } from "@/@types";
export {};

declare global {
  interface Array<T> {
    sortMetaFiles(by: "name" | "size", sort: "up" | "down"): Array<MetaFile>;
    sortBySizeMetaFiles(sort: "up" | "down"): void;
  }
  interface Number {
    formatToStringFileSize(to?: string): string;
  }
}

const Size = {
  TB: 2 ** 40,
  GB: 2 ** 30,
  MB: 2 ** 20,
  KB: 2 ** 10,
};

if (!Array.prototype.sortMetaFiles) {
  Array.prototype.sortMetaFiles = function (by, sort): Array<MetaFile> {
    const files: Array<MetaFile> = [];

    let count = 0;
    for (const nextFile of this as Array<MetaFile>) {
      count++;
      if (files.length == 0) {
        files.push(nextFile);

        continue;
      }
      let char = 0;

      for (let i = 0; i < files.length; i++) {
        const prevFile = files[i];

        let a: string | number = "";
        let b: string | number = "";

        if (by == "name") {
          a = prevFile.name[char].toLowerCase();
          b = nextFile.name[char].toLowerCase();
        } else if (by == "size") {
          a = prevFile.size;
          b = nextFile.size;
        }

        if (sort == "up") {
          if (a > b) {
            files.splice(i, 0, nextFile);
            break;
          }
        } else if (sort == "down") {
          if (a < b) {
            console.log(files.slice());
            files.splice(i, 0, nextFile);
            break;
          }
        }

        if (i == files.length - 1) {
          files.push(nextFile);
          break;
        }

        if (a == b) {
          char++;
          --i;
        }
      }
    }
    return files;
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
