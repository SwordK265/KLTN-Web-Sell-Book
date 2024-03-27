import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedConfigModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/shared.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.select(SharedConfigModule).get(ApiConfigService);

    // Validation Global
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            skipMissingProperties: false,
            forbidUnknownValues: false
        })
    );

    // Cors
    app.enableCors();

    const port = configService.getPort.port || 8000;
    await app.listen(port, () => {
        console.log(`🚀 ~ Application running on port ${port}`);
    });
}
bootstrap();
