<script setup>
import unqualifiedApi from "@/api/unqualified";

const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const ressonList = ref([]);
unqualifiedApi
  .unqualifiedReturnReason({
    mid: props.item.id,
  })
  .then((res) => {
    ressonList.value = res.data;
  });
const submit = () => {
  return new Promise((resolve) => {
    unqualifiedApi
      .unqualifiedUpdateData({
        mid: props.item.id,
        ccause: props.item.ccause,
        cimprove: props.item.cimprove,
      })
      .then(() => {
        resolve();
      });
  });
};
console.log(props.item);
defineExpose({
  submit,
});
</script>
<template>
  <v-card variant="text">
    <v-card-title>
      <h3 class="mt-2 mb-2">基本信息</h3>
    </v-card-title>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-sheet> 物料名称： {{ props.item.cinvName }} </v-sheet>
        </v-col>
        <v-col cols="12" sm="6">
          <v-sheet> 规格型号： {{ props.item.cinvStd }} </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-sheet> 不合格数量： {{ props.item.iqty }} </v-sheet>
        </v-col>
        <v-col cols="12" sm="6">
          <v-sheet> 不合格类型： {{ props.item.ctypeName }} </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-sheet> 处罚金额： {{ props.item.ifinaMoney }} </v-sheet>
        </v-col>
        <v-col cols="12" sm="6">
          <v-sheet> 处理方式： {{ props.item.csugName }} </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-divider></v-divider>
  <v-card variant="text">
    <v-card-title>
      <h3 class="mt-2 mb-2">不合格描述</h3>
    </v-card-title>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <v-sheet> {{ props.item.cdepict }} </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-divider></v-divider>
  <v-card variant="text">
    <v-card-title>
      <h3 class="mt-2 mb-2">原因分析</h3>
    </v-card-title>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <v-textarea
            v-model="props.item.ccause"
            label="具体明细"
            hide-details
            rows="3"
            variant="underlined"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-divider></v-divider>
  <v-card variant="text">
    <v-card-title>
      <h3 class="mt-2 mb-2">改善措施</h3>
    </v-card-title>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <v-textarea
            v-model="props.item.cimprove"
            label="具体明细"
            hide-details
            rows="3"
            variant="underlined"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-divider></v-divider>
  <v-card variant="text">
    <v-card-title>
      <h3 class="mt-2 mb-2">退回原因</h3>
    </v-card-title>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <v-sheet v-for="item in ressonList">
            <span class="mr-5">{{ item.tCreateTime }}</span>
            <span>{{ item.cRecordMemo }}</span>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
