import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './generic-http.service';

export interface ServiceConfig {
  endpoint: string;
  modelType: string;
}

export interface ServiceRegistry {
  [key: string]: ServiceConfig;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceFactoryService {
  private serviceCache = new Map<string, any>();
  private serviceRegistry: ServiceRegistry = {};

  constructor(
    private injector: Injector,
    private http: HttpClient
  ) {
    this.initializeServiceRegistry();
  }

  /**
   * Registers a service configuration.
   */
  registerService(key: string, config: ServiceConfig): void {
    this.serviceRegistry[key] = config;
  }

  /**
   * Creates or retrieves a cached service instance.
   */
  createService<T>(key: string): GenericHttpService<T> {
    if (this.serviceCache.has(key)) {
      return this.serviceCache.get(key);
    }

    const config = this.serviceRegistry[key];
    if (!config) {
      throw new Error(`Service configuration not found for key: ${key}`);
    }

    const service = new GenericHttpService<T>(this.http, config.endpoint);
    this.serviceCache.set(key, service);
    return service;
  }

  /**
   * Creates a service with a custom endpoint.
   */
  createServiceWithEndpoint<T>(endpoint: string): GenericHttpService<T> {
    return new GenericHttpService<T>(this.http, endpoint);
  }

  /**
   * Gets a service from the cache.
   */
  getService<T>(key: string): GenericHttpService<T> | null {
    return this.serviceCache.get(key) || null;
  }

  /**
   * Removes a service from the cache.
   */
  removeService(key: string): boolean {
    return this.serviceCache.delete(key);
  }

  /**
   * Clears all cached services.
   */
  clearCache(): void {
    this.serviceCache.clear();
  }

  /**
   * Gets all registered service configurations.
   */
  getServiceRegistry(): ServiceRegistry {
    return { ...this.serviceRegistry };
  }

  /**
   * Initializes the service registry with common services.
   */
  private initializeServiceRegistry(): void {
    this.registerService('recipe', {
      endpoint: 'recipe',
      modelType: 'RecipeModel'
    });

    this.registerService('shopping-list', {
      endpoint: 'ShoppingList',
      modelType: 'ShoppingListModel'
    });

    this.registerService('meal-plan', {
      endpoint: 'MealPlan',
      modelType: 'MealPlanModel'
    });

    this.registerService('plan', {
      endpoint: 'Plan',
      modelType: 'PlanModel'
    });

    this.registerService('person', {
      endpoint: 'Person',
      modelType: 'PersonModel'
    });

    this.registerService('household', {
      endpoint: 'Household',
      modelType: 'HouseholdModel'
    });

    this.registerService('curation', {
      endpoint: 'Curation',
      modelType: 'CurationModel'
    });

    this.registerService('privacy', {
      endpoint: 'Privacy',
      modelType: 'PrivacyModel'
    });

    this.registerService('restriction', {
      endpoint: 'Restriction',
      modelType: 'RestrictionModel'
    });

    this.registerService('invitation', {
      endpoint: 'Invitation',
      modelType: 'InvitationModel'
    });

    this.registerService('messaging', {
      endpoint: 'Messaging',
      modelType: 'MessagingModel'
    });

    this.registerService('user-management', {
      endpoint: 'UserManagement',
      modelType: 'UserManagementModel'
    });

    this.registerService('reference', {
      endpoint: 'Reference',
      modelType: 'ReferenceModel'
    });
  }
}