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

  async function createCity(newCity) {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await response.json();

      setCities((prevCities) => [...prevCities, data]);
    } catch (error) {
      console.error("Error creating city:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCity(id) {
    setLoading(true);
    try {
      await fetch(`${API_URL}cities/${id}`, {
        method: "DELETE",
      });
      setCities((prevCities) => prevCities.filter((city) => city.id !== id));
    } catch (error) {
      console.error("Error deleting city:", error);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    cities,
    loading,
    currentCity,
    getCity,
    createCity,
    deleteCity,
  };

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
