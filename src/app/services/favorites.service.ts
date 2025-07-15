import { Injectable, signal, computed } from '@angular/core';
import { FavoriteCity } from '../models/weather.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'weather-favorites';
  private readonly favorites = signal<FavoriteCity[]>(this.loadFromStorage());

  readonly favoriteCities = this.favorites.asReadonly();
  readonly favoritesCount = computed(() => this.favorites().length);

  addFavorite(city: Omit<FavoriteCity, 'id' | 'addedAt'>): void {
    const newFavorite: FavoriteCity = {
      ...city,
      id: this.generateId(),
      addedAt: new Date(),
    };

    const current = this.favorites();
    const exists = current.some(
      (fav) =>
        fav.name.toLowerCase() === city.name.toLowerCase() &&
        fav.country === city.country
    );

    if (!exists) {
      this.favorites.set([...current, newFavorite]);
      this.saveToStorage();
    }
  }

  removeFavorite(id: string): void {
    this.favorites.update((current) => current.filter((fav) => fav.id !== id));
    this.saveToStorage();
  }

  isFavorite(cityName: string, country: string): boolean {
    return this.favorites().some(
      (fav) =>
        fav.name.toLowerCase() === cityName.toLowerCase() &&
        fav.country === country
    );
  }

  private loadFromStorage(): FavoriteCity[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites()));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
