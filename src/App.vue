<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <NavBar/>
    </v-app-bar>

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
