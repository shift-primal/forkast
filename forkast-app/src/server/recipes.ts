import { db } from '#/db';
import { recipes } from '#/db/schema';
import type { GetRecipeInput, GetRecipesInput } from '#/lib/schemas/recipes';
import { and, asc, desc, eq, gte, ilike, lte, sql } from 'drizzle-orm';

export async function getrecipes(input: GetRecipeInput) {
    const recipeId = input.recipeId;

    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, recipeId));
    return recipe ?? null;
}

export async function getrecipess(filters: GetRecipesInput) {
    const { search, maxDifficulty, maxTime, minRating, page, limit, sortBy, sortDir } = filters;

    const columnMap = {
        name: recipes.name,
        difficulty: recipes.difficultyLevel,
        time: recipes.timeEstimateTotal,
        rating: recipes.averageRating
    };

    const where = [];

    if (search) {
        where.push(ilike(recipes.name, `%${search}%`));
    }

    if (maxDifficulty) {
        where.push(lte(recipes.difficultyLevel, maxDifficulty));
    }

    if (maxTime) {
        where.push(lte(recipes.timeEstimateTotal, maxTime));
    }

    if (minRating) {
        where.push(gte(recipes.averageRating, minRating));
    }

    const [result, [{ count }]] = await Promise.all([
        db
            .select()
            .from(recipes)
            .where(and(...where))
            .limit(limit)
            .offset((page - 1) * limit)
            .orderBy(sortDir === 'desc' ? desc(columnMap[sortBy]) : asc(columnMap[sortBy])),

        db
            .select({ count: sql<number>`count(*)::int` })
            .from(recipes)
            .where(and(...where))
    ]);

    return { recipess: result, total: count, page, pageCount: Math.ceil(count / limit) };
}
