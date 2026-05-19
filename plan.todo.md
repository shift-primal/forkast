# Forkast — Build Plan

## 1. Scraper

- [ ] Set `LIMIT = 0` in `main.py` to run a full scrape
- [ ] Verify all recipes, sections, steps and ingredients landed correctly in Neon

## 2. Drizzle schema (`src/db/schema.ts`) ✓

- [x] `recipes`, `sections`, `steps`, `ingredients` tables — mirrored from scraper (plural names)
- [x] `meal_plan_entries` table — `id`, `userId`, `recipeId`, `date`, `meal` (enum), `notes`, `servings`
- [x] `pantry_items` table — `id`, `userId`, `name`, `amount`, `unit`, `notes`
- [x] `favorites` table — composite PK `(userId, recipeId)`
- [x] `meal` enum — breakfast, lunch, dinner, supper, snack
- [x] Drizzle relations defined for all tables
- [x] `pnpm db:push` synced to Neon

## 3. Auth ✓

- [x] Neon Auth provisioned (Better Auth-based)
- [x] `@neondatabase/auth@0.2.0-beta.1` + `@neondatabase/neon-js@0.2.0-beta.1` installed
- [x] `NeonAuthUIProvider` in `__root.tsx`
- [x] `authClient` in `src/lib/auth.ts` with `BetterAuthReactAdapter`
- [x] `UserButton`, `SignedIn`, `SignedOut` from `@neondatabase/auth/react`
- [x] `VITE_NEON_AUTH_URL` read from root `.env` via `envDir: '../'` in vite config
- [ ] Gate planner / pantry / favorites mutations behind `SignedIn` check on server

## 4. Server functions

TanStack Start server functions that query Drizzle directly. All user-scoped queries must read `userId` from the auth session server-side.

**Recipes** (`src/db/queries/recipes.ts` → `src/server/recipes.ts`) ✓

- [x] `getRecipes(filters)` / `fetchRecipes` — paginated recipe list with search, filters, sorting
- [x] `getRecipe(input)` / `fetchRecipe` — full recipe with sections, steps and ingredients

**Favorites** (`src/db/queries/favorites.ts` → `src/server/favorites.ts`)

- [x] `getFavorites(userId)` / `fetchFavorites` — list of favorited recipes for current user
- [x] `addFavorite({ recipeId })` — insert into `favorites`
- [x] `removeFavorite({ recipeId })` — delete from `favorites`

**Planner** (`src/db/queries/planner.ts` → `src/server/planner.ts`)

- [ ] `getWeekEntries({ userId, weekStart })` / `fetchWeekEntries` — all meal entries for a given week
- [ ] `addMealEntry({ recipeId, date, meal, notes?, servings? })`
- [ ] `removeMealEntry({ id })`
- [ ] `updateMealEntry({ id, notes?, servings? })`

**Pantry** (`src/db/queries/pantry.ts` → `src/server/pantry.ts`)

- [ ] `getPantryItems(userId)` / `fetchPantryItems`
- [ ] `addPantryItem({ name, amount?, unit?, notes? })`
- [ ] `removePantryItem({ id })`
- [ ] `updatePantryItem({ id, ...fields })`

**Shopping list** (`src/db/queries/shopping-list.ts` → `src/server/shopping-list.ts`)

- [ ] `getShoppingList({ userId, weekStart })` / `fetchShoppingList` — aggregate ingredients from the week's entries, subtract pantry matches

## 5. Routes & pages

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
    - [ ] Favorite toggle on card
    - [ ] Pagination
- [ ] `/recipes/$id` — recipe detail
    - [ ] Header: name, image, meta (time, difficulty, servings, rating)
    - [ ] Sections with ingredients and steps side by side
    - [ ] "Add to planner" button → day/meal picker
    - [ ] Favorite toggle
- [ ] `/favorites` — list of favorited recipes (same card layout as `/recipes`)
- [ ] `/pantry` — pantry tracker
    - [ ] List of pantry items with amount and unit
    - [ ] Add / edit / remove items
- [ ] `/shopping-list` — generated from current week minus pantry
    - [ ] Grouped by ingredient name
    - [ ] Check off items (marks as in pantry)

## 6. Layout & navigation

- [ ] App shell with sidebar or top nav: Planner, Recipes, Favorites, Pantry, Shopping List
- [ ] `UserButton` in nav
- [ ] Week navigation (prev/next week arrows)
- [ ] Mobile-friendly layout

## 7. Polish

- [ ] Loading and empty states on all pages
- [ ] Optimistic updates on planner and favorites mutations
- [ ] Image handling — scraper stores `image_id`, wire up the actual image URL from the source
- [ ] Dark mode (theme tokens already set up in `globals.css`)
