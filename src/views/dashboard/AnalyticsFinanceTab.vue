<script setup>
import loginApi from "@/api/login";
import statsVerticalPaypal from "@images/cards/paypal-error.png";
import statsVerticalWallet from "@images/cards/wallet-primary.png";
import { hexToRgb } from "@layouts/utils";
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";

const vuetifyTheme = useTheme();

const series = ref({
  income: [
    {
      xName: [],
      data: [],
      sum: 0,
    },
  ],
});
const xName = ref([]);
loginApi.indexPriceRecordGroupMonth().then((res) => {
  xName.value = res.data.map((e) => {
    return e.month + "月";
  });

  series.value.income[0].data = res.data.map((e) => {
    series.value.income[0].sum += e.value;
    return e.value;
  });
});

const tabData = computed(() => {
  const data = {
    income: {
      avatar: statsVerticalWallet,
      title: "当年报价总数",
      stats: 0,
      profitLoss: 65,
      profitLossAmount: "6.5k",
      compareToLastWeek: "$39k",
    },
    expenses: {
      avatar: statsVerticalPaypal,
      title: "当年订单总数",
      stats: 0,
      profitLoss: 27.8,
      profitLossAmount: "7.2k",
      compareToLastWeek: "$16k",
    },
  };

  return data["income"];
});

const chartConfig = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;
  const disabledTextColor = `rgba(${hexToRgb(
    String(currentTheme["on-surface"])
  )},${variableTheme["disabled-opacity"]})`;
  const borderColor = `rgba(${hexToRgb(
    String(variableTheme["border-color"])
  )},${variableTheme["border-opacity"]})`;

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    grid: {
      strokeDashArray: 4.5,
      borderColor,
      padding: {
        left: 0,
        top: 0,
        right: 10,
        bottom: 0,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityTo: 0.25,
        opacityFrom: 0.5,
        stops: [0, 95, 100],
        shadeIntensity: 0.6,
        colorStops: [
          [
            {
              offset: 0,
              opacity: 0.4,
              color: currentTheme.primary,
            },
            {
              offset: 100,
              opacity: 0.2,
              color: currentTheme.surface,
            },
          ],
        ],
      },
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: "light",
        shadeIntensity: 1,
        color: currentTheme.primary,
      },
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: xName.value,
      labels: {
        style: {
          fontSize: "14px",
          colors: disabledTextColor,
          fontFamily: "Public Sans",
        },
      },
    },
    yaxis: {
      show: true,
      tickAmount: 4,
    },
    markers: {
      size: 8,
      strokeWidth: 6,
      strokeOpacity: 1,
      hover: { size: 8 },
      colors: ["transparent"],
      strokeColors: "transparent",
      discrete: [
        {
          size: 8,
          seriesIndex: 0,
          fillColor: "#fff",
          strokeColor: currentTheme.primary,
          dataPointIndex: series.value["income"][0].data.length - 1,
        },
      ],
    },
  };
});
</script>

<template>
  <VCard title="报价">
    <VCardText class="d-flex align-center gap-3">
      <VAvatar size="46" rounded :image="tabData.avatar" />

      <div>
        <p class="mb-0">
          {{ tabData.title }}
        </p>
        <div class="d-flex align-center gap-2">
          <h6 class="text-h6">
            {{ series["income"][0].sum }}
          </h6>
        </div>
      </div>
    </VCardText>

    <VCardText>
      <VueApexCharts
        type="area"
        :height="241"
        :options="chartConfig"
        :series="series['income']"
      />
    </VCardText>
  </VCard>
</template>
