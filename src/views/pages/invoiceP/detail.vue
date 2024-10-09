<script setup>
import invoicingApi from "@/api/invoicing";
import { ref } from "vue";

const loading = ref(true);
const serverItems = ref([]);
const totalItems = ref(0);
let expandedArr = ref([]);
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
      invoicingApi
        .shipOrderShowData({
          current: page,
          size: itemsPerPage,
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
    title: "未交数量",
    key: "inotFinishedQty",
    align: "center",
    sortable: false,
  },
  {
    title: "单位",
    key: "ccomUnitName",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "备注",
    key: "cmemo",
    align: "center",
    sortable: false,
    minWidth: 200,
  },
];
const rowProps = ({ item }) => {
  if (expandedArr.value.includes(item.id)) {
    return { style: "color: rgb(var(--v-theme-primary-cym))" };
  }
  return {};
};
const submit = () => {
  return new Promise((resolve) => {
    const parms = serverItems.value.filter((e) =>
      expandedArr.value.includes(e.id)
    );
    resolve();
    console.log(parms);
    const datas = [];
    parms.forEach((e) => {
      datas.push({
        iOrderType: e.ctype,
        iOrderDetailID: e.id,
        cOderNumber: e.inotFinishedQty,
        cmemo: e.cmemo,
      });
    });
    invoicingApi.shipOrderSave(datas).then(() => {
      resolve();
    });
  });
};
defineExpose({
  submit,
});
</script>
<template>
  <VDataTableServer
    ref="table"
    v-model="expandedArr"
    fixed-header
    :headers="headers"
    :items="serverItems"
    :loading="loading"
    hover
    height="calc(100vh - 290px)"
    @update:options="loadItems"
    show-select
    :row-props="rowProps"
    hide-default-footer
  >
    <template #item.exclusive="{ item }">
      <VCheckbox :model-value="expandedArr.includes(item.id)" />
    </template>
    <template #item.inotFinishedQty="{ item }">
      <v-text-field
        v-if="expandedArr.includes(item.id)"
        v-model="item.inotFinishedQty"
        label="数量"
        hide-details
        type="number"
        min="0"
        variant="solo-filled"
      ></v-text-field>
      <span v-else>{{ item.inotFinishedQty }}</span>
    </template>
    <template #item.cmemo="{ item }">
      <v-text-field
        v-if="expandedArr.includes(item.id)"
        v-model="item.cmemo"
        label="描述"
        hide-details
        variant="solo-filled"
      ></v-text-field>
      <span v-else>{{ item.cmemo }}</span>
    </template>
    <template #loading />
  </VDataTableServer>
</template>
