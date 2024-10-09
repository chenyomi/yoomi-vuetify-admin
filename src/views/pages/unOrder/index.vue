<script setup name="unOrder">
import offerApi from "@/api/offer";
import orderApi from "@/api/order";
import { ref } from "vue";
import tableSum from "./template.vue";
const loading = ref(true);
const serverItems = ref([]);
const totalItems = ref(0);
const itemsPerPage = ref(25);
const search = ref({
  starttime: undefined,
  endtime: undefined,
  code: undefined,
});

const loadItems = ({ page, itemsPerPage }) => {
  loading.value = true;
  FakeAPI.fetch({ page, itemsPerPage }).then(({ items, total }) => {
    serverItems.value = items;
    totalItems.value = total;
  });
};

const FakeAPI = {
  async fetch({ page, itemsPerPage }) {
    return new Promise((resolve) => {
      const parms = Object.assign({}, search.value);

      parms.starttime &&
        (parms.starttime = new Intl.DateTimeFormat("zh-cn").format(
          parms.starttime
        ));
      parms.endtime &&
        (parms.endtime = new Intl.DateTimeFormat("zh-cn").format(
          parms.endtime
        ));
      orderApi
        .getUnOrder({
          current: page,
          size: itemsPerPage,
          ...parms,
        })
        .then((res) => {
          const items = res.data.records;
          const paginated = items;

          resolve({ items: paginated, total: res.data.total });
        })
        .finally(() => {
          loading.value = false;
        });
    });
  },
};

const headers = [
  {
    title: "交货日期",
    key: "ddates",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "采购单号",
    key: "cpoid",
    align: "center",
    sortable: false,
    minWidth: 120,
  },
  {
    title: "物料编码",
    key: "cinvcode",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "物料名称",
    key: "cinvname",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "规格型号",
    key: "cinvstd",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "订货数量",
    key: "inotFinishedQty",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "未交数量",
    key: "iquantity",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    sortable: false,
    minWidth: 400,
  },
];

const showPic = (item) => {
  offerApi
    .getPic({
      cid: item.cinvstd,
    })
    .then((res) => {
      res.data &&
        res.data !== "no" &&
        window.open(res.data, "_blank", "width=1200,height=800");
    });
};

const down3D = (item) => {
  offerApi
    .get3D({
      cid: item.cinvstd,
      name: item.cinvstd,
    })
    .then((res) => {
      if (res.data && res.data !== "no") {
        const $link = document.createElement("a");
        $link.href = res.data;
        $link.click();
        document.body.appendChild($link);
        document.body.removeChild($link); // 下载完成移除元素
        window.URL.revokeObjectURL($link.href); // 释放掉blob对象
      }
    });
};

const table = ref();

const submit = () => {
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
};

const reset = () => {
  search.value = {
    starttime: undefined,
    endtime: undefined,
    code: undefined,
  };
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
};
const printCard = (item) => {
  window.open(`/#/designer?id=${item.cinvcode}&type=undeOrderGy`, "_blank");
};
const printRf = ref(false);
const justPrint = (item) => {
  localStorage.setItem("d-id", item.cCode);
  localStorage.setItem("d-type", "undeOrderGy");
  printRf.value = true;
  setTimeout(() => {
    printRf.value = false;
  }, 1000);
};
</script>

<template>
  <VCard>
    <VDataTableServer
      ref="table"
      v-model:items-per-page="itemsPerPage"
      fixed-header
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      density="compact"
      hover
      height="calc(100vh - 290px)"
      @update:options="loadItems"
    >
      <template #top>
        <div class="d-flex flex-row align-center px-5 py-4 gap-2">
          <div>
            <v-dialog max-width="1200">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  prepend-icon="bxs-data"
                  v-bind="activatorProps"
                  color="surface-variant"
                  text="数据汇总"
                  variant="tonal"
                ></v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card>
                  <tableSum></tableSum>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="关闭" @click="isActive.value = false"></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </div>
          <div class="flex-fill">
            <VLocaleProvider locale="en">
              <VDateInput
                v-model="search.starttime"
                label="开始时间"
                variant="outlined"
                density="compact"
              />
            </VLocaleProvider>
          </div>
          <div class="flex-fill">
            <VLocaleProvider locale="en">
              <VDateInput
                v-model="search.endtime"
                label="结束时间"
                variant="outlined"
                density="compact"
              />
            </VLocaleProvider>
          </div>
          <VTextField v-model="search.code" label="模糊查询" />
          <VBtn density="default" @click="submit"> 查询 </VBtn>
          <VBtn density="default" variant="outlined" @click="reset">
            重置
          </VBtn>
        </div>
      </template>
      <template #item.action="{ item }">
        <VBtn
          prepend-icon="bxl-unity"
          variant="outlined"
          class="mr-2"
          density="compact"
          @click.stop="showPic(item)"
        >
          图纸
        </VBtn>
        <VBtn
          prepend-icon="bxl-unity"
          class="mr-2"
          density="compact"
          @click.stop="down3D(item)"
        >
          三维下载
        </VBtn>
        <v-btn
          prepend-icon="bx-credit-card-alt"
          class="mr-2"
          variant="tonal"
          density="compact"
          @click.stop="justPrint(item)"
        >
          打印工艺卡片
        </v-btn>
        <v-btn
          prepend-icon="bx-credit-card-alt"
          variant="tonal"
          density="compact"
          @click.stop="printCard(item)"
        >
          打印模板
        </v-btn>
      </template>
      <template #loading />
    </VDataTableServer>
  </VCard>
  <iframe
    v-if="printRf"
    :src="'/ankareport/indexSimple.html?e=' + Math.random()"
    frameborder="0"
    style="position: absolute"
  ></iframe>
</template>

<style lang="scss">
.v-input__details {
  display: none;
}
</style>
