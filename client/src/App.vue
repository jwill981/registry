<template>
  <div id="app">
    <h1>Wedding Registries</h1>
    <div id="nav">
      <router-link to="/">View All Registries</router-link> |
      <router-link to="/add">Add/Edit a Couple or Item</router-link>
    </div>
    <router-view/>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/footer.vue'

export default {
  components: {
    Footer
  },
}

</script>


<style>
#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #7eb0da;
}

#nav a.router-link-exact-active {
  color: #0062ff;
}
</style>
