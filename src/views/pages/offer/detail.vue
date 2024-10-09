<script setup>
import offerApi from "@/api/offer";
import { computed } from "vue";
const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const formData = ref({});
const submit = () => {
  return new Promise((resolve) => {
    offerApi
      .insertData({
        id: props.item.autoid,
        ...formData.value,
      })
      .then(() => {
        resolve();
      });
  });
};
const sum = computed(() => {
  return (
    Number(formData.value.fprocessPrice1) +
    Number(formData.value.fprocessPrice2) +
    Number(formData.value.fprocessPrice3) +
    Number(formData.value.fprocessPrice4) +
    Number(formData.value.fprocessPrice5)
  );
});
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
        <v-col cols="12" sm="4">
          <v-sheet> 产品名称： {{ props.item.cinvname }} </v-sheet>
        </v-col>
        <v-col cols="12" sm="4">
          <v-sheet> 规格型号： {{ props.item.cinvstd }} </v-sheet>
        </v-col>
        <v-col cols="12" sm="4">
          <v-sheet> 物料编码： {{ props.item.cinvcode }} </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" sm="4">
          <v-sheet> 需求数量： {{ props.item.iquantity }} </v-sheet>
        </v-col>
        <v-col cols="12" sm="4">
          <v-sheet> 需求日期： {{ props.item.ddate1 }} </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-divider></v-divider>
  <v-card variant="text">
    <v-card-title>
      <h3 class="mt-2 mb-2">以下为报价信息</h3>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.fmaterialPrice"
            label="材料费"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.cprocess1"
            label="第一道工艺"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.iprocessTime1"
            label="第一道工时"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.fprocessPrice1"
            label="第一道加工费"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.cprocess2"
            label="第二道工艺"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.iprocessTime2"
            label="第二道工时"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.fprocessPrice2"
            label="第二道加工费"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.cprocess3"
            label="第三道工艺"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.iprocessTime3"
            label="第三道工时"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.fprocessPrice3"
            label="第三道加工费"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.cprocess4"
            label="第四道工艺"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.iprocessTime4"
            label="第四道工时"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.fprocessPrice4"
            label="第四道加工费"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.cprocess5"
            label="第五道工艺"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.iprocessTime5"
            label="第五道工时"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.fprocessPrice5"
            label="第五道加工费"
            hide-details
            variant="underlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4"> 合计加工费：{{ sum || 0.0 }}</v-col>
        <v-col cols="12" sm="4"> 税 费： {{ sum * 0.13 || 0 }}</v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="formData.fprofit"
            label="利润"
            hide-details
            variant="underlined"
          ></v-text-field
        ></v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          总合计单价：{{ sum + Number(formData.fmaterialPrice) || 0.0 }}
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12">
          <v-textarea
            v-model="formData.cmemos"
            label="备注"
            hide-details
            rows="1"
            variant="underlined"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
