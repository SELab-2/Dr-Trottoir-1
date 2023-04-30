<template>
  <BorderCard
    class="mx-1 mb-3"
    v-on="!can_expand ? { click: () => route(start_date) } : {}"
  >
    <v-row class="flex-nowrap">
      <v-col cols="2" class="flex-grow-0 flex-shrink-0">
        <!-- The image -->
        <v-img
          cover
          src="https://unsplash.com/photos/95YCW2X5jUc/download?force=true&w=1920"
          class="prepend-img"
        />
      </v-col>
      <v-col
        class="flex-grow-1 flex-shrink-0"
        style="min-width: 100px; max-width: 100%"
      >
        <!-- The content -->
        <v-card variant="flat" size="compact">
          <!-- Title -->
          <template v-slot:title>
            {{ building!.name }}
            <v-icon end v-if="comments"> mdi-comment-alert-outline </v-icon>
          </template>
          <!-- Subtitle -->
          <template v-slot:subtitle>
            <Avatar
              :name="full_syndicus_name()"
              size="x-small"
              :key="full_syndicus_name()"
            />
            {{ full_syndicus_name() }} <br />
            <v-chip label color="brown" class="mt-4">
              <v-icon icon="mdi-office-building-marker-outline"></v-icon>
              <p class="ml-2">{{ full_address() }}</p>
            </v-chip>
          </template>

          <template v-slot:append>
            <!-- Date -->
            <v-chip
              label
              color="blue"
              class="ml-3 align-top"
              v-if="!can_expand"
            >
              <v-icon icon="mdi-calendar-clock"></v-icon>
              <p class="ml-2">{{ start_date.toLocaleDateString() }}</p>
            </v-chip>
            <!-- Date expansion button-->
            <v-btn
              @click.stop="expanded = !expanded"
              :icon="expanded ? 'mdi-menu-up' : 'mdi-menu-down'"
              class="dropdown-button"
              variant="text"
              v-else
            />
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-expand-transition v-on:click.stop>
      <div v-show="progresses.length && expanded">
        <DividerLayout />
        <div class="w-100 px-4 py-2" v-if="progresses.length">
          <v-chip
            v-for="(progress, id) of progresses"
            :key="id"
            label
            class="w-100"
            variant="text"
            @click="route(progress.arrival)"
          >
            <v-icon color="blue" icon="mdi-calendar-clock"></v-icon>
            <p class="ml-2">
              {{
                new Date(progress.arrival ?? new Date()).toLocaleDateString()
              }}
            </p>
            <v-icon end color="black" v-if="progress.report">
              mdi-comment-alert-outline
            </v-icon>
          </v-chip>
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
import { Result, BuildingQuery, ProgressQuery } from "@selab-2/groep-1-query";
import { PropType } from "vue";
import { tryOrAlertAsync } from "@/try";

const router = useRouter();

const props = defineProps({
  building: { type: Object as PropType<Result<BuildingQuery>>, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
});

function full_syndicus_name() {
  const user = props.building.syndicus?.user;
  return user?.first_name + " " + user?.last_name;
}

function full_address() {
  const addressprops = props.building.address;
  return (
    addressprops.street + " " + addressprops.number + " " + addressprops.city
  );
}

const expanded = ref<Boolean>(false);
const comments = ref<Boolean>(false);

let progresses: Ref<Result<ProgressQuery>[]> = ref([]);

const can_expand: Ref<boolean> = ref(
  props.start_date.toLocaleDateString() !==
    props.end_date.toLocaleDateString(),
);

tryOrAlertAsync(async () => {
  progresses.value = await new ProgressQuery().getAll({
    building: props.building?.id,
    arrived_after: props.start_date,
    arrived_before: props.end_date,
  });
  can_expand.value = can_expand.value && progresses.value.length > 0;
});

function route(date: Date | null) {
  console.log(`TODO: link to ${date}`);
  if (props.building) {
    router.push({
      name: "building_id",
      params: {
        id: props.building.id,
        // TODO change to different route with:
        //  date: new Date(date).toLocaleDateString(),
      },
    });
  }
}
</script>

<style scoped lang="scss">
.prepend-img {
  height: 100%;
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
