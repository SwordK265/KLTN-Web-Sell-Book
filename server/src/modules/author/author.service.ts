import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from './author.entity';
import {
    AuthorNotFoundException,
    DuplicateNameException
} from '../common/exceptions';
import { GetAuthorQueryDto } from './dtos/get-authors-query.dto';
import { GetAuthorsResponse } from './dtos/get-authors-response.dto';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { UpdateAuthorDto } from './dtos/update-author.dto';

@Injectable()
export class AuthorService {
    constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

    async findById(id: string): Promise<Author> {
        const result = await this.authorModel.findById(id);

        if (!result) {
            throw new AuthorNotFoundException();
        }

        return result;
    }

    async findName(name: string): Promise<Author> {
        const result = await this.authorModel.findOne({ name });

        if (!result) {
            throw new AuthorNotFoundException();
        }

        return result;
    }

    async create(data: CreateAuthorDto): Promise<Author> {
        const checkName = await this.authorModel.findOne({ name: data.name });

        if (checkName) {
            throw new DuplicateNameException();
        }

        const result = await this.authorModel.create({
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

    async update(authorId: string, data: UpdateAuthorDto): Promise<Author> {
        const result = await this.authorModel.findByIdAndUpdate(
            authorId,
            data,
            { new: true, runValidators: true }
        );

        if (!result) {
            throw new AuthorNotFoundException();
        }

        return result;
    }

    async delete(authorId: string): Promise<Author> {
        const result = await this.authorModel.findByIdAndDelete(authorId);

        if (!result) {
            throw new AuthorNotFoundException();
        }

        return result;
    }

    async countById(id: string): Promise<number> {
        const count = await this.authorModel.count({ _id: id });

        return count;
    }

    async findAll(query: GetAuthorQueryDto): Promise<GetAuthorsResponse> {
        // Search
        const search = query.q || '';

        // Sort
        const sortObj = {};
        query.orderBy
            ? (sortObj[query.sortKey] = query.keyword)
            : (sortObj['name'] = 1);

        // Find authors (sort - quantity book)
        const [result] = await this.authorModel
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

    async getOutstandingAuthor(): Promise<Author> {
        const [result] = await this.authorModel.aggregate([
            {
                $lookup: {
                    from: 'books',
                    foreignField: 'author',
                    localField: '_id',
                    as: 'books'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    bookCount: { $size: '$books' },
                    top3Books: { $slice: ['$books', 3] }
                }
            },
            {
                $sort: {
                    bookCount: -1
                }
            },
            {
                $limit: 1
            }
        ]);

        return result;
    }
}
