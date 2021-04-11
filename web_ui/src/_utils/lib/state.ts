export type ProcessStateValue =
  | "CREATED"
  | "READY"
  | "RUNNING"
  | "FINISH"
  | "SUCCESS"
  | "ERROR";

export class ProcessState {
  value: ProcessStateValue;

  constructor() {
    this.value = "CREATED";
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
