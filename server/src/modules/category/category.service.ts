import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.entity';
import { CategoryTypeService } from '../category-type/category-type.service';
import {
    CategoryNotFoundException,
    DuplicateNameException
} from '../common/exceptions';
import { GetCategoryQuery } from './dtos/get-category-query.dto';
import { GetCategoryResponse } from './dtos/get-category-response.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name)
        private readonly categoryModel: Model<Category>,
        private readonly categoryTypeService: CategoryTypeService
    ) {}

    async findByName(name: string): Promise<Category> {
        const result = await this.categoryModel.findOne({ name });

        if (!result) {
            throw new CategoryNotFoundException();
        }

        return result;
    }

    async findById(id: string): Promise<Category> {
        const result = await this.categoryModel.findById(id);

        if (!result) {
            throw new CategoryNotFoundException();
        }

        return result;
    }

    async create(data: CreateCategoryDto): Promise<Category> {
        const checkName = await this.categoryModel.findOne({ name: data.name });

        if (checkName) {
            throw new DuplicateNameException();
        }

        const result = await this.categoryModel.create({
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

    async findAll(): Promise<Category[]> {
        const result = await this.categoryModel.aggregate([
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: 'category',
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
                    books: { $push: '$books' }
                }
            },
            {
                $unwind: '$books'
            },
            {
                $sort: { 'books.quantity': -1 }
            },
            {
                $group: {
                    _id: '$_id.categoryId', // group categoryId
                    name: { $first: '$name' },
                    slug: { $first: '$slug' },
                    books: { $push: '$books' },
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
                $lookup: {
                    from: 'categorytypes',
                    localField: '_id',
                    foreignField: 'category',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                slug: 1
                            }
                        }
                    ],
                    as: 'types'
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        return result;
    }

    async findBySlug(slug: string): Promise<any> {
        // Find in category
        const [category] = await this.categoryModel.aggregate([
            {
                $match: { slug }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: 'category',
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
                $lookup: {
                    from: 'categorytypes',
                    localField: '_id',
                    foreignField: 'category',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                slug: 1
                            }
                        }
                    ],
                    as: 'types'
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Find in categoryType
        if (!category) {
            const categoryType = await this.categoryTypeService.findBySlug(
                slug
            );

            if (!categoryType) {
                return categoryType;
            }

            const categoryFindByTypes =
                await this.categoryTypeService.findTypesInCategory(
                    categoryType.category
                );

            return {
                ...categoryType,
                types: categoryFindByTypes
            };
        }

        return category;
    }

    async update(
        categoryId: string,
        data: UpdateCategoryDto
    ): Promise<Category> {
        const result = await this.categoryModel.findByIdAndUpdate(
            categoryId,
            data,
            {
                new: true,
                runValidators: true
            }
        );

        if (!result) {
            throw new CategoryNotFoundException();
        }

        return result;
    }

    async delete(categoryId: string): Promise<Category> {
        const result = await this.categoryModel.findByIdAndDelete(categoryId);

        if (!result) {
            throw new CategoryNotFoundException();
        }

        return result;
    }

    async findAllByAdmin(
        query: GetCategoryQuery
    ): Promise<GetCategoryResponse> {
        // Search
        const search = query.q || '';

        // Sort
        const sortObj = {};
        query.orderBy
            ? (sortObj[query.sortKey] = query.keyword)
            : (sortObj['name'] = 1);

        // Find authors (sort - quantity book)
        const [result] = await this.categoryModel
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
}
