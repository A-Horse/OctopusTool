<template>
  <section class="container">
    <div>
      <nuxt-link class="index-link" v-bind:to="'/low-poly'">LOW POLY</nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  head () {
    return {
      title: 'Developer and Designer Tool - Octopus Tool',
      meta: [
        { hid: 'description', name: 'description', content: 'Generate low poly image with a click!' },
        { hid: 'og:title', name: 'og:title', content: 'Design Tool - Low poly image generation.' },
        { hid: 'og:type', name: 'og:type', content: 'website' }
      ]
    }
  },
  components: {

  }
}
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .index-link {

  }
</style>
