import { useState, useEffect } from "react";
import "./index.css";



const KEY = 'fe355d4575454cef9f993402251404'

function App() {
  const [city, setCity] = useState('Mi')
  const [weatherData, setWeatherData] =  useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${city}`
        )

        const data = await res.json();
        console.log(data)

        if(data.error){
          setError(data.error.message)
        }else{
          setWeatherData(data)
        }
      } catch (error) {
        console.log(error)
        setError(error.message)
      }
    }
    getData()
  }, [])






  return (
    <div className="app">
      <div className="widget-container">
        <div className="weather-card-container">
          <h1 className="app-title">{error}Weather Widget</h1>
          <div className="search-container">
            <input type="text" placeholder="Enter city name" className="search-input" />
          </div>
        </div>

            <div className="weather-card">
              <h2>{`${weatherData?.location?.name}, ${weatherData?.location?.country}`}</h2>
              <img src="" alt="icon" className="weather-icon" />
              <p className="temperature">{
                weatherData?.current
                    .temp_c}</p>
              <p className="condition">rainy</p>
              <div className="weather-details" >
                <p>Humidity: 20%</p>
                <p>Wind: 22 km/h</p>
              </div>
            </div>
      </div>
    </div>
  );
}

export default App;
