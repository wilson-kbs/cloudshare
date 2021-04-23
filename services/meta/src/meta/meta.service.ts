import { Injectable } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class MetaService {
  constructor(private authservice: AuthService) {}

  validAuth(auth: string, uploadId: string): boolean {
    if (auth && auth !== '') {
      let token = auth.split(' ')[1];
      if (token || token !== '') {
        return this.authservice.validToken(token, uploadId);
      }
    }
    return false;
  }
  validToken(token: string, payload: any): boolean {
    return this.authservice.validToken(token, payload);
  }
}
