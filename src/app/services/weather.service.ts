import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  GeocodingResponse,
  WeatherResponse,
} from '../models/weather.interface';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly API_KEY = 'aa9634817ebe3afd0329ac192727e2b0';
  private readonly GEO_URL = 'http://api.openweathermap.org/geo/1.0/direct';
  private readonly WEATHER_URL =
    'https://api.openweathermap.org/data/2.5/weather';

  getCoords(city: string, limit: number = 5): Observable<GeocodingResponse> {
    const url = `${this.GEO_URL}?q=${encodeURIComponent(city)}&limit=${limit}&appid=${this.API_KEY}`;

    return this.http.get<GeocodingResponse[]>(url).pipe(
      map((response) => {
        if (!response || response.length === 0) {
          throw new Error('Ciudad no encontrada');
        }
        return response[0];
      }),
      catchError((error) =>
        throwError(() => new Error('Error al buscar la ciudad'))
      )
    );
  }

  getCurrentWeather(lat: number, lon: number): Observable<WeatherResponse> {
    const url = `${this.WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${this.API_KEY}`;

    return this.http
      .get<WeatherResponse>(url)
      .pipe(
        catchError((error) =>
          throwError(() => new Error('Error al obtener datos del clima'))
        )
      );
  }

  searchCityWeather(
    cityName: string
  ): Observable<{ coords: GeocodingResponse; weather: WeatherResponse }> {
    return this.getCoords(cityName).pipe(
      map((coords) => ({ coords, weather: null as any })),
      catchError((error) => throwError(() => error))
    );
  }
}
