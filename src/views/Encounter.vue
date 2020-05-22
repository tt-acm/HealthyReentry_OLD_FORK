<template>
<div>
  <!-- <appAlerts v-bind:alerts="alerts"/> -->
  <h4 class="text-muted">Record a TT Encounter</h4>
  <!-- <hr class="my-2" /> -->
  <div class="card mt-2">
    <div class="card-body bg-info p-2 text-white">
      <p class="mb-2">
        Search for colleagues by typing their name(s) or scanning their QR code.
      </p>
      <div class="d-flex mb-2 mx-0 align-items-center">
        <p class="mb-0">
          Log ALL encounters with TT colleagues where there is a breach of our current protocol.
        </p>
        <a class="ml-1" href="https://spark.thorntontomasetti.com/docs/DOC-17243" target="blank">
          <md-icon class="md-size-1x m-0" md-src="/imgs/info-circle-solid-small.svg" style="color:white"></md-icon>
        </a>
      </div>
      <p class="mb-0">
        For a group interaction, check the <i>Group</i> box (only one person needs to submit to account for everyone in the group).
      </p>
    </div>
  </div>

  <p v-if="encountersToday && encountersToday.length > 0" class="mb-1 mt-3">Today's Recorded Encounter(s):</p>
  <div v-if="encountersToday  && encountersToday.length > 0" class="row mx-0 mb-2">
    <div v-for="encounter in encountersToday">
      <span class="badge badge-pill badge-info mx-1">{{encounter.name}}</span>
    </div>
  </div>

  <div class="d-flex align-items-end">
    <b class="mt-3 mb-0">Your Encounter(s):</b>
    <a class="ml-1" href="https://core-studio.gitbook.io/encounter/faq#what-counts-as-an-interaction-that-should-be-logged" target="blank">
      <md-icon class="md-size-1x m-0" md-src="/imgs/info-circle-solid-small.svg" ></md-icon>
    </a>
  </div>

  <div class="input-group mb-2 d-flex justify-content-between">
    <div class="mt-1 ml-0 mr-2" style="min-width:18rem;">
      <autocomplete v-if="minUsers.length > 0" label="Encounters:" v-bind:items="minUsers" v-bind:split="splitChar" :frequentEncounters="frequentEncounters" placeholder="Search by email or name" @sendBack="getAutoFillUser"></autocomplete>
      <p v-else class="text-muted"> No other user is available at this moment, please check again later.</p>
    </div>
    <div v-if="disableQRScanning" class="mt-2 ml-2 mr-auto">
      <md-tooltip md-direction="top">Scanning QR code is not available on current browser</md-tooltip>
      <i class="fas fa-qrcode fa-2x text-muted"></i>
    </div>
    <div v-else class="mt-2 ml-2 mr-auto">
      <md-tooltip md-direction="top">Open camera to scan QR code</md-tooltip>
      <i class="fas fa-qrcode fa-2x" @click="preLaunchCamera()"></i>
    </div>
  </div>
  <small>NOTE: You will only be able to search for employees who have opted into the app.</small>

  <div v-if="encountered" class="row mx-0 mb-1">
    <div v-for="encounter in encountered">
      <span class="badge badge-pill badge-info mx-1">{{encounter.name}}</span>
      <button type="button" class="close text-center" aria-label="Close" v-on:click="removeUser(encounter)" data-toggle="modal" data-target="#deleteUserModal">
        <span class="text-center" aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
  <div class="form-check mt-2">
    <input v-if="encountered.length > 1" class="form-check-input" type="checkbox" v-model="isGroup" id="defaultCheck1">
    <input v-else class="form-check-input" type="checkbox" v-model="isGroup" id="defaultCheck1" disabled>
    <div class="d-flex align-items-end">
      <label class="form-check-label d-flex" for="defaultCheck1">
        Group
        <a class="mb-0 ml-1" href="https://core-studio.gitbook.io/encounter/faq#when-should-i-use-the-group-checkbox" target="blank">
          <md-icon class="md-size-1x m-0" md-src="/imgs/info-circle-solid-small.svg" ></md-icon>
        </a>
      </label>
    </div>

  </div>
  <qrcode-stream v-if="camera!=='off'" @decode="onDecode" :camera="camera"></qrcode-stream>

  <div class="row">
    <legend class="col-form-label col-sm-2 pt-0">Date:</legend>
    <div class="col-sm-10">
      <div class="form-check">
        <input class="form-check-input" type="radio" name="gridRadios" id="today" value="option1" @click="todaySelected=true;" checked>
        <label class="form-check-label" for="gridRadios1">
          Today
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="gridRadios" id="customDate" value="option2" @click="todaySelected=false;showDatePicker=true">
        <label class="form-check-label" for="gridRadios2">
          Pick a Date
        </label>
        <p v-if="!todaySelected" class="text-muted">{{showDisplayDate(date)}}</p>
        <vuejs-datepicker v-if="showDatePicker" v-model="date" :format="'MMM dd yyyy'" :inline="true" class="mb-4"></vuejs-datepicker>
      </div>
    </div>
  </div>

  <br>
  <md-list>
    <md-list-item class="py-0 mx-auto">
      <md-button class="md-primary md-raised" @click="showDialog=!showDialog" :disabled="disableSubmitUser" id="nextBtn" style="width:240px">
        <h6 class="mb-0">Next</h6>
      </md-button>
    </md-list-item>

    <md-list-item class="mx-auto py-0">
      <md-button class="md-primary mx-auto">
        <router-link :to="{ name: 'menu' }"> <p class="text-muted">Back</p> </router-link>
      </md-button>
    </md-list-item>
  </md-list>


  <!-- Modal -->
  <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
      <md-dialog-title>Review Your Encounter</md-dialog-title>
      <md-subheader class="mx-2 mb-3">
        Review the name(s) and date listed below then click <b class="ml-1">Submit</b>. You will not be able to edit this once submitted. To edit, click <b class="ml-1">Go Back</b>.
      </md-subheader>
      <md-content class="mx-4">

        <div class="card mx-auto">
          <div class="card-header">
            <h6>Encounter Details<span v-if="isGroup" class="badge badge-warning ml-2">Group Encounter</span></h6>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><b>Name(s):</b>
              <div v-if="encountered.length>0">
                <div v-for="encounter in encountered">
                  <span class="mx-1">{{encounter.name}}</span>
                </div>
              </div>
            </li>
            <li class="list-group-item"><b>Date:</b>
              <p class="mb-0">{{showDisplayDate(date)}}</p>
              <!-- <p v-else> Custom Date</p> -->
            </li>
          </ul>
        </div>
      </md-content>



      <md-dialog-actions class="mx-4 my-2">
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary md-raised" @click="showDialog = false;saveEncounters()">Submit</md-button>
      </md-dialog-actions>
    </md-dialog>





