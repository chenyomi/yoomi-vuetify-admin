<script setup>
import offerApi from "@/api/offer.js";
import { ref } from "vue";
import tableSum from "./detail.vue";
const loading = ref(true);
const serverItems = ref([]);
const totalItems = ref(0);
const itemsPerPage = ref(25);
const expandedArr = ref([]);
const expanded = ref();

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
    loading.value = false;
  });
};
const FakeAPI = {
  async fetch({ page, itemsPerPage }) {
    return new Promise((resolve) => {
      offerApi
        .getList({
          current: page,
          size: itemsPerPage,
          ...search.value,
        })
        .then((res) => {
          res.data.records.forEach((e, i) => {
            e.index = i + 1 + (page - 1) * itemsPerPage;
          });
          const items = res.data.records;
          const paginated = items;
          resolve({ items: paginated, total: res.data.total });
        });
    });
  },
};

const headers = [
  {
    title: "序号",
    key: "index",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "需求日期",
    key: "ddate1",
    align: "center",
    sortable: false,
    minWidth: 120,
  },
  {
    title: "编号",
    key: "ccode",
    align: "center",
    sortable: false,
    minWidth: 90,
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
    title: "需求数量",
    key: "iquantity",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "报价",
    key: "fprice",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "财务报价",
    key: "ffinanceprice",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    sortable: false,
    minWidth: 220,
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
const childCol = [
  {
    title: "类型",
    value: "pricetype",
    width: 90,
  },
  {
    title: "材料费",
    value: "fmaterialPrice",
    width: 70,
  },
  {
    title: "第一道加工",
    align: "center",
    children: [
      { title: "工艺", value: "cprocess1", maxWidth: 100 },
      { title: "工时", value: "iprocessTime1", width: 60 },
      { title: "加工费", value: "fprocessPrice1", width: 70 },
    ],
  },
  {
    title: "第一道加工",
    align: "center",
    children: [
      { title: "工艺", value: "cprocess2", maxWidth: 100 },
      { title: "工时", value: "iprocessTime2", width: 60 },
      { title: "加工费", value: "fprocessPrice2", width: 70 },
    ],
  },
  {
    title: "第三道加工",
    align: "center",
    children: [
      { title: "工艺", value: "cprocess3", maxWidth: 100 },
      { title: "工时", value: "iprocessTime3", width: 60 },
      { title: "加工费", value: "fprocessPrice3", width: 70 },
    ],
  },
  {
    title: "第四道加工",
    align: "center",
    children: [
      { title: "工艺", value: "cprocess4", maxWidth: 100 },
      { title: "工时", value: "iprocessTime4", width: 60 },
      { title: "加工费", value: "fprocessPrice4", width: 70 },
    ],
  },
  {
    title: "第五道加工",
    align: "center",
    children: [
      { title: "工艺", value: "cprocess5", maxWidth: 100 },
      { title: "工时", value: "iprocessTime5", width: 60 },
      { title: "加工费", value: "fprocessPrice5", width: 70 },
    ],
  },
  {
    title: "合计加工费",
    value: "fprocessTotal",
  },
  {
    title: "税费",
    value: "frate",
    width: 60,
  },
  {
    title: "利润",
    value: "fprofit",
    width: 60,
  },
  {
    title: "总计单价",
    value: "fprice",
    width: 60,
  },
  {
    title: "核价时间",
    value: "tdate",
  },
];
const rowProps = ({ item }) => {
  if (item.pricetype == "财务核价") {
    return { style: "color: rgb(var(--v-theme-error))" };
  }
  return { style: "color: rgb(var(--v-theme-primary-cym))" };
};
const tablesum = ref();
</script>
<template>
  <v-card>
    <v-data-table-server
      ref="table"
      v-model:items-per-page="itemsPerPage"
      fixed-header
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      density="compact"
      item-value="autoid"
      hover
      height="calc(100vh - 290px)"
      @update:options="loadItems"
      show-expand
      expand-on-click
      @update:expanded="
        (newVal) => {
          // 打开 输出id
          newVal.map((e) => {
            if (!expandedArr.includes(e)) {
              expanded = e;
              const index = serverItems.findIndex((a) => a.autoid === e);
              !serverItems[index].baby &&
                offerApi
                  .getDetail({
                    childId: serverItems[index].autoid,
                  })
                  .then((res) => {
                    serverItems[index].baby = res.data;
                  });
            }
          });
          // 关闭 输出id
          expandedArr.map((e) => {
            if (!newVal.includes(e)) {
              expanded = e;
            }
          });
          expandedArr = newVal;
        }
      "
    >
      <template v-slot:top>
        <div class="d-flex flex-row align-center px-5 py-4">
          <v-text-field v-model="search.code" label="模糊查询"></v-text-field>
          <v-btn class="ml-2" density="default" @click="submit"> 查询 </v-btn>
          <v-btn
            class="ml-2"
            density="default"
            variant="outlined"
            @click="reset"
          >
            重置
          </v-btn>
        </div>
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td colspan="12" class="py-5">
            <v-card border>
              <v-data-table
                :row-props="rowProps"
                :cell-props="{ style: 'padding:0 5px' }"
                :header-props="{ style: 'padding:0 5px' }"
                density="compact"
                :headers="childCol"
                :items="item.baby"
                hide-default-footer
              ></v-data-table>
            </v-card>
          </td>
        </tr>
      </template>
      <template #item.fprice="{ item }">
        <span style="color: rgb(var(--v-theme-primary-cym))">{{
          Number(item.fprice).toFixed(2)
        }}</span>
      </template>
      <template #item.ffinanceprice="{ item }">
        <span style="color: rgb(var(--v-theme-error))">{{
          Number(item.ffinanceprice).toFixed(2)
        }}</span>
      </template>
      <template #item.action="{ item }">
        <v-btn
          prepend-icon="bxl-unity"
          variant="outlined"
          class="mr-2"
          density="compact"
          @click.stop="showPic(item)"
        >
          图纸
        </v-btn>

        <v-dialog max-width="1000" persistent>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              prepend-icon="bx-message-square"
              v-bind="activatorProps"
              density="compact"
              text="报价"
            ></v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card>
              <tableSum ref="tablesum" :item="item"></tableSum>
              <v-card-actions>
                <v-btn
                  prepend-icon="bx-message-square"
                  text="报价"
                  @click="
                    () => {
                      tablesum.submit().then(() => {
                        isActive.value = false;
                      });
                    }
                  "
                ></v-btn>
                <v-btn text="关闭" @click="isActive.value = false"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </template>
      <template #loading />
    </v-data-table-server>
  </v-card>
</template>
