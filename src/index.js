import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector(`#search-box`);
const countryList = document.querySelector(`.country-list`);
const countryInfo = document.querySelector(`.country-info`);

countryInput.addEventListener(
  `input`,
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput(evt) {
  const countryName = evt.target.value.trim();
  countryList.innerHTML = ``;
  countryInfo.innerHTML = ``;

  if (countryName === ``) {
    return;
  }

  fetchCountries(countryName)
    .then(response => {
      if (response.length > 10) {
        Notiflix.Notify.info(
          `too many matches found. Please enter a more specific name.`
        );
        return response;
      }
      const marking = markupCountries(response);
      addMarkupOnFirstPage(marking);
      if (response.length !== 1) {
        return;
      }
      addMarkupOnSecondPage(markupCountry(response));
      document.querySelector(`.country`).classList.add(`country__item`);
    })
    .catch(() => {
      Notiflix.Notify.failure(`Oops, there is no country with that name`);
    });
}

function markupCountries(response) {
  return response
    .map(({ name, flags: { svg } }) => {
      return `
    <li class='country'>
      <img src="${svg}" alt="" width="100">
      <p class="name-countries">${name}</p>
    </li>
    `;
    })
    .join(``);
}
function markupCountry(response) {
  return response
    .map(({ capital, languages, population }) => {
      const language = languages.map(el => {
        return el.name;
      });
      return `
  <ul class="list-info">
    <li class="list"><span class="name">Capital</span> - ${capital}</li>
    <li class="list"><span class="name">Population</span> - ${population}</li>
    <li class="list"><span class="name">Languages</span> - ${language.join(
      ', '
    )}</li>
  </ul>
    `;
    })
    .join('');
}

function addMarkupOnFirstPage(markup) {
  countryList.innerHTML = markup;
}

function addMarkupOnSecondPage(markup) {
  countryInfo.innerHTML = markup;
}
