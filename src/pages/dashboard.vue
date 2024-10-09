<script setup>
import AnalyticsCongratulations from "@/views/dashboard/AnalyticsCongratulations.vue";
import AnalyticsFinanceTabs from "@/views/dashboard/AnalyticsFinanceTab.vue";
import AnalyticsProfitReport from "@/views/dashboard/AnalyticsProfitReport.vue";
import AnalyticsTotalRevenue from "@/views/dashboard/AnalyticsTotalRevenue.vue";
import AnalyticsTransactions from "@/views/dashboard/AnalyticsTransactions.vue";

// 👉 Images
import loginApi from "@/api/login";
import chart from "@images/cards/chart-success.png";
import card from "@images/cards/credit-card-primary.png";
import paypal from "@images/cards/paypal-error.png";
import wallet from "@images/cards/wallet-info.png";
const firstDatas = ref({});
loginApi.defaultinfoSp().then((res) => {
  firstDatas.value = res.data;
});
</script>

<template>
  <VRow>
    <!-- 👉 Congratulations -->
    <VCol cols="12" md="8">
      <AnalyticsCongratulations />
    </VCol>

    <VCol cols="12" sm="4">
      <VRow>
        <!-- 👉 Profit -->
        <VCol cols="12" md="6">
          <CardStatisticsVertical
            v-bind="{
              title: '上月开票（元）',
              image: chart,
              stats: firstDatas?.spone?.value || '0',
            }"
          />
        </VCol>

        <!-- 👉 Sales -->
        <VCol cols="12" md="6">
          <CardStatisticsVertical
            v-bind="{
              title: '本月扣款（元）',
              image: wallet,
              stats: firstDatas?.sptwo?.value || '0',
              change: firstDatas?.sptwo?.per,
            }"
          />
        </VCol>
      </VRow>
    </VCol>

    <!-- 👉 Total Revenue -->
    <VCol cols="12" md="8" order="2" order-md="1">
      <AnalyticsTotalRevenue />
    </VCol>

    <VCol cols="12" sm="8" md="4" order="1" order-md="2">
      <VRow>
        <!-- 👉 Payments -->
        <VCol cols="12" sm="6">
          <CardStatisticsVertical
            v-bind="{
              title: '交货及时率（本月）',
              image: paypal,
              stats: firstDatas?.spthree?.value + '%' || '0',
              change: firstDatas?.spthree?.per,
            }"
          />
        </VCol>

        <!-- 👉 Revenue -->
        <VCol cols="12" sm="6">
          <CardStatisticsVertical
            v-bind="{
              title: '品质合格率（本月）',
              image: card,
              stats: firstDatas?.spfour?.value + '%' || '0',
              change: firstDatas?.spfour?.per,
            }"
          />
        </VCol>
      </VRow>

      <VRow>
        <VCol cols="12" sm="12">
          <AnalyticsProfitReport />
        </VCol>
      </VRow>
    </VCol>

    <!-- <VCol cols="12" md="4" sm="6" order="3">
      <AnalyticsOrderStatistics />
    </VCol> -->

    <VCol cols="12" md="4" sm="6" order="3">
      <AnalyticsFinanceTabs />
    </VCol>

    <VCol cols="12" md="4" sm="6" order="3">
      <AnalyticsTransactions />
    </VCol>
  </VRow>
</template>
