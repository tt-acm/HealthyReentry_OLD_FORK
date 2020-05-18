<template>
  <div id="app">
    <!-- <Navbar /> -->
    <!-- <hr /> -->
      <md-app>
        <md-app-toolbar class="md-primary" id="appHeader" style="background-color:rgb(52, 58, 64);">
          <a class="md-title" href="/">
            <span>Healthy Reentry</span>
            <small style="color:lightblue;margin-left:4px"><i>alpha</i></small>
          </a>

          <md-badge v-if="$auth.isAuthenticated && $auth.user" class="md-accent" md-content="12" style="margin-left:auto;margin-top:2px;">
            <md-menu md-size="small" md-align-trigger>
              <md-button class="md-icon-button" style="width=32px" md-menu-trigger>
                <md-avatar style="transform: scale(0.8);">
                  <!-- <img src="https://gravatar.com/avatar/4dacc85086497a31cf2c646031d2cb01?d=retro" alt="Avatar"> -->
                  <img :src="$auth.user.picture" alt="Avatar">
                </md-avatar>
              </md-button>

              <md-menu-content>
                <md-menu-item disabled>{{$auth.user.name}}</md-menu-item>
                <md-menu-item>Profile</md-menu-item>
                <md-menu-item @click="logout()">Log out</md-menu-item>
              </md-menu-content>
            </md-menu>
          </md-badge>
          <a v-else class="md-title md-dense" style="margin-left:auto" @click="login()" href="#!">
            Login
          </a>

        </md-app-toolbar>

        <md-app-content>
          <!-- <button class="btn btn-primary" @click="getUser()"> getuser</button> -->
          <router-view />
        </md-app-content>



      </md-app>
      <md-toolbar class="md-primary md-dense" id="appFooter" style="height:40px">
        <span class="md-subheading md-layout" style="margin-left:auto;margin-top:0px;margin-bottom:0px">
          <a href="https://coresso.thorntontomasetti.com/eula" target="_blank" style ="margin-right: 16px;">
            <span style="color:white;">License</span>
          </a>
          <a href="http://core.thorntontomasetti.com" id="core-logo-import" target="_blank" style ="margin-right: 8px;margin-top: 0px;">
            <md-icon md-src="/imgs/CORE.svg" style="width:auto"/>
          </a>
          <div>
            &nbsp;&nbsp;&copy; {{new Date().getFullYear()}}
          </div>
        </span>
      </md-toolbar>
  </div>
</template>

<script>
// import Navbar from '@/partials/Navbar.vue'

export default {
  name: 'App',
  components: {
    // Navbar
  },
  data() {
    return {
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
.md-app {
  height: 100vh;
}
</style>
