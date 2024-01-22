// ForecastCard.tsx

import React from 'react';

interface ForecastCardProps {
  forecast: any;
  locationName: string;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, locationName }) => {
  const { current, timezone, generationtime_ms, utc_offset_seconds } = forecast;

  const getWeatherCondition = (weatherCode: number) => {
    switch (weatherCode) {
      case 1:
        return 'Ensolarado';
      case 2:
        return 'Parcialmente Nublado';
      case 3:
        return 'Nublado';
      case 4:
        return 'Chuvoso';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div style={{ margin: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <h3>{locationName}</h3>
      <p>Temperatura Atual: {current.temperature_2m} °C</p>
      <p>Umidade Relativa: {current.relative_humidity_2m} %</p>
      <p>Sensação Térmica: {current.apparent_temperature} °C</p>
      <p>Chovendo: {current.precipitation} mm/h</p>
      <p>Condição do Tempo: {getWeatherCondition(current.weather_code)}</p>
      <p>Cobertura de Nuvens: {current.cloud_cover} %</p>
      <p>Pressão ao Nível do Mar: {current.pressure_msl} hPa</p>
      <p>Velocidade do Vento: {current.wind_speed_10m} km/h</p>
      <p>Direção do Vento: {current.wind_direction_10m} °</p>
      <p>Rajadas de Vento: {current.wind_gusts_10m} km/h</p>
      <p>Horário Atualizado: {new Date(current.time).toLocaleTimeString()}</p>
      <p>UTC Offset: {utc_offset_seconds / 3600} horas</p>
      <p>Fuso Horário: {timezone}</p>
      <p>Altitude: {forecast.elevation} metros</p>
    </div>
  );
};

export default ForecastCard;
