<template>
  <div class="px-2 pb-4">

    <!-- Modal -->
    <div class="modal fade" id="updateConfModal" tabindex="-1" role="dialog" aria-labelledby="updateConfModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="updateConfModalLabel">Updates</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="px-4">
              <b>Status to set: </b>
              <p>
                <i :class="'fas fa-circle fa-xs ' + enumStatusMap.filter(s => s.code === userUpdateData.statusCodeToSet)[0].css_key "></i>
                {{ enumStatusMap.filter(s => s.code === userUpdateData.statusCodeToSet)[0].label }}
              </p>
            </div>
            <b class="px-4">Persons selected: </b>
            <ul>
              <li v-for="usr in selectedUsers" :key="usr._id">{{ usr.name }}</li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-tertiary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-tertiary" @click="sendUpdateData">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <h5 class="text-muted">Admin Dashboard</h5>

    <hr class="my-3"/>

    <p class="mb-2">

      <div class="row mb-1">

        <div class="col-lg-3 col-md-6 mb-1">

          <button class="btn btn-outline-tertiary dropdown-toggle" type="button" id="officeListMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Office List
          </button>
          <div class="dropdown-menu p-2 custom-dd-size" aria-labelledby="officeListMenu">

            <div class="row">
              <div class="col-12 pl-3">
                <button class="btn btn-outline-tertiary" type="button" @click="setOfficeFilterForAll(true); updateUsersInView();">
                  Select All
                </button>
                <button class="btn btn-outline-tertiary" type="button" @click="setOfficeFilterForAll(false); updateUsersInView();">
                  Select None
                </button>
              </div>
            </div>

            <hr />

            <div class="row">
              <div class="col-6">
                <p v-for="ofc in officesList.slice(0, 15)" :key="ofc.LocationID" class="pl-4">
                  <input class="form-check-input" type="checkbox" v-model="ofc.selected" @change="updateUsersInView">
                  {{ofc.LocationName}}
                </p>
              </div>
              <div class="col-6">
                <p v-for="ofc in officesList.slice(15)" :key="ofc.LocationID">
                  <input class="form-check-input" type="checkbox" v-model="ofc.selected" @change="updateUsersInView">
                  {{ofc.LocationName}}
                </p>
              </div>
            </div>

          </div>

          <small><i>
          <span class="text-muted">
            <span v-if="allOfficesSelected">
              All offices selected
            </span>
            <span v-else>
              {{ officesSelectedCount }} offices selected
            </span>
          </span>
          </i></small>

        </div>

        <div class="col-lg-3 col-md-6 mb-1">
          <input
            type="text"
            class="form-control"
            placeholder="Filter by name"
            v-model="nameFilter"
            @keyup="updateUsersInView"
            />
        </div>

        <div class="col-lg-3 col-md-6 mb-1">

          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="pageNav">Items per page:</span>
            </div>
            <select class="form-control" v-model="itemsOnPage" @change="setItemsOnPage(itemsOnPage)">
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
              <option>{{ users.length }}</option>
            </select>
          </div>

        </div>

        <div class="col-lg-3 col-md-6 mb-1">

          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="pageNav">Current page:</span>
            </div>
            <input
              type="number"
              min="1"
              class="form-control"
              v-model="pageNo"
              aria-label="Current page number"
              aria-describedby="pageNav"
            />
            <div class="input-group-append">
              <span
                :style="'cursor: ' + (((pageNo-1) < 1) ? 'not-allowed' : 'pointer') "
                @click="setPageNo(pageNo-1)"
                :class="'input-group-text ' + (((pageNo-1) < 1) ? 'disabled' : '') "
                id="pageNav"
              ><i class="fas fa-chevron-left"></i></span>
            </div>
            <div class="input-group-append">
              <span
                :style="'cursor: ' + (((pageNo) * itemsOnPage >= users.length) ? 'not-allowed' : 'pointer') "
                @click="setPageNo(pageNo+1)"
                :class="'input-group-text ' + (((pageNo) * itemsOnPage >= users.length) ? 'disabled' : '') "
                id="pageNav"
              ><i class="fas fa-chevron-right"></i></span>
            </div>
          </div>

        </div>

      </div>


      <div class="d-flex mb-2">

        <!-- <div class="col-lg-11 col-sm-9"> -->

          <button id="actionDropdown" type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Action
          </button>
          <div class="dropdown-menu" aria-labelledby="actionDropdown">
            <span class="dropdown-item text-muted"><small><i>Applies to selected persons only</i></small></span>

            <div class="dropdown-divider"></div>

            <span class="dropdown-item" data-toggle="modal" data-target="#updateConfModal"
              @click="userUpdateData.statusCodeToSet = 0;"
            ><i class="fas fa-circle fa-xs en_green"></i> &nbsp;&nbsp; Mark green</span>
            <span class="dropdown-item" data-toggle="modal" data-target="#updateConfModal"
              @click="userUpdateData.statusCodeToSet = 1;"
            ><i class="fas fa-circle fa-xs en_orange"></i> &nbsp;&nbsp; Mark orange</span>
            <span class="dropdown-item" data-toggle="modal" data-target="#updateConfModal"
              @click="userUpdateData.statusCodeToSet = 2;"
            ><i class="fas fa-circle fa-xs en_red"></i> &nbsp;&nbsp; Mark red</span>

            <div class="dropdown-divider"></div>

            <span class="dropdown-item" data-toggle="modal" data-target="#updateConfModal"
              @click="userUpdateData.statusCodeToSet = 3;"
            ><i class="fas fa-circle fa-xs en_blue"></i> &nbsp;&nbsp; Mark blue</span>

          </div>

        <!-- </div> -->

        <!-- <div class="col-lg-1 col-sm-3"> -->
          <button type="button" class="btn btn-outline-tertiary ml-auto" @click="downloadSelectedAsCSV();">
            Download
          </button>
        <!-- </div> -->

      </div>

      <table class="table table-striped table-hover table-sm">

        <thead>
          <tr>
            <th style="width: 15%" class="text-center">
              <small><i>
                <span
                  style="cursor: pointer;"
                  @click="updInviewUserSelectedState(true)"
                >
                All
                </span>
                |
                <span
                  style="cursor: pointer;"
                  @click="updInviewUserSelectedState(false)"
                >
                None
                </span>
                |
                <span
                  style="cursor: pointer;"
                  @click="updInviewUserSelectedState('invert')"
                >
                Invert
                </span>
              </i></small>
              <br />
              <i
                style="cursor: pointer"
                :class="'fas fa-caret-' + (sortAsc ? 'up' : 'down') + ' ' + (sortBy === 'selected' ? '' : ' disabled')"
                @click="sortUsers('selected', !sortAsc)"
              ></i>
              Select
            </th>
            <th style="width: 5%" class="text-center">
              <i
                style="cursor: pointer"
                :class="'fas fa-caret-' + (sortAsc ? 'up' : 'down') + ' ' + (sortBy === 'status' ? '' : ' disabled')"
                @click="sortUsers('statusCode', !sortAsc)"
              ></i>
              Status
            </th>
            <th style="width: 25%">
              <i
                style="cursor: pointer"
                :class="'fas fa-caret-' + (sortAsc ? 'up' : 'down') + ' ' + (sortBy === 'name' ? '' : ' disabled')"
                @click="sortUsers('name', !sortAsc)"
              ></i>
              Name
            </th>
            <th style="width: 20%">
              <i
                style="cursor: pointer"
                :class="'fas fa-caret-' + (sortAsc ? 'up' : 'down') + ' ' + (sortBy === 'officeCode' ? '' : ' disabled')"
                @click="sortUsers('officeCode', !sortAsc)"
              ></i>
              Office
            </th>
            <th style="width: 20%">
              <i
                style="cursor: pointer"
                :class="'fas fa-caret-' + (sortAsc ? 'up' : 'down') + ' ' + (sortBy === 'lastUpdated' ? '' : ' disabled')"
                @click="sortUsers('lastUpdated', !sortAsc)"
              ></i>
              Last Updated
            </th>
            <th style="width: 15%">
              <i
                style="cursor: pointer"
                :class="'fas fa-caret-' + (sortAsc ? 'up' : 'down') + ' ' + (sortBy === 'dateOfConsent' ? '' : ' disabled')"
                @click="sortUsers('dateOfConsent', !sortAsc)"
              ></i>
              Consent Date
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in usersInView" :key="user.id">
            <td style="width: 15%" class="text-center">
              <i
                style="cursor: pointer"
                :class="'far ' + (user.selected ? 'fa-check-square' : 'fa-square')"
                @click="user.selected = !user.selected"
              ></i>
            </td>
            <td style="width: 5%" class="text-center">
              <i :class="'fas fa-circle ' + user.status.css_key"></i>
            </td>
            <td style="width: 25%">
              {{ user.name }}
            </td>
            <td style="width: 20%">
              {{ user.officeCode }}
            </td>
            <td style="width: 20%">
              {{ user.lastUpdatedFormatted }}
            </td>
            <td style="width: 15%">
              {{ user.dateOfConsentFormatted }}
            </td>
          </tr>
        </tbody>

      </table>

    </p>
  </div>
