<template>
  <div>
    <md-toolbar class="md-primary" id="appHeader" style="background-color:rgb(52, 58, 64);">
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

    </md-toolbar>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
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

</style>
