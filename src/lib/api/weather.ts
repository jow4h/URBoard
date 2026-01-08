const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeatherData(city: string) {
    if (!city) throw new Error("Şehir bilgisi eksik");

    // 1. Get coordinates from city name
    const geoResponse = await fetch(
        `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=tr&format=json`
    );

    if (!geoResponse.ok) throw new Error("Konum servisine bağlanılamadı");

    const geoData = await geoResponse.json();
    if (!geoData.results || geoData.results.length === 0) {
        throw new Error("404: Şehir Bulunamadı");
    }

    const { latitude, longitude, name: cityName } = geoData.results[0];

    // 2. Get weather data from coordinates
    const weatherResponse = await fetch(
        `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,apparent_temperature&timezone=auto`
    );

    if (!weatherResponse.ok) throw new Error("Hava durumu verisi alınamadı");

    const weatherData = await weatherResponse.json();

    return {
        name: cityName,
        main: {
            temp: weatherData.current_weather.temperature,
            feels_like: weatherData.hourly?.apparent_temperature?.[0] || weatherData.current_weather.temperature,
            humidity: weatherData.hourly?.relative_humidity_2m?.[0] || 0,
        },
        wind: {
            speed: weatherData.current_weather.windspeed
        },
        weather: [
            {
                code: weatherData.current_weather.weathercode,
                description: mapWeatherCode(weatherData.current_weather.weathercode)
            }
        ]
    };
}

function mapWeatherCode(code: number): string {
    const codes: Record<number, string> = {
        0: "Açık",
        1: "Çoğunlukla Açık",
        2: "Parçalı Bulutlu",
        3: "Bulutlu",
        45: "Sisli",
        48: "Kırağılı Sis",
        51: "Hafif Çisenti",
        53: "Orta Çisenti",
        55: "Yoğun Çisenti",
        61: "Hafif Yağmur",
        63: "Orta Yağmur",
        65: "Yoğun Yağmur",
        71: "Hafif Kar",
        73: "Orta Kar",
        75: "Yoğun Kar",
        77: "Kar Taneleri",
        80: "Hafif Sağanak Yağmur",
        81: "Orta Sağanak Yağmur",
        82: "Yoğun Sağanak Yağmur",
        85: "Hafif Sağanak Kar",
        86: "Yoğun Sağanak Kar",
        95: "Fırtına",
        96: "Dulu Fırtına",
        99: "Şiddetli Dolu Fırtına"
    };
    return codes[code] || "Bilinmiyor";
}
