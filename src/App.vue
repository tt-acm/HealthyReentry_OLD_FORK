<template>
<div class="page-container" id="app">
  <Navbar />
  <!-- <hr /> -->
  <!-- <md-content class="mx-3" style="max-width:600px"> -->
  <span v-model="notificationMsg"></span>
  <md-content class="mx-auto" style="padding-top:75px;padding-bottom:40px;">
    <router-view class="px-3" @disclosureMsg="disclosureMsg" @statusMsg="statusMsg" @encounterMsg="encounterMsg" @noDupUser="noDupUser" @scanSucceed="scanSucceed"/>
  </md-content>

  <!-- Notifications -->
  <md-snackbar md-position="center" :md-duration="notificationDuration" :md-active.sync="showDisclosureMsg" md-persistent class="px-2" style="margin-bottom:55px; background-color: gray">
    <span> Your consent has been submitted. A copy of the disclosure and consent has been sent to your TT email for reference (keep an eye out for an email from healthyreentry-notifications@thorntontomasetti.com).</span>
  </md-snackbar>
  <md-snackbar md-position="center" :md-duration="notificationDuration" :md-active.sync="showStatusMsg" md-persistent style="margin-bottom:55px; background-color: gray">
    <span> Status successfully recorded.</span>
  </md-snackbar>
  <md-snackbar md-position="center" :md-duration="notificationDuration" :md-active.sync="showEncounterMsg" md-persistent style="margin-bottom:55px; background-color: gray">
    <span> Encounter submitted successfully.</span>
  </md-snackbar>
  <md-snackbar md-position="center" :md-duration="notificationDuration" :md-active.sync="showDupUserMsg" md-persistent style="margin-bottom:55px; background-color: orange">
    <span> Cannot add yourself as an encounter.</span>
  </md-snackbar>
  <md-snackbar md-position="center" :md-duration="notificationDuration" :md-active.sync="scanSucceedMsg" md-persistent style="margin-bottom:55px; background-color: gray">
    <span> QR code scanned submitted successfully.</span>
  </md-snackbar>

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
    return {
      notificationDuration: 4000,
      showDisclosureMsg: false,
      showStatusMsg: false,
      showEncounterMsg: false,
      showDupUserMsg: false,
      scanSucceedMsg: false,
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
    statusMsg: function(alerts) { this.showStatusMsg = true; },
    disclosureMsg: function() { this.showDisclosureMsg = true; },
    encounterMsg: function() { this.showEncounterMsg = true; },
    noDupUser: function() { this.showDupUserMsg = true; },
    scanSucceed: function() { this.scanSucceedMsg = true; },
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
