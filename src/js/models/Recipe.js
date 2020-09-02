import axios from "axios";
import { api, requestRecipeID } from "../config";

export default class Recipie {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const resolve = await axios(`${api}${requestRecipeID}${this.id}`);
      this.title = resolve.data.recipe.title;
      this.author = resolve.data.recipe.publisher;
      this.img = resolve.data.recipe.image_url;
      this.url = resolve.data.recipe.source_url;
      this.ingredients = resolve.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  calcTime() {
    // Assuming that we need 15 min per each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
    ];
    const unitsShort = ["tbsb", "tbsb", "oz", "oz", "tsp", "cup", "pound"];
    const units = [...unitsShort, "kg", "g"];

    const newIngredients = this.ingredients.map((el) => {
      // 1) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      // 2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
      // 3) Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((word) => units.includes(word));

      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit, but 1st element is a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        // There is no unit and no numnber
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;
    // Ingredients
    this.ingredients.forEach((ing) => {
      ing.count *= newServings / this.servings;
    });
    this.servings = newServings;
  }
}
