import { MetaFile } from "@/@types";
export {};

declare global {
  interface Array<T> {
    sortMetaFiles(by: "name" | "size", sort: "up" | "down"): Array<MetaFile>;
    sortBySizeMetaFiles(sort: "up" | "down"): void;
  }
}
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
