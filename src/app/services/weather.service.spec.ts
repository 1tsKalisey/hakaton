import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import {
  GeocodingResponse,
  WeatherResponse,
} from '../models/weather.interface';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService],
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get coordinates for a city', () => {
    const mockGeoResponse: GeocodingResponse[] = [
      {
        name: 'Madrid',
        lat: 40.4168,
        lon: -3.7038,
        country: 'ES',
      },
    ];

    service.getCoords('Madrid').subscribe((coords) => {
      expect(coords.name).toBe('Madrid');
      expect(coords.lat).toBe(40.4168);
      expect(coords.lon).toBe(-3.7038);
    });

    const req = httpMock.expectOne((req) => req.url.includes('geo/1.0/direct'));
    expect(req.request.method).toBe('GET');
    req.flush(mockGeoResponse);
  });

  it('should handle city not found error', () => {
    service.getCoords('NonExistentCity').subscribe({
      error: (error) => {
        expect(error.message).toBe('Error al buscar la ciudad');
      },
    });

    const req = httpMock.expectOne((req) => req.url.includes('geo/1.0/direct'));
    req.flush([]);
  });

  it('should get weather data', () => {
    const mockWeatherResponse: WeatherResponse = {
      main: {
        temp: 25,
        feels_like: 27,
        humidity: 60,
      },
      weather: [
        {
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      name: 'Madrid',
      sys: {
        country: 'ES',
      },
    };

    service.getCurrentWeather(40.4168, -3.7038).subscribe((weather) => {
      expect(weather.main.temp).toBe(25);
      expect(weather.name).toBe('Madrid');
    });

    const req = httpMock.expectOne((req) =>
      req.url.includes('data/2.5/weather')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockWeatherResponse);
  });
});
