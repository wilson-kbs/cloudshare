import { ProcessState } from "@/_utils";
import { Config } from "@/config";
import { useStore } from "@/store";
import { UploadActionTypes } from "@/store/modules/upload/action-types";
import { Upload } from "tus-js-client";

type FilesItemMode = "UPLOAD" | "DOWNLOAD";

export interface FileItemProps {
  id: string;
  mode: FilesItemMode;
}

export class FileItem {
  id: string;
  mode: FilesItemMode;

  name!: string;
  size!: number;

  serverID?: string;

  upload?: () => void;
  progress = 0;
  processState: ProcessState;

  constructor(props: FileItemProps) {
    this.id = props.id;
    this.mode = props.mode;
    this.processState = new ProcessState();
  }

  setMeta(fileName: string, fileSize: number) {
    this.name = fileName;
    this.size = fileSize;
  }

  isReady(): boolean {
    return this.processState.isReady;
  }

  isRunning(): boolean {
    return this.processState.isRunning;
  }

  isFinish(): boolean {
    return this.processState.isRunning;
  }

  generateUploader(file: File) {
    const store = useStore();
    const upload = new Upload(file, {
      endpoint: Config.TUS_PATH,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: file.name,
        filetype: file.type,
        lastmodified: file.lastModified.toString(),
      },
      onError: (error) => {
        this.processState.value = "ERROR";
        console.log("Failed because: " + error);
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        console.log(bytesUploaded, bytesTotal);
        console.log(this.processState);
        this.progress = Math.floor((bytesUploaded / bytesTotal) * 100);
      },
      onSuccess: () => {
        this.processState.value = "FINISH";
        this.serverID = upload.url?.split("/").pop() ?? undefined;
        store.dispatch(UploadActionTypes.HANDLER);
      },
    });

    const starter = () => {
      this.processState.value = "RUNNING";
      upload.start();
    };

    this.processState.value == "READY";

    this.upload = starter;

    return starter;
  }
}