</template>



<script>
import enumStatusMap from "../../server/util/enumStatusMap.js";

// ref: https://stackoverflow.com/questions/7641791/javascript-library-for-human-friendly-relative-date-formatting
function fuzzyTime(date) {

  var delta = Math.round((+new Date - date) / 1000);

  var minute = 60,
      hour = minute * 60,
      day = hour * 24,
      week = day * 7;

  var fuzzy;

  if (isNaN(delta)) {
    fuzzy = '---';
  } else if (delta < 30) {
    fuzzy = 'just now';
  } else if (delta < minute) {
    fuzzy = `${delta} seconds ago`;
  } else if (delta < 2 * minute) {
    fuzzy = 'a minute ago'
  } else if (delta < hour) {
    fuzzy = `${Math.floor(delta / minute)} minutes ago`;
  } else if (Math.floor(delta / hour) == 1) {
    fuzzy = '1 hour ago'
  } else if (delta < day) {
    fuzzy = `${Math.floor(delta / hour)} hours ago`;
  } else if (delta < day * 2) {
    fuzzy = 'yesterday';
  } else if (delta < day * 10) {
    fuzzy = `${Math.floor(delta / day)} days ago`;
  } else {
    fuzzy = `${date.toDateString()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  return fuzzy;
}

export default {
  beforeMount() {

    this.refreshData();

  },
  created() {},
  mounted() {
    console.log("enumStatusMap", enumStatusMap);
  },
  data() {
    return {
      pageNo: 1,
      itemsOnPage: 10,
      nameFilter: "",
      sortBy: null,
      sortAsc: true,
      officesList: [],
      usersInView: [],
      users: [],
      enumStatusMap: enumStatusMap,
      userUpdateData: {
        statusCodeToSet: -1,
        selectedUserIds: []
      }
    };
  },
  computed: {
    officesSelectedCount() {
      return this.officesList.reduce((a, c) => a + (c.selected ? 1 : 0), 0);
    },
    allOfficesSelected() {
      return this.officesList.every(o => o.selected);
    },
    selectedUsers() {
      return this.usersInView
                  .filter(u => u.selected);
    }
  },
  methods: {
    downloadSelectedAsCSV() {
      let tot = "Name,Status,Office,LastUpdated";
      let csv = this.selectedUsers
                    .map(u => `${u.name},${u.status.label},${u.officeCode},${String(this.moment(u.lastUpdated).format('lll')).replace(/\,/g, '')}`)
                    .reduce((tot, cur) => tot + "\n" + cur, tot);
      let dlTrigger = document.createElement('a');
      dlTrigger.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
      dlTrigger.setAttribute('download', 'encounters.csv');
      dlTrigger.style.display = 'none';
      document.body.appendChild(dlTrigger);
      dlTrigger.click();
      document.body.removeChild(dlTrigger);
    },
    updateUsersInView() {

      let officeArr = this.officesList
                            .filter(o => o.selected)
                            .map(o => o.LocationName);
      let officeFilteredUsers = this.users.filter(u => officeArr.includes(u.location));

      console.log("officeFilteredUsers", officeFilteredUsers);

      let nameFilteredUsers = officeFilteredUsers;
      if(this.nameFilter !== "") {
        let nfLower = this.nameFilter.toLowerCase();
        nameFilteredUsers = nameFilteredUsers.filter(u => u.name.toLowerCase().includes(nfLower));
      };

      let st = (this.itemsOnPage * (this.pageNo - 1));
      let ed = (this.itemsOnPage * (this.pageNo));
      let pageFilteredUsers = nameFilteredUsers.slice(st, ed);

      this.usersInView = pageFilteredUsers.map(u => {
        let hasStatus = u.status && u.status.status !== null && u.status.status !== undefined;
        let code = (hasStatus) ? u.status.status : -1;
        let status = enumStatusMap.filter(i => i.code === code)[0];
        let updateDate = (hasStatus) ? fuzzyTime(new Date(u.status.date)) : '---';
        let user = {
          id: u._id,
          selected: false,
          name: u.name,
          officeCode: u.location,
          status: status,
          statusCode: status.code,
          lastUpdatedFormatted: updateDate,
          lastUpdated: hasStatus ? u.status.date : null,
          dateOfConsent: u.dateOfConsent ? new Date(u.dateOfConsent) : 0,
          dateOfConsentFormatted: u.dateOfConsent ? new Date(u.dateOfConsent).toDateString() : 'Not Available'
        };
        return user;
      });

    },
    refreshData() {

      let that = this;
      let officesSet = new Set();

      let apiurl = `/api/admin/get-all-users`;
      this.$api.get(apiurl)
        .then(userData => {
          var users = userData.data;
          users.sort((a, b) => (a.name < b.name) ? -1 : 1)
          that.users = users;
          console.log("that.users", that.users);
          that.users.forEach(u => {
            let loc = u.location || 'unknown';
            officesSet.add(loc);
          });
          this.officesList = Array.from(officesSet).map(o => { return { LocationName:o, selected: true } });
          that.updateUsersInView();
        })
        .catch(err => {
          console.log(err);
        });

    },
    sendUpdateData() {

      this.userUpdateData.selectedUserIds = this.selectedUsers
                                                .map(u => { return { userId: u.id }});

      let that = this;

      this.$api.post("/api/admin/update-users", this.userUpdateData)
        .then(updatedUsers => {

          updatedUsers.forEach(nu => {
            let idx = this.users.findIndex(u => u._id === nu._id);
            that.users[idx] = nu;
            that.updateUsersInView();
          });

          that.userUpdateData.statusCodeToSet = -1;
          that.userUpdateData.selectedUserIds = [];

        })
        .catch(err => {
          console.log(err);
        });

      $(function () {
        $('#updateConfModal').modal('toggle');
      });

    },
    updInviewUserSelectedState(val) {
      this.usersInView.forEach(u => u.selected = (val === 'invert') ? !u.selected : val);
    },
    sortUsers(key, inAsc) {
      this.sortBy = key;
      this.sortAsc = inAsc;
      let i = this.sortAsc ? 1 : -1;
      this.usersInView.sort((a, b) => {
        return (a[this.sortBy] < b[this.sortBy])
        ? -i : (a[this.sortBy] > b[this.sortBy])
        ?  i : 0;
      });
    },
    setPageNo(newNo) {
      if (newNo < 1 || ((newNo-1) * this.itemsOnPage) > this.users.length) return;
      this.pageNo = parseInt(newNo);
      this.updateUsersInView();
    },
    setItemsOnPage(newNo) {
      if (newNo < 1) return;
      this.itemsOnPage = parseInt(newNo);
      this.updateUsersInView();
    },
    setOfficeFilterForAll(val) {
      this.officesList.forEach(o => o.selected = val);
    }
  }
};
</script>

<style scoped>
.custom-dd-size {
  padding-left: 40px;
  width: 400px !important;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.disabled {
  color: #DEDEDE;
}

.en_green {
  color: #00C851;
}

.en_orange {
  color: #FF9800;
}

.en_red {
  color: #DC3545;
}

.en_blue {
  color: #007BFF;
}

.unknown {
  color: #898989;
}
</style>
