<script setup>
import barcodeApi from "@/api/barcode";
import invoicingApi from "@/api/invoicing";
import { ref } from "vue";
import tableSum from "./detail.vue";

const loading = ref(true);
const serverItems = ref([]);
const totalItems = ref(0);
const itemsPerPage = ref(25);
const expandedArr = ref([]);
const expanded = ref();
const tablesum = ref();

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
        .shipOrderGainMainData({
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
    key: "cCode",
    align: "center",
    sortable: false,
    minWidth: 200,
  },
  {
    title: "创建时间",
    key: "tTime",
    align: "center",
    sortable: false,
    minWidth: 120,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    sortable: false,
    minWidth: 90,
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
  window.open(`/#/designer?id=${item.cCode}&type=shipOrderSendPrint`, "_blank");
};
const printRf = ref(false);
const justPrint = (item) => {
  localStorage.setItem("d-id", item.cCode);
  localStorage.setItem("d-type", "shipOrderSendPrint");
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
      height="calc(100vh - 290px)"
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

      <template v-slot:top>
        <div class="d-flex flex-row align-center px-5 py-4">
          <v-dialog max-width="1500">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                prepend-icon="bxs-data"
                v-bind="activatorProps"
                density="default"
                text="新建发货单"
              ></v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card>
                <tableSum ref="tablesum"></tableSum>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    prepend-icon="bx-message-square"
                    text="保存发货单"
                    @click="
                      () => {
                        tablesum.submit().then(() => {
                          isActive.value = false;
                          loadItems({
                            page: 1,
                            itemsPerPage: itemsPerPage,
                          });
                        });
                      }
                    "
                  ></v-btn>
                  <v-btn text="关闭" @click="isActive.value = false"></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>
      </template>
      <template #item.action="{ item }">
        <v-dialog max-width="400" persistent>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              prepend-icon="bx-credit-card-alt"
              density="compact"
              class="mr-2"
              v-bind="activatorProps"
            >
              发货
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card text="是否发货吗？" title="发货">
              <template v-slot:actions>
                <v-spacer></v-spacer>

                <v-btn @click="isActive.value = false"> 关闭 </v-btn>

                <v-btn
                  @click="
                    () => {
                      invoicingApi
                        .shipOrderSendOrder({
                          id: item.id,
                        })
                        .then((res) => {
                          isActive.value = false;
                          loadItems({
                            page: 1,
                            itemsPerPage: itemsPerPage,
                          });
                        });
                    }
                  "
                >
                  确定
                </v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>
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
        <v-dialog max-width="400" persistent>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              prepend-icon="bxl-slack-old"
              color="error"
              density="compact"
              v-bind="activatorProps"
            >
              删除
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card text="是否删除吗？" title="删除">
              <template v-slot:actions>
                <v-spacer></v-spacer>

                <v-btn @click="isActive.value = false"> 关闭 </v-btn>

                <v-btn
                  @click="
                    () => {
                      invoicingApi
                        .shipOrderDelSendMainID({
                          id: item.id,
                        })
                        .then((res) => {
                          isActive.value = false;
                          loadItems({
                            page: 1,
                            itemsPerPage: itemsPerPage,
                          });
                        });
                    }
                  "
                >
                  确定
                </v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>
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
