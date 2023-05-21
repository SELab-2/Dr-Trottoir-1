<template>
  <BorderCard
    class="mb-4"
    v-if="props.building?.id"
    v-on="{
      click: () => {
        router.push({ name: 'building_id', params: { id: props.building!.id } })
      }
    }"
  >
    <div class="d-flex align-center">
      <img
        v-if="building.images.length > 0"
        :src="
          ImgProxy.env
            .resize({ width: 200, height: 200 })
            .maxBytes(50 * 1024)
            .url(building.images[0].image)
        "
        alt="Banner"
        class="prepend-img"
      />

      <div class="pa-5">
        <h3>{{ building.name }}</h3>

        <div class="d-flex align-center mt-1" style="gap: 12px">
          <Avatar
            :name="syndicusName ?? undefined"
            size="x-small"
            :key="syndicusName ?? undefined"
          />
          <p>{{ syndicusName ?? "Geen syndicus aangesteld" }}</p>
        </div>

        <div class="d-flex mt-3" style="gap: 12px">
          <v-chip label color="brown">
            <v-icon icon="mdi-office-building-marker-outline"></v-icon>
            <p class="ml-2">{{ fullAddress }}</p>
          </v-chip>

          <v-chip
            label
            color="red"
            v-if="progressItems.filter((e) => e.report !== '').length > 0"
          >
            <v-icon icon="mdi-comment-alert-outline"></v-icon>
            <p class="ml-2">Opmerkingen</p>
          </v-chip>
        </div>
      </div>

      <div class="d-flex" style="gap: 12px"></div>

      <div class="flex-grow-1"></div>

      <v-btn
        @click.stop="expanded = !expanded"
        :icon="expanded ? 'mdi-menu-up' : 'mdi-menu-down'"
        variant="text"
        v-if="progressItems.length > 0"
      />
    </div>

    <v-expand-transition v-on:click.stop>
      <div v-show="expanded">
        <divider-layout></divider-layout>

        <div
          style="
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          "
          class="pa-3 font-weight-medium"
        >
          <p>Datum</p>
          <p>Ronde</p>
          <p>Opmerkingen</p>
        </div>

        <div
          v-for="progress of progressItems"
          :key="progress.id"
          @click="
            router.push({
              name: 'round_detail',
              params: {
                id: progress.schedule?.round_id,
                schedule: progress.schedule_id,
              },
            })
          "
        >
          <divider-layout></divider-layout>

          <div
            style="
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
            "
            class="pa-3"
          >
            <p>
              {{
                new Date(progress.arrival ?? new Date()).toLocaleDateString()
              }}
            </p>
            <p>{{ progress.schedule?.round.name }}</p>
            <p>
              {{ progress.report.slice(0, 20) }}
              {{ progress.report.length > 20 ? ".." : "" }}
            </p>
          </div>
        </div>
      </div>
    </v-expand-transition>
  </BorderCard>
</template>

<script lang="ts" setup>
import Avatar from "@/components/Avatar.vue";
import { ref, Ref } from "vue";
import { useRouter } from "vue-router";
import BorderCard from "@/layouts/CardLayout.vue";
import DividerLayout from "@/layouts/DividerLayout.vue";
import Filterdata from "@/components/filter/FilterData";
import { Result, BuildingQuery, ProgressQuery } from "@selab-2/groep-1-query";
import { PropType } from "vue";
import { tryOrAlertAsync } from "@/try";
import { ImgProxy } from "@/imgproxy";

const props = defineProps({
  building: { type: Object as PropType<Result<BuildingQuery>>, required: true },
  filter_data: { type: Object as PropType<Filterdata>, required: true },
});

const router = useRouter();
const expanded = ref<Boolean>(false);
const progressItems: Ref<Array<Result<ProgressQuery>>> = ref([]);

// We compute the name of the syndicus once.
const syndicusName: string | null = (() => {
  const syndicus = props.building?.syndicus.user;

  if (syndicus === undefined) {
    return null;
  }

  return `${syndicus.first_name} ${syndicus.last_name}`;
})();

// We compute the full address once.
const fullAddress: string | null = (() => {
  const address = props.building?.address;

  if (!address) {
    return null;
  }

  return `${address.street} ${address.number}, ${address.zip_code} ${address.city}`;
})();

function getStartOfDay(day: Date) {
  return new Date(day.setHours(0, 0, 0, 0));
}

function getEndOfDay(day: Date) {
  return new Date(
    new Date(day.setHours(0, 0, 0, 0)).setDate(day.getDate() + 1),
  );
}

tryOrAlertAsync(async () => {
  // Retrieve items within given time range.
  const start = props.filter_data?.start_day;
  const end = props.filter_data?.end_day;

  let result = await new ProgressQuery().getAll({
    building: props.building?.id,
    arrived_after: start ? getStartOfDay(start) : undefined,
    arrived_before: end ? getEndOfDay(end) : undefined,
  });

  // Filter based on comments if required.
  if (props.filter_data?.filters.includes("Opmerkingen")) {
    result = result.filter((e) => e.report !== "");
  }

  // Set results
  progressItems.value = result;
});
</script>

<style scoped lang="scss">
.prepend-img {
  height: 150px;
  object-fit: cover;
  width: 200px;
}

.dropdown-button {
  position: absolute;
  bottom: 3px;
  right: 3px;
}

.align-top {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
