<template>
  <v-table>
    <thead>
      <tr>
        <th
          v-bind:key="header.id"
          v-for="header in headers"
          :class="{ fit: header.fit }"
        >
          <div style="display: flex; align-items: center">
            <p>
              {{ header.name }}
            </p>
            <v-btn
              v-if="header.sortable"
              variant="plain"
              :icon="
                header.order == 'asc' ? 'mdi-chevron-up' : 'mdi-chevron-down'
              "
              @click="() => sort(header)"
              size="small"
            ></v-btn>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in entries" :key="item.id">
        <td
          v-bind:key="header.id"
          v-for="header in headers"
          :class="{ fit: header.fit }"
        >
          <div
            v-if="header.type === RowType.IMAGE"
            style="display: flex; align-items: center"
            @click="route_to(header.route_to)"
            :class="actual_route(header.route_to) ? 'clickable' : ''"
          >
            <img :src="header.get(item)" class="image" alt="Portrait" />
          </div>
          <div
            v-if="header.type === RowType.AVATAR"
            style="display: flex; align-items: center"
            @click="route_to(header.route_to)"
            :class="actual_route(header.route_to) ? 'clickable' : ''"
          >
            <Avatar :name="header.get(item)" size="default" />
          </div>
          <div
            v-if="header.type === RowType.CHECKBOX"
            @click="route_to(header.route_to)"
            :class="actual_route(header.route_to) ? 'clickable' : ''"
          >
            <input type="checkbox" v-model="item.student" />
          </div>
          <!-- Check or cross icon for boolean-->
          <div
            v-if="header.type === RowType.BOOLEAN"
            @click="route_to(header.route_to)"
            :class="actual_route(header.route_to) ? 'clickable' : ''"
          >
            <v-icon
              :icon="bool_icon(header.get(item))"
              :color="bool_color(header.get(item))"
            />
          </div>
          <v-btn
            v-if="header.type === RowType.ICONBUTTON"
            variant="plain"
            v-bind:icon="header.get(item)"
            size="small"
            @click="route_to(header.route_to)"
            :class="actual_route(header.route_to) ? 'clickable' : ''"
          ></v-btn>
          <p
            v-if="header.type === RowType.TEXT"
            @click="route_to(header.route_to)"
            :class="actual_route(header.route_to) ? 'clickable' : ''"
          >
            {{ header.get(item) }}
          </p>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
import Avatar from "@/components/Avatar.vue";
import { RowType } from "@/components/table/RowType";
import router from "@/router";
import { ref } from "vue";
import { Header } from "@/components/table/Header";

const props = defineProps({
  entries: { type: Array<any>, require: true },
  headers: { type: Array<Header<any>>, require: true, default: [] },
  sort: { type: Function, require: true, default: () => {} },
});

const entries = ref(props.entries);

const headers = ref(props.headers);

function bool_icon(bool: boolean): string {
  return bool ? "mdi-check" : "mdi-close";
}

function bool_color(bool: boolean): string {
  return bool ? "success" : "red";
}

function actual_route(route: string): boolean {
  return route !== "";
}

function sort(header: Header<any>) {
  // Reset all other headers to `null` order.
  headers.value?.forEach((e) => {
    if (e != header) {
      e.order = null;
    }
  });

  // Sort the actual entries using the specific comparator.
  header.sort(entries.value ?? []);
}

function route_to(route: string) {
  if (actual_route(route)) {
    router.push(route);
  }
}
</script>

<style lang="sass" scoped>

.clickable
  cursor: pointer

tr:nth-child(even)
  background-color: #f8f8f8

td
  vertical-align: middle

.fit
  width: 0.1%
  white-space: nowrap

.image
  width: 40px
  height: 40px
  object-fit: cover
  border-radius: 40px

a
  text-decoration: none
  color: black
</style>
