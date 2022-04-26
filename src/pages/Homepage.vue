<template>
  <q-page class="bg">
    <div class="q-pa-md">
      <!-- {{valuselected}} -->
      <div class="setposition">
        <div class="setpo row">
          <div class="pdbt q-gutter-md" style="max-width: 300px">
            <q-input
              filled
              ref="input"
              type="input"
              v-model="ITEMBARCODE"
              label="รหัสบาร์โค้ด"
              v-on:keyup.page-up="setQTY"
              v-on:keyup.enter="insertdata"
              autofocus
            >
            </q-input>
          </div>
          <div class="mgtext">
            <h5 class="pclass">{{ showQTY() }}</h5>
          </div>
          <div class="col pdtext">
            <!-- <a style="color: DarkBlue">กด ENTER เพื่อเพิ่มรายการสินค้า</a> -->
          </div>
          <div class="row">
            <div class="ptext">
              <p class="pclass">{{ this.WHOINS + ":" }}</p>
            </div>
            <div class="ptext">
              <p class="pclass">{{ this.WHONAMEINS }}</p>
            </div>
            <div class="pdbtn">
              <q-btn color="red-4" label="ออกจากระบบ" @click="logout"></q-btn>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-sm-6 srtright">
            <p class="pclass">กด ENTER เพื่อเพิ่มรายการสินค้า</p>
          </div>
          <div class="col-md-6 col-sm-6 setleft">
            <p class="pclass">last update : {{ settime() }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-sm-6 srtright">
            <p class="pclass">กด page up เพื่อเพิ่มจำนวนสินค้า</p>
          </div>
          <!-- <div class="col-md-6 col-sm-6 setleft">
            <p style="color: DarkBlue">last update : {{ settime() }}</p>
          </div> -->
        </div>
      </div>

      <div class="posi">
        <q-table
          class="my-sticky-column-table"
          title="Treats"
          :data="datatable"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :loading="loading"
          :pagination="pageoption"
        >
          <!-- seach tab -->
          <template v-slot:top>
            <q-space />
            <div class="cc">
              <q-input
                borderless
                dense
                debounce="300"
                color="primary"
                v-model="filter"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </template>
          <!-- seach tab -->

          <!-- Confirm delete data -->
          <template v-slot:body-cell-action="props">
            <div class="btndel">
              <q-btn
                icon="delete"
                padding="xs"
                color="red-4"
                @click="deleteconfirm(props.row)"
              ></q-btn>
            </div>
          </template>
          <!-- Confirm delete data -->
        </q-table>

        <!-- QTY Only Int dialog -->
        <q-dialog v-model="qtyint">
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
                ><span class="text-weight-bold">ScanItem</span></q-toolbar-title
              >
              <q-btn flat round dense icon="close" @click="closeqtyolyint()" />
            </q-toolbar>

            <q-card-section> จำนวนสินค้าต้องเป็นตัวเลขเท่านั้น </q-card-section>
          </q-card>
        </q-dialog>
        <!-- QTY Only Int dialog -->
        <!-- QTY Over 10,000 dialog -->
        <q-dialog v-model="qtybar">
          <q-card>
            <q-toolbar>
              <q-avatar>
                <img
                  placeholder-src="~assets/images/logo.jpg"
                  src="~assets/images/logo.jpg"
                  spinner-color="red"
                />
              </q-avatar>

              <q-toolbar-title
                ><span class="text-weight-bold">ScanItem</span></q-toolbar-title
              >
              <q-btn flat round dense icon="close" @click="closeqtyolyint()" />
            </q-toolbar>

            <q-card-section> จำนวนสินค้าต้องไม่เกิน 10,000 </q-card-section>
          </q-card>
        </q-dialog>
        <!-- QTY Over 10,000 dialog -->
        <!-- not found barcode dialog -->
        <q-dialog v-model="toolbar">
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
                ><span class="text-weight-bold">ScanItem</span></q-toolbar-title
              >
              <q-btn flat round dense icon="close" @click="closeshowdata()" />
            </q-toolbar>

            <q-card-section> ไม่พบบาร์โค้ดที่ระบุ </q-card-section>
          </q-card>
        </q-dialog>
        <!-- not found barcode dialog -->
        <!-- delete row dialog -->
        <q-dialog v-model="confirm" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar icon="delete" color="negative" text-color="white" />
              <span class="q-ml-sm">กดยืนยันอีกครั้งเพื่อทำการลบรายการนี้</span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="ยกเลิก" color="primary" v-close-popup />
              <q-btn
                flat
                label="ยืนยัน"
                color="primary"
                @click="onConfirm()"
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- delete row dialog -->
      </div>
    </div>
  </q-page>
</template>

<script>
import routes from "src/router/routes";
import { mapActions } from "vuex";
import router from "src/router";
import axios from "axios";
import { ref } from "vue";
import { date } from "quasar";

export default {
  setup() {
    return {
      formData: Object.assign({}, initFromData),
    };
  },

  data() {
    return {
      pageoption: { rowsPerPage: 30 },
      POSGROUP: "",
      WHOINS: "",
      users: [],
      BRANCH_ID: "",
      BRANCH_NAME: "",
      PRICE: "",
      ITEMBARCODE: "",
      QTY: 1.0,
      NUMQTY: 0,
      qty: "",
      WHONAMEINS: "",
      MachineName: "",
      countdata: 0,
      numrow: 0,

      alert: false,
      confirm: false,
      prompt: false,
      toolbar: false,
      qtybar: false,
      qtyint: false,

      address: "",
      position: 'center',

      answer: {},
      timer: "",
      loading: false,
      filter: "",
      rowCount: 10,
      columns: [
        { name: "action", label: "", field: "action" },
        {
          name: "itembarcode",
          required: true,
          label: "บาร์โค้ด",
          align: "left",
          field: "itembarcode",
          sortable: true,
          classes(val) {
            return val.saleBill == "" ? "bg-red-4" : "bg-white";
          },
        },
        {
          name: "name",
          align: "ชื่อ",
          label: "ชื่อ",
          field: "spC_NAME",
          sortable: true,
          classes(val) {
            return val.saleBill == "" ? "bg-red-4" : "bg-white";
          },
        },
        { name: "unit", label: "หน่วย", field: "unit", sortable: true },
        { name: "quantity", label: "จำนวน", field: "qty", sortable: true },
        { name: "price", label: "ราคา", field: "price", sortable: true },
        { name: "time", label: "เวลา", field: "datetimeins", sortable: true },
        { name: "totalprice", label: "ราคารวม", field: "net", sortable: true },
        {
          name: "totaltime",
          label: "เวลารวม",
          field: "sumTime",
          sortable: true,
        },
        {
          name: "numbill",
          label: "เลขที่บิล",
          field: "saleBill",
          sortable: true,
        },
        {
          name: "saletime",
          label: "วันที่ขาย",
          field: "saleCreatDateTime",
          sortable: true,
        },
        { name: "order", label: "ลำดับ", field: "saleSeqNo", sortable: true },
      ],

      data: [],
      datatable: [],
      valuselected: [],
      original: [],
      selecrow: null,
    };
  },

  mounted() {
    setTimeout(function () {
      location.reload(1);
    }, 120000); //reload page evry 2m.
    if (localStorage.getItem("altnum") == null) {
      this.$router.replace("/");
    } //return login page
    this.scanitemdetail(); //call function show all data
    this.reloadPAGE();
  },

  methods: {
    ...mapActions("Login", ["showBarcode"]),
    ...mapActions("Login", ["addItem"]),
    ...mapActions("Login", ["deleteItem"]),
    ...mapActions("Login", ["branchname"]),
    ...mapActions("Login", [
      "scanitem",
      "findBarcode",
      "insertBarcode",
      "updateBarcode",
      "reloadPage",
    ]),

    reloadPAGE() {
      console.log("reload");
      this.reloadPage({
        posGroup: this.POSGROUP,
        whoIns: this.WHOINS,
      })
        .then((r) => {
          console.log("reload sucess");
          return;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    settime() {
      // console.log("timenow");
      return date.formatDate(Date.now(), "HH:mm:ss");
    },

    deleteconfirm(dataRow) {
      this.selecrow = dataRow;
      this.confirm = true;
    }, //alert confirm delete data

    onConfirm() {
      this.confirm = false;
      // this.manageAction();
      this.updateStautus();
    }, //click confirm to delet row

    updateStautus() {
      this.$q.loading.show();
      console.log("test", this.selecrow);

      this.updateBarcode({
        DateTimeIns: this.selecrow.datetimeins,
        WhoID: this.selecrow.whoins,
        Barcode: this.selecrow.itembarcode,
        PosGroup: this.selecrow.posgroup,
      })
        .then((v) => {
          if (v.status === 200) {
            this.scanitemdetail();
            this.$q.notify({ message: "ลบรายการสำเร็จ", color: "positive" ,position: 'center',});
          }
        })
        .catch((error) => {
          var resErr = error.response;
          if (resErr.status == 500) {
            this.$q.notify({ message: resErr.data, color: "negative" });
          }
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    }, //delete row

    // manageAction() {
    //   console.log("test", this.selecrow);
    //   let value = {
    //     ITEMBARCODE: this.selecrow.itembarcode,
    //     WHOINS: this.selecrow.whoins,
    //   };

    //   axios
    //     .post(`/ScanProductAPI/api/ScanProduct/updateStatus`, value)
    //     .then((v) => {
    //       if (v.status === 200) {
    //         this.$q.notify({ message: "ลบรายการสำเร็จ", color: "positive" });
    //         this.showdata();
    //       }
    //     })
    //     .catch((error) => {
    //       var resErr = error.response;
    //       if (resErr.status == 500) {
    //         this.$q.notify({ message: resErr.data, color: "negative" });
    //       }
    //       // }).finally(()=>{
    //       //   this.$q.loading.hide();
    //     });
    // },

    scanitemdetail() {
      this.POSGROUP = localStorage.getItem("branchin");
      this.WHOINS = localStorage.getItem("altnum");
      this.PRICE = localStorage.getItem("groupprice");
      this.WHONAMEINS = localStorage.getItem("name");

      this.scanitem({
        BchID: this.POSGROUP,
        WhoIns: this.WHOINS,
      })
        .then((e) => {
          if (e.status === 200) {
            console.log("dataLength :", e.data.length);
            // console.log("data", e.data);
            this.datatable = e.data;
            return;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, //show all data

    // showdata() {
    //   this.POSGROUP = localStorage.getItem("branchin");
    //   this.WHOINS = localStorage.getItem("altnum");
    //   this.PRICE = localStorage.getItem("groupprice");
    //   this.MachineName = localStorage.getItem("emplastused");
    //   this.WHONAMEINS = localStorage.getItem("name");
    //   // if (this.POSGROUP === "MN000") {
    //   //   this.POSGROUP = "RT";
    //   // }

    //   this.showBarcode({
    //     POSGROUP: this.POSGROUP,
    //     WHOINS: this.WHOINS,
    //     PRICE: this.PRICE,
    //     MachineName: this.MachineName,
    //     WHONAMEINS: this.WHONAMEINS,
    //   })
    //     .then((e) => {
    //       if (e.status === 200) {
    //         // console.log(this.MachineName);
    //         // console.log(this.WHONAMEINS);
    //         // console.log(this.PRICE);
    //         // console.log(this.POSGROUP);
    //         // console.log(this.WHOINS);
    //         // console.log(e.data.length);
    //         // console.log(this.numrow);
    //         // console.log(e.data);
    //         this.countdata = e.data.length;
    //         this.datatable = e.data;

    //         return;
    //       }
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // },

    showQTY() {
      if (this.QTY > 1) {
        return "x" + this.QTY;
      } else {
        return "";
      }
    }, //set QTY on web

    // shownodata() {
    //   this.toolbar = true;
    //   this.ITEMBARCODE = ""; //clear input barcode
    //   this.QTY = 1; //clear input QTY
    // }, //alert no data when insert

    closeshowdata() {
      this.toolbar = false;
    }, //close alert no data

    qtyover() {
      this.qtybar = true;
    }, //alert input qty over 10,000

    closeqtyover() {
      this.qtybar = false;
    }, //close alert input qty over 10,000

    qtyonlyint() {
      this.qtyint = true;
    }, //alert input qty only int

    closeqtyolyint() {
      this.qtyint = false;
    }, //close alert input qty only int

    checkBarcode() {
      this.findBarcode({
        Barcode: this.ITEMBARCODE,
      })
        .then((r) => {
          if (r.data.length == 0) {
            this.messageerror = "ไม่พบบาร์โค้ด";
            this.shownodata();
            return;
          }
          console.log(r.data);
          this.insertdata(r.data[0]);
        })
        .catch((error) => {
          console.error(error);
        });
    }, //check have barcode in database?
    //not use!!!

    insertdata() {
      this.$q.loading.show();
      this.insertBarcode({
        barcode: this.ITEMBARCODE,
        priceGroup: this.PRICE,
        posGroup: this.POSGROUP,
        qty: this.QTY,
        whoIns: this.WHOINS,
        whoInsName: this.WHONAMEINS,
      })
        .then((e) => {
          console.log("data status", e.data.status);
          if (e.data.status == false) {
            // this.shownodata();
            this.ITEMBARCODE = ""; //clear input barcode
            this.QTY = 1; //clear input QTY
            this.$q.notify({ message: "ไม่พบบาร์โค้ดที่ระบุ", color: "warning", icon: 'warning', position: 'center',});
            // this.$q.notify({
            //   color: "negative",
            //   icon: 'warning',
            //   message: "ไม่พบบาร์โค้ดที่ระบุ",
            //   position : center,
            // });
            return;
          }

          console.log("sucssess");
          this.ITEMBARCODE = ""; //clear input barcode
          this.QTY = 1; //clear input QTY
          this.scanitemdetail(); //call function show all data
        })
        .catch((error) => {
          var resErr = error.response;
          if (resErr.status == 500) {
            this.$q.notify({ message: resErr.data, color: "negative" });
          }
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    }, //insert data

    setQTY() {
      //   console.log(Number.isInteger(parseFloat(this.ITEMBARCODE)));
      if (Number.isInteger(parseFloat(this.ITEMBARCODE)) == false) {
        // this.qtyonlyint();
        this.$q.notify({ message: "จำนวนสินค้าต้องเป็นตัวเลขเท่านั้น", color: "warning", icon: 'warning', position: 'center',});
        this.ITEMBARCODE = "";
      } else if (parseFloat(this.ITEMBARCODE) > 10000) {
        // this.qtyover();
        this.$q.notify({ message: "จำนวนสินค้าต้องไม่เกิน 10,000", color: "warning", icon: 'warning', position: 'center',});
        this.ITEMBARCODE = "";
      } else {
        this.QTY = this.ITEMBARCODE * 1.0;
        this.ITEMBARCODE = "";
      }
    }, //set default QTY

    logout() {
      localStorage.clear();
      this.$router.push("/");
    }, //logout page

    showbranchname() {
      if (this.POSGROUP == "RT") {
        this.BRANCH_NAME = "ซุปเปอร์ชีป";
        return "ซุปเปอร์ชีป";
      } else {
        this.branchname({
          BRANCH_ID: this.POSGROUP,
          // BRANCH_NAME : this.BRANCH_NAME
        })
          .then((e) => {
            if (e.status === 200) {
              console.log("testbranch");
              console.log(v.data);
              return this.BRANCH_NAME;
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }, //show brach name on page

    showbranchid() {
      if (this.POSGROUP == "RT") {
        this.BRANCH_ID = "MN000";
        return "MN000";
      }
      return this.POSGROUP;
    }, //show branch id on page
  },
};
</script>
<style lang="scss">
.cc {
  background-color: #b66db8;
  border-radius: 5px;
}
.bg {
  background-color: #a257a3;
}
.pdbt {
  padding-bottom: 5px;
}
.pdtext {
  margin-top: 1px;
  padding-bottom: 5px;
  margin-left: 20px;
}
.ptext {
  margin-top: 18px;
  padding-bottom: 5px;
  margin-right: 10px;
}
.mgtext {
  margin-top: -30px;
  margin-left: 10px;
}
.btndel {
  margin-left: 15px;
  margin-top: 8px;
}
.fixed {
  position: fixed;
  //ตำแหน่ง
  //ผลักจากด้านซ้ายไปด้านขว
  //ขนาดเส้น รูปแบบ สีของเส้น
}
.pdbtn {
  margin-top: 10px;
}
.setpo {
  position: relative;
}
.posi {
  position: relative;
}
.setleft {
  text-align: right;
}
.setposition {
  // position: sticky;
  // top: 50px;
}
.pclass {
  color: #f3f3f3;
}
</style>
