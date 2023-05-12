<template>
    <form @submit.prevent="searchLocations">
        <div :class="{ 'search-container': true, 'dropdown-open': locations.length && inputValue }">
            <button type="submit">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>
            <input @focus="inputFocused = true"
                   @blur="inputFocused = false"
                   v-model="inputValue"
                   ref="inputRef"
                   type="text"
                   name="search"
                   id="search"
                   placeholder="Search for a city...">
            <button v-if="!(locations.length && inputValue)"
                    @click.prevent="locateUser">
                <i class="fa-solid fa-location-crosshairs"></i>
            </button>

            <button v-else
                    @click.prevent="inputValue = ''">
                <i class="fa-solid fa-xmark-circle"></i>
            </button>
        </div>

        <div class="dropdown-wrapper">
            <div v-if="locations.length && inputValue"
                 class="dropdown">
                <div v-for="location in locations"
                     @click="getCityWeather(location)"
                     class="location">
                    {{ location.name }}, {{ location.state ? location.state + ", " : "" }}{{ location.country }}
                </div>
            </div>
        </div>

        <p class="searching"
           v-if="searching">Searching... <i class="fa-solid fa-location-dot fa-bounce"></i></p>
        <p class="no-results"
           v-if="noResults">No results!</p>
    </form>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import debounce from 'lodash.debounce';

const inputRef = ref(null);
const inputValue = ref(null);
const searching = ref(false);
const locations = ref([]);
const inputFocused = ref(true);
const lat = ref(null);
const lon = ref(null);
const city = ref(null);
const country = ref(null);
const noResults = ref(false);
const singleLocation = ref(null);

const router = useRouter();

const focusInput = () => {
    inputRef.value.focus();
}

const goToWeatherRoute = () => {
    router.push({
        name: "Location",
        query: {
            lat: lat.value,
            lon: lon.value,
            city: city.value,
            country: country.value
        },
    })
}

const locateUser = () => {
    noResults.value = false;
    searching.value = true;
    locations.value = [];

    if (!navigator.geolocation) {
        alert('Geolocation not supported.')
    } else {
        navigator.geolocation.getCurrentPosition(async (position) => {
            console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
            lat.value = position.coords.latitude;
            lon.value = position.coords.longitude;

            try {
                const { data } = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse`, {
                    params: {
                        lat: lat.value,
                        lon: lon.value,
                        appid: 'e8b2ae8d3ec2683f4f92e54458f76256',
                    }
                })

                console.log(data);
                inputValue.value = `${data[0].name}, ${data[0].state ? data[0].state + ", " : ""}${data[0].country}`;

                city.value = data[0].name;
                country.value = data[0].country;
                goToWeatherRoute();

            } catch (error) {
                console.log(error);
            }

            searching.value = false;
        }, () => {
            console.log(`Couldn't get your location.`);
            searching.value = false;
        });
    }
}

const searchLocations = async () => {
    noResults.value = false;
    inputValue.value = inputValue.value.trim(' ');

    try {
        if (!inputValue.value) return;

        searching.value = true;

        const { data } = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
            params: {
                q: inputValue.value,
                limit: 0,
                appid: 'e8b2ae8d3ec2683f4f92e54458f76256',
            }
        })

        console.log(data);
        locations.value = data;
        console.log(locations.value);

        if (!locations.value.length) noResults.value = true;
        searching.value = false;

        if (locations.value.length === 1) {
            getCityWeather(locations.value[0]);
        }

    } catch (error) {
        console.log(error);
        searching.value = false;
    }
}

const showLocations = async () => {
    noResults.value = false;
    inputValue.value = inputValue.value.trim(' ');

    try {
        if (!inputValue.value) return;

        searching.value = true;

        const { data } = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
            params: {
                q: inputValue.value,
                limit: 0,
                appid: 'e8b2ae8d3ec2683f4f92e54458f76256',
            }
        })

        console.log(data);
        locations.value = data;
        console.log(locations.value);

        if (!locations.value.length) noResults.value = true;
        searching.value = false;

    } catch (error) {
        console.log(error);
        searching.value = false;
    }
}

const getCityWeather = (location) => {
    lat.value = location.lat;
    lon.value = location.lon;
    city.value = location.name
    country.value = location.country;

    console.log(lat.value, lon.value);

    goToWeatherRoute();
}

onMounted(() => {
    focusInput();
})

watch(inputValue, (newVal) => {
    if (!newVal) locations.value = [];
})

watch(inputValue,
    debounce(() => {
        showLocations();
    }, 1000)
)

</script>

<style lang="scss" scoped>
form {
    position: relative;
    box-sizing: border-box;
    width: 100%;

    & div.search-container {
        background-color: white;
        width: 100%;
        display: flex;
        border-radius: 5px;

        & input {
            all: unset;
            width: 100%;
            padding: 20px 0px;
        }

        & button {
            all: unset;
            box-sizing: border-box;
            border-radius: 5px;
            border: 3px solid white;

            &:hover {
                cursor: pointer;
            }

            & i {
                display: flex;
                align-items: center;
                padding: 0 20px;
                height: 20px;
                margin-top: auto;
                margin-bottom: auto;
                opacity: 50%;
            }

            &:last-of-type {
                & i {
                    border-left: 1px solid rgba(0, 0, 0, 0.5);
                }
            }

            
        }

        &.dropdown-open {
            border-radius: 5px 5px 0 0 !important;
        }
    }

    & div.dropdown-wrapper {
        position: absolute;
        left: 0;
        right: 0;
        top: 100%;
        translate: 0 -1px;
        z-index: 99;

        & div.dropdown {
            background-color: white;
            border-radius: 0 0 5px 5px;
            margin-bottom: 50px;
            max-height: 400px;
            overflow: scroll;

            & div.location {
                padding: 20px 62px;

                &:hover {
                    background-color: rgba(0, 0, 0, 0.135);
                    cursor: pointer;
                }
            }
        }
    }

    & p.searching {
        color: white;
        position: absolute;
        left: 0;
        bottom: 100%;
        margin-bottom: 15px;
    }

    & p.no-results {
        color: white;
        position: absolute;
        left: 0;
        bottom: 100%;
        margin-bottom: 15px;
    }
}
</style>