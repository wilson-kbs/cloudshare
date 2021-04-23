import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface DataToken {
  id: string;
}

@Injectable()
export class AuthService {
  private SECRET = process.env.CLOUDSHARE_JWT_SECRET;

  generateToken(data: DataToken): string {
    return jwt.sign(data, this.SECRET, { expiresIn: '15m' });
  }

  validToken(token: string, id: string): boolean {
    try {
      const decode = <any>jwt.verify(token, this.SECRET);
      return decode.id == id;
    } catch (error) {
      return false;
    }
  }
}
