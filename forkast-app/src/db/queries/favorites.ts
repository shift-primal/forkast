import { db } from '#/db';
import { favorites } from '#/db/schema';
import type { FavoriteInput, GetFavoritesInput } from '#/lib/schemas/favorites';
import { and, eq } from 'drizzle-orm';

export function getFavorites(input: GetFavoritesInput) {
    return db.query.favorites.findMany({
        where: eq(favorites.userId, input.userId),
        with: { recipe: true }
    });
}

export function addFavorite(input: FavoriteInput) {
    return db.insert(favorites).values({
        userId: input.userId,
        recipeId: input.recipeId
    });
}

export function removeFavorite(input: FavoriteInput) {
    return db
        .delete(favorites)
        .where(and(eq(favorites.userId, input.userId), eq(favorites.recipeId, input.recipeId)));
}
