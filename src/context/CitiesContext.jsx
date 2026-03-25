import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const CitiesContext = createContext();

const API_URL = "http://localhost:9000/";

const initialCity = {
  cities: [],
  loading: false,
  currentCity: {},
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOADING_START":
      return {
        ...state,
        loading: true,
      };

    case "GET_CITY":
      return {
        ...state,
        cities: action.payload,
        loading: false,
      };

    case "GET_CURRENT_CITY":
      return {
        ...state,
        currentCity: action.payload,
        loading: false,
      };

    case "CREATE_CITY":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        loading: false,
        currentCity: action.payload,
      };

    case "DELETE_CITY":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        loading: false,
        currentCity: {},
      };

    case "REJECTED":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const CitiesProvider = ({ children }) => {
  const [{ cities, loading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialCity,
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "LOADING_START" });
      try {
        const response = await fetch(`${API_URL}cities`);
        const data = await response.json();
        dispatch({ type: "GET_CITY", payload: data });
      } catch {
        dispatch({ type: "REJECTED", payload: "Error fetching cities" });
      }
    }

    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (currentCity.id === +id) return;
      dispatch({ type: "LOADING_START" });
      try {
        const response = await fetch(`${API_URL}cities/${id}`);
        const data = await response.json();
        dispatch({ type: "GET_CURRENT_CITY", payload: data });
      } catch {
        dispatch({ type: "REJECTED", payload: "Error gettings city" });
      }
    },
    [currentCity.id],
  );

  async function createCity(newCity) {
    dispatch({ type: "LOADING_START" });
    try {
      const response = await fetch(`${API_URL}cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await response.json();

      dispatch({ type: "CREATE_CITY", payload: data });
    } catch {
      dispatch({ type: "REJECTED", payload: "Error creating city" });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "LOADING_START" });
    try {
      await fetch(`${API_URL}cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "DELETE_CITY", payload: id });
    } catch {
      dispatch({ type: "REJECTED", payload: "Error deleting city" });
    }
  }

  const value = {
    cities,
    loading,
    currentCity,
    error,
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
