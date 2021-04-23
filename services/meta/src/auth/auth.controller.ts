import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CredentialUpload } from '@validator/CredentialUpload';
import { DatabaseService } from '@/database/database.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private databaseService: DatabaseService,
    private authServices: AuthService,
  ) {}

  @Get()
  async isAuthRequired(@Query('u') uploadID: string) {
    const response = {
      statusCode: 200,
      statusMsg: 'OK',
    };
    const upload = await this.databaseService.findDataUploadById(uploadID);
    if (!upload) {
      response.statusCode = HttpStatus.BAD_REQUEST;
      response.statusMsg = 'Bad Request';
      throw new HttpException(JSON.stringify(response), HttpStatus.BAD_REQUEST);
    }
    if (!upload.isActive()) {
      response.statusCode = HttpStatus.FORBIDDEN;
      response.statusMsg = 'Expired';
      throw new HttpException(JSON.stringify(response), HttpStatus.FORBIDDEN);
    } else {
      response['authRequired'] = upload.auth;
    }
    return JSON.stringify(response);
  }

  @Post()
  async getAuth(@Body() cred: CredentialUpload): Promise<string> {
    const response = {
      statusCode: 200,
      statusMsg: 'OK',
    };
    const upload = await this.databaseService.findDataUploadById(cred.id);
    if (!upload) {
      response.statusCode = HttpStatus.BAD_REQUEST;
      response.statusMsg = 'Bad Request';
      throw new HttpException(JSON.stringify(response), HttpStatus.BAD_REQUEST);
    }
    if (!upload.isActive()) {
      response.statusCode = HttpStatus.FORBIDDEN;
      response.statusMsg = 'Expired';
      throw new HttpException(JSON.stringify(response), HttpStatus.FORBIDDEN);
    }
    if (!upload.validPassword(cred.pwd)) {
      response.statusCode = HttpStatus.BAD_REQUEST;
      response.statusMsg = 'Bad Request';
      throw new HttpException(JSON.stringify(response), HttpStatus.BAD_REQUEST);
    }
    response['token'] = this.authServices.generateToken({ id: cred.id });
    return JSON.stringify(response);
  }
}
