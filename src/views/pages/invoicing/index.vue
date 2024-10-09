<script setup name="unOrder">
import invoicingApi from "@/api/invoicing";
import { ref } from "vue";
const loading = ref(true);
const serverItems = ref([]);
const totalItems = ref(0);
const itemsPerPage = ref(25);

const today = new Date();
const search = ref({
  starttime:
    new Date(today.getFullYear(), today.getMonth() - 1, 1) || undefined,
  endtime: new Date(today.getFullYear(), today.getMonth(), 0) || undefined,
});
const loadItems = ({ page, itemsPerPage }) => {
  loading.value = true;
  FakeAPI.fetch({ page, itemsPerPage }).then(({ items, total }) => {
    serverItems.value = items;
    totalItems.value = total;
  });
};
const sum = ref();
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
      invoicingApi
        .getInvoiceGetDatar({
          current: page,
          size: itemsPerPage,
          ...parms,
        })
        .then((res) => {
          sum.value = 0;
          res.data.records.forEach((e, i) => {
            e.id = i + 1 + (page - 1) * itemsPerPage;
            sum.value += Number(e.isum);
          });
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
    title: "开票日期",
    key: "cdate",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "发票号",
    key: "cpbvcode",
    align: "center",
    sortable: false,
    minWidth: 120,
  },
  {
    title: "开票金额",
    key: "isum",
    align: "center",
    sortable: false,
    minWidth: 90,
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
      <template #loading />
      <template #bottom>
        <div class="text-right pr-5 pt-2 pb-2">
          <v-btn color="surface-variant" variant="tonal">
            合计：<span style="color: red">{{ sum }}</span>
          </v-btn>
        </div>
      </template>
    </VDataTableServer>
  </VCard>
</template>

<style lang="scss">
.v-input__details {
  display: none;
}
</style>
