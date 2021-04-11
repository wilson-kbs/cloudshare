export type ProcessStateValue =
  | "CREATED"
  | "READY"
  | "RUNNING"
  | "FINISH"
  | "SUCCESS"
  | "ERROR";

export class ProcessState {
  private _value: ProcessStateValue;

  constructor() {
    this._value = "CREATED";
  }

  get value(): ProcessStateValue {
    return this._value;
  }
  set value(value: ProcessStateValue) {
    this._value = value;
  }

  get isCreated(): boolean {
    return this._value == "CREATED";
  }

  get isReady(): boolean {
    return this._value == "READY";
  }

  get isRunning(): boolean {
    return this._value == "RUNNING";
  }

  get isFinish(): boolean {
    return this._value == "FINISH";
  }

  get isSuccess(): boolean {
    return this._value == "SUCCESS";
  }

  get isError(): boolean {
    return this._value == "ERROR";
  }
}
