import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class PhotoService {
    saveFile(fileData: string, filePath: string): string {
        const data = fileData.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
        return filePath;
    }
}
