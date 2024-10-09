<script setup name="unOrder">
import unqualifiedApi from "@/api/unqualified";
import { ref } from "vue";
import tableSum from "./detail.vue";
const loading = ref(true);
const serverItems = ref([]);
const totalItems = ref(0);
const itemsPerPage = ref(25);

const search = ref({
  starttime: undefined,
  endtime: undefined,
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
      const parms = Object.assign({}, search.value);

      parms.starttime &&
        (parms.starttime = new Intl.DateTimeFormat("zh-cn").format(
          parms.starttime
        ));
      parms.endtime &&
        (parms.endtime = new Intl.DateTimeFormat("zh-cn").format(
          parms.endtime
        ));
      unqualifiedApi
        .getUnqualifiedGetData({
          current: page,
          size: itemsPerPage,
          ...parms,
        })
        .then((res) => {
          const items = res.data.records;
          const paginated = items;

          resolve({ items: paginated, total: res.data.total });
        });
    });
  },
};

const headers = [
  {
    title: "日期",
    key: "cdates",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "单号",
    key: "ccode",
    align: "center",
    sortable: false,
    minWidth: 120,
  },
  {
    title: "物料名称",
    key: "cinvName",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "规格型号",
    key: "cinvStd",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "不合格数",
    key: "iqty",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "不合格类型",
    key: "ctypeName",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "处罚金额",
    key: "ifinaMoney",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "处理方式",
    key: "csugName",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    sortable: false,
    minWidth: 120,
  },
];

const table = ref();

const submit = () => {
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
};

const reset = () => {
  search.value = {
    starttime: undefined,
    endtime: undefined,
  };
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
};
const tablesum = ref();
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
          <VBtn density="default" @click="submit"> 查询 </VBtn>
          <VBtn density="default" variant="outlined" @click="reset">
            重置
          </VBtn>
        </div>
      </template>
      <template #item.action="{ item }">
        <v-dialog max-width="1000" persistent>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              prepend-icon="bx-message-square"
              v-bind="activatorProps"
              density="compact"
              text="查看详情"
            ></v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card>
              <tableSum ref="tablesum" :item="item"></tableSum>
              <v-card-actions>
                <v-btn
                  prepend-icon="bx-message-square"
                  text="提交"
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
    </VDataTableServer>
  </VCard>
</template>

<style lang="scss">
.v-input__details {
  display: none;
}
</style>
