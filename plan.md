# Forkast — Build Plan

## 1. Scraper

- [ ] Set `LIMIT = 0` in `main.py` to run a full scrape
- [ ] Verify all recipes, sections, steps and ingredients landed correctly in Neon

## 2. Drizzle schema (`src/db/schema.ts`) ✓

- [x] `recipe`, `section`, `step`, `ingredient` tables — mirrored from scraper
- [x] `meal_plan_entry` table — `id`, `recipe_id`, `date`, `meal` (enum), `notes`, `servings`
- [x] `pantry_item` table — `id`, `name`, `amount`, `unit`, `notes`
- [x] `meal` enum — breakfast, lunch, dinner, supper, snack
- [x] Run `pnpm db:push` to sync schema to Neon

## 3. Server functions

TanStack Start server functions that query Drizzle directly.

**Recipes** (`src/db/queries/recipes.ts` → `src/server/recipes.ts`)

- [x] `getRecipes(filters)` / `fetchRecipes` — paginated recipe list with search, filters, sorting
- [x] `getRecipe(input)` / `fetchRecipe` — full recipe with sections, steps and ingredients

**Planner** (`src/db/queries/planner.ts` → `src/server/planner.ts`)

- [ ] `getWeekEntries(weekStart)` / `fetchWeekEntries` — all meal entries for a given week
- [ ] `addMealEntry({ recipeId, date, meal, notes?, servings? })` / `addMealEntryFn`
- [ ] `removeMealEntry(id)` / `removeMealEntryFn`
- [ ] `updateMealEntry(id, { notes?, servings? })` / `updateMealEntryFn`

**Pantry** (`src/db/queries/pantry.ts` → `src/server/pantry.ts`)

- [ ] `getPantryItems()` / `fetchPantryItems`
- [ ] `addPantryItem({ name, amount?, unit?, notes? })` / `addPantryItemFn`
- [ ] `removePantryItem(id)` / `removePantryItemFn`
- [ ] `updatePantryItem(id, fields)` / `updatePantryItemFn`

**Shopping list** (`src/db/queries/shopping-list.ts` → `src/server/shopping-list.ts`)

- [ ] `getShoppingList(weekStart)` / `fetchShoppingList` — aggregate ingredients from the week's entries, subtract pantry matches

## 4. Routes & pages

- [ ] `/` — redirect to current week's planner
- [ ] `/planner` — weekly planner view (7-day grid, Mon–Sun)
    - [ ] Each day column shows assigned meals
    - [ ] Click a slot → recipe picker modal
    - [ ] Each entry shows recipe name, meal type, notes
    - [ ] Remove/edit entry inline
- [ ] `/recipes` — recipe browser
    - [ ] Search by name
    - [ ] Filter by difficulty and max time
    - [ ] Recipe card grid (image, name, time, difficulty, rating)
    - [ ] Pagination
- [ ] `/recipes/$id` — recipe detail
    - [ ] Header: name, image, meta (time, difficulty, servings, rating)
    - [ ] Sections with ingredients and steps side by side
    - [ ] "Add to planner" button → day/meal picker
- [ ] `/pantry` — pantry tracker
    - [ ] List of pantry items with amount and unit
    - [ ] Add / edit / remove items
- [ ] `/shopping-list` — generated from current week minus pantry
    - [ ] Grouped by ingredient name
    - [ ] Check off items (marks as in pantry)

## 5. Layout & navigation

- [ ] App shell with sidebar or top nav: Planner, Recipes, Pantry, Shopping List
- [ ] Week navigation (prev/next week arrows)
- [ ] Mobile-friendly layout

## 6. Polish

- [ ] Loading and empty states on all pages
- [ ] Optimistic updates on planner mutations
- [ ] Image handling — scraper stores `image_id`, wire up the actual image URL from the source
- [ ] Dark mode (theme tokens already set up in `globals.css`)
