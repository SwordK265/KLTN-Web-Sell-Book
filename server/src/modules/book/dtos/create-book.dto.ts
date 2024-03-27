import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString
} from 'class-validator';
import { LanguageEnum } from 'src/modules/common/enums/language.enum';

export class CreateBookDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'SlugIsRequired' })
    slug: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty({ message: 'PriceIsRequired' })
    @IsPositive()
    price: number;

    @IsString()
    @IsNotEmpty({ message: 'LanguageIsRequired' })
    @IsOptional()
    @IsEnum(LanguageEnum)
    language?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'SizeIsRequired' })
    size?: string;

    @IsNumber()
    @IsNotEmpty({ message: 'PageNumberIsRequired' })
    @IsPositive()
    @IsOptional()
    page_number?: number;

    @IsNumber()
    @IsNotEmpty({ message: 'WeightIsRequired' })
    @IsPositive()
    @IsOptional()
    weight?: number;

    @IsString()
    @IsOptional()
    date_release?: string;

    @IsString()
    @IsOptional()
    format?: string;

    @IsNumber()
    @IsNotEmpty({ message: 'QuantityIsRequired' })
    @IsPositive()
    quantity: number;

    @IsNumber()
    @IsNotEmpty({ message: 'SoldIsRequired' })
    @IsPositive()
    @IsOptional()
    sold?: number;

    @IsString()
    photo: string;

    @IsNumber()
    @IsNotEmpty({ message: 'DiscountIsRequired' })
    @IsPositive()
    @IsOptional()
    discount?: number;

    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'AuthorNameIsRequired' })
    author?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'PublisherNameIsRequired' })
    publisher?: string;

    @IsString()
    @IsNotEmpty({ message: 'CategoryNameIsRequired' })
    category: string;

    @IsString()
    @IsNotEmpty({ message: 'CategoryTypeNameIsRequired' })
    category_type: string;
}
