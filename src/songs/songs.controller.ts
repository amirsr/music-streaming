import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { FileResponseVm } from "./file-response.modal";
import { AuthGuard } from "@nestjs/passport";
import { SongsService } from "./songs.service";
import { UploadedFile } from "@nestjs/common/decorators/http/route-params.decorator";

@Controller("/attachment/files")
@UseGuards(AuthGuard("jwt"))
export class SongsController {
  constructor( private songsService: SongsService ) {
  }

  @Post("")
  @UseInterceptors(FilesInterceptor("file"))
  async upload( @UploadedFile() file: Express.Multer.File, @Request() req ) {
    const fileResponse = {
      userId: req.auth.id,
      filename: file.filename,
      mimeType: file.mimetype,
      title: req.body.title,
      duration: req.body.duration,
      genre: req.body.genre,
      lyrics: req.body.lyrics,
      uploaded: new Date(),
    };
    await this.songsService.addSongsData(fileResponse);
    return fileResponse;
  }

  @Get("info/:id")
  async getFileInfo( @Param("id") id: string ): Promise<FileResponseVm> {
    const file = await this.songsService.findInfo(id);
    const filestream = await this.songsService.readStream(id);
    if ( !filestream ) {
      throw new HttpException("An error occurred while retrieving file info", HttpStatus.EXPECTATION_FAILED);
    }
    return {
      message: "File has been detected",
      file: file
    };
  }

  @Get(":id")
  async getFile( @Param("id") id: string, @Res() res ) {
    const file = await this.songsService.findInfo(id);
    const filestream = await this.songsService.readStream(id);
    if ( !filestream ) {
      throw new HttpException("An error occurred while retrieving file", HttpStatus.EXPECTATION_FAILED);
    }
    res.header("Content-Type", file.contentType);
    return filestream.pipe(res);
  }

  @Get("download/:id")
  async downloadFile( @Param("id") id: string, @Res() res ) {
    const file = await this.songsService.findInfo(id);
    const filestream = await this.songsService.readStream(id);
    if ( !filestream ) {
      throw new HttpException("An error occurred while retrieving file", HttpStatus.EXPECTATION_FAILED);
    }
    res.header("Content-Type", file.contentType);
    res.header("Content-Disposition", "attachment; filename=" + file.filename);
    return filestream.pipe(res);
  }

  @Get("delete/:id")
  async deleteFile( @Param("id") id: string ): Promise<FileResponseVm> {
    const file = await this.songsService.findInfo(id);
    const filestream = await this.songsService.deleteSong(id);
    if ( !filestream ) {
      throw new HttpException("An error occurred during file deletion", HttpStatus.EXPECTATION_FAILED);
    }
    return {
      message: "File has been deleted",
      file: file
    };
  }
}