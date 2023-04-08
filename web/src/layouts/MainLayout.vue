<template>
  <v-app>
    <v-main>
      <v-navigation-drawer
        :temporary="!permanentDrawer"
        :permanent="!!permanentDrawer"
        v-model="drawer"
        class="sidebar"
        style="border-right: rgba(97,97,97, 0.5) 1px solid"
        color="background"
      >
        <v-list density="compact" nav>
          <v-list-item lines="two">
            <template v-slot:prepend>
              <Avatar :name="studentName" />
            </template>
            <div class="flex">
              <div class="text">
                <v-list-item-title>{{ studentName }}</v-list-item-title>
                <v-list-item-subtitle>{{ roles() }}</v-list-item-subtitle>
              </div>
            </div>
          </v-list-item>

          <div>
            <v-list-item
              :to="{ name: 'login' }"
              prepend-icon="mdi-account-cancel"
              title="Afmelden"
              value="logout"
            />

            <router-link
              :to="{
                name: 'account_settings',
                params: { id: 0, isadmin: 'true' },
              }"
            >
              <v-list-item
                prepend-icon="mdi-cog"
                title="Account"
                value="account"
              />
            </router-link>
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

          <div v-if="isSuperStudent">
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

          <div v-if="isSyndicus">
            <p class="pa-2 font-weight-medium text-caption">Mijn gebouwen</p>

            <div v-for="buildingid of [1, 2]" :key="buildingid">
              <router-link
                :to="{
                  name: 'building_id_detail',
                  params: { id: buildingid, date: today },
                }"
              >
                <v-list-item
                  prepend-icon="mdi-file-cabinet"
                  :title="'Gebouw ' + buildingid"
                  value="gebouwen"
                />
              </router-link>
            </div>

            <div class="py-2">
              <DividerLayout />
            </div>
          </div>

          <div v-if="isAdmin">
            <p class="pa-2 font-weight-medium text-caption">Administratie</p>

            <v-list-item
              :to="{ name: 'user_overview' }"
              prepend-icon="mdi-account-supervisor"
              title="Gebruikers"
              value="users"
            ></v-list-item>

            <v-list-item
              :to="{ name: 'building_overview' }"
              prepend-icon="mdi-office-building-outline"
              title="Gebouwen"
              value="buildings"
            ></v-list-item>

            <v-list-item
              :to="{ name: 'round_overview' }"
              prepend-icon="mdi-map-legend"
              title="Rondes"
              value="rounds"
            ></v-list-item>
          </div>
        </v-list>

        <template v-slot:append>
          <p class="text-center text-caption pa-4">
            SELab 2 - Groep 1 (v0.0.1)
          </p>
        </template>
      </v-navigation-drawer>

      <v-app-bar prominent elevation="0" color="background">
        <div class="px-4">
          <v-app-bar-nav-icon variant="text" @click="drawer = !drawer" />
        </div>

        <v-toolbar-title class="font-weight-medium">
          {{ route.meta.title }}
        </v-toolbar-title>

        <v-spacer />
      </v-app-bar>

      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import Avatar from "@/components/Avatar.vue";
import { formatDate } from "@/assets/scripts/date";
import { ref } from "vue";
import { useRoute } from "vue-router";
import DividerLayout from "@/layouts/DividerLayout.vue";

const today = formatDate(new Date());

// reactive state to show the drawer or not
const drawer = ref(true);

// get the route object, needed to show the title
const route = useRoute();

// roles to know what to show
const isStudent = ref(true);
const isSuperStudent = ref(true);
const isSyndicus = ref(true);
const isAdmin = ref(true);

// account display settings
const studentName: string = "Jens Pots";
function roles(): string {
  let str = "";
  if (isStudent.value) {
    str += "student ";
  }
  if (isSuperStudent.value) {
    str += "superstudent ";
  }
  if (isSyndicus.value) {
    str += "syndicus ";
  }
  if (isAdmin.value) {
    str += "admin ";
  }
  return str;
}

const thresholdWidth: number = 750;

const permanentDrawer = ref<Boolean>(window.innerWidth > thresholdWidth);

window.addEventListener(
  "resize",
  () => (permanentDrawer.value = window.innerWidth > thresholdWidth),
);
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

.sidebar {
  position: fixed !important;
  height: 100vh !important;
}
</style>
