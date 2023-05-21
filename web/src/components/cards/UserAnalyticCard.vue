<template>
  <BorderCard class="pa-5">
    <div class="d-flex mb-2">
      <div>
        <h3>Prestaties</h3>
        <p>Bekijk het aantal gepresteerde uren per maand.</p>
      </div>
      <div class="flex-grow-1"></div>
      <input
        type="number"
        min="2020"
        max="2120"
        step="1"
        v-model="statsYear"
        style="width: 60px"
        v-on:change="retrieve"
      />
    </div>

    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
  </BorderCard>
</template>

<script setup lang="ts">
import BorderCard from "@/layouts/CardLayout.vue";
import { Ref, ref, onMounted, computed } from "vue";
import { Result, BuildingQuery, ProgressQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartOptions,
} from "chart.js";

// This is required to use ChartJS.
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const props = defineProps({
  id: { type: Number, required: true },
});

const totalTimeSpent: Ref<number[]> = ref([...Array(12)].map(() => 0));
const building = ref<Result<BuildingQuery>>();
const statsYear = ref(2023);
const months = [...Array(12)]
  .map((e, i) => new Date().setMonth(i))
  .map((e) => new Date(e).toLocaleDateString("default", { month: "long" }));

// The data of the charts is dependent on `totalTimeSpent`, so it must be a computed value.
const chartData = computed(() => {
  return {
    labels: months,
    datasets: [
      {
        data: totalTimeSpent.value,
        backgroundColor: ["rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgb(54, 162, 235)"],
        borderWidth: 1,
      },
    ],
  };
});

// Configuration of the chart.
const chartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

onMounted(() => {
  tryOrAlertAsync(async () => {
    building.value = await new BuildingQuery().getOne(props.id);
  });
});

async function retrieve() {
  totalTimeSpent.value = await Promise.all(
    [...Array(12)].map(async (e, i) => {
      const start = new Date();
      start.setUTCFullYear(statsYear.value, Number(i), 1);
      start.setHours(0, 0, 0);

      const end = new Date(start);
      end.setMonth(Number(i) + 1);

      const progressItems = await new ProgressQuery().getAll({
        arrived_after: start,
        left_before: end,
        user: props.id,
      });

      let time = 0;

      for (const progress of progressItems) {
        if (progress.arrival !== null && progress.departure !== null) {
          const departure = new Date(progress.departure);
          const arrival = new Date(progress.arrival);
          time += (departure.getTime() - arrival.getTime()) / (1000 * 60 * 60);
        }
      }

      return time;
    }),
  );
}

retrieve();
</script>
