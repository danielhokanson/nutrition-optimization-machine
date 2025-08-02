// File: nom-ui/src/app/recipe/services/recipe.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GenericHttpService } from '../../common/services/generic-http.service';

import {
  RecipeModel,
  RecipeCreateModel,
  RecipeUpdateModel,
  RecipeCommentModel,
  RecipeRatingModel,
  RecipeCommentCreateModel,
  RecipeRatingCreateModel,
  RecipeRatingUpdateModel
} from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService extends GenericHttpService<RecipeModel> {
  constructor(http: HttpClient) {
    super(http, 'recipe');
  }

  getRecipes(): Observable<RecipeModel[]> {
    return this.getAll();
  }

  getRecipe(id: number): Observable<RecipeModel> {
    return this.getById(id);
  }

  createRecipe(recipe: RecipeCreateModel): Observable<RecipeModel> {
    return this.create(recipe);
  }

  updateRecipe(id: number, recipe: RecipeUpdateModel): Observable<RecipeModel> {
    return this.update(id, recipe);
  }

  deleteRecipe(id: number): Observable<void> {
    return this.delete(id);
  }

  // Recipe Comments
  getComments(recipeId: number): Observable<RecipeCommentModel[]> {
    return this.get<RecipeCommentModel[]>(`${this.apiUrl}/${recipeId}/comments`);
  }

  addComment(comment: RecipeCommentCreateModel): Observable<RecipeCommentModel> {
    return this.post<RecipeCommentModel>(`${this.apiUrl}/${comment.recipeId}/comments`, comment);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.delete<void>(`${this.apiUrl}/comments/${commentId}`);
  }

  // Recipe Ratings
  getRatings(recipeId: number): Observable<RecipeRatingModel[]> {
    return this.get<RecipeRatingModel[]>(`${this.apiUrl}/${recipeId}/ratings`);
  }

  addRating(rating: RecipeRatingCreateModel): Observable<RecipeRatingModel> {
    return this.post<RecipeRatingModel>(`${this.apiUrl}/${rating.recipeId}/ratings`, rating);
  }

  updateRating(ratingId: number, rating: RecipeRatingUpdateModel): Observable<RecipeRatingModel> {
    return this.put<RecipeRatingModel>(`${this.apiUrl}/ratings/${ratingId}`, rating);
  }

  deleteRating(ratingId: number): Observable<void> {
    return this.delete<void>(`${this.apiUrl}/ratings/${ratingId}`);
  }

  // Ingredient methods
  searchIngredients(query: string): Observable<any[]> {
    return this.get<any[]>(`${environment.apiUrl}/ingredient/search?q=${query}`);
  }

  createIngredient(ingredient: any): Observable<any> {
    return this.post<any>(`${environment.apiUrl}/ingredient`, ingredient);
  }

  getIngredientDetails(id: number): Observable<any> {
    return this.get<any>(`${environment.apiUrl}/ingredient/${id}`);
  }

  getMeasurementTypes(): Observable<any[]> {
    return this.get<any[]>(`${environment.apiUrl}/measurement-types`);
  }

  // Recipe search
  searchRecipes(query: string): Observable<RecipeModel[]> {
    return this.get<RecipeModel[]>(`${this.apiUrl}/search?q=${query}`);
  }
}