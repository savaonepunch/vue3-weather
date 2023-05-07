<template>
    <div
        v-if="locationsStore.locations.length"
        class="cities-container"
    >
        <h3>Saved Cities:</h3>
        <div class="cities">
            <div
                v-for="(location, index) in locationsStore.locations"
                :data-lat="location.coords.lat"
                :data-lon="location.coords.lon"
                :data-city="location.city"
                :data-country="location.country"
                class="city"
                @click="getLocationWeather"
            >
                <span>{{ location.city }}, {{ location.country }}</span>
                <button @click.stop="locationsStore.locations.splice(index, 1)" class="remove">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLocationsStore } from '../stores/locations';
import { useRouter } from 'vue-router';

const locationsStore = useLocationsStore();

const lat = ref(null);
const lon = ref(null);
const city = ref(null);
const country = ref(null);

const router = useRouter();

const getLocationWeather = (e) => {
    lat.value = e.currentTarget.getAttribute('data-lat');
    lon.value = e.currentTarget.getAttribute('data-lon');
    city.value = e.currentTarget.getAttribute('data-city');
    country.value = e.currentTarget.getAttribute('data-country');

    goToWeatherRoute();
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
</script>

<style lang="scss" scoped>
div.cities-container {
    color: white;
    position: absolute;
    left: 0px;
    right: 0px;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 100%;

    & div.cities {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        justify-content: center;
        padding: 0 15px;
        padding-bottom: 50px;

        & div.city {
            background-color: rgba(0, 0, 0, 0.31);
            padding: 15px 20px;
            border-radius: 5px;
            position: relative;

            & button {
                all: unset;
                display: none;
                position: absolute;
                top: -10px;
                right: -10px;
                background-color: white;
                color: rgba(0, 0, 0, 0.5);
                width: 20px;
                height: 20px;
                border-radius: 100px;
                justify-content: center;
                align-items: center;
                font-size: .8rem;
            }

            &:hover {
                cursor: pointer;

                & button {
                    display: flex;
                }
            }

            @media (hover: none) {
                & button {
                    display: flex;
                }
            }
        }
    }
}
</style>