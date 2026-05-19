import { recipes } from '#/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import z from 'zod';

export const getRecipeInput = z.object({
    recipeId: z.uuid()
});

export const getRecipesInput = z.object({
    search: z.string().optional(),
    maxDifficulty: z.int().min(1).max(4).optional(),
    maxTime: z.int().positive().optional(),
    minRating: z.number().positive().optional(),
    page: z.int().default(1),
    limit: z.int().positive().default(25),
    sortBy: z.enum(['name', 'difficulty', 'time', 'rating']).default('name'),
    sortDir: z.enum(['asc', 'desc']).default('asc')
});

export type Recipe = InferSelectModel<typeof recipes>;
export type GetRecipeInput = z.infer<typeof getRecipeInput>;
export type GetRecipesInput = z.infer<typeof getRecipesInput>;
