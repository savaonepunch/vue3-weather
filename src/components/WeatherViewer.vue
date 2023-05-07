<template>
    <div
        v-if="!loading"
        class="weather-container"
    >
        <div class="current-weather">
            <h1 class="location">
                {{ route.query.city }}, {{ weather.state ? weather.state + ", " : "" }}{{ weather.sys.country }}
                <button
                    @click="saveLocation"
                    class="save-location"
                >
                    SAVE LOCATION
                </button>
            </h1>
            <p>
                {{
                    new Date(weather.dt * 1000).toLocaleString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                    })
                }}
            </p>
            <div class="content">
                <div class="left">
                    <div class="icon">
                        <img :src="getIcon(weather.weather[0].icon)">
                    </div>
                    <div class="info-container">
                        <span class="temp">
                            {{ Math.trunc(weather.main.temp) }}°
                        </span>
                        <span class="description">
                            {{ weather.weather[0].main }}
                        </span>
                    </div>
                </div>
                <div class="right">
                    <div class="row">
                        <div class="info-container">
                            <span class="info">{{ Math.round(weather.main.temp_max * 10) / 10 }}°</span>
                            <span class="description">High</span>
                        </div>
                        <div class="info-container">
                            <span class="info">{{ weather.wind.speed }}km/h</span>
                            <span class="description">Wind</span>
                        </div>
                        <div class="info-container">
                            <span class="info">{{ weather.main.humidity }}%</span>
                            <span class="description">Humidity</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="info-container">
                            <span class="info">{{ Math.round(weather.main.temp_min * 10) / 10 }}°</span>
                            <span class="description">Low</span>
                        </div>
                        <div class="info-container">
                            <span class="info">{{ weather.main.pressure }}mb</span>
                            <span class="description">Pressure</span>
                        </div>
                        <div class="info-container">
                            <span class="info">{{ weather.clouds.all }}%</span>
                            <span class="description">Clouds</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="todays-weather">
            <p>Forecast</p>
            <div
                @mousedown="carouselMouseDownHandler"
                ref="cardsCarousel"
                class="content"
            >
                <div
                    v-for="(n, index) in 7"
                    class="card"
                >
                    <span class="time">{{ forecast.list[index].dt_txt.split(' ')[1].split(':').slice(0, 2).join(':')
                    }}</span>
                    <img
                        draggable="false"
                        :src="getIcon(forecast.list[index].weather[0].icon)"
                    >
                    <span class="temp">{{ Math.round(forecast.list[index].main.temp * 10) / 10 }}°</span>
                </div>
            </div>
        </div>
        <div class="future-weather">
            <p>Next 3 days</p>
            <div class="content-mobile">
                <div
                    v-for="(weather, index) in dailyForecast.daily.slice(1, 4)"
                    class="card"
                >

                    <div class="row">
                        <div class="info">
                            <span class="title">
                                {{ new Date(weather.dt * 1000).toLocaleString("en-US", {
                                    weekday: "short",
                                }) }}
                            </span>
                            <span class="description">
                                {{ new Date(weather.dt * 1000).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                }) }}
                            </span>
                        </div>

                        <div class="info">
                            <img :src="getIcon(weather.weather[0].icon)">
                        </div>
                    </div>

                    <div class="row">
                        <div class="info">
                            <span class="title">{{ Math.round(weather.temp.min * 10) / 10 }}°</span>
                            <span class="description">Low</span>
                        </div>

                        <div class="info">
                            <span class="title">{{ Math.round(weather.temp.max * 10) / 10 }}°</span>
                            <span class="description">High</span>
                        </div>
                    </div>

                    <div class="row">
                        <div class="info">
                            <span class="title">{{ weather.humidity }}%</span>
                            <span class="description">Humidity</span>
                        </div>

                        <div class="info">
                            <span class="title">{{ weather.wind_speed }}km/h</span>
                            <span class="description">Wind</span>
                        </div>
                    </div>

                </div>
            </div>

            <div class="content">
                <div
                    v-for="(weather, index) in dailyForecast.daily.slice(1, 4)"
                    class="card"
                >

                    <div class="info">
                        <span class="title">
                            {{ new Date(weather.dt * 1000).toLocaleString("en-US", {
                                weekday: "short",
                            }) }}
                        </span>
                        <span class="description">
                            {{ new Date(weather.dt * 1000).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                            }) }}
                        </span>
                    </div>

                    <div class="info">
                        <img :src="getIcon(weather.weather[0].icon)">
                    </div>

                    <div class="info">
                        <span class="title">{{ Math.round(weather.temp.min * 10) / 10 }}°</span>
                        <span class="description">Low</span>
                    </div>

                    <div class="info">
                        <span class="title">{{ Math.round(weather.temp.max * 10) / 10 }}°</span>
                        <span class="description">High</span>
                    </div>

                    <div class="info">
                        <span class="title">{{ weather.humidity }}%</span>
                        <span class="description">Humidity</span>
                    </div>

                    <div class="info">
                        <span class="title">{{ weather.wind_speed }}km/h</span>
                        <span class="description">Wind</span>
                    </div>


                </div>
            </div>
        </div>
    </div>

    <div
        v-else
        class="loading-overlay"
    >
        <i class="fa-solid fa-sun fa-flip fa-2xl"></i>
        <span>Loading...</span>
    </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useLocationsStore } from '../stores/locations'

