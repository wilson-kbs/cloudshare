import { ErrorCodes } from "@vue/runtime-core";

export type ErrorCode = 400 | 401 | 403 | 404 | 500 | 503;

export type StatueCode = 200 | 201 | ErrorCode;

// export type ProcessState = "PENDING" | "SUCCESS" | "ERROR";
export type ProcessState = "CREATED" | "READY" | "RUNNING" | "FINISH" | "ERROR";
