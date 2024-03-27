import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryType } from './category-type.entity';
import { CategoryTypeNotFoundException } from '../common/exceptions';
import { GetCategoryTypeResponse } from './dtos/get-category-type-response.dto';
import { GetCategoryTypeQuery } from './dtos/get-category-type-query.dto';
import { CreateCategoryTypeDto } from './dtos/create-category-type.dto';
import { UpdateCategoryTypeDto } from './dtos/update-category-type.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class CategoryTypeService {
    constructor(
        @InjectModel(CategoryType.name)
        private readonly categoryTypeModel: Model<CategoryType>,
        @Inject(forwardRef(() => CategoryService))
        private readonly categoryService: CategoryService
    ) {}

    async findById(id: string): Promise<CategoryType> {
        const result = await this.categoryTypeModel.findById(id);

        if (!result) {
            throw new CategoryTypeNotFoundException();
        }

        return result;
    }

    async findByNameAndCategory(
        categoryId: string,
        name: string
    ): Promise<CategoryType> {
        const result = await this.categoryTypeModel.findOne({
            name,
            category: categoryId
        });

        if (!result) {
            throw new CategoryTypeNotFoundException();
        }

        return result;
    }

    async findTypesInCategory(categoryId: string): Promise<CategoryType[]> {
        const result = await this.categoryTypeModel
            .find({
                category: categoryId
            })
            .select('name slug');

        return result;
    }

    async findBySlug(slug: string): Promise<CategoryType> {
        const [result] = await this.categoryTypeModel.aggregate([
            {
                $match: { slug }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: 'category_type',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'authors',
                                localField: 'author',
                                foreignField: '_id',
                                as: 'author'
                            }
                        },
                        {
                            $lookup: {
                                from: 'publishers',
                                localField: 'publisher',
                                foreignField: '_id',
                                as: 'publisher'
                            }
                        }
                    ],
                    as: 'books'
                }
            },
            {
                $unwind: '$books'
            },
            {
                $unwind: '$books.author'
            },
            {
                $unwind: '$books.publisher'
            },
            {
                $group: {
                    _id: {
                        categoryId: '$_id', // categoryId
                        authorName: '$books.author.name',
                        authorId: '$books.author._id', // authorId,
                        publisherName: '$books.publisher.name',
                        publisherId: '$books.publisher._id' // publisherId
                    },
                    name: { $first: '$name' },
                    slug: { $first: '$slug' },
                    category: { $first: '$category' }
                }
            },
            {
                $group: {
                    _id: '$_id.categoryId', // group categoryId
                    name: { $first: '$name' },
                    slug: { $first: '$slug' },
                    category: { $first: '$category' },
                    authors: {
                        $addToSet: {
                            authorId: '$_id.authorId',
                            name: '$_id.authorName'
                        }
                    },
                    publishers: {
                        $addToSet: {
                            authorId: '$_id.publisherId',
                            name: '$_id.publisherName'
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        return result;
    }

    async create(data: CreateCategoryTypeDto): Promise<CategoryType> {
        const category = await this.categoryService.findByName(data.category);

        const result = await this.categoryTypeModel.create({
            ...data,
            slug: data.slug
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .split(' ')
                .join('-'),
            category: category._id
        });

        return result;
    }

    async findAll(): Promise<CategoryType[]> {
        const result = await this.categoryTypeModel.aggregate([
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: 'category_type',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'authors',
                                localField: 'author',
                                foreignField: '_id',
                                as: 'author'
                            }
                        },
                        {
                            $lookup: {
                                from: 'publishers',
                                localField: 'publisher',
                                foreignField: '_id',
                                as: 'publisher'
                            }
                        }
                    ],
                    as: 'books'
                }
            },
            {
                $unwind: '$books'
            },
            {
                $unwind: '$books.author'
            },
            {
                $unwind: '$books.publisher'
            },
            {
                $group: {
                    _id: {
                        categoryId: '$_id', // categoryId
                        authorName: '$books.author.name',
                        authorId: '$books.author._id', // authorId,
                        publisherName: '$books.publisher.name',
                        publisherId: '$books.publisher._id' // publisherId
                    },
                    name: { $first: '$name' },
                    slug: { $first: '$slug' }
                }
            },
            {
                $group: {
                    _id: '$_id.categoryId', // group categoryId
                    name: { $first: '$name' },
                    slug: { $first: '$slug' },
                    authors: {
                        $addToSet: {
                            authorId: '$_id.authorId',
                            name: '$_id.authorName'
                        }
                    },
                    publishers: {
                        $addToSet: {
                            authorId: '$_id.publisherId',
                            name: '$_id.publisherName'
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        return result;
    }

    async findAllByAdmin(
        query: GetCategoryTypeQuery
    ): Promise<GetCategoryTypeResponse> {
        // Search
        const search = query.q || '';

        // Sort
        const sortObj = {};
        query.orderBy
            ? (sortObj[query.sortKey] = query.keyword)
            : (sortObj['name'] = 1);

        // Find authors (sort - quantity book)
        const [result] = await this.categoryTypeModel
            .aggregate([
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $match: {
                        name: { $regex: search, $options: 'i' }
                    }
                },
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

    async update(
        categoryTypeId: string,
        data: UpdateCategoryTypeDto
    ): Promise<CategoryType> {
        const category = await this.categoryService.findByName(data.category);

        const result = await this.categoryTypeModel.findByIdAndUpdate(
            categoryTypeId,
            { ...data, category: category._id },
            {
                new: true,
                runValidators: true
            }
        );

        return result;
    }

    async delete(categoryTypeId: string): Promise<CategoryType> {
        const result = await this.categoryTypeModel.findByIdAndDelete(
            categoryTypeId
        );

        return result;
    }
}
