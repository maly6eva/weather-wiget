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
    const controller = new AbortController()
    const signal = controller.signal
    console.log(signal)

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
            `http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${query}`,
            {
              signal
            }
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
    return () => {
      controller.abort()
    }
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
      <TimerComponent/>
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

function TimerComponent() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);


  useEffect(() => {
    let timer;


    if (isRunning) {
      // Устанавливаем таймер, если он включён
      timer = setInterval(() => {
        console.log("Timer running:", count);
        setCount((prev) => prev + 1);
      }, 1000);
    }


    // Функция очистки таймера
    return () => {
      if (timer) {
        console.log("Cleaning up the timer");
        clearInterval(timer);
      }
    };
  }, [isRunning]); // Таймер обновляется при изменении isRunning


  return (
      <div>
        <h1>Timer: {count}</h1>
        <button onClick={() => setIsRunning((prev) => !prev)}>
          {isRunning ? "Stop Timer" : "Start Timer"}
        </button>
        <button onClick={() => setCount(0)} disabled={isRunning}>
          Reset Timer
        </button>
      </div>
  );
}
export default App;
