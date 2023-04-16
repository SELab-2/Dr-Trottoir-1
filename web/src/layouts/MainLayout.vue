<template>
  <v-app>
    <v-main>
      <v-navigation-drawer
        :temporary="!permanentDrawer"
        :permanent="!!permanentDrawer"
        v-model="drawer"
        class="sidebar"
        style="border: rgba(189, 189, 189, 0.5) 1px solid"
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
              id="logout"
              @click="logOut"
              prepend-icon="mdi-account-cancel"
              title="Afmelden"
              value="logout"
            />

            <router-link
              :to="{
                name: 'account_settings',
                params: { id: 0 },
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
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import DividerLayout from "@/layouts/DividerLayout.vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();

const today = new Date().toLocaleDateString("nl");

// reactive state to show the drawer or not
const drawer = ref(true);

// get the route object, needed to show the title
const route = useRoute();

// roles to know what to show
const isStudent: Boolean = useAuthStore().auth!.student;
const isSuperStudent: Boolean = useAuthStore().auth!.super_student;
const isSyndicus = true; // TODO: check for syndicus
const isAdmin: Boolean = useAuthStore().auth!.admin;

// account display settings
const studentName: string =
  useAuthStore().auth!.first_name + " " + useAuthStore().auth!.last_name;
function roles(): string {
  let str = "";
  if (isStudent) {
    str += "student ";
  }
  if (isSuperStudent) {
    str += "superstudent ";
  }
  if (isSyndicus) {
    str += "syndicus ";
  }
  if (isAdmin) {
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

async function logOut() {
  await useAuthStore().logOut();
  await router.push({ name: "login" });
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

.sidebar {
  position: fixed !important;
  height: 100vh !important;
}
</style>
