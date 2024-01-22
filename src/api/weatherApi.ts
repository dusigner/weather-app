// weatherApi.ts

import axios from 'axios';

const API_BASE_URL_FORECAST = 'https://api.open-meteo.com/v1/forecast';
const API_PARAMETERS = 'current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m';

const API_BASE_URL_SEARCH = 'https://geocoding-api.open-meteo.com/v1/search';

export const fetchWeatherDataByLocation = async (location: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_SEARCH}?name=${location}&count=10&language=pt&format=json`
    );

    const results = response.data.results || [];

    return results
    
  } catch (error) {
    console.error('Erro ao buscar dados meteorológicos por localização:', error);
    throw error;
  }
};

export const fetchWeatherData = async (latitude: number, longitude: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_FORECAST}?latitude=${latitude}&longitude=${longitude}&${API_PARAMETERS}&hourly=temperature_2m&timezone=America%2FSao_Paulo`
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados meteorológicos:', error);
    throw error;
  }
};
