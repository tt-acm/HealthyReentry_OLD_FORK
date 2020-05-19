<template>
<div id="app">
  <Navbar />
  <!-- <hr /> -->

  <md-content>
    <!-- <button class="btn btn-primary" @click="getUser()"> getuser</button> -->
    <router-view />
  </md-content>



  <Footer />
</div>
</template>

<script>
import Navbar from '@/partials/Navbar.vue'
import Footer from '@/partials/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {};
  },
  mounted() {
    // $.get("https://s3-us-west-2.amazonaws.com/core-weblibrary/libraries/core-logo.svg.html", function(data) {
    //   console.log("data", data);
    //   $("#core-logo-import").html(data);
    // });
    // console.log("window.jquery", window);
  },
  methods: {
    getUser() {
      console.log("getting user", this.$auth.isAuthenticated);
      console.log("this.user", this.$auth.user);

    },
    login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
}
</script>

<style scoped>
#appFooter {
  position: fixed;
  left: 0;
  top: auto;
  bottom: 0;
  width: 100%;
  background-color: rgb(52, 58, 64);
  /* color: white; */
  /* text-align: center; */
}

.md-app {
  height: 100vh;
}
</style>