const loading = ref(true);
const weather = ref(null);
const forecast = ref(null);
const dailyForecast = ref(null);

const cardsCarousel = ref(null);
const pos = ref({ left: 0, x: 0 });

const route = useRoute();

const location = ref({
    city: route.query.city,
    country: route.query.country,
    coords: {
        lat: route.query.lat,
        lon: route.query.lon
    }
});

const locationsStore = useLocationsStore();

onMounted(() => {
    getWeather();
    console.log(locationsStore.locations);
})

const saveLocation = () => {
    if (
        locationsStore.locations.some(
            (location) =>
                location.city === route.query.city &&
                location.country === route.query.country
        )
    ) {
        // Object with the same lat and lon values already exists in the store
        console.log("Location already exists!");
        console.log(locationsStore.locations);
        return;
    }

    locationsStore.locations.push(location.value);
    console.log(locationsStore.locations);
}

const carouselMouseDownHandler = (e) => {
    pos.value = {
        // The current scroll
        left: cardsCarousel.value.scrollLeft,
        // Get the current mouse position
        x: e.clientX,
    };

    document.addEventListener('mousemove', carouselMouseMoveHandler);
    document.addEventListener('mouseup', carouselMouseUpHandler);
}

const carouselMouseMoveHandler = (e) => {
    // How far the mouse has been moved
    const dx = e.clientX - pos.value.x;

    // Scroll the element
    cardsCarousel.value.scrollLeft = pos.value.left - dx;
};

const carouselMouseUpHandler = () => {
    document.removeEventListener('mousemove', carouselMouseMoveHandler);
    document.removeEventListener('mouseup', carouselMouseUpHandler);
};

const getIcon = (iconName) => {
    return new URL(`../assets/icons/${iconName}.svg`, import.meta.url).href;
}

const getWeather = async () => {
    loading.value = true;

    try {
        const { data: weatherData } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                lat: route.query.lat,
                lon: route.query.lon,
                appid: 'e8b2ae8d3ec2683f4f92e54458f76256',
                units: 'metric',
            }
        })

        const { data: forecastData } = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
                lat: route.query.lat,
                lon: route.query.lon,
                appid: 'e8b2ae8d3ec2683f4f92e54458f76256',
                units: 'metric',
            }
        })

        const { data: dailyForecastData } = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
            params: {
                lat: route.query.lat,
                lon: route.query.lon,
                appid: 'e8b2ae8d3ec2683f4f92e54458f76256',
                units: 'metric',
                exclude: 'hourly,minutely,current,alerts',
            }
        })

        console.log(weatherData);
        weather.value = weatherData;

        console.log(forecastData);
        forecast.value = forecastData;

        console.log(dailyForecastData);
        dailyForecast.value = dailyForecastData;

        loading.value = false;

    } catch (error) {
        console.log(error);
        loading.value = false;
    }
}
</script>

