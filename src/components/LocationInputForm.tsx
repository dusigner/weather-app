import React, { useState } from 'react';
import { Location } from '../types/models';

interface LocationInputFormProps {
  onSubmit: (location: Location) => void;
}

const LocationInputForm: React.FC<LocationInputFormProps> = ({ onSubmit }) => {
  const [location, setLocation] = useState<Location>({
    value: '',
    label: '',
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Lógica para adicionar previsão com coordenadas
    onSubmit(location);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Inputs para latitude e longitude */}
      <button type="submit">Adicionar Previsão</button>
    </form>
  );
};

export default LocationInputForm;
