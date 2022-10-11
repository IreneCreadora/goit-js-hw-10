const BASE_URL = 'https://restcountries.com/v3.1/name';

const searchParams = new URLSearchParams({
  fields: ['name', 'capital', 'population', 'flags', 'languages'],
});

export async function fetchCountries(countryName) {
  try {
    const response = await fetch(`${BASE_URL}/${countryName}?${searchParams}`);
    const countryInfo = await response.json();

    return countryInfo;
  } catch (error) {
    if (!response.ok) {
      throw new Error(response.status);
    }
  }
}
