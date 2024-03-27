import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publisher } from './publisher.entity';
import {
    DuplicateNameException,
    PublisherNotFoundException
} from '../common/exceptions';
import { GetPublishersQuery } from './dtos/get-publishers-query.dto';
import { GetPublishersResponse } from './dtos/get-publishers-response.dto';
import { CreatePublisherDto } from './dtos/create-publisher.dto';
import { UpdatePublisherDto } from './dtos/update-publisher.dto';

@Injectable()
export class PublisherService {
    constructor(
        @InjectModel(Publisher.name) private publisherModel: Model<Publisher>
    ) {}

    async findById(id: string): Promise<Publisher> {
        const result = await this.publisherModel.findById(id);

        if (!result) {
            throw new PublisherNotFoundException();
        }

        return result;
    }

    async findByName(name: string): Promise<Publisher> {
        const result = await this.publisherModel.findOne({ name });

        if (!result) {
            throw new PublisherNotFoundException();
        }

        return result;
    }

    async countById(id: string): Promise<number> {
        const count = await this.publisherModel.count({ _id: id });

        return count;
    }

    async findAll(query: GetPublishersQuery): Promise<GetPublishersResponse> {
        // Search
        const search = query.q || '';

        // Sort
        const sortObj = {};
        query.orderBy
            ? (sortObj[query.sortKey] = query.keyword)
            : (sortObj['name'] = 1);

        // Find Publishers (sort - quantity book)
        const [result] = await this.publisherModel
            .aggregate([
                { $match: { name: { $regex: search, $options: 'i' } } },
                { $sort: sortObj },
                {
                    $facet: {
                        data: [{ $skip: query.skip }, { $limit: query.limit }],
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

    async create(data: CreatePublisherDto): Promise<Publisher> {
        const checkName = await this.publisherModel.findOne({
            name: data.name
        });

        if (checkName) {
            throw new DuplicateNameException();
        }

        const result = await this.publisherModel.create({
            ...data,
            slug: data.slug
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .split(' ')
                .join('-')
        });

        return result;
    }

    async update(
        publisherId: string,
        data: UpdatePublisherDto
    ): Promise<Publisher> {
        const result = await this.publisherModel.findByIdAndUpdate(
            publisherId,
            data,
            { new: true, runValidators: true }
        );

        if (!result) {
            throw new PublisherNotFoundException();
        }

        return result;
    }

    async delete(publisherId: string): Promise<Publisher> {
        const result = await this.publisherModel.findByIdAndDelete(publisherId);

        if (!result) {
            throw new PublisherNotFoundException();
        }

        return result;
    }
}
