<template>
  <div>
    <div class="container">
      <SearchForm />
      <div class="cities-container">
        <CityList />
      </div>
    </div>
  </div>
</template>

<script setup>
import CityList from '../components/CityList.vue';
import SearchForm from '../components/SearchForm.vue';
</script>

<style lang="scss" scoped>
div.container {
  position: relative;
  box-sizing: border-box;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 700px;
  margin: auto;
  flex-direction: column;

  padding: 0 100px;
  padding-bottom: 50px;

  @media only screen and (max-width: 580px) {
    padding: 0 16px;
  }
}
</style>