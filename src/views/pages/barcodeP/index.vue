<script setup>
import barcodeApi from "@/api/barcode";
import { ref } from "vue";

const loading = ref(true);
const serverItems = ref([]);
const totalItems = ref(0);
const itemsPerPage = ref(25);
const expandedArr = ref([]);
const expanded = ref();

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
      barcodeApi
        .shipOrderListGetData({
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
    title: "单据号",
    key: "ccode",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "创建时间",
    key: "tcreatTime",
    align: "center",
    sortable: false,
    minWidth: 120,
  },
  {
    title: "发货时间",
    key: "tsendTime",
    align: "center",
    sortable: false,
    minWidth: 90,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    sortable: false,
    minWidth: 250,
  },
];

const table = ref();
const childCol = [
  {
    title: "单据号",
    value: "ccode",
  },
  {
    title: "采购单号",
    value: "cinvcode",
  },
  {
    title: "物料编码",
    value: "cinvstd",
  },
  {
    title: "物料名称",
    value: "cinvname",
  },
  {
    title: "规格图号",
    value: "cinvstd",
  },
  {
    title: "发货数量",
    value: "iquantity",
  },
  {
    title: "需求日期",
    value: "ddate",
  },
  {
    title: "备注",
    value: "cmemos",
  },
];
const rowProps = ({ item }) => {
  return { style: "color: rgb(var(--v-theme-primary-cym))" };
};
const printCard = (item) => {
  window.open(
    `/#/designer?id=${item.ccode}&type=shipOrderSendPrint2`,
    "_blank"
  );
};
const printRf = ref(false);
const justPrint = (item) => {
  localStorage.setItem("d-id", item.ccode);
  localStorage.setItem("d-type", "shipOrderSendPrint2");
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
      item-value="id"
      hover
      height="calc(100vh - 220px)"
      show-expand
      expand-on-click
      @update:options="loadItems"
      @update:expanded="
        (newVal) => {
          // 打开 输出id
          newVal.map((e) => {
            if (!expandedArr.includes(e)) {
              expanded = e;
              const index = serverItems.findIndex((a) => a.id === e);
              !serverItems[index].baby &&
                barcodeApi
                  .shipOrderAllData({
                    childId: serverItems[index].id,
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
              console.log(e, 11);
            }
          });
          expandedArr = newVal;
        }
      "
    >
      <template #expanded-row="{ columns, item }">
        <tr>
          <td colspan="12" class="py-5">
            <VCard border>
              <VDataTable
                density="compact"
                :headers="childCol"
                :items="item.baby"
                hide-default-footer
                :row-props="rowProps"
              />
            </VCard>
          </td>
        </tr>
      </template>
      <template #item.action="{ item }">
        <v-btn
          prepend-icon="bx-credit-card-alt"
          variant="tonal"
          density="compact"
          class="mr-2"
          @click.stop="justPrint(item)"
        >
          打印
        </v-btn>
        <v-btn
          prepend-icon="bx-credit-card-alt"
          variant="tonal"
          density="compact"
          class="mr-2"
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
