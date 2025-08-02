import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GenericHttpService } from "../../common/services/generic-http.service";
import {
    ShoppingListCreateRequestModel,
    ShoppingListCreateResponseModel,
    ShoppingListResponseModel,
    ShoppingListItemCreateRequestModel,
    ShoppingListItemUpdateRequestModel,
    ShoppingListItemResponseModel,
} from "../models/shopping.model";

@Injectable({
    providedIn: "root",
})
export class ShoppingService extends GenericHttpService<ShoppingListResponseModel> {
    constructor(http: HttpClient) {
        super(http, "ShoppingList");
    }

    createShoppingList(request: ShoppingListCreateRequestModel): Observable<ShoppingListCreateResponseModel> {
        return this.post<ShoppingListCreateResponseModel>(`${this.apiUrl}`, request);
    }

    getShoppingList(id: number): Observable<ShoppingListResponseModel> {
        return this.getById(id);
    }

    updateShoppingList(id: number, request: ShoppingListCreateRequestModel): Observable<ShoppingListResponseModel> {
        return this.update(id, request);
    }

    deleteShoppingList(id: number): Observable<any> {
        return this.delete(id);
    }

    addItem(request: ShoppingListItemCreateRequestModel): Observable<ShoppingListItemResponseModel> {
        return this.post<ShoppingListItemResponseModel>(`${this.apiUrl}/item`, request);
    }

    updateItem(id: number, request: ShoppingListItemUpdateRequestModel): Observable<ShoppingListItemResponseModel> {
        return this.put<ShoppingListItemResponseModel>(`${this.apiUrl}/item/${id}`, request);
    }

    deleteItem(id: number): Observable<any> {
        return this.delete<any>(`${this.apiUrl}/item/${id}`);
    }
} 