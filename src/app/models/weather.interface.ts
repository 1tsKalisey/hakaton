export interface GeocodingResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
  sys: {
    country: string;
  };
}

export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  temperature?: number;
  addedAt: Date;
}
