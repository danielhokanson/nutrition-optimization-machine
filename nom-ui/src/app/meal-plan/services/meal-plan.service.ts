import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GenericHttpService } from "../../common/services/generic-http.service";
import {
    MealPlanCreateRequestModel,
    MealPlanCreateResponseModel,
    MealPlanResponseModel,
    MealPlanUpdateRequestModel,
    MealPlanRuleCreateRequestModel,
    MealPlanRuleCreateResponseModel,
    MealPlanRuleResponseModel,
} from "../models/meal-plan.model";

@Injectable({
    providedIn: "root",
})
export class MealPlanService extends GenericHttpService<MealPlanResponseModel> {
    constructor(http: HttpClient) {
        super(http, "MealPlan");
    }

    createMealPlan(request: MealPlanCreateRequestModel): Observable<MealPlanCreateResponseModel> {
        return this.post<MealPlanCreateResponseModel>(`${this.apiUrl}`, request);
    }

    getMealPlan(id: number): Observable<MealPlanResponseModel> {
        return this.getById(id);
    }

    updateMealPlan(id: number, request: MealPlanUpdateRequestModel): Observable<MealPlanResponseModel> {
        return this.update(id, request);
    }

    deleteMealPlan(id: number): Observable<any> {
        return this.delete(id);
    }

    createRule(request: MealPlanRuleCreateRequestModel): Observable<MealPlanRuleCreateResponseModel> {
        return this.post<MealPlanRuleCreateResponseModel>(`${this.apiUrl}/rule`, request);
    }

    getRule(id: number): Observable<MealPlanRuleResponseModel> {
        return this.get<MealPlanRuleResponseModel>(`${this.apiUrl}/rule/${id}`);
    }

    deleteRule(id: number): Observable<any> {
        return this.delete<any>(`${this.apiUrl}/rule/${id}`);
    }
} 