<style lang="scss" scoped>
div.weather-container {
    width: 100%;
    color: white;

    & p {
        font-size: 1.1rem;
        opacity: 70%;
        margin-top: 10px;
    }

    & div.current-weather {

        & h1 {
            font-weight: 600;
            margin-bottom: 0;
            font-size: clamp(16px, 10vw, 42px);
            display: flex;
            align-items: center;
            justify-content: space-between;

            & button {
                all: unset;
                box-sizing: border-box;
                background-color: #F5A71C;
                font-size: .8rem;
                color: black;
                font-weight: 600;
                padding: 10px 15px;
                border-radius: 20px;
                translate: 0 3px;
                min-width: 130px;
                text-align: center;
                transition: background-color .2s ease-in-out;

                &:hover {
                    cursor: pointer;
                    background-color: #ffc053;
                }
            }

            @media only screen and (max-width: 635px) {
                flex-direction: column-reverse;
                align-items: start;
                gap: 23px;
            }
        }

        & div.content {
            padding-top: 10px;

            display: flex;

            & div.left {
                box-sizing: border-box;
                padding-right: 30px;
                flex-grow: 1;
                display: flex;
                width: 50%;
                align-items: center;
                justify-content: space-around;
                border-right: 1px solid rgba(255, 255, 255, 0.448);

                & div.icon {
                    flex-grow: 1;
                    max-width: 200px;
                    // scale: 2.2;
                }

                & div.info-container {
                    display: flex;
                    flex-direction: column;

                    & span.temp {
                        font-weight: 600;
                        font-size: 3.5rem;
                    }
                }

                @media only screen and (max-width: 635px) {
                    padding: 0;
                    border: none;
                    width: 100%;
                }
            }

            & div.right {
                box-sizing: border-box;
                padding-left: 30px;
                display: flex;
                width: 50%;
                flex-direction: column;
                justify-content: center;
                gap: 40px;

                & div.row {
                    display: flex;
                }

                & div.info-container {
                    display: flex;
                    width: 33.33%;
                    flex-direction: column;
                    gap: 5px;

                    & span.info {
                        font-size: 1.3rem;
                    }

                    & span.description {
                        opacity: 60%;
                    }

                    &:nth-of-type(2) {
                        text-align: center;
                    }

                    &:last-of-type {
                        text-align: end;
                    }
                }

                @media only screen and (max-width: 635px) {
                    padding: 0;
                    padding-top: 50px;
                    width: 100%;
                    border-top: 1px solid rgba(255, 255, 255, 0.448);
                }
            }

            @media only screen and (max-width: 635px) {
                flex-direction: column;
                padding-bottom: 20px;
            }
        }
    }

    & div.todays-weather {
        padding-top: 10px 0;

        & div.content {
            display: flex;
            gap: 10px;
            overflow: scroll;
            padding-bottom: 25px;

            & div.card {
                background-color: rgba(0, 0, 0, 0.233);
                height: 160px;
                border-radius: 5px;
                min-width: calc((800px - 60px) / 7);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;

                & img {
                    width: 80%;
                }

                & span {
                    font-size: 1.3rem;
                }
            }

            &::-webkit-scrollbar {
                display: none;
            }

            -ms-overflow-style: none;
            /* IE and Edge */
            scrollbar-width: none;
            /* Firefox */

            @media only screen and (max-width: 875px) {
                &:hover {
                    cursor: grab;
                }
            }
        }
    }

    & div.future-weather {
        & div.content-mobile {
            display: none;
            flex-direction: column;
            gap: 10px;

            & div.card {
                background-color: rgba(0, 0, 0, 0.233);
                border-radius: 5px;
                display: flex;
                align-items: center;
                padding: 10px 0;

                & div.row {
                    display: flex;
                    width: 100%;
                    justify-content: center;
                    flex-direction: row-reverse;
                    padding: 10px 0;

                    &:first-of-type {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.334);
                        padding-bottom: 20px;
                    }

                    &:nth-of-type(2) {
                        padding-top: 10px;
                        padding-bottom: 0px;
                    }
                }

                & div.info {
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    height: 50px;
                    width: 50%;

                    & span.description {
                        font-size: .9rem;
                        opacity: 60%;
                    }

                    & img {
                        min-width: 72px;
                        max-width: 90px;
                    }
                }

                @media only screen and (max-width: 635px) {
                    flex-direction: column;
                }
            }

            @media only screen and (max-width: 635px) {
                display: flex;
            }
        }

        & div.content {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 10px;


            & div.card {
                background-color: rgba(0, 0, 0, 0.233);
                padding: 10px;
                border-radius: 5px;
                display: flex;
                align-items: center;

                & div.row {
                    display: flex;
                }

                & div.info {
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;

                    & span.description {
                        font-size: .9rem;
                        opacity: 60%;
                    }

                    & img {
                        min-width: 72px;
                        max-width: 90px;
                    }
                }

                @media only screen and (max-width: 635px) {
                    flex-direction: column;
                }
            }

            @media only screen and (max-width: 635px) {
                display: none;
            }
        }

        @media only screen and (max-width: 635px) {
            padding-bottom: 50px;
        }
    }
}

div.loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    flex-direction: column;
    gap: 30px;

    & span {
        padding-left: 8px;
    }
}
</style>
