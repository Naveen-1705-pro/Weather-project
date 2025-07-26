// ===== WEATHER APP JAVASCRIPT =====

// Configuration
const API_KEY = '3c69c1590ad7cdbb4e75b4179c6a8bc6';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Global variables
let currentWeatherData = null;
let isLoading = false;

// Weather icon mapping
const WEATHER_ICONS = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️',
    '04d': '☁️', // broken clouds
    '04n': '☁️',
    '09d': '🌧️', // shower rain
    '09n': '🌧️',
    '10d': '🌦️', // rain day
    '10n': '🌧️', // rain night
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️',
    '13d': '❄️', // snow
    '13n': '❄️',
    '50d': '🌫️', // mist
    '50n': '🌫️',
};

// DOM Elements
const elements = {
    searchForm: document.getElementById('search-form'),
    cityInput: document.getElementById('city-input'),
    searchBtn: document.getElementById('search-btn'),
    searchText: document.getElementById('search-text'),
    locationBtn: document.getElementById('location-btn'),
    
    errorSection: document.getElementById('error-section'),
    errorMessage: document.getElementById('error-message'),
    
    loadingSection: document.getElementById('loading-section'),
    
    weatherSection: document.getElementById('weather-section'),
    currentDay: document.getElementById('current-day'),
    currentDate: document.getElementById('current-date'),
    currentTime: document.getElementById('current-time'),
    locationName: document.getElementById('location-name'),
    locationCountry: document.getElementById('location-country'),
    weatherIcon: document.getElementById('weather-icon'),
    temperature: document.getElementById('temperature'),
    weatherDescription: document.getElementById('weather-description'),
    feelsLike: document.getElementById('feels-like'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    
    forecastSection: document.getElementById('forecast-section'),
    forecastContainer: document.getElementById('forecast-container'),
    
    weatherBackground: document.getElementById('weather-background'),
    weatherEffects: document.getElementById('weather-effects'),
    
    toastContainer: document.getElementById('toast-container')
};

// ===== UTILITY FUNCTIONS =====

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function setLoading(loading) {
    isLoading = loading;
    
    elements.searchBtn.disabled = loading;
    elements.locationBtn.disabled = loading;
    elements.cityInput.disabled = loading;
    
    if (loading) {
        elements.searchText.textContent = 'Searching...';
        elements.loadingSection.classList.remove('hidden');
        elements.loadingSection.classList.add('animate-slide-up');
    } else {
        elements.searchText.textContent = 'Search Weather';
        elements.loadingSection.classList.add('hidden');
    }
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorSection.classList.remove('hidden');
    elements.errorSection.classList.add('animate-slide-up');
    elements.weatherSection.classList.add('hidden');
    elements.forecastSection.classList.add('hidden');
}

function hideError() {
    elements.errorSection.classList.add('hidden');
}

function updateDateTime() {
    const now = new Date();
    
    const dayOptions = { weekday: 'long' };
    const dateOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    };
    
    elements.currentDay.textContent = now.toLocaleDateString('en-US', dayOptions);
    elements.currentDate.textContent = now.toLocaleDateString('en-US', dateOptions);
    elements.currentTime.textContent = now.toLocaleTimeString('en-US', timeOptions);
}

function getWeatherIcon(iconCode) {
    return WEATHER_ICONS[iconCode] || '🌤️';
}

function updateBackground(weatherCondition, isDay) {
    // Remove existing weather classes
    elements.weatherBackground.className = 'weather-background';
    
    // Add appropriate weather class
    if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
        elements.weatherBackground.classList.add('rainy');
        createRainEffect();
    } else if (weatherCondition.includes('snow')) {
        elements.weatherBackground.classList.add('snowy');
        createSnowEffect();
    } else if (weatherCondition.includes('cloud')) {
        elements.weatherBackground.classList.add('cloudy');
        createCloudEffect();
    } else if (weatherCondition.includes('clear')) {
        elements.weatherBackground.classList.add(isDay ? 'sunny' : 'clear-night');
        clearWeatherEffects();
    } else {
        elements.weatherBackground.classList.add(isDay ? 'sunny' : 'clear-night');
        clearWeatherEffects();
    }
}

function createRainEffect() {
    clearWeatherEffects();
    
    for (let i = 0; i < 100; i++) {
        const rainDrop = document.createElement('div');
        rainDrop.className = 'rain-drop';
        rainDrop.style.left = Math.random() * 100 + '%';
        rainDrop.style.animationDelay = Math.random() * 1000 + 'ms';
        elements.weatherEffects.appendChild(rainDrop);
    }
}

function createSnowEffect() {
    clearWeatherEffects();
    
    for (let i = 0; i < 50; i++) {
        const snowFlake = document.createElement('div');
        snowFlake.className = 'snow-flake';
        snowFlake.textContent = '❄';
        snowFlake.style.left = Math.random() * 100 + '%';
        snowFlake.style.animationDelay = Math.random() * 3000 + 'ms';
        snowFlake.style.fontSize = (Math.random() * 3 + 1) + 'rem';
        elements.weatherEffects.appendChild(snowFlake);
    }
}

function createCloudEffect() {
    clearWeatherEffects();
    
    const cloudPositions = [
        { top: '20%', delay: '0s', size: '4rem' },
        { top: '30%', delay: '5s', size: '3rem' },
        { top: '15%', delay: '10s', size: '3.5rem' }
    ];
    
    cloudPositions.forEach(pos => {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.textContent = '☁';
        cloud.style.top = pos.top;
        cloud.style.animationDelay = pos.delay;
        cloud.style.fontSize = pos.size;
        elements.weatherEffects.appendChild(cloud);
    });
}

