<template>
  <v-app>
    <v-main>
      <v-navigation-drawer
        :temporary="mobile"
        :permanent="!mobile"
        v-model="drawer"
        class="sidebar"
        style="position: fixed !important; height: 100vh !important"
        color="background"
      >
        <v-list density="compact" nav>
          <v-list-item
            id="account"
            lines="two"
            :to="{
              name: 'account_settings',
              params: { id: id },
            }"
          >
            <template v-slot:prepend>
              <Avatar :name="studentName" />
            </template>
            <div class="flex">
              <div class="text">
                <v-list-item-title>{{ studentName }}</v-list-item-title>
                <v-list-item-subtitle v-if="useAuthStore()?.auth?.admin">
                  Admin
                </v-list-item-subtitle>
                <v-list-item-subtitle
                  v-else-if="useAuthStore()?.auth?.super_student"
                >
                  Super Student
                </v-list-item-subtitle>
                <v-list-item-subtitle v-else-if="useAuthStore()?.auth?.student">
                  Student
                </v-list-item-subtitle>
                <v-list-item-subtitle v-else> Syndicus </v-list-item-subtitle>
              </div>
            </div>
          </v-list-item>

          <div>
            <v-list-item
              id="logout"
              @click="logOut"
              prepend-icon="mdi-account-cancel"
              title="Afmelden"
              value="logout"
            />
          </div>

          <div class="py-2">
            <DividerLayout />
          </div>

          <div v-if="isStudent">
            <p class="pa-2 font-weight-medium text-caption">Overzicht</p>

            <v-list-item
              :to="{ name: 'student_planning' }"
              prepend-icon="mdi-calendar-edit"
              title="Planning"
              value="schedule"
            />

            <div class="py-2">
              <DividerLayout />
            </div>
          </div>

          <div v-if="isSuperStudent || isAdmin">
            <p class="pa-2 font-weight-medium text-caption">Opvolging</p>

            <v-list-item
              :to="{ name: 'round_followup' }"
              prepend-icon="mdi-transit-detour"
              title="Opvolging"
              value="rondes"
            />

            <v-list-item
              :to="{ name: 'building_followup' }"
              prepend-icon="mdi-domain"
              title="Gebouwen"
              value="gebouwen"
            />

            <div class="py-2">
              <DividerLayout />
            </div>
          </div>

          <div v-if="syndicusBuildings.length > 0">
            <p class="pa-2 font-weight-medium text-caption">Mijn gebouwen</p>

            <div v-for="building of syndicusBuildings" :key="building.id">
              <router-link
                :to="{
                  name: 'building_id',
                  params: { id: building.id },
                }"
              >
                <v-list-item
                  id="building"
                  prepend-icon="mdi-file-cabinet"
                  :title="building.name"
                  value="gebouwen"
                />
              </router-link>
            </div>

            <div class="py-2">
              <DividerLayout />
            </div>
          </div>

          <div v-if="isSuperStudent || isAdmin">
            <p class="pa-2 font-weight-medium text-caption">Administratie</p>

            <v-list-item
              :to="{ name: 'user_overview' }"
              prepend-icon="mdi-account-supervisor"
              title="Gebruikers"
              value="users"
              id="users"
            ></v-list-item>

            <v-list-item
              :to="{ name: 'building_overview' }"
              prepend-icon="mdi-office-building-outline"
              title="Gebouwen"
              value="buildings"
              id="buildings"
            ></v-list-item>

            <v-list-item
              :to="{ name: 'round_overview' }"
              prepend-icon="mdi-map-legend"
              title="Rondes"
              value="rounds"
              id="rounds"
            ></v-list-item>
            <v-list-item
              id="templates"
              :to="{ name: 'template_overview' }"
              prepend-icon="mdi-email"
              title="Templates"
              value="templates"
            ></v-list-item>
          </div>
        </v-list>

        <template v-slot:append>
          <p class="text-center text-caption pa-4">
            SELab 2 - Groep 1 (v0.0.1)
          </p>
        </template>
      </v-navigation-drawer>

      <v-app-bar
        prominent
        elevation="0"
        color="background"
        style="position: fixed !important"
      >
        <div class="px-4">
          <v-app-bar-nav-icon
            id="navbar-visible"
            variant="text"
            @click="drawer = !drawer"
          />
        </div>

        <v-toolbar-title class="font-weight-medium">
          {{ route.meta.title }}
        </v-toolbar-title>
      </v-app-bar>
      <Suspense :key="route.fullPath">
        <template #fallback>
          <Loader />
        </template>
        <router-view />
      </Suspense>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import Loader from "@/components/popups/Loader.vue";
import Avatar from "@/components/Avatar.vue";
import { Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import DividerLayout from "@/layouts/DividerLayout.vue";
import { useAuthStore } from "@/stores/auth";
import { BuildingQuery, Result } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { useDisplay } from "vuetify";

const router = useRouter();
const display = useDisplay();
const mobile = display.mobile;
// reactive state to show the drawer or not
const drawer = ref(true);
// get the route object, needed to show the title
const route = useRoute();
// roles to know what to show
const isStudent: Boolean = useAuthStore().auth!.student;
const isSuperStudent: Boolean = useAuthStore().auth!.super_student;
const isAdmin: Boolean = useAuthStore().auth!.admin;
const syndicusBuildings: Ref<Result<BuildingQuery>[]> = ref([]);

tryOrAlertAsync(async () => {
  for (const building of useAuthStore().auth!.syndicus) {
    syndicusBuildings.value.push(await new BuildingQuery().getOne(building.id));
  }
});

// account display settings
const studentName: string =
  useAuthStore().auth!.first_name + " " + useAuthStore().auth!.last_name;

// account display settings
const id = useAuthStore().auth!.id;

async function logOut() {
  await router.push({ name: "login" });
  await useAuthStore().logOut();
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: black;
}
.text {
  width: 80%;
}
.flex {
  display: flex;
}
</style>
