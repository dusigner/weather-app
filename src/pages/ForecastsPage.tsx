// ForecastsPage.tsx

import React, { useState, useEffect } from 'react';
import { Location } from '../types/models';
import ForecastCard from '../components/ForecastCard';
import { fetchWeatherData } from '../api/weatherApi';

export interface ForecastsPageProps {
  locations: Location[];
}

const ForecastsPage: React.FC<ForecastsPageProps> = ({ locations }) => {
  const [currentLocation, setCurrentLocation] = useState<GeolocationCoordinates | null>(null);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        setCurrentLocation(position.coords);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido ao obter geolocalização');
        }
      }
    };

    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchWeatherDataForLocations = async () => {
      if (locations.length > 0 || currentLocation) {
        try {
          const weatherDataForLocations = await Promise.all(
            locations.map(async (location) => {
              const data = await fetchWeatherData(location.latitude, location.longitude);
              return { key: `${location.latitude}-${location.longitude}`, forecast: data };
            })
          );

          if (currentLocation) {
            const currentLocationData = await fetchWeatherData(
              currentLocation.latitude,
              currentLocation.longitude
            );

            weatherDataForLocations.push({
              key: 'current-location',
              forecast: currentLocationData,
            });
          }

          setWeatherData(weatherDataForLocations);
        } catch (error) {
          setError('Erro ao buscar dados meteorológicos para as localizações');
        }
      }
    };

    fetchWeatherDataForLocations();
  }, [locations, currentLocation]);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '20px' }}>
      {/* Cards de Previsão do Tempo */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {error && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            <p>Erro: {error}</p>
          </div>
        )}

        {weatherData && weatherData.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {weatherData.map(({ key, forecast }: { key: string; forecast: any }, index: number) => (
              <div key={key} style={{ flex: '1 0 324px', marginBottom: '20px', minWidth: '300px' }}>
                <ForecastCard
                  forecast={forecast}
                  locationName={index === weatherData.length - 1 ? 'Localização Atual' : locations[index].label}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastsPage;