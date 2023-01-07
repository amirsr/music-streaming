import { Controller } from '@nestjs/common';
import { FilesService } from "../multer/files.service";

@Controller('songs')
export class SongsController {
  constructor( private filesService: FilesService ) {
  }

}
