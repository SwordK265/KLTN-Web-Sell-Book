import { User } from 'src/modules/user/user.entity';

export class AssignLoginUser {
    name: string;

    email: string;

    token: string;

    phone?: string;

    role?: string;

    constructor(user: User, token: string) {
        this.name = user.name;
        this.email = user.email;
        this.phone = user.phone;
        this.token = token;
        this.role = user.role;
    }
}
