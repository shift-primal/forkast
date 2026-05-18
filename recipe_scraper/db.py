from uuid import UUID
from sqlmodel import SQLModel, Session, create_engine
from config import DATABASE_URL
from schema import Ingredient, Recipe, Section, Step

engine = create_engine(DATABASE_URL)


def create_db() -> None:
    SQLModel.metadata.create_all(engine)


def save_all(session: Session, recipe: dict) -> None:
    new_recipe: Recipe = save_recipe(session, recipe)
    recipe_id: UUID = new_recipe.id

    sections = recipe.get("recipeDetails", [])

    for section in sections:
        new_section: Section = save_section(session, recipe_id, section)
        session.flush()

        section_id = new_section.id

        steps = section.get("recipeSteps", [])
        ingredients = section.get("ingredients", [])

        assert section_id is not None

        for step in steps:
            save_step(session, recipe_id, section_id, step)

        for ingredient in ingredients:
            save_ingredient(session, recipe_id, section_id, ingredient)

    print(f"Saved recipe {new_recipe.name}!")


def save_recipe(session: Session, recipe: dict) -> Recipe:
    new_recipe: Recipe = Recipe(
        id=recipe["id"],
        name=recipe.get("name"),
        description=recipe.get("description"),
        serving_size_people=recipe.get("numberOfPersons"),
        serving_size_is_pieces=recipe.get("numberOfPersonsMeansPieces", False),
        time_estimate=recipe.get("timeEstimate"),
        time_estimate_total=recipe.get("timeEstimateTotal"),
        difficulty_level=recipe.get("difficultyEstimate"),
        image_id=recipe.get("media", {}).get("imageId"),
        video_id=recipe.get("media", {}).get("videoUrl"),
        number_of_ratings=recipe.get("rating", {}).get("numberOfRatings"),
        average_rating=recipe.get("rating", {}).get("averageRating"),
    )

    existing = session.get(Recipe, new_recipe.id)
    if existing:
        return existing

    session.add(new_recipe)

    return new_recipe


def save_section(session: Session, recipe_id: UUID, section: dict) -> Section:
    new_section: Section = Section(
        recipe_id=recipe_id,
        name=section.get("name"),
        sort_index=section["sortIndex"],
    )

    session.add(new_section)

    return new_section


def save_step(session: Session, recipe_id: UUID, section_id: int, step: dict) -> None:
    new_step: Step = Step(
        recipe_id=recipe_id,
        section_id=section_id,
        description=step.get("description"),
        sort_index=step.get("sortIndex"),
        tip=step.get("tip"),
        image_id=step.get("imageId"),
    )

    session.add(new_step)


def save_ingredient(
    session: Session, recipe_id: UUID, section_id: int, ingredient: dict
) -> None:
    new_ingredient: Ingredient = Ingredient(
        recipe_id=recipe_id,
        section_id=section_id,
        name=ingredient.get("name"),
        sort_index=ingredient.get("sortIndex"),
        in_pantry=ingredient.get("inpantry", False),
        amount=ingredient.get("amount"),
        unit=ingredient.get("unit"),
        measurement_value=ingredient.get("measurementValue"),
        measurement_type=ingredient.get("measurementType"),
        additional_info=ingredient.get("additionalinfo"),
    )

    session.add(new_ingredient)
