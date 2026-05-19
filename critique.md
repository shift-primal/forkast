Issues & Bad Practices

1. Critical security: userId trusted from client

favorites.ts:6-10 and schemas/favorites.ts:7-10 — getFavorites, addFavorite, and removeFavorite all take userId as input. The plan even states "all user-scoped queries must read userId from the auth session server-side," but then the schema and
query functions contradict that. Any client can pass an arbitrary UUID and read or modify another user's favorites. Same problem will repeat in planner and pantry if you follow the same pattern. userId must never come from the client — only
from the server session.

2. Critical data model bug: ingredients.inPantry on shared data

schema.ts:56 — inPantry: boolean('in_pantry') sits on the ingredients table, which is shared recipe data, not per-user data. If user A marks garlic as in-pantry, it flips for everyone. This field does not belong here at all — pantry matching
for the shopping list should be done by comparing ingredient names against the user's pantry_items rows at query time, not by a flag on a shared table.

3. Schema: nullable columns that should not be null

schema.ts — most content columns have no .notNull():

- recipes.name — a recipe with no name is useless
- sections.name
- ingredients.name
- mealPlanEntries.meal — the enum column is nullable (mealEnum() with no .notNull()), so you can insert a meal plan entry with no meal type, which makes no semantic sense

4. Denormalized recipeId on steps and ingredients

schema.ts:42, 53 — both steps and ingredients have a recipeId column and a sectionId column. A section already belongs to a recipe, so recipeId on these tables is redundant and creates an inconsistency risk: you could insert a step with
sectionId pointing to section A (recipe X) but recipeId pointing to recipe Y. The query in getRecipe already loads steps and ingredients via sections → steps/ingredients, so the extra recipeId on those tables isn't needed.

5. updateMealEntrySchema is too permissive

schemas/mealPlanner.ts:23-28 — the update schema is built by .partial()-ing addMealEntrySchema, making every field including date and meal optional. The plan says updateMealEntry should only allow updating notes and servings. As written, a
client could change the date or meal type of an existing entry through the update path, which is almost certainly not intended.

6. Error stack trace exposed in production

\_\_root.tsx:19-23 — the errorComponent renders error.error.stack directly in the DOM. Stack traces reveal file paths, line numbers, and internal structure — never expose these in production. Replace with a generic message and log the full error
server-side.

7. latest dependency versions for core packages

package.json:32-36 — @tanstack/react-query, @tanstack/react-router, @tanstack/react-start, @tanstack/react-devtools etc. all pinned to "latest". This means any pnpm install on a fresh machine or in CI can silently pull in a breaking version.
These should be pinned to exact versions or at least ^major.minor.patch.

8. drizzle-kit and shadcn in production dependencies

package.json:18, 49 — drizzle-kit is a CLI tool for migrations and should be in devDependencies. shadcn is also a CLI code-generation tool and has no place in dependencies — it adds weight to the production bundle and signals confusion about
what's runtime vs. tooling.

9. Nightly/hash-pinned build in production dependencies

package.json:44 — "nitro": "npm:nitro-nightly@4.0.0-20251010-091516-7cafddba". A nightly build pinned to a specific CI hash from Oct 2025 is not a stable dependency. It will likely become unreachable over time and carries no guarantees about
API stability or security patches.

10. prettier alongside Biome

package.json:71 — Biome already formats and lints. Having prettier as a devDependency too creates conflicting rules, adds confusion about which tool runs in CI, and means contributors might get different formatting depending on which they run.
Pick one.

11. DATABASE_URL! non-null assertion with no runtime guard

db/index.ts:7 — the ! silences TypeScript but does nothing at runtime. If DATABASE_URL is missing (wrong env, misconfigured deploy), the error you get will be a cryptic Neon connection failure deep in the driver, not a clear "DATABASE_URL is
not set" message. A small if (!process.env.DATABASE_URL) throw new Error(...) at module load would make every deploy failure immediately obvious.

12. relations merged into schema in the Drizzle client

db/index.ts:8 — { schema: { ...schema, ...relations } } spreads both into the Drizzle schema object. Relations are not schema — they're metadata Drizzle uses for the relational query API. The conventional pattern is drizzle(sql, { schema })
where schema already re-exports everything from one index file. Merging them this way also means any relation export name collision with a table name would silently shadow one with the other.

13. Missing server-side auth gate (plan item still open, but structurally broken)

plan.todo.md:26 — "Gate planner / pantry / favorites mutations behind SignedIn check on server" is marked unchecked. But the deeper issue is that the current query signatures require userId as input (issue #1), so even when you add the guard,
you'll need to refactor all the query functions to not accept userId from the client at all.

---

Priority order to fix before building more on top:

1. #1 (userId from client) and #2 (inPantry on shared table) — these are correctness/security bugs that will require refactoring later work if not fixed now
2. #5 (updateMealEntry schema) and #3 (nullable columns) — fix in schema/Zod before you push more data
3. #6 (stack trace in prod) — one-line fix
4. #7, #8, #9, #10 — dependency hygiene, sort before you lock a lockfile you'll live with
