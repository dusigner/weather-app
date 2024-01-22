// index.ts
import { atom, useAtom } from 'jotai';

export const locationAtom = atom({ latitude: 0, longitude: 0 });

export const useLocation = () => {
  const [location, setLocation] = useAtom(locationAtom);
  return { location, setLocation };
};
