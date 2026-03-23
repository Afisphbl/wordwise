import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import styles from "./CountryList.module.css";

function CountriesList({ cities, loading }) {
  if (loading) return <Spinner />;

  if (cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  return (
    <ul className={styles.countriesList}>
      {cities.map((city) => (
        <CityItem key={city.id} city={city} />
      ))}
    </ul>
  );
}

export default CountriesList;
