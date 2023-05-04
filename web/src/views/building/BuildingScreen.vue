<template>
  <HFillWrapper v-if="building !== null">
    <div class="space-y">
      <img
        alt="banner"
        id="banner"
        src="https://unsplash.com/photos/95YCW2X5jUc/download?force=true&w=1920"
      />

      <div>
        <div class="d-flex justify-space-between">
          <h1 class="building-name">{{ building.name }}</h1>
          <RoundedButton
            v-if='useAuthStore().auth?.admin'
            @clicked="() => router.push({ name: 'building_new' })"
            icon="mdi-pencil"
            class="mt-2"
          />
        </div>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
          ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div style="display: flex; gap: 16px; flex-wrap: wrap" class="mt-2">
          <RoundedButton icon="mdi-map-search" value="Kaarten" />
          <RoundedButton icon="mdi-file-pdf-box" value="Handleiding" />
          <RoundedButton icon="mdi-lock" value="3142" />
        </div>
      </div>

      <CardLayout
        style="
          display: flex;
          gap: 16px;
          align-items: center;
          border-radius: 10px;
          padding: 16px 0 16px 16px;
        "
      >
        <Avatar
          :name="
            building.syndicus?.user.first_name +
            ' ' +
            building.syndicus?.user.last_name
          "
        ></Avatar>

        <div>
          <p style="font-weight: 600; font-size: 16px; opacity: 90%">
            SYNDICUS
          </p>
          <p style="font-weight: 500">
            {{
              building.syndicus?.user.first_name +
              " " +
              building.syndicus?.user.last_name
            }}
          </p>
        </div>

        <div style="flex-grow: 1"></div>

        <div style="display: flex; gap: 16px; flex-wrap: wrap">
          <RoundedButton
            icon="mdi-phone"
            :value="building.syndicus?.user.phone"
          />
          <RoundedButton icon="mdi-mail" value="E-mail" />
        </div>
      </CardLayout>

      <div class="space-y-8">
        <div style="display: flex; gap: 8px; align-items: center" class="mt-8">
          <h2>Taken</h2>
          <div class="flex-grow-1"></div>
          <RoundedButton
            icon="mdi-calendar"
            value="17 Maart 2023 - 24 Maart 2023"
          ></RoundedButton>
          <RoundedButton
            icon="mdi-plus"
            value="Toevoegen"
            @click="
              () => router.push({ name: 'garbage_plan', params: { id: id } })
            "
          ></RoundedButton>
        </div>
        <div class="grid">
          <CardLayout
            style="
              display: flex;
              align-items: center;
              padding: 16px 0 16px 16px;
              gap: 16px;
            "
            v-for="action in garbage"
            :key="action.id"
          >
            <div>
              <h4>{{ action.action.description }}</h4>
              <p>{{ new Date(action.pickup_time).toLocaleString() }}</p>
            </div>
            <div class="flex-grow-1"></div>
            <v-icon icon="mdi-check" v-if="Math.random() < 0.5"></v-icon>
            <v-icon v-else icon="mdi-plus"></v-icon>
            <v-icon icon="mdi-trash-can-outline"></v-icon>
          </CardLayout>
        </div>
      </div>

      <div class="space-y-8" v-if='useAuthStore().auth?.admin || useAuthStore().auth?.super_student'>
        <div style="display: flex; gap: 8px; align-items: center" class="mt-8">
          <h2>Bezoeken</h2>
          <div class="flex-grow-1"></div>
          <RoundedButton icon="mdi-calendar" value="Maart 2023"></RoundedButton>
          <RoundedButton icon="mdi-plus" value="Toevoegen"></RoundedButton>
        </div>

        <RoundCard
          :schedule="schedule"
          :status="'completed'"
          v-for="schedule in schedules"
          :key="schedule.id"
        ></RoundCard>
        <RoundCard :schedule="schedules[0]" :status="'active'"></RoundCard>
        <RoundCard
          :schedule="schedule"
          :status="'scheduled'"
          v-for="schedule in schedules"
          :key="schedule.id"
        ></RoundCard>
      </div>
    </div>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import router from "@/router";
import Avatar from "@/components/Avatar.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import CardLayout from "@/layouts/CardLayout.vue";
import { useAuthStore } from "@/stores/auth"
import { BuildingQuery, Result, ScheduleQuery } from "@selab-2/groep-1-query";
import { Ref, ref } from "vue";
import { tryOrAlertAsync } from "@/try";
import RoundCard from "@/components/round/RoundCard.vue";
import { GarbageQuery } from "@selab-2/groep-1-query/dist/garbage";

const building: Ref<Result<BuildingQuery> | null> = ref(null);
const schedules: Ref<Array<Result<ScheduleQuery>>> = ref([]);
const garbage: Ref<Array<Result<GarbageQuery>>> = ref([]);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

tryOrAlertAsync(async () => {
  building.value = await new BuildingQuery().getOne(Number(props.id));
});

tryOrAlertAsync(async () => {
  // TODO (in rework building page)
  //schedules.value = await new ScheduleQuery().getAll({});
});

tryOrAlertAsync(async () => {
  garbage.value = await new GarbageQuery().getAll({building_id: Number(props.id)});
});
</script>

<style lang="scss" scoped>
#banner {
  width: 100%;
  max-height: 34vh;
  object-fit: cover;
  border-radius: 5px;
}

.space-y {
  & > * {
    margin-bottom: 32px;
  }
}

.space-y-8 {
  & > * {
    margin-bottom: 8px;
  }
}

#building-screen {
  max-width: 800px;
  margin: auto;

  & > * {
    margin: 50px 0;
  }
}

.grid {
  display: grid;
  gap: 8px;

  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
