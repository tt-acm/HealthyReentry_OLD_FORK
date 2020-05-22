<template>
<!-- <div class="mx-auto" style="transform: translateY(150%)"> -->
<div id="mainControls">
  <md-list v-if="user">
    <md-list-item class="mx-auto">
      <router-link :to="{ name: 'status', params: { id: user._id}}">
        <!-- <button type="button" class="btn btn-lg btn-block btn-outline-primary text-center my-2">
          Report Your Health Status
        </button> -->
        <md-button class="md-raised md-accent menu-button">
          <h6 class="my-3 ">Report Your Health Status</h6>
        </md-button>
      </router-link>
    </md-list-item>

    <md-list-item  class="mx-auto">
      <router-link :to="{ name: 'encounter', params: { id: user._id}}">
        <!-- <button type="button" class="btn btn-lg btn-block btn-outline-primary text-center my-2">
          Record a TT Encounter
        </button> -->
        <md-button class="md-raised md-accent menu-button" style="margin-top: 16px">
          <h6 class="mb-0">Record a TT Encounter</h6>
        </md-button>
      </router-link>
    </md-list-item>

    <md-list-item  class="mx-auto">
      <router-link :to="{ name: 'displayqr', params: { id: user._id}}">
        <!-- <button type="button" class="btn btn-lg btn-block btn-outline-primary text-center my-2">
          Display QR Code
        </button> -->
        <md-button class="md-raised md-accent menu-button" style="margin-top: 16px">
          <h6 class="mb-0">Display QR Code</h6>
        </md-button>
      </router-link>
    </md-list-item>
  <!-- </div> -->
</md-list>
</div>
</template>
<script>
// import store from "store/index.js";

import Vuex from 'vuex';

export default {
  // props: ["user"],
  created() {
  },
  mounted() {
    this.mapButtonCSS();
  },
  updated() {
    this.mapButtonCSS();
  },
  data() {
    return {
    };
  },
  computed: Vuex.mapState({
    user: state => state.user,
  }),
  methods: {
    mapButtonCSS() {
      const buttonWidth = screen.width*0.6 > 310? screen.width*0.7 : 310;

      console.log("buttonWidth",buttonWidth);

      window.$("#mainControls").css("transform", 'translateY(' + (screen.height/6) + 'px)');
      window.$(".menu-button").css("width", buttonWidth + 'px');
    }
  }
};
</script>

<style scoped>
.md-button {
  height: 7vh;
}
</style>
