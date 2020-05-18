<template>
<!-- <div class="mx-auto" style="transform: translateY(150%)"> -->
<div id="mainControls">
  <md-list>
    <md-list-item class="mx-auto">
      <router-link :to="{ name: 'status', params: { id: user._id}}">
        <!-- <button type="button" class="btn btn-lg btn-block btn-outline-primary text-center my-2">
          Report Your Health Status
        </button> -->
        <md-button class="md-raised md-accent" style="width: 280px;">
          Report Your Health Status
        </md-button>
      </router-link>
    </md-list-item>

    <md-list-item  class="mx-auto">
      <router-link :to="{ name: 'encounter', params: { id: user._id}}">
        <!-- <button type="button" class="btn btn-lg btn-block btn-outline-primary text-center my-2">
          Record a TT Encounter
        </button> -->
        <md-button class="md-raised md-accent" style="width: 280px; margin-top: 16px">
          Record a TT Encounter
        </md-button>
      </router-link>
    </md-list-item>

    <md-list-item  class="mx-auto">
      <router-link :to="{ name: 'QRCode', params: { id: user._id}}">
        <!-- <button type="button" class="btn btn-lg btn-block btn-outline-primary text-center my-2">
          Display QR Code
        </button> -->
        <md-button class="md-raised md-accent" style="width: 280px; margin-top: 16px">
          Display QR Code
        </md-button>
      </router-link>
    </md-list-item>
  <!-- </div> -->
</md-list>
</div>
</template>
<script>
// import store from "store/index.js";

export default {
  // props: ["user"],
  created() {},
  mounted() {
    // $(window).on('load',function(){
    //     $('#exampleModalLong').modal('show');
    // });
    // $('#disclosure').modal('show');
    // console.log("user", this.user);

    window.$("#mainControls").css("transform", 'translateY(' + screen.height/2*0.5 + 'px)');
  },
  data() {
    return {
      user:{
        _id: null
      }
    };
  },
  // computed: Vuex.mapState({
  //   user: state => state.user,
  // }),
  methods: {}
};
</script>

<style scoped>
</style>
