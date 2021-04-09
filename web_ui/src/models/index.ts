import { ProcessState } from "@/@types";
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
  status?: ProcessState;

  constructor(props: FileItemProps) {
    this.id = props.id;
    this.mode = props.mode;
  }

  setMeta(fileName: string, fileSize: number) {
    this.name = fileName;
    this.size = fileSize;
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
        this.status = "ERROR";
        console.log("Failed because: " + error);
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        console.log(bytesUploaded, bytesTotal);
        console.log(this.status);
        this.progress = Math.floor((bytesUploaded / bytesTotal) * 100);
      },
      onSuccess: () => {
        this.status = "SUCCESS";
        this.serverID = upload.url?.split("/").pop() ?? undefined;
        store.dispatch(UploadActionTypes.UPLOAD_HANDLER);
      },
    });

    const starter = () => {
      this.status = "PENDING";
      upload.start();
    };

    this.upload = starter;

    return starter;
  }
}
