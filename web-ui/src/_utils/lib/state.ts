export type ProcessStateValue =
  | "CREATED"
  | "READY"
  | "RUNNING"
  | "FINISH"
  | "SUCCESS"
  | "ERROR";

export class ProcessState {
  private _v: ProcessStateValue;

  constructor() {
    this._v = "CREATED";
  }

  get value() {
    return this._v;
  }

  set value(v: ProcessStateValue) {
    this._v = v;
  }

  get isCreated(): boolean {
    return this.value == "CREATED";
  }

  get isReady(): boolean {
    return this.value == "READY";
  }

  get isRunning(): boolean {
    return this.value == "RUNNING";
  }

  get isFinish(): boolean {
    return this.value == "FINISH";
  }

  get isSuccess(): boolean {
    return this.value == "SUCCESS";
  }

  get isError(): boolean {
    return this.value == "ERROR";
  }
}
