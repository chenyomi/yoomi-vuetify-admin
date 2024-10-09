<script setup>
import orderApi from "@/api/order";
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
      orderApi
        .getUnOrder({
          current: page,
          size: itemsPerPage,
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
];
</script>

<template>
  <VCard>
    <!-- bar chart -->
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
      height="400"
      hide-default-footer
      @update:options="loadItems"
    >
      <template #loading />
    </VDataTableServer>
  </VCard>
</template>
