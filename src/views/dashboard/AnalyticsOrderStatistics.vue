<script setup>
import loginApi from "@/api/login";
import { hexToRgb } from "@layouts/utils";
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";
const vuetifyTheme = useTheme();

const series = [45, 80, 20, 40];
const infoDatas = ref([0, 0, 0]);
loginApi.selectGetall().then((res) => {
  infoDatas.value = [res.data.dt1, res.data.dt2, res.data.dt3];
});
const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;
  const disabledTextColor = `rgba(${hexToRgb(
    String(currentTheme["on-surface"])
  )},${variableTheme["disabled-opacity"]})`;
  const primaryTextColor = `rgba(${hexToRgb(
    String(currentTheme["on-surface"])
  )},${variableTheme["high-emphasis-opacity"]})`;

  return {
    chart: {
      sparkline: { enabled: true },
      animations: { enabled: false },
    },
    stroke: {
      width: 6,
      colors: [currentTheme.surface],
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    labels: ["Fashion", "Electronic", "Sports", "Decor"],
    colors: [
      currentTheme.success,
      currentTheme.primary,
      currentTheme.secondary,
      currentTheme.info,
    ],
    grid: {
      padding: {
        top: -7,
        bottom: 5,
      },
    },
    states: {
      hover: { filter: { type: "none" } },
      active: { filter: { type: "none" } },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "75%",
          labels: {
            show: true,
            name: {
              offsetY: 17,
              fontSize: "14px",
              color: disabledTextColor,
              fontFamily: "Public Sans",
            },
            value: {
              offsetY: -17,
              fontSize: "24px",
              color: primaryTextColor,
              fontFamily: "Public Sans",
            },
            total: {
              show: true,
              label: "Weekly",
              fontSize: "14px",
              formatter: () => "38%",
              color: disabledTextColor,
              fontFamily: "Public Sans",
            },
          },
        },
      },
    },
  };
});

const orders = [
  {
    amount: infoDatas.value.dt1,
    title: "今日订单",
    avatarColor: "primary",
    subtitle: "Today's order",
    avatarIcon: "bx-mobile-alt",
  },
  {
    amount: infoDatas.value.dt2,
    title: "今日未报价单",
    avatarColor: "success",
    subtitle: "No quotation today",
    avatarIcon: "bx-closet",
  },
  {
    amount: infoDatas.value.dt3,
    title: "本月不合格处置单",
    avatarColor: "info",
    subtitle: "Unqualified disposal orders this month",
    avatarIcon: "bx-home",
  },
];

const moreList = [
  {
    title: "Share",
    value: "Share",
  },
  {
    title: "Refresh",
    value: "Refresh",
  },
  {
    title: "Update",
    value: "Update",
  },
];
const time = new Intl.DateTimeFormat("zh-cn", {
  timeStyle: "medium",
  dateStyle: "medium",
}).format(new Date());
</script>

<template>
  <VCard>
    <VCardItem class="pb-3">
      <VCardTitle class="mb-1"> 信息提示 </VCardTitle>
      <VCardSubtitle>最后更新时间: {{ time }}</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="flex-grow-1">
          <h4 class="text-h4 mb-1">8,258</h4>
          <span>Total Orders</span>
        </div>

        <div>
          <VueApexCharts
            type="donut"
            :height="125"
            width="105"
            :options="chartOptions"
            :series="series"
          />
        </div>
      </div>

      <VList class="card-list mt-7">
        <VListItem v-for="(order, i) in orders" :key="order.title">
          <template #prepend>
            <VAvatar rounded variant="tonal" :color="order.avatarColor">
              <VIcon :icon="order.avatarIcon" />
            </VAvatar>
          </template>

          <VListItemTitle class="mb-1">
            {{ order.title }}
          </VListItemTitle>
          <VListItemSubtitle class="text-disabled">
            {{ order.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <span>{{ infoDatas[i] }}</span>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 21px;
}
</style>
