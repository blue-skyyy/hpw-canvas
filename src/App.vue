<template>
  <div id="app">
    <hpw-canvas></hpw-canvas>
    <!-- <test></test> -->
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js Appss" /> -->
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import hpwCanvas from "./components/index";
// import test from "./components/a";

export default {
  name: "App",
  components: {
    // HelloWorld,
    hpwCanvas
    // test
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
