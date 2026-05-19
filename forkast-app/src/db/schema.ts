import {
    boolean,
    date,
    integer,
    pgEnum,
    pgTable,
    real,
    serial,
    text,
    uuid,
    varchar
} from 'drizzle-orm/pg-core';

export const mealEnum = pgEnum('meal', ['breakfast', 'lunch', 'dinner', 'supper', 'snack']);

export const recipes = pgTable('recipes', {
    id: uuid().primaryKey(),
    name: varchar({ length: 255 }),
    description: text(),
    servingSizePeople: integer('serving_size_people'),
    servingSizeIsPieces: boolean('serving_size_is_pieces').default(false),
    timeEstimate: integer('time_estimate'),
    timeEstimateTotal: integer('time_estimate_total'),
    difficultyLevel: integer('difficulty_level'),
    imageId: varchar('image_id', { length: 255 }),
    videoId: varchar('video_id', { length: 255 }),
    numberOfRatings: integer('number_of_ratings'),
    averageRating: real('average_rating')
});

export const sections = pgTable('sections', {
    id: serial().primaryKey(),
    recipeId: uuid('recipe_id').references(() => recipes.id),
    name: varchar({ length: 255 }),
    sortIndex: integer('sort_index')
});

export const steps = pgTable('steps', {
    id: serial().primaryKey(),
    recipeId: uuid('recipe_id').references(() => recipes.id),
    sectionId: integer('section_id').references(() => sections.id),
    description: text(),
    sortIndex: integer('sort_index'),
    tip: text(),
    imageId: varchar('image_id', { length: 255 })
});

export const ingredients = pgTable('ingredients', {
    id: serial().primaryKey(),
    recipeId: uuid('recipe_id').references(() => recipes.id),
    sectionId: integer('section_id').references(() => sections.id),
    name: varchar({ length: 255 }),
    sortIndex: integer('sort_index'),
    inPantry: boolean('in_pantry').default(false),
    amount: real(),
    unit: varchar({ length: 100 }),
    measurementValue: real('measurement_value'),
    measurementType: varchar('measurement_type', { length: 100 }),
    additionalInfo: text('additional_info')
});

export const mealPlanEntries = pgTable('meal_plan_entries', {
    id: serial().primaryKey(),
    recipeId: uuid('recipe_id').references(() => recipes.id),
    date: date().notNull(),
    meal: mealEnum().notNull(),
    notes: text(),
    servings: integer().default(2)
});

export const pantryItems = pgTable('pantry_items', {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    amount: real(),
    unit: varchar({ length: 100 }),
    notes: text()
});
