import { getRecipe, getRecipes } from '#/db/queries/recipes';
import { getRecipeSchema, getRecipesSchema } from '#/lib/schemas/recipes';
import { createServerFn } from '@tanstack/react-start';

export const fetchRecipe = createServerFn({ method: 'GET' })
    .inputValidator(getRecipeSchema)
    .handler(async ({ data }) => {
        return await getRecipe(data);
    });

export const fetchRecipes = createServerFn({ method: 'GET' })
    .inputValidator(getRecipesSchema)
    .handler(async ({ data }) => {
        return await getRecipes(data);
    });
