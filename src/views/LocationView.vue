<template>
  <div class="container">
    <WeatherViewer/>
  </div>
</template>

<script setup>
import WeatherViewer from '../components/WeatherViewer.vue';
</script>

<style lang="scss" scoped>
div.container {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    max-width: 880px;
    margin: auto;

    padding: 0 40px;
    //padding-bottom: 50px;

    @media only screen and (max-width: 635px) {
        padding: 0 80px;
    }

    @media only screen and (max-width: 495px) {
        padding: 0 30px;
    }
}
</style>