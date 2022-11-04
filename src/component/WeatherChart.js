import styled from 'styled-components';

const colorSet = {
  min: '#88e',
  max: '#e88'
}

const StyledChartWrap = styled.div`
  width: auto;
  height: 500px;
  border: 1px solid #fff;
  background-color: rgba(255, 255, 255, .15);
  padding: 0 20px;
  margin-top: 20px;
  margin-bottom: 140px;
  display: inline-flex;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`
const StyledHint = styled.div`
  color: #fff;
`
const StyledHintContent = styled.div`
  display: inline-flex;
  align-items: center;
`
const StyledHintLeftBox = styled.div`
  margin-right: 40px;
`
const StyledHintRightBox = styled.div`
  p {
    display: inline-block;
    margin-left: 10px;
  }
`
const StyledTempHint = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
  span {
    display: inline-block;
    margin-left: 5px;
  }
  &::before {
    content: '';
    width: 15px;
    height: 20px;
    background-color: ${props => props.bgColor};
    display: inline-block;
    top: 1px;
    position: relative;
  }
`
const StyledChartColumn = styled.div`
  padding: 0 30px;
  position: relative;
  display: flex;
  align-items: flex-end;
`
const StyledTempBar = styled.div`
  width: 30px;
  min-height: 5px;
  height: ${(props) => `${Math.abs(props.barHeight) * 0.7}%`};
  background-color: ${props => props.bgColor};
  margin: 0 5px;
  position: relative;
  display: flex;
  justify-content: center;
  span {
    top: -30px;
    display: inline-block;
    position: relative;
  }
`
const StyledOuterBox = styled.div`
  width: 100%;
  position: absolute;
  text-align: center;
  bottom: -140px;
  left: 0;
`
const StyledChartColumnDate = styled.span`
  width: 100%;
  display: inline-block;
  text-align: center;
`
const StyledPieChart = styled.div`
  width: 100px;
  height: 100px;
  background: conic-gradient(rgba(44, 105, 253, .7) ${props => props.humidity}%, rgba(100, 152, 166, 0.7) ${props => props.humidity}% 100%);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`
const StyledPieChartHint = styled(StyledPieChart)`
  width: 70px;
  height: 70px;
  font-size: 14px;
`

const StyledHasNegChartContent = styled.div`
  display: inline-flex;
  top: ${props => `-${props.topOffset}%`};
  position: relative;
  pointer-events: none;
`
const StyledHasNegChartColumn = styled(StyledChartColumn)`
  border-bottom: 1px solid #fafafa;
`
const StyledHasNegTempBar = styled(StyledTempBar)`
  ${props => (
    props.isNegative
      ? `
        top: calc(100% + 1px);
        align-self: flex-start;
      `
      : ''
  )}
`
const StyledHasNegOuterBox = styled(StyledOuterBox)`
  bottom: ${props => `calc(-${props.topOffset}% - 140px)`};
`

function WeatherChart({ weatherData }) {
  const dailyData = weatherData.daily.map((day) => {
    return {
      max: Math.ceil(day.temp.max),
      min: Math.floor(day.temp.min),
      humidity: day.humidity,
      dt: day.dt,
    };
  });

  const maxTempList = [];
  const minTempList = [];
  dailyData.forEach((day) => {
    maxTempList.push(day.max);
    minTempList.push(day.min);
  })
  const maxTemp = Math.ceil(Math.max(...maxTempList));
  const minTemp = Math.floor(Math.min(...minTempList));
  const hasNegativeTemp = minTemp <= 0;
  const tempRange = Math.abs(maxTemp) + Math.abs(minTemp);

  return (
    <>
      <StyledHint>
        <StyledHintContent>
          <StyledHintLeftBox>
            <p>Unit of temperature: Celsius</p>
            <StyledTempHint bgColor={colorSet.min}><span>Minimum Temperature</span></StyledTempHint>
            <StyledTempHint bgColor={colorSet.max}><span>Maximum Temperature</span></StyledTempHint>
          </StyledHintLeftBox>
          <StyledHintRightBox>
            <StyledPieChartHint humidity={63}><span>63%</span></StyledPieChartHint>
            <p>
              Humidity
            </p>
          </StyledHintRightBox>
        </StyledHintContent>
      </StyledHint>
      {hasNegativeTemp && (
        <StyledChartWrap>
          <StyledHasNegChartContent topOffset={Math.abs(minTemp)/(tempRange*1.1)*100}>
            {dailyData.map((day) => (
              <StyledHasNegChartColumn key={day.dt}>
                <StyledHasNegTempBar bgColor={colorSet.min} barHeight={day.min/tempRange*100} isNegative={day.min < 0}><span>{day.min}</span></StyledHasNegTempBar>
                <StyledHasNegTempBar bgColor={colorSet.max} barHeight={day.max/tempRange*100} isNegative={day.max < 0}><span>{day.max}</span></StyledHasNegTempBar>
                <StyledHasNegOuterBox topOffset={Math.abs(minTemp)/(tempRange*1.1)*100}>
                  <StyledChartColumnDate>
                    {new Date(day.dt*1000).getMonth() + 1}
                    /
                    {new Date(day.dt*1000).getDate()}
                  </StyledChartColumnDate>
                  <StyledPieChart humidity={day.humidity}><span>{`${day.humidity}%`}</span></StyledPieChart>
                </StyledHasNegOuterBox>
              </StyledHasNegChartColumn>
            ))}
          </StyledHasNegChartContent>
        </StyledChartWrap>
      )}
      {!hasNegativeTemp && (
        <StyledChartWrap>
          {dailyData.map((day) => (
            <StyledChartColumn key={day.dt}>
              <StyledTempBar bgColor={colorSet.min} barHeight={day.min/tempRange*100}><span>{day.min}</span></StyledTempBar>
              <StyledTempBar bgColor={colorSet.max} barHeight={day.max/tempRange*100}><span>{day.max}</span></StyledTempBar>
              <StyledOuterBox>
                <StyledChartColumnDate>
                  {new Date(day.dt*1000).getMonth() + 1}
                  /
                  {new Date(day.dt*1000).getDate()}
                </StyledChartColumnDate>
                <StyledPieChart humidity={day.humidity}><span>{`${day.humidity}%`}</span></StyledPieChart>
              </StyledOuterBox>
            </StyledChartColumn>
          ))}
        </StyledChartWrap>
      )}
    </>
  )
}

export default WeatherChart;
