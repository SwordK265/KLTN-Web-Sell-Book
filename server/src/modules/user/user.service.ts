import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';
import { SignUpUserDto } from '../auth/dtos/sign-up.auth.dto';
import { UpdateMeDto } from './dtos/update-me.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import {
    InvalidUpdatePwdException,
    UserNotFoundException
} from '../common/exceptions';
import { GetUsersQuery } from './dtos/get-users-query.dto';
import { GetUsersResponse } from './dtos/get-users-response.dto';
import { MessageResponse } from '../common/interfaces/api-response-message';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}

    async findAll(query: GetUsersQuery): Promise<GetUsersResponse> {
        // Search
        const search = query.q || '';

        // Sort
        const sortObj = {};
        query.orderBy
            ? (sortObj[query.sortKey] = query.keyword)
            : (sortObj['name'] = 1);

        // Find authors (sort - quantity book)
        const [result] = await this.userModel
            .aggregate([
                { $match: { name: { $regex: search, $options: 'i' } } },
                { $sort: sortObj },
                {
                    $facet: {
                        data: [
                            { $skip: query.skip },
                            { $limit: query.limit },
                            { $project: { password: 0 } }
                        ],
                        total: [
                            {
                                $count: 'count'
                            }
                        ]
                    }
                },
                {
                    $unwind: '$total'
                },
                {
                    $project: {
                        data: 1,
                        total: '$total.count'
                    }
                }
            ])
            .collation({ locale: 'vi' });

        return {
            data: result?.data || [],
            page: Number(query.page),
            perPage: Number(query.perPage),
            total: result?.total || 0
        };
    }

    async findById(id: string): Promise<User> {
        const user = await this.userModel.findById(id);

        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async create(userDto: SignUpUserDto): Promise<User> {
        return await this.userModel.create(userDto);
    }

    async findEmail(email: string): Promise<User> {
        const user = await this.userModel
            .findOne({ email })
            .select('+password');

        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async getMe(user: User): Promise<User> {
        const getUser = await this.userModel.findById(user._id);

        if (!getUser) {
            throw new UserNotFoundException();
        }

        return getUser;
    }

    async updateMe(user: User, data: UpdateMeDto): Promise<User> {
        const getUser = await this.userModel.findByIdAndUpdate(user._id, data, {
            new: true,
            runValidators: true
        });

        if (!getUser) {
            throw new UserNotFoundException();
        }

        return getUser;
    }

    async updatePassword(
        user: User,
        data: UpdatePasswordDto
    ): Promise<MessageResponse> {
        // Get user from token
        const getUser = await this.userModel
            .findById(user._id)
            .select('+password');

        // Check pwd user
        const checkPwd = await bcrypt.compare(
            data.currentPassword,
            getUser.password
        );

        if (!checkPwd) {
            throw new InvalidUpdatePwdException();
        }

        // Update new pwd
        const hashNewPassword = await bcrypt.hash(data.newPassword, 12);
        getUser.password = hashNewPassword;
        await getUser.save();

        return {
            message: 'Change password successfully!'
        };
    }

    async createUserByAdmin(data: CreateUserDto): Promise<User> {
        const hashPassword = await bcrypt.hash(data.password, 12);

        data.password = hashPassword;
        const result = await this.userModel.create(data);

        result.password = undefined;

        return result;
    }

    async updateUserByAdmin(
        userId: string,
        data: UpdateUserDto
    ): Promise<User> {
        if (data.password) {
            const hashPassword = await bcrypt.hash(data.password, 12);
            data.password = hashPassword;
        }

        const result = await this.userModel.findByIdAndUpdate(
            { _id: userId },
            data,
            { new: true, runValidators: true }
        );

        if (!result) {
            throw new UserNotFoundException();
        }

        return result;
    }

    async deleteUserByAdmin(userId: string): Promise<User> {
        const result = await this.userModel.findByIdAndDelete({ _id: userId });

        if (!result) {
            throw new UserNotFoundException();
        }

        return result;
    }
}
