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

export const recipe = pgTable('recipe', {
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

export const section = pgTable('section', {
    id: serial().primaryKey(),
    recipeId: uuid('recipe_id').references(() => recipe.id),
    name: varchar({ length: 255 }),
    sortIndex: integer('sort_index')
});

export const step = pgTable('step', {
    id: serial().primaryKey(),
    recipeId: uuid('recipe_id').references(() => recipe.id),
    sectionId: integer('section_id').references(() => section.id),
    description: text(),
    sortIndex: integer('sort_index'),
    tip: text(),
    imageId: varchar('image_id', { length: 255 })
});

export const ingredient = pgTable('ingredient', {
    id: serial().primaryKey(),
    recipeId: uuid('recipe_id').references(() => recipe.id),
    sectionId: integer('section_id').references(() => section.id),
    name: varchar({ length: 255 }),
    sortIndex: integer('sort_index'),
    inPantry: boolean('in_pantry').default(false),
    amount: real(),
    unit: varchar({ length: 100 }),
    measurementValue: real('measurement_value'),
    measurementType: varchar('measurement_type', { length: 100 }),
    additionalInfo: text('additional_info')
});

export const mealPlanEntry = pgTable('meal_plan_entry', {
    id: serial().primaryKey(),
    recipeId: uuid('recipe_id').references(() => recipe.id),
    date: date().notNull(),
    meal: mealEnum().notNull(),
    notes: text(),
    servings: integer().default(2)
});

export const pantryItem = pgTable('pantry_item', {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    amount: real(),
    unit: varchar({ length: 100 }),
    notes: text()
});
