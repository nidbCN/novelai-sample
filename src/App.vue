<template>
  <v-app>
      <NavBar/>
    <v-main>
      <MainPage/>
    </v-main>
  </v-app>
</template>

<script>
import MainPage from './pages/MainPage';
import NavBar from "@/components/NavBar";

export default {
  name: 'App',

  components: {
    NavBar,
    MainPage,
  },
};
</script>
