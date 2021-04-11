export function requestTimeout(cb: Function, ms = 0) {
  return setTimeout(cb, ms);
}

export function removeRequestTimeout(timer: number) {
  clearTimeout(timer);
}

export type GetTiggerElement = () => HTMLElement;
