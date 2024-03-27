import { User } from 'src/modules/user/user.entity';

export class JWTPayload {
    readonly user: User;

    constructor(payload: { user: User }) {
        this.user = payload.user;
    }
}
