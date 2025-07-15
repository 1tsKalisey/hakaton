import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
// Se quita TranslateModule
import { DatePipe } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { WeatherService } from '../../services/weather.service';
import { FavoriteCity } from '../../models/weather.interface';

@Component({
  selector: 'app-favorites',
  imports: [DatePipe], // Se quita TranslateModule
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent implements OnInit {
  private readonly favoritesService = inject(FavoritesService);
  private readonly weatherService = inject(WeatherService);

  protected readonly favorites = this.favoritesService.favoriteCities;
  protected readonly isLoading = signal(false);
  protected readonly updatingWeather = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.updateAllWeatherData();
  }

  removeFavorite(id: string): void {
    this.favoritesService.removeFavorite(id);
  }

  updateWeather(favorite: FavoriteCity): void {
    this.updatingWeather.update((set) => new Set(set.add(favorite.id)));

    this.weatherService
      .getCurrentWeather(favorite.lat, favorite.lon)
      .subscribe({
        next: (weather) => {
          this.updatingWeather.update((set) => {
            const newSet = new Set(set);
            newSet.delete(favorite.id);
            return newSet;
          });
        },
        error: () => {
          this.updatingWeather.update((set) => {
            const newSet = new Set(set);
            newSet.delete(favorite.id);
            return newSet;
          });
        },
      });
  }

  private updateAllWeatherData(): void {
    if (this.favorites().length === 0) return;

    this.isLoading.set(true);

    // Simulación sencilla
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }

  isUpdating(id: string): boolean {
    return this.updatingWeather().has(id);
  }
}
