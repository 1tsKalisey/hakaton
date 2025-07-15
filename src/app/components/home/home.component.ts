import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { FavoritesService } from '../../services/favorites.service';
import {
  GeocodingResponse,
  WeatherResponse,
} from '../../models/weather.interface';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly weatherService = inject(WeatherService);
  private readonly favoritesService = inject(FavoritesService);

  protected readonly cityControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
  ]);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly currentWeather = signal<WeatherResponse | null>(null);
  protected readonly currentCoords = signal<GeocodingResponse | null>(null);

  onSubmit(): void {
    if (this.cityControl.invalid) return;
    const cityName = this.cityControl.value!.trim();
    console.log('Buscando clima para:', cityName);
    this.isLoading.set(true);
    this.error.set(null);
    this.currentWeather.set(null);

    this.weatherService.getCoords(cityName).subscribe({
      next: (coords) => {
        console.log('Coordenadas recibidas:', coords);
        this.currentCoords.set(coords);
        this.weatherService.getCurrentWeather(coords.lat, coords.lon).subscribe({
          next: (weather) => {
            console.log('Clima recibido:', weather);
            this.currentWeather.set(weather);
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Error al obtener datos del clima:', error);
            this.error.set(error.message);
            this.isLoading.set(false);
          },
        });
      },
      error: (error) => {
        console.error('Error al buscar la ciudad:', error);
        this.error.set(error.message);
        this.isLoading.set(false);
      },
    });
  }

  addToFavorites(): void {
    const weather = this.currentWeather();
    const coords = this.currentCoords();

    if (weather && coords) {
      this.favoritesService.addFavorite({
        name: weather.name,
        country: weather.sys.country,
        lat: coords.lat,
        lon: coords.lon,
        temperature: Math.round(weather.main.temp),
      });
    }
  }

  isFavorite(): boolean {
    const weather = this.currentWeather();
    return weather
      ? this.favoritesService.isFavorite(weather.name, weather.sys.country)
      : false;
  }
}

