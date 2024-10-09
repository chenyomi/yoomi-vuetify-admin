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
    loading.value = false;
  });
};

const FakeAPI = {
  async fetch({ page, itemsPerPage }) {
    return new Promise((resolve) => {
      orderApi
        .getUnOrderSum({
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
        });
    });
  },
};
const headers = [
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
    title: "未交数量汇总",
    key: "unorderSum",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
];
</script>
<template>
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
    <template #loading />
  </VDataTableServer>
</template>
