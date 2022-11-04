import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { getCityList, getWeatherByCoordinates } from './api/openWeather';
import WeatherChart from './component/WeatherChart';

const StyledWrapper = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  text-align: center;
  padding: 50px;
  background: linear-gradient(145deg, rgba(2,0,36,1) 0%, rgba(235,198,122,1) 0%, rgba(0,206,247,1) 100%);
  h1 {
    color: #fff;
    margin: 0 0 50px 0;
  }
`

const StyledInputDropDownMenuWrap = styled.div`
  display: inline-block;
  position: relative;
`
const StyledQueryCityName = styled.h2`
  color: #fff;
  font-size: 40px;
  line-height: 40px;
  margin-top: 60px;
`
const StyledInputText = styled.input`
  width: 400px;
  background-color: rgba(255, 255, 255, .7);
  border: 2px solid #fff;
  padding: 5px 10px;
  font-size: 24px;
`
const StyledDropDownUl = styled.ul`
  width: 400px;
  margin: 0;
  padding: 0;
  border: 1px solid #fff;
  border-radius: 0 0 5px 5px;
  background-color: #fff;
  position: absolute;
  z-index: 5;

  li {
    padding: 10px 10px;
    list-style: none;
    cursor: initial;
    user-select: none;

    &:hover {
      background-color: rgba(245, 169, 89, 0.68);
    }
  }
`

function InputDropDownMenu({ onSelected }) {
  const debounceSetState = useMemo(() => {
    return _.debounce((inputValue, setFunc) => {
      setFunc(inputValue);
    }, 1000);
  }, []);
  const [needToFetch, setNeedToFetch] = useState(true);

  // 查詢城市 - Start
  const [cityNameInput, setCityNameInput] = useState('');
  const [cityNameToFetch, setCityNameToFetch] = useState('');
  const handleChange = (event) => {
    setCityNameInput(event.target.value);
    debounceSetState(event.target.value, setCityNameToFetch);
  };
  const [cityList, setCityList] = useState([])
  useEffect(() => {
    const fetchCityList = () => {
      getCityList({
        cityName: cityNameToFetch,
      }).then((response) => {
        setCityList(response.data);
      });
    };
    if (needToFetch && cityNameToFetch !== '') {
      fetchCityList();
    }
    if (cityNameToFetch === '') {
      setCityList([])
    }
  }, [needToFetch, cityNameToFetch]);
  // 查詢城市 - End

  // 查詢城市天氣 - Start
  const [citySelected, setCitySelected] = useState({});
  const onCityBeSelected = (item) => {
    setCitySelected(item);
    setCityNameInput(item.name);
    setCityList([]);
    setNeedToFetch(false);
    onSelected(item);
  }
  // 查詢城市天氣 - End

  return (
    <StyledInputDropDownMenuWrap>
      <StyledInputText
        type="text"
        value={cityNameInput}
        onChange={(event) => handleChange(event)}
        onKeyDown={() => setNeedToFetch(true)}
        placeholder="Please enter the city name"
      />
      {cityList.length > 0 && (
        <StyledDropDownUl>
          <>
            {cityList.map((item) => (
              <li
                key={`${item.country}${item.state}${item.name}`}
                onClick={() => onCityBeSelected(item)}
              >
                {item.name}, {item.state}, {item.country}
              </li>
            ))}
          </>
        </StyledDropDownUl>
      )}
      <StyledQueryCityName>{citySelected.name}</StyledQueryCityName>
    </StyledInputDropDownMenuWrap>
  )
}

function App() {
  const [weatherData, setWeatherData] = useState({});
  const fetchWeatherData = (item) => {
    getWeatherByCoordinates(item).then((response) => {
      console.log(response.data);
      setWeatherData({
        ...response.data,
        daily: response.data.daily.slice(0, 4),
      });
    });
  };

  return (
    <StyledWrapper className="App">
      <header className="App-header">
        <h1>
          Weather
        </h1>
      </header>
      <InputDropDownMenu onSelected={fetchWeatherData} />
      {Object.keys(weatherData).length !== 0 && (
        <WeatherChart weatherData={weatherData} />
      )}
    </StyledWrapper>
  );
}

export default App;
