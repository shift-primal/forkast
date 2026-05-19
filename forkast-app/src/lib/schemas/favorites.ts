import z from 'zod';

export const getFavoritesSchema = z.object({
    userId: z.uuid()
});

export const favoriteSchema = z.object({
    userId: z.uuid(),
    recipeId: z.uuid()
});

export type GetFavoritesInput = z.infer<typeof getFavoritesSchema>;
export type FavoriteInput = z.infer<typeof favoriteSchema>;
