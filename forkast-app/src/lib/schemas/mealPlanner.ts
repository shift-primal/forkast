import { MEAL_ENUM } from '#/lib/constants';
import z from 'zod';

const mealEnum = z.enum(MEAL_ENUM);

export const getMealPlanSchema = z.object({
    userId: z.uuid(),
    weekStart: z.iso.date()
});

export const addMealEntrySchema = z.object({
    recipeId: z.uuid(),
    date: z.iso.date(),
    meal: mealEnum,
    notes: z.string().optional(),
    servings: z.int().optional()
});

export const removeMealEntrySchema = z.object({
    id: z.int()
});

export const updateMealEntrySchema = addMealEntrySchema
    .extend({
        id: z.int()
    })
    .partial()
    .required({ id: true });
