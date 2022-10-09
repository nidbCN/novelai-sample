<template>
  <div>
    <span> {{ this.website.barTitle }} </span>

    <v-spacer/>

    <v-btn v-for="(link, i) in website.links" :key="i" text :href="link.link">
      <v-icon>{{ link.icon }}</v-icon>
      {{ link.text }}
    </v-btn>
  </div>
</template>

<script>
import config from "@/config";

export default {
  name: "NavBar",
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
}
</script>

<style scoped>

</style>
