// AddForecastPage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import ForecastsPage, { ForecastsPageProps } from './ForecastsPage';
import { Location } from '../types/models';
import { fetchWeatherDataByLocation, fetchWeatherData } from '../api/weatherApi';

const LOCAL_STORAGE_KEY = 'selectedLocations';

const AddForecastPage: React.FC = () => {
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(false);
  const [currentLocationData, setCurrentLocationData] = useState<Location | null>(null);

  useEffect(() => {
    // Carregar localizações salvas no localStorage
    const storedLocations = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedLocations) {
      setSelectedLocations(JSON.parse(storedLocations));
    }
  }, []);

  useEffect(() => {
    // Salvar localizações no localStorage sempre que houver uma alteração
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedLocations));
  }, [selectedLocations]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {

        const response = await fetchWeatherDataByLocation(searchQuery)

        const results = response.map((result: any) => ({
          value: result.name,
          label: `${result.name} - ${result.admin1}, ${result.country}`,
          city: result.admin1,
          country: result.country,
          latitude: result.latitude,
          longitude: result.longitude,
        }));
        setSearchResults(results);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(`Erro ao buscar localização: ${error.message}`);
        }
      }
    };

    if (searchQuery.trim() !== '') {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const response = await fetchWeatherData(position.coords.latitude, position.coords.longitude);

        const currentLocationData: Location = {
          value: '',
          label: `${response.timezone}`,
          city: '',
          country: '',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setCurrentLocationData(currentLocationData);
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

  const handleSelectLocation = async (location: Location) => {
    setLoadingWeather(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // TODO: Buscar dados meteorológicos aqui (pode precisar de ajustes)
      setLoadingWeather(false);
  
      setSelectedLocations((prevLocations) => [...prevLocations, location]);
      setSearchQuery('');
    } catch (error) {
      setLoadingWeather(false);
      console.error('Erro ao buscar dados meteorológicos:', error);
    }
  };

  const handleRemoveLocation = (location: Location) => {
    const updatedLocations = selectedLocations.filter((l) => l !== location);
    setSelectedLocations(updatedLocations);
  };

  const handleShowWeatherData = () => {
    if (selectedLocations.length > 0) {
      return <ForecastsPage locations={selectedLocations as ForecastsPageProps['locations']} />;
    } else {
      return <p>Selecione pelo menos uma localização para ver os dados meteorológicos.</p>;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Barra Lateral */}
      <div style={{ flex: 1 }}>
        <h2>Previsão do Tempo</h2>

        <label>
          Buscar Localização:
          <Select
            value={null}
            options={searchResults}
            onChange={(selectedOption: any) => handleSelectLocation(selectedOption)}
            onInputChange={(inputValue) => setSearchQuery(inputValue)}
          />
        </label>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <h3>Localização Atual:</h3>
        <ul>
          {currentLocationData && (
            <li>{currentLocationData.label}</li>
          )}
        </ul>

        <hr />

        <h3>Localizações Adicionadas:</h3>
        <ul>
          {selectedLocations.map((location, index) => (
            <li key={index}>
              {location && location.label && (
                <>
                  {location.label} - ({location.city}, {location.country})
                  <button onClick={() => handleRemoveLocation(location)}>Remover</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Cards de Previsão do Tempo */}
      <div style={{ flex: 2 }}>
        <div>
          {handleShowWeatherData()}
        </div>
      </div>
    </div>
  );
};

export default AddForecastPage;
