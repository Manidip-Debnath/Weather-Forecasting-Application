const apiKey = '0596644e8d5fd2d7c7719bf0a63a15fa';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const cityName = document.getElementById('city-name');
const dateTime = document.getElementById('date-time');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const realFeel = document.getElementById('real-feel');
const windSpeed = document.getElementById('wind-speed');
const cloudCoverage = document.getElementById('cloud-coverage');
const humidity = document.getElementById('humidity');
const weeklyForecast = document.getElementById('weekly-forecast');
const body = document.body; // To change background dynamically

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        updateWeatherUI(data);
        fetchWeeklyForecast(city);
    } catch (error) {
        alert('Error fetching weather data. Please try again.');
    }
}

function updateWeatherUI(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    dateTime.textContent = new Date().toLocaleString();
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherDescription.textContent = data.weather[0].description;
    realFeel.textContent = `${Math.round(data.main.feels_like)}°C`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    cloudCoverage.textContent = `${data.clouds.all}%`;
    humidity.textContent = `${data.main.humidity}%`;

    // Apply weather-based background and animation class
    updateBackground(data.weather[0].main.toLowerCase());
}

function updateBackground(weather) {
    body.className = ''; // Reset any previous weather class

    if (weather.includes('clear')) {
        body.classList.add('sunny');
    } else if (weather.includes('cloud')) {
        body.classList.add('cloudy');
    } else if (weather.includes('rain')) {
        body.classList.add('rainy');
    } else if (weather.includes('snow')) {
        body.classList.add('snowy');
    } else if (weather.includes('thunderstorm')) {
        body.classList.add('stormy');
    } else {
        body.classList.add('cloudy'); // Default fallback
    }
}

async function fetchWeeklyForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        updateWeeklyForecastUI(data);
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

function updateWeeklyForecastUI(data) {
    weeklyForecast.innerHTML = '';
    const days = {};

    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!days[date]) {
            days[date] = item;
        }
    });

    Object.values(days).forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-item');
        dayElement.innerHTML = `
            <p>${new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long' })}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="">
            <p>${Math.round(day.main.temp)}°C</p>
            <p>${day.weather[0].description}</p>
        `;
        weeklyForecast.appendChild(dayElement);
    });
}

// Allow search with "Enter" key
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});
