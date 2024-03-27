import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from '../common/guard/auth.guard';

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard]
})
export class AuthModule {}
