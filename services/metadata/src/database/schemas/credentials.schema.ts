import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CredentialDocument = Credential & Document;

@Schema()
export class Credential {
  @Prop({ type: String, index: true })
  id: string;

  @Prop({ type: String })
  create_at: string;

  @Prop({ type: String })
  expire_at: string;

  @Prop({ type: Boolean, default: false })
  auth: boolean;


  @Prop({ type: Boolean, default: false })
  permanante: boolean;
}

export const CredentialSchema = SchemaFactory.createForClass(Credential);
