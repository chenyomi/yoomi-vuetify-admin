<script setup name="unInvoicing">
import invoicingApi from "@/api/invoicing";
import { ref } from "vue";
const loading = ref(true);
const serverItems = ref([]);
const totalItems = ref(0);
const itemsPerPage = ref(25);

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
      invoicingApi
        .getBalaqueryAllData({
          current: page,
          size: itemsPerPage,
        })
        .then((res) => {
          res.data.records.forEach((e, i) => {
            e.id = i + 1 + (page - 1) * itemsPerPage;
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
    title: "日期",
    key: "dbillDate",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "摘要",
    key: "cdigest",
    align: "center",
    sortable: false,
    minWidth: 120,
  },
  {
    title: "单据号",
    key: "coutid",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "发生金额",
    key: "dfMoney",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
];

const table = ref();
const today = new Intl.DateTimeFormat("zh-cn").format(new Date());
console.log(today);
const df = ref(0);
const getdataVo = () => {
  invoicingApi.getBalaqueryShowDataVo().then((res) => {
    df.value = res.data.df;
  });
};

getdataVo();
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
        <div
          class="d-flex flex-row align-center justify-space-between px-5 py-4 gap-2"
        >
          <span style="color: rgb(var(--v-theme-error))"
            >本页面内的数据只做查询对比使用，不保证数据完全的完整性，如有疑问请致电财务查询。</span
          >
          <div></div>
          <v-btn color="surface-variant" variant="tonal">
            <span>截止{{ today }},您尚有</span>
            <span style="color: rgb(var(--v-theme-error))">{{ df }}</span>
            <span>元未结算。</span>
          </v-btn>
        </div>
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
