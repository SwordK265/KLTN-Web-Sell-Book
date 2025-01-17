import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
    imports: [],
    controllers: [PhotoController],
    providers: [PhotoService],
    exports: [PhotoService]
})
export class PhotoModule {}
