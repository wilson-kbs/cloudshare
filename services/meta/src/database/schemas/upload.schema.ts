import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model, Mongoose } from 'mongoose';
import { MetaFile, MetaFileDocument } from './metafile.schema';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';

export type UploadDocument = Upload & Document;

@Schema()
export class Upload {
  private SALT = 15;

  @Prop({ required: true, index: true })
  id: string;

  @Prop({ required: true, default: true })
  active: boolean;

  @Prop({ required: true, default: new Date().toISOString() })
  createAt: string;

  @Prop({ required: true })
  expireAt: string;

  @Prop({ required: true, default: false })
  auth: boolean;

  @Prop({})
  pwd: string;

  @Prop({ required: true, default: false })
  permanante: boolean;

  @Prop({ required: true })
  files: MetaFile[];

  public hashPassword(pwd: string) {
    this.pwd = hashSync(pwd, genSaltSync(this.SALT));
  }

  public validPassword(pwd: string): boolean {
    return compareSync(pwd, this.pwd);
  }

  public isExpired(): boolean {
    let now = Date.now();
    let expire = new Date(this.expireAt).getTime();
    return now > expire;
  }

  public isActive(): boolean {
    if (this.permanante) {
      return true;
    }
    if (!this.active) {
      return false;
    }
    return !this.isExpired();
  }

  public getDataFileById(id: string): MetaFile[] {
    return this.files.filter((file: MetaFileDocument) => file.id === id);
  }

  public setCreateAndExpireDate(expire: number) {
    let date = new Date();
    this.createAt = date.toISOString();
    let timeNow = date.getTime();
    switch (expire) {
      case 0: // if NODE_ENV:production = +10 Min else 30 Sec
        if (process.env.NODE_ENV == 'production')
          this.expireAt = new Date(timeNow + 10 * 60 * 1000).toISOString();
        else this.expireAt = new Date(timeNow + 30 * 1000).toISOString();
        break;
      case 1: // +1H
        this.expireAt = new Date(timeNow + 60 * 60 * 1000).toISOString();
        break;
      case 2: // +1d
        this.expireAt = new Date(timeNow + 24 * 60 * 60 * 1000).toISOString();
        break;
      case 3: // +3d
        this.expireAt = new Date(
          timeNow + 3 * 24 * 60 * 60 * 1000,
        ).toISOString();
        break;
      default:
        // +10 Min
        this.expireAt = new Date(timeNow + 10 * 60 * 1000).toISOString();
    }
  }
}

export const UploadSchema = SchemaFactory.createForClass(Upload);

UploadSchema.loadClass(Upload);
