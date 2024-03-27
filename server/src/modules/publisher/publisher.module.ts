import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publisher, PublisherSchema } from './publisher.entity';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Publisher.name, schema: PublisherSchema }
        ]),
        UserModule
    ],
    controllers: [PublisherController],
    providers: [PublisherService],
    exports: [PublisherService]
})
export class PublisherModule {}
