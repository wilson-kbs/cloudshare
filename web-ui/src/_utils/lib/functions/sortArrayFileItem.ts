import { FileItem } from "@/models";

type SortIndex = "name" | "size";
type SortDirection = "up" | "down";

interface SortFileItemOptions {
  index?: SortIndex;
  direction?: SortDirection;
}

export function sortFileItem(
  files: Array<FileItem>,
  options?: SortFileItemOptions
): Array<FileItem> {
  const sortIndex = options?.index ?? "name";
  const sortDirection = options?.direction ?? "up";

  const newArrayFileItem: Array<FileItem> = [];

  let count = 0;

  for (const nextFileItem of files) {
    console.log(newArrayFileItem.slice());
    count++;
    if (newArrayFileItem.length == 0) {
      newArrayFileItem.push(nextFileItem);

      continue;
    }

    let char = 0;

    for (let i = 0; i < newArrayFileItem.length; i++) {
      const prevFileItem = newArrayFileItem[i];

      const prevValue = prevFileItem[sortIndex];
      const nextValue = nextFileItem[sortIndex];

      let a: string | number = "";
      let b: string | number = "";

      if (typeof prevValue == "string" && typeof nextValue == "string") {
        a = prevValue[char].toLowerCase();
        b = nextValue[char].toLowerCase();
      } else if (typeof prevValue == "number" && typeof nextValue == "number") {
        a = prevValue;
        b = nextValue;
      }
      console.log(a, "=", b, a == b);

      if (
        a == b &&
        typeof prevValue == "string" &&
        typeof nextValue == "string"
      ) {
        ++char;
        --i;
        continue;
      }

      if (sortDirection == "up") {
        if (b === " ") {
          char = 0;
        } else if (a == " " || a > b) {
          char = 0;
          newArrayFileItem.splice(i, 0, nextFileItem);
          break;
        }
      } else if (sortDirection == "down") {
        if (a === " ") {
          char = 0;
        } else if (b === " " || a < b) {
          char = 0;
          newArrayFileItem.splice(i, 0, nextFileItem);
          break;
        }
      }

      if (i == newArrayFileItem.length - 1) {
        char = 0;
        newArrayFileItem.push(nextFileItem);
        break;
      }
    }
  }
  console.log(newArrayFileItem.slice());
  return newArrayFileItem;
}
