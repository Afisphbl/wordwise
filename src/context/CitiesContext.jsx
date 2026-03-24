import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

const API_URL = "http://localhost:9000/";

export const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}cities`);
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}cities/${id}`);
      const data = await response.json();
      setCurrentCity(data);
    } catch (error) {
      console.error("Error fetching city:", error);
    } finally {
      setLoading(false);
    }
  }

  const value = { cities, loading, currentCity, getCity };

  return (
    <CitiesContext.Provider value={value}>{children}</CitiesContext.Provider>
  );
};

export const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("useCities must be used within a CitiesProvider");
  return context;
};
