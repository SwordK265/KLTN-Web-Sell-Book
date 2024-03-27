import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryType, CategoryTypeSchema } from './category-type.entity';
import { CategoryTypeService } from './category-type.service';
import { CategoryTypeController } from './category-type.controller';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CategoryType.name, schema: CategoryTypeSchema }
        ]),
        UserModule,
        forwardRef(() => CategoryModule)
    ],
    controllers: [CategoryTypeController],
    providers: [CategoryTypeService],
    exports: [CategoryTypeService]
})
export class CategoryTypeModule {}
