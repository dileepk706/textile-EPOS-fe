import { z } from 'zod';
import { createProductFormSchema, CreateProductFormDto } from '../create/product.create.contracts';

export const updateProductFormSchema = createProductFormSchema;
export type UpdateProductFormDto = CreateProductFormDto;
