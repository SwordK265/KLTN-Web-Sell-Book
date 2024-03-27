import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/shared.service';

@Global()
@Module({
    providers: [ApiConfigService],
    exports: [ApiConfigService]
})
export class SharedConfigModule {}
