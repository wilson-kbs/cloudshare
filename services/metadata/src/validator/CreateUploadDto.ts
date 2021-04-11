import {
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  ArrayMaxSize,
  ArrayUnique,
  Allow,
  IsInt,
  Min,
  Max
} from "class-validator";


export class CreateUploadDto {
  @IsNotEmpty()
  @IsBoolean()
  auth: boolean;

  @Allow()
  password: string;

  @IsInt()
  @Min(0)
  @Max(6)
  expire: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(10)
  @ArrayUnique()
  @MaxLength(35, {
    each: true,
  })
  filesID: string[];
}
