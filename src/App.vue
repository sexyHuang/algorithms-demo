<template>
  <img :src="logoImg" />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import logoImg from './assets/logo.png';

export default defineComponent({
  name: 'App',
  components: {},
  setup() {
    return {
      logoImg
    };
  }
});
</script>

<style >
</style>
