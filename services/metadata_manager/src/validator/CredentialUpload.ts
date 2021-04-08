import { IsNotEmpty } from "class-validator";


export class CredentialUpload {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  pwd: string;
}
