import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericHttpService } from '../../common/services/generic-http.service';
import { PlanModel } from '../models/plan.model';

@Injectable({
    providedIn: 'root'
})
export class PlanService extends GenericHttpService<PlanModel> {
    constructor(http: HttpClient) {
        super(http, 'Plan');
    }

    getCuratedPlans(): Observable<PlanModel[]> {
        return this.get<PlanModel[]>(`${this.apiUrl}/curated`);
    }

    getMyPlans(): Observable<PlanModel[]> {
        return this.get<PlanModel[]>(`${this.apiUrl}/my-plans`);
    }

    getPlanById(id: number): Observable<PlanModel> {
        return this.getById(id);
    }

    clonePlan(sourcePlanId: number, newPlanName: string): Observable<PlanModel> {
        return this.post<PlanModel>(`${this.apiUrl}/clone`, {
            sourcePlanId,
            newPlanName
        });
    }

    createPlan(plan: any): Observable<PlanModel> {
        return this.create(plan);
    }

    updatePlan(id: number, plan: any): Observable<void> {
        return this.update(id, plan);
    }

    deletePlan(id: number): Observable<void> {
        return this.delete(id);
    }

    submitPlanForCuration(id: number): Observable<void> {
        return this.post<void>(`${this.apiUrl}/${id}/submit-for-curation`, {});
    }
} 