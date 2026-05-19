import { favorites, ingredients, mealPlanEntries, recipes, sections, steps } from '#/db/schema';
import { relations } from 'drizzle-orm';

export const recipesRelations = relations(recipes, ({ many }) => ({
    sections: many(sections),
    mealPlanEntries: many(mealPlanEntries),
    favorites: many(favorites)
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
    recipe: one(recipes, {
        fields: [sections.recipeId],
        references: [recipes.id]
    }),
    steps: many(steps),
    ingredients: many(ingredients)
}));

export const stepsRelations = relations(steps, ({ one }) => ({
    recipe: one(recipes, {
        fields: [steps.recipeId],
        references: [recipes.id]
    }),

    section: one(sections, {
        fields: [steps.sectionId],
        references: [sections.id]
    })
}));

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
    recipe: one(recipes, {
        fields: [ingredients.recipeId],
        references: [recipes.id]
    }),

    section: one(sections, {
        fields: [ingredients.sectionId],
        references: [sections.id]
    })
}));

export const mealPlanEntriesRelations = relations(mealPlanEntries, ({ one }) => ({
    recipe: one(recipes, {
        fields: [mealPlanEntries.recipeId],
        references: [recipes.id]
    })
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
    recipe: one(recipes, {
        fields: [favorites.recipeId],
        references: [recipes.id]
    })
}));
