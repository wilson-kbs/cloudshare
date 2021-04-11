export function formatFileSize(value: number): string {
  const Size = {
    TB: 2 ** 40,
    GB: 2 ** 30,
    MB: 2 ** 20,
    KB: 2 ** 10,
  };
  let result = "";
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
}
