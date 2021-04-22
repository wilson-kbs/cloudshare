import { Int } from '@/interfaces/gRPC.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as Long from 'long';
import { Document } from 'mongoose';

export type MetaFileDocument = MetaFile & Document;

@Schema()
export class MetaFile {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  type: string;

  @Prop({ type: Number })
  size: number;

  @Prop({ type: Number })
  lastModified: number;

  public setSize(size: Int | number = 0) {
    if (typeof size == 'number') {
      this.size = size;
      return;
    }
    this.size = new Long(size.low, size.high, size.unsigned).toNumber();
  }

  public setLastModified(lastModified: Int | number) {
    if (typeof lastModified == 'number') {
      this.lastModified = lastModified;
      return;
    }
    this.lastModified = new Long(
      lastModified.low,
      lastModified.high,
      lastModified.unsigned,
    ).toNumber();
  }
}

const MetaFileSchema = SchemaFactory.createForClass(MetaFile);
MetaFileSchema.loadClass(MetaFile);
