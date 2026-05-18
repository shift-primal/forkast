from uuid import UUID
from sqlmodel import Field, SQLModel


class Recipe(SQLModel, table=True):
    id: UUID = Field(primary_key=True)
    name: str | None = None
    description: str | None = None
    serving_size_people: int | None = None
    serving_size_is_pieces: bool = False
    time_estimate: int | None = None
    time_estimate_total: int | None = None
    difficulty_level: int | None = None
    image_id: str | None = None
    video_id: str | None = None
    number_of_ratings: int | None = None
    average_rating: float | None = None


class Section(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    recipe_id: UUID = Field(foreign_key="recipe.id")
    name: str | None = None
    sort_index: int | None = None


class Step(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    recipe_id: UUID = Field(foreign_key="recipe.id")
    section_id: int = Field(foreign_key="section.id")
    description: str | None = None
    sort_index: int | None = None
    tip: str | None = None
    image_id: str | None = None


class Ingredient(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    recipe_id: UUID = Field(foreign_key="recipe.id")
    section_id: int = Field(foreign_key="section.id")
    name: str | None = None
    sort_index: int | None = None
    in_pantry: bool = False
    amount: float | None = None
    unit: str | None = None
    measurement_value: float | None = None
    measurement_type: str | None = None
    additional_info: str | None = None