</div>
</template>
<script src="./vue-browser-detect-plugin.umd.js"></script>

<script>
import Vue from 'vue';
import Vuex from 'vuex';
import autocomplete from "@/components/autoComplete.vue";
import {
  QrcodeStream
} from 'vue-qrcode-reader'
// import appAlerts from "components/appAlerts.vue";
import vuejsDatepicker from 'vuejs-datepicker';

// app Alert
// https://github.com/tt-acm/CORE.Bootstrap.jspkg/blob/958451080ef1115c1dc07bb2851882dcfad8628f/src/bootstrap/css/lib/bootstrap4/_alert.scss

// const browser = detect();
// console.log(browser.name);

export default {
  name: "encounter",
  components: {
    autocomplete,
    vuejsDatepicker,
    QrcodeStream
    // appAlerts
  },
  created() {},
  beforeMount() {
    this.$api.get("/api/user/get-all").then(all => {

      console.log("getalluser", all);

      const arrayToObject = (array) =>
        array.reduce((obj, item) => {
          obj[item.name + "_" + item.email] = item
          return obj
        }, {})

      const dictionary = arrayToObject(all.data);
      console.log("dictionary", dictionary);
      Vue.set(this, "userDictionary", dictionary);
      Vue.set(this, "minUsers", Object.keys(dictionary));
    });

    this.$api.get("/api/encounters/find-frequent-encounters").then(mostEncountered => {
      const userToday = mostEncountered.data.filter(u=>u.encounteredToday===true);
      console.log("userToday", userToday);
      this.encountersToday = userToday;
      Vue.set(this, "frequentEncounters", mostEncountered.data.map(item=>item.name + "_" + item.email));
      Vue.set(this, "encountersToday", mostEncountered.data.filter(u=>u.encounteredToday===true));

      if (this.$route.params.scannedUser) this.searchUserByEmail(this.$route.params.scannedUser);
    });


  },
  mounted() {
    const buttonWidth = screen.width*0.6 > 280? screen.width*0.7 : 280;

    // window.$("#nextBtn").css("width", buttonWidth + 'px');
    // console.log("this.direct", this.$browserDetect.isChromeIOS);
    // console.log("this route param", this.$route.params);
  },
  data() {
    return {
      splitChar: "",
      encountered: [],
      userDictionary: [],
      minUsers: [],
      //mostEncountered: [],
      todaySelected: true,
      date: new Date(),
      alerts: null,
      // disableSubmitDate: false,
      disableSubmitUser: true,
      camera: 'off',
      encountersToday: null,
      isGroup: false,
      showDatePicker: false,
      frequentEncounters: null,
      showDialog: false,
      disableQRScanning: false
    };
  },
  watch: {
    date() {
      this.checkPast();
    },
    encountered() {
      this.disableSubmitUser = true;
      console.log("this.encountered", this.encountered);
      if (this.encountered.length > 0) {
        // this.$emit("getNotification", [{
        //   message: "Please selector at least one TT employee as your encounter.",
        //   type: "warning"
        // }]);
        this.disableSubmitUser = false;
        console.log("this.disableSubmitUser", this.disableSubmitUser);
      }
    }
  },
  computed: Vuex.mapState({
    user: state => state.user,
  }),
  methods: {
    preLaunchCamera() {
      if (this.$browserDetect.isChromeIOS) {
        // this.$api.$emit("getNotification", [{
        //   message: "This function cannot be used on Chrome IOS. Please scan the QR code using your device's native camera.",
        //   type: "warning"
        // }]);
        this.disableQRScanning = true;
      }
      else this.camera = "auto";
    },
    onDecode(incomingStr) {
      const decodedString = incomingStr.split("/").slice(-1)[0];
      console.log("decodedString", decodedString);
      this.searchUserByEmail(decodedString);
    },
    searchUserByEmail(emailStr){
      if (emailStr === this.user.email.toLowerCase()) {
        this.$emit("noDupUser");
      } else if (emailStr && emailStr.toLowerCase().indexOf("@thorntontomasetti.com") > 0) {
        var body = {
          "email": emailStr
        }
        this.$api.post("/api/user/user-by-email", body).then(res => {
          const encountered = this.encountered.map(en=>en._id);

          if (res && res._id) {
            if (encountered.includes(res._id)){//encounter already exists
              // this.$emit("encounterExists", [{
              //   message: "Encounter already exists.",
              //   type: "warning"
              // }]);
            }
            else {
              this.encountered.push(res);//adding scanned user to encounter
              this.$emit("scanSucceed");

              this.camera = 'off';
            }
          }

        });
      }
    },
    showDisplayDate(date) {
      return this.moment(date).format('ll');
    },
    getAutoFillUser(k) {
      if (k.index != -1) {
        var u = this.userDictionary[k.match];
        if (this.encountered.length === 0){
          let newList = [];
          newList.push(u);
          this.encountered = newList;
        }
        else if (this.encountered.map(e=>e._id).indexOf(u._id) === -1) {
          this.encountered.push(u);
        }
        else{
          //user already added as encounter
          this.$emit("getNotification", [{
            message: "This user has already been added as your encounter.",
            type: "warning"
          }]);
        }
      }
    },
    formatDate() {
      var formattedDate = this.moment(this.date).format('YYYY/MM/DD');
      // Vue.set(this, "date", formattedDate);
      return formattedDate;
    },
    // getSelectedDate() {
    //   if (this.todaySelected) {
    //     this.date = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    //   } else {
    //     //this
    //     //var formattedDate =  moment(this.date).format('YYYY/MM/DD');
    //     //console.log("formattedDate", formattedDate);
    //     //Vue.set(this,"date", formattedDate);
    //   }
    // },
    removeUser(e) {
      this.encountered.splice(
        this.encountered.indexOf(e),
        1
      );
    },
    checkPast() {
      // this.disableSubmitDate = false;
      if (this.date > new Date()) {
        //selected date is in the past
        // this.disableSubmitDate = true;

        this.$emit("getNotification", [{
          message: "Selected date cannot be in the future.",
          type: "warning"
        }]);
      }
      else{
        //time to hide the datepicker
        // this.showDatePicker = false;
      }

    },
    saveEncounters() {
      console.log("this.encountered", this.encountered);

      var body = {
        encounters: this.encountered,
        date: this.date,
        isGroup: this.isGroup
      };
      //console.log(body);
      this.$api.post("/api/encounters/add-many", body).then(result => {
        // console.log("result", result);
        if (result) {
          this.$emit("encounterMsg");
          this.$router.push({
            name: 'menu'
          }); //return back to menu after saving
        }
      });
    }
  }
};
</script>

<style scoped>
/* .wrapper {
  position:absolute;
  top:0;
  right:0;
  height:25px;
  background:green;
} */
/* .d-flex {
  max-width: 350px;
} */
/* .md-theme-default{
  height: 400px;
} */
/* .md-list-item-content {
  padding-top: 0px;
  padding-bottom: 0px;
} */
/* .md-dialog /deep/ .md-dialog-container {
  transform: none;
} */


</style>
