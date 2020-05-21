<template>
<div class="page-container" id="app">
  <Navbar />
  <!-- <hr /> -->
  <!-- <md-content class="mx-3" style="max-width:600px"> -->
  <span v-model="notificationMsg"></span>
  <md-content class="mx-auto" style="padding-top:75px;padding-bottom:40px;">
    <!-- <button class="btn btn-primary" @click="getUser()"> getuser</button> -->
    <router-view class="px-3" @getNotification="showNotification"/>
  </md-content>


  <md-snackbar md-position="center" :md-duration="notificationDuration" :md-active.sync="showMsg" md-persistent>
    <span> Status successfully recorded.</span>
    <!-- <md-button class="md-icon-button" @click="showMsg = false">
      <md-icon class="fas fa-times"></md-icon>
    </md-button> -->
  </md-snackbar>

  <!-- <Footer /> -->
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
    return {
      notificationDuration: 4000,
      showMsg: false,
      notificationMsg: "nothing"
    };
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
      console.log("this.user", this.$auth.userDB);

    },
    login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    },
    showNotification: function(alerts) {
      console.log("got alert", alerts);
      // this.notificationDuration = alerts.duration;
      // this.notificationMsg = this.message;
      this.showMsg = true;
      // this.alerts = alerts;
      // setTimeout(() => {
      //   this.showMsg = false;
      // }, this.notificationDuration);
    }
  }
}
</script>

<style>
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

/* #app {
  height: 100vh-80px;
} */
.md-dialog /deep/ .md-dialog-container {
  transform: none;
}

</style>
