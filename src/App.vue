<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <span> {{ this.website.barTitle }} </span>

      <v-spacer></v-spacer>

      <v-btn v-for="(link, i) in website.links" :key="i" text :href="link.link">
        <v-icon>{{ link.icon }}</v-icon>
        {{ link.text }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <MainPage/>
    </v-main>
  </v-app>
</template>

<script>
import MainPage from './components/MainPage';
import config from "@/config";

export default {
  name: 'App',

  components: {
    MainPage,
  },

  data: () => ({
    website: {
      barTitle: "Novel AI frontend",
      links: [
        {
          icon: "mdi-github",
          text: "Github",
          link: "https://github.com/nidbCN/novelai-sample"
        }
      ]
    }
  }),
  mounted() {
    this.website = config.default.website;
  }
};
</script>
