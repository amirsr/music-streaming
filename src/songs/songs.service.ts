import { Injectable } from '@nestjs/common';
import { FilesService } from "../multer/files.service";

@Injectable()
export class SongsService {
  constructor(private fileService:FilesService) {
  }


}
