import {
    IsOptional,
    IsString,
    IsNotEmpty,
    IsEnum,
    IsNumber,
    IsPositive
} from 'class-validator';
import { LanguageEnum } from 'src/modules/common/enums/language.enum';

export class UpdateBookDto {
    @IsString()
    @IsNotEmpty({ message: 'NameIsRequired' })
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty({ message: 'SlugIsRequired' })
    @IsOptional()
    slug?: string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    sold?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    @IsNotEmpty({ message: 'PriceIsRequired' })
    @IsPositive()
    price?: number;

    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'LanguageIsRequired' })
    @IsEnum(LanguageEnum)
    language?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'SizeIsRequired' })
    size?: string;

    @IsNumber()
    @IsOptional()
    @IsNotEmpty({ message: 'PageNumberIsRequired' })
    @IsPositive()
    page_number?: number;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    @IsNotEmpty({ message: 'WeightIsRequired' })
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
    @IsOptional()
    quantity?: number;

    @IsString()
    @IsOptional()
    photo?: string;

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
    @IsOptional()
    @IsNotEmpty({ message: 'CategoryNameIsRequired' })
    category?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'CategoryTypeNameIsRequired' })
    category_type?: string;
}
