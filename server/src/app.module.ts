import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService } from './shared/services/shared.service';
import { SharedConfigModule } from './shared/shared.module';
import { CartModule } from './modules/cart/cart.module';
import { BookModule } from './modules/book/book.module';
import { AuthorModule } from './modules/author/author.module';
import { PublisherModule } from './modules/publisher/publisher.module';
import { ReviewModule } from './modules/review/review.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { CategoryTypeModule } from './modules/category-type/category-type.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PhotoModule } from './modules/photo/photo.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public')
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ApiConfigService) => ({
                uri: configService.mongoConfig.database
            }),
            inject: [ApiConfigService]
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        JwtModule.registerAsync({
            global: true, // don't need to import the JwtModule anywhere else in our application,
            useFactory: (configService: ApiConfigService) => ({
                secret: configService.authConfig.jwtSecret,
                signOptions: { expiresIn: configService.authConfig.jwtExpire }
            }),
            inject: [ApiConfigService]
        }),
        SharedConfigModule,
        CartModule,
        BookModule,
        AuthorModule,
        PublisherModule,
        ReviewModule,
        UserModule,
        AuthModule,
        CategoryModule,
        CategoryTypeModule,
        PhotoModule,
        PaymentModule
    ]
})
export class AppModule {}
