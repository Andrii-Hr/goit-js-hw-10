const BASE_URL = 'https://restcountries.com/v2';
const options = {};

export function fetchCountries(name) {
  return fetch(
    `${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`,
    options
  ).then(response => {
    if (!response.ok) {
      throw new Error(error);
    }
    return response.json();
  });
}
