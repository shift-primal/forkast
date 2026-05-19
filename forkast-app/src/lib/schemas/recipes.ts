import type { getRecipe } from '#/db/queries/recipes';
import z from 'zod';

export const getRecipeSchema = z.object({
    recipeId: z.uuid()
});

export const getRecipesSchema = z.object({
    search: z.string().optional(),
    maxDifficulty: z.int().min(1).max(4).optional(),
    maxTime: z.int().positive().optional(),
    minRating: z.number().positive().optional(),
    page: z.int().default(1),
    limit: z.int().positive().default(25),
    sortBy: z.enum(['name', 'difficulty', 'time', 'rating']).default('name'),
    sortDir: z.enum(['asc', 'desc']).default('asc')
});

export type GetRecipeInput = z.infer<typeof getRecipeSchema>;
export type GetRecipesInput = z.infer<typeof getRecipesSchema>;
export type Recipe = NonNullable<Awaited<ReturnType<typeof getRecipe>>>;
