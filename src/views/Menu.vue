<template>
<!-- <div class="mx-auto" style="transform: translateY(150%)"> -->
<div class="mx-auto" id="mainControls">
  <md-list>
    <md-list-item class="mx-auto">
      <router-link :to="{ name: 'status', params: { id: user._id}}">
        <!-- <button type="button" class="btn btn-lg btn-block btn-outline-primary text-center my-2">
          Report Your Health Status
        </button> -->
        <md-button class="md-raised md-accent menu-button">
          <h6 class="my-3">Report Your Health Status</h6>
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

export default {
  // props: ["user"],
  created() {
    if (this.$auth.userDB) this.user = this.$auth.userDB;
    console.log("this.user", this.user);
  },
  mounted() {
    if (this.$auth.userDB) this.user = this.$auth.userDB;
    console.log("this.user2", this.user);
    // $(window).on('load',function(){
    //     $('#exampleModalLong').modal('show');
    // });
    // $('#disclosure').modal('show');
    // console.log("user", this.user);
    console.log("screen.width",screen.width);

    // const buttonWidth = screen.width*0.7 > 280? screen.width*0.7 : 280;
    const buttonWidth = screen.width*0.6 > 310? screen.width*0.7 : 310;

    console.log("buttonWidth",buttonWidth);

    window.$("#mainControls").css("transform", 'translateY(' + (screen.height/6) + 'px)');
    window.$(".menu-button").css("width", buttonWidth + 'px');
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
.md-button {
  height: 7vh;
}
</style>
