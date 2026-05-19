import { db } from '#/db';
import { recipes } from '#/db/schema';
import type { GetRecipeInput, GetRecipesInput } from '#/lib/schemas/recipes';
import { and, asc, desc, eq, gte, ilike, lte, sql } from 'drizzle-orm';

export async function getRecipe(input: GetRecipeInput) {
    const recipe = await db.query.recipes.findFirst({
        where: eq(recipes.id, input.recipeId),
        with: {
            sections: {
                with: {
                    steps: true,
                    ingredients: true
                }
            }
        }
    });
    return recipe ?? null;
}

export async function getRecipes(filters: GetRecipesInput) {
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

    return { recipes: result, total: count, page, pageCount: Math.ceil(count / limit) };
}
