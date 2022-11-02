import axios from 'axios';

// api key 真正實作時應該放在後端，避免被其他人使用。
const apiKey = 'fb2843134e75ec6d8731d6b4771dfd32';

const getCityList = ({
  cityName = '',
  stateCode = '',
  countryCode = '',
  limit = 5
}) => {
  return axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`);
}
const getWeatherByCoordinates = ({
  lat = 25.0375198,
  lon = 121.5636796
}) => {
  return axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
}

export {
  getCityList,
  getWeatherByCoordinates,
};
