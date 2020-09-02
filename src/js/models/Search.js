import axios from "axios";
import { api, requestRecipes } from "../config";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const resolve = await axios(`${api}${requestRecipes}${this.query}`);
      this.result = resolve.data.recipes;
    } catch (error) {
      console.log(error);
    }
  }
}
