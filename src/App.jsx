import { useState, useEffect } from "react";
import "./index.css";




const KEY = 'fe355d4575454cef9f993402251404'

function App() {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] =  useState(null)
  const [error, setError] = useState(null)
  const [loading, setloading] = useState(false)
  const [coords, setCoords] = useState(null)



  useEffect(() => {
    if(!navigator.geolocation){
      setError('Geolocation is not supported')
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
    console.log(position)
    const {latitude, longitude} = position.coords
    setCoords({latitude, longitude} )
  },
        (error) => {
      console.error('Error getting coords', error.message)
          setError('Failed to get coords')
        } )
  },[])

  useEffect(() => {
    if(!city.trim() && !coords) {
      setWeatherData(null)
      setError(null)
      return
    }

    async function getData() {
      setloading(true)
      try {
        const query = city.trim() ? city : `${coords.latitude}, ${coords.longitude}`
        const res = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${query}`
        )
        const data = await res.json();
        if(data.error){
          setError(data.error.message)
          setWeatherData(null)
          return;
        }
          setWeatherData(data)
        setError(null)
      } catch  {

        setError('Failed to fetch data')
        setWeatherData(null)
      }finally{
        setloading(false)
      }
    }
    getData()
  }, [city, coords])




function renderError(){
    return <p>{error}</p>
}

  function renderLoading(){
    return <p>Loading...</p>
  }

  function renderWeather(){
    return (
        <div className="weather-card">
          <h2>{`${weatherData?.location?.name}, ${weatherData?.location?.country}`}</h2>
          <img src={`https:${weatherData?.current?.condition?.icon}`} alt="icon" className="weather-icon" />
          <p className="temperature">{`${Math.round(  weatherData?.current.temp_c)} °C`}</p>
          <p className="condition">{weatherData?.current?.condition?.text}</p>
          <div className="weather-details" >
            <p>Влажность: {weatherData?.current?.humidity}%</p>
            <p>Ветер: {weatherData?.current?.wind_kph}km/h</p>
          </div>
        </div>
    )
  }


  return (
    <div className="app">
      <div className="widget-container">
        <div className="weather-card-container">
          <h1 className="app-title">Weather Widget</h1>
          <div className="search-container">
            <input type="text"
                   value={city}
                   placeholder="Enter city name"
                   className="search-input"
                   onChange={(e) => setCity(e.target.value) }

            />
          </div>
        </div>
        {error && renderError()}
        {loading && renderLoading()}
        {!loading && !error && weatherData && renderWeather()}

      </div>
    </div>
  );
}

export default App;
