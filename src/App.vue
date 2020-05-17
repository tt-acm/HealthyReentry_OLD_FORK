<template>
  <div class="page-container" id="app">
    <!-- <Navbar /> -->
    <!-- <hr /> -->
      <md-app>
        <md-app-toolbar class="md-primary" id="appHeader" style="background-color:rgb(52, 58, 64);">
          <a class="md-title" href="/">
            <!-- <span class="">Encounter</span> -->
            <span>Encounter</span>
            <small style="color:lightblue"><i>alpha</i></small>
          </a>

          <md-badge class="md-accent" md-content="12" style="margin-left:auto;margin-top:2px;">
            <md-menu md-size="medium" md-align-trigger>
              <md-button class="md-icon-button" style="width=32px" md-menu-trigger>
                <md-avatar style="transform: scale(0.8);">
                  <img src="https://gravatar.com/avatar/4dacc85086497a31cf2c646031d2cb01?d=retro" alt="Avatar">
                </md-avatar>
              </md-button>

              <md-menu-content>
                <md-menu-item v-if="user" disabled>{{user.sso.profile.name}}</md-menu-item>
                <md-menu-item>Profile</md-menu-item>
                <md-menu-item>Log out</md-menu-item>
              </md-menu-content>
            </md-menu>
          </md-badge>

        </md-app-toolbar>

        <md-app-content>
          <h2>Mirror Subpage</h2>
          <md-tabs md-sync-route>
            <md-tab id="tab-pages-1" md-label="About" to="/about">Subpage 1</md-tab>
            <md-tab id="tab-pages-2" md-label="Test" to="/test">Subpage 2</md-tab>
          </md-tabs>
          <router-view />
          <div>
            <!-- <md-bottom-bar md-sync-route>
              <md-bottom-bar-item to="/components/bottom-bar" exact md-label="Home" md-icon="home"></md-bottom-bar-item>
              <md-bottom-bar-item to="/components/bottom-bar/posts" md-label="Posts" md-icon="/assets/icon-whatshot.svg"></md-bottom-bar-item>
              <md-bottom-bar-item to="/components/bottom-bar/favorites" md-label="Favorites" md-icon="favorite"></md-bottom-bar-item>
            </md-bottom-bar> -->
          </div>
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
// import $ from "jquery";

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
