<template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container class="bg-grey-2">
      <q-page padding class="bgimg row items-center justify-center">
        <div class="row full-width">
          <div class="col-md-8 offset-md-2 col-xs-12 q-pl-md q-pr-md q-pt-sm">
            <q-card flat class="bg-white text-black">
              <div class="row">
                <div class="bgimg col-md-4 col-sm-3 q-pa-md"></div>
                <!-- <div class="backclimg col-md-4 col-sm-6 col-xs-12 q-pa-md">
                  <q-img
                    placeholder-src="~assets/images/logo.jpg"
                    src="~assets/images/logo.jpg"
                    spinner-color="white"
                  ></q-img>
                </div> -->
                <div class="changcl col-md-4 col-sm-6 col-xs-12">
                  <div class="q-pa-md">
                    <div
                      class="texclass text-h5 q-pb-md text-gray-900 text-center text-weight-bolder"
                    >
                      SUPC ScanItem
                    </div>
                    <q-form @submit="onSubmit" class="q-gutter-md">
                      <q-input
                        filled
                        v-model="username"
                        label="รหัสพนักงาน"
                        lazy-rules
                        :rules="[
                          (val) => (val && val.length > 0) || 'ใส่รหัสพนักงาน',
                        ]"
                      />

                      <q-input
                        filled
                        type="password"
                        v-model="password"
                        label="รหัสผ่าน"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val !== null && val !== '') || 'ใส่รหัสผ่าน',
                        ]"
                      />

                      <q-input
                        v-if="false"
                        filled
                        type="password"
                        value="xxx"
                        label="รหัสผ่าน"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val !== null && val !== '') || 'ใส่รหัสผ่าน',
                          (val) =>
                            (val > 0 && val < 100) || 'Please type a real age',
                        ]"
                      />

                      <div class="row items-center justify-center">
                        <q-btn label="Login" type="submit" color="primary" />
                      </div>
                      <!-- Login dialog -->
                      <q-dialog v-model="loginbar">
                        <q-card>
                          <q-toolbar >
                            <q-avatar>
                              <img
                                placeholder-src="~assets/images/logo.jpg"
                                src="~assets/images/logo.jpg"
                                spinner-color="white"
                              />
                            </q-avatar>

                            <q-toolbar-title
                              ><span class="text-weight-bold"
                                >ScanItem</span
                              ></q-toolbar-title
                            >
                            <q-btn
                              flat
                              round
                              dense
                              icon="close"
                              @click="closeloginerror()"
                            />
                          </q-toolbar>

                          <q-card-section>
                            {{ this.messageerror }}
                          </q-card-section>
                        </q-card>
                      </q-dialog>
                      <!-- Login dialog -->
                      <!-- Login 500 dialog -->
                      <q-dialog v-model="loginstatus">
                        <q-card>
                          <q-toolbar>
                            <q-avatar>
                              <img
                                placeholder-src="~assets/images/logo.jpg"
                                src="~assets/images/logo.jpg"
                                spinner-color="white"
                              />
                            </q-avatar>

                            <q-toolbar-title
                              ><span class="text-weight-bold"
                                >ScanItem</span
                              ></q-toolbar-title
                            >
                            <q-btn
                              flat
                              round
                              dense
                              icon="close"
                              @click="closeloginstatusEr()"
                            />
                          </q-toolbar>

                          <q-card-section>
                            {{ this.messageerror }}
                          </q-card-section>
                        </q-card>
                      </q-dialog>
                      <!-- Login 500 dialog -->
                      <div class="pdrowp row items-center justify-center">
                        <p>รหัสเข้าโปรแกรมเหมือนกับ SUPC Shop24Hrs.</p>
                      </div>
                    </q-form>
                  </div>
                </div>
                <div class="bgimg col-md-4 col-sm-3 q-pa-md"></div>
              </div>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      username: "",
      password: "",
      altnum: "",
      pw_branch_in: "",
      persistent: false,
      loginbar: false,
      messageerror: "",
      loginstatus: false,
      BRANCHIN: "",
      BRANCHNAME: "",
      // users: [],
    };
  },

  methods: {
    ...mapActions("Login", ["empFindName", "encodePassword", "getBranch"]),
    

    loginerror() {
      this.loginbar = true;
    },

    closeloginerror() {
      this.loginbar = false;
    },

    loginstatusEr() {
      this.loginstatus = true;
    },

    closeloginstatusEr() {
      this.loginstatus = false;
    },

    onSubmit() {
      console.log("click submit");
      // this.authenUser();
      this.loginuser();
    },
    getgroupprice(users) {
      if (this.BRANCHIN == "") {
        this.BRANCHIN = "MN000";
      }
      this.getBranch({
        BchID: this.BRANCHIN,
      })
        .then((r) => {

          if (r.data.length == 0) {
            this.messageerror = "ไม่พบสาขา";
            this.loginerror();
            return;
          }
          var branch = r.data[0];
          localStorage.setItem("branchname", branch.brancH_NAME);
          localStorage.setItem("groupprice", branch.brancH_PRICE);
          localStorage.setItem("altnum", users.emplid);
          localStorage.setItem("name", users.spC_NAME);
          if(this.BRANCHIN == "MN000"){
            this.BRANCHIN = "RT"
          }
          localStorage.setItem("branchin", this.BRANCHIN);

          this.$router.push("/home");
        })
        .catch((error) => {
          console.error(error);
        });
    },

    encode(users) {
      this.encodePassword({
        empPassword: this.password,
      })
        .then((e) => {
          var pass = e.data;
          if (users.emP_PASSWORD !== pass) {
            this.messageerror = "รหัสผ่านไม่ถูกต้อง";
            this.loginerror();
            return;
          }
          this.getgroupprice(users);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    loginuser() {
      this.$q.loading.show();
      this.empFindName({
        altnum: this.username,
      })
        .then((r) => {
          if (r.data.length == 0) {
            this.messageerror = "ไม่พบพนักงาน";
            this.loginerror();
            return;
          }
          this.encode(r.data[0]);
        })
        .catch((error) => {
          var resErr = error.response;
          if (resErr.status == 500) {
            // this.$q.notify({ message: resErr.data, color: "negative" });
            this.messageerror = resErr.data;
            this.loginstatusEr();
          }
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },

    // authenUser() {
    //   this.$q.loading.show();
    //   let data = {
    //     username: this.username,
    //     password: this.password,
    //   };

    //   axios
    //     .post(`/ScanProductAPI/api/emp/auth`, data)
    //     .then((r) => {
    //       if (r.status !== 200) {
    //         console.log(r.data);
    //         return;
    //       }
    //       var users = r.data[0];

    //       localStorage.setItem("user", this.username);
    //       localStorage.setItem("altnum", users.altnum);
    //       //this.altnum
    //       let BRANCHIN = users.pW_BRANCH_IN;
    //       if (BRANCHIN == "MN000") {
    //         BRANCHIN = "RT";
    //       }
    //       let BRANCHNAME = users.pW_BRANCH_NAME;
    //       if (BRANCHNAME == "") {
    //         BRANCHNAME = "ซุปเปอร์ชีป";
    //       }
    //       localStorage.setItem("branchin", BRANCHIN);
    //       localStorage.setItem("branchname", BRANCHNAME);
    //       localStorage.setItem("name", users.spC_NAME);
    //       localStorage.setItem("groupprice", users.pricE_GROUP);
    //       localStorage.setItem("emplastused", users.emP_LASTUSEDSPC);
    //       //this.spc_name

    //       console.log(r.data);
    //       this.$router.push("/home");
    //     })
    //     .catch((error) => {
    //       var resErr = error.response;
    //       if (resErr.status == 500) {
    //         // this.$q.notify({ message: resErr.data, color: "negative" });
    //         this.messageerror = resErr.data;
    //         this.loginstatusEr();
    //       }
    //       if (resErr.status == 400) {
    //         // this.$q.notify({ message: resErr.data, color: "warning" });
    //         this.messageerror = resErr.data;
    //         this.loginerror();
    //       }
    //     })
    //     .finally(() => {
    //       this.$q.loading.hide();
    //     });
    // },
  },
};
</script>
<style>
.texclass {
  margin-top: 10px ;
  margin-bottom: 20px ;
}
.bgimg {
  background-color: #F8B195;
  width: 100%;
}
.changcl {
  background-color: #F67280;
  /* border-radius: 25px; */
}
.backclimg {
  background-color: #F67280;
  /* border-radius: 25px; */
}
.pdrowp {
  margin-top: 35px;
}
/* .pdrows{
    margin-top: -15px;
} */
@media only screen and (max-width: 800px) {
  .pdrowp {
    margin-top: 35px;
  }
  /* .pdrows{
    margin-top: -15px;
} */
}
</style>
