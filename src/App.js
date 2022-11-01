import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { getCityList, getWeatherByCoordinates } from './api/openWeather';

const StyledInputText = styled.input`
  width: 200px;
  padding: 5px 10px;
  font-size: 24px;
`
const StyledDropDownUl = styled.ul`
  width: 200px;
  margin: 0;
  padding: 0;
  border: 1px solid #ccc;
  li {
    padding: 5px 10px;
    list-style: none;
    cursor: initial;
    user-select: none;
    &:hover {
      background-color: #faa;
    }
  }
`

function InputDropDownMenu({ onSelected }) {
  const debounceSetState = useMemo(() => {
    return _.debounce((inputValue, setFunc) => {
      setFunc(inputValue);
    }, 1000)
  }, [])
  const [needToFetch, setNeedToFetch] = useState(true)

  // 查詢城市 - Start
  const [cityNameInput, setCityNameInput] = useState('')
  const [cityNameToFetch, setCityNameToFetch] = useState('')
  const handleChange = (event) => {
    setCityNameInput(event.target.value)
    debounceSetState(event.target.value, setCityNameToFetch)
  }
  const [cityList, setCityList] = useState([])
  useEffect(() => {
    const fetchCityList = () => {
      getCityList({
        cityName: cityNameToFetch,
      }).then((response) => {
        setCityList(response.data)
      })
    }
    if (needToFetch && cityNameToFetch !== '') {
      fetchCityList()
    }
  }, [needToFetch, cityNameToFetch])
  // 查詢城市 - End

  // 查詢城市天氣 - Start
  const [citySelected, setCitySelected] = useState({})
  const onCityBeSelected = (item) => {
    setCitySelected(item)
    setCityNameInput(item.name)
    setCityList([])
    setNeedToFetch(false)
    onSelected(item)
  }
  // 查詢城市天氣 - End

  return (
    <div>
      <StyledInputText
        type="text"
        value={cityNameInput}
        onChange={(event) => handleChange(event)}
        onKeyDown={() => setNeedToFetch(true)}
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
      <h1>查詢城市：{citySelected.name}</h1>
    </div>
  )
}

function App() {
  const [weatherData, setWeatherData] = useState({})
  const fetchWeatherData = (item) => {
    getWeatherByCoordinates(item).then((response) => {
      setWeatherData(response.data)
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          天氣預報
        </p>
      </header>
      <InputDropDownMenu onSelected={fetchWeatherData} />
      <h2>{weatherData.timezone}</h2>
    </div>
  );
}

export default App;