function clearWeatherEffects() {
    elements.weatherEffects.innerHTML = '';
}

function isDay() {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18;
}

// ===== API FUNCTIONS =====

async function fetchWeatherByCity(city) {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('City not found!');
        }
        
        const data = await response.json();
        const forecast = await fetchForecast(data.coord.lat, data.coord.lon);
        
        return {
            location: {
                name: data.name,
                country: data.sys.country
            },
            current: {
                temperature: Math.round(data.main.temp),
                condition: data.weather[0].main.toLowerCase(),
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
                feelsLike: Math.round(data.main.feels_like),
                icon: data.weather[0].icon
            },
            forecast
        };
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch weather data');
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Unable to fetch weather for your location');
        }
        
        const data = await response.json();
        const forecast = await fetchForecast(lat, lon);
        
        return {
            location: {
                name: data.name,
                country: data.sys.country
            },
            current: {
                temperature: Math.round(data.main.temp),
                condition: data.weather[0].main.toLowerCase(),
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed * 3.6),
                feelsLike: Math.round(data.main.feels_like),
                icon: data.weather[0].icon
            },
            forecast
        };
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch weather data');
    }
}

async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            return [];
        }
        
        const data = await response.json();
        
        // Get daily forecast (one per day at 12:00)
        const dailyForecasts = data.list
            .filter(item => item.dt_txt.includes('12:00:00'))
            .slice(0, 5);
        
        return dailyForecasts.map(item => {
            const date = new Date(item.dt * 1000);
            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                temperature: {
                    max: Math.round(item.main.temp_max),
                    min: Math.round(item.main.temp_min)
                },
                condition: item.weather[0].main.toLowerCase(),
                icon: item.weather[0].icon
            };
        });
    } catch (error) {
        return [];
    }
}

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => {
                reject(new Error('Unable to retrieve your location'));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
}

// ===== UI UPDATE FUNCTIONS =====

function displayWeatherData(weatherData) {
    currentWeatherData = weatherData;
    
    // Update location
    elements.locationName.textContent = weatherData.location.name;
    elements.locationCountry.textContent = weatherData.location.country;
    
    // Update weather
    elements.weatherIcon.textContent = getWeatherIcon(weatherData.current.icon);
    elements.temperature.textContent = `${weatherData.current.temperature}°C`;
    elements.weatherDescription.textContent = weatherData.current.description;
    
    // Update details
    elements.feelsLike.textContent = `${weatherData.current.feelsLike}°C`;
    elements.humidity.textContent = `${weatherData.current.humidity}%`;
    elements.windSpeed.textContent = `${weatherData.current.windSpeed} km/h`;
    
    // Update background
    updateBackground(weatherData.current.condition, isDay());
    
    // Show weather section with animation
    hideError();
    elements.weatherSection.classList.remove('hidden');
    elements.weatherSection.classList.add('animate-slide-up');
    
    // Display forecast
    displayForecast(weatherData.forecast);
}

function displayForecast(forecast) {
    if (!forecast || forecast.length === 0) {
        elements.forecastSection.classList.add('hidden');
        return;
    }
    
    elements.forecastContainer.innerHTML = '';
    
    forecast.forEach((day, index) => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.style.animationDelay = `${index * 0.1}s`;
        
        forecastItem.innerHTML = `
            <div class="forecast-day">${day.day}</div>
            <div class="forecast-date">${day.date}</div>
            <div class="forecast-icon" style="animation-delay: ${index * 0.2}s">${getWeatherIcon(day.icon)}</div>
            <div class="forecast-temp-max">${day.temperature.max}°</div>
            <div class="forecast-temp-min">${day.temperature.min}°</div>
        `;
        
        elements.forecastContainer.appendChild(forecastItem);
    });
    
    elements.forecastSection.classList.remove('hidden');
    elements.forecastSection.classList.add('animate-slide-up');
}

// ===== EVENT HANDLERS =====

async function handleSearch(city) {
    if (!city.trim()) return;
    
    setLoading(true);
    hideError();
    
    try {
        const weatherData = await fetchWeatherByCity(city.trim());
        displayWeatherData(weatherData);
        showToast(`Weather data for ${city} loaded!`, 'success');
        elements.cityInput.value = '';
    } catch (error) {
        showError(error.message);
        showToast(error.message, 'error');
    } finally {
        setLoading(false);
    }
}

async function handleLocationRequest() {
    setLoading(true);
    hideError();
    
    try {
        showToast('Getting your location...', 'info');
        const coords = await getCurrentLocation();
        const weatherData = await fetchWeatherByCoords(coords.lat, coords.lon);
        displayWeatherData(weatherData);
        showToast('Weather data loaded successfully!', 'success');
    } catch (error) {
        showError(error.message);
        showToast(error.message, 'error');
        
        // Fallback to London if location fails
        if (error.message.includes('location')) {
            showToast('Loading default city (London)...', 'info');
            setTimeout(() => handleSearch('London'), 1000);
        }
    } finally {
        setLoading(false);
    }
}

// ===== EVENT LISTENERS =====

elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSearch(elements.cityInput.value);
});

elements.locationBtn.addEventListener('click', handleLocationRequest);

// ===== INITIALIZATION =====

function init() {
    // Start clock
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Load default location
    handleLocationRequest();
}

// Start the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
