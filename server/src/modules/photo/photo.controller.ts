import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConfigService } from 'src/shared/services/shared.service';

@Controller('photo')
export class PhotoController {
    constructor(
        private readonly photoService: PhotoService,
        private readonly shareService: ApiConfigService
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile() file): string {
        const filePath = 'public/uploads/' + file.originalname;

        this.photoService.saveFile(file.buffer.toString('base64'), filePath);

        const imageUrl = filePath.replace(
            'public',
            this.shareService.serverClientUrl.serverUrl
        );

        return imageUrl;
    }
}
