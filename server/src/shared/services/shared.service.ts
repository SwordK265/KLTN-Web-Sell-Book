import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
    constructor(private configService: ConfigService) {}

    private getString(key: string): string {
        return this.configService.get<string>(key);
    }

    get getPort() {
        return {
            port: this.getString('PORT')
        };
    }

    get serverClientUrl() {
        return {
            clientUrl: this.getString('CLIENT_URL'),
            serverUrl: this.getString('SERVER_URL')
        };
    }

    get authConfig() {
        return {
            jwtSecret: this.getString('JWT_SECRET') || '',
            jwtExpire: this.getString('JWT_EXPIRES_IN') || '',
            serviceTransport: this.getString('SERVICE_TRANSPORT') || '',
            clientId: this.getString('CLIENT_ID') || '',
            clientSercet: this.getString('CLIENT_SECRET') || '',
            emailUser: this.getString('ADMIN_EMAIL_ADDRESS') || '',
            mailToUser: this.getString('MAIL_TO_USER') || '',
            subjectToUser: this.getString('SUBJECT_TO_USER') || ''
        };
    }

    get awsConfig() {
        return {
            awsRegion: this.getString('AWS_REGION') || '',
            awsAccessKeyId: this.getString('AWS_ACCESS_KEY_ID') || '',
            awsSecretAcessKey: this.getString('AWS_SECRET_ACCESS_KEY') || '',
            awsBucketKey: this.getString('AWS_BUCKET_KEY') || '',
            awsUrlExpire: this.getString('AWS_URL_EXPIRE') || ''
        };
    }

    get mongoConfig() {
        return {
            database: this.getString('DATABASE').replace(
                '<password>',
                this.getString('DATABASE_PASSWORD')
            )
        };
    }
    get vnpayConfig() {
        return {
            baseUrl:
                this.getString('VN_PAY_URL') ||
                'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            tmp: this.getString('VN_PAY_TMP') || '',
            secret: this.getString('VN_PAY_SECRET') || '',
            returnUrl: 'http://localhost:8000/payment/vnpay_return'
        };
    }
}
