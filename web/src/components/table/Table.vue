<template>
  <v-table>
    <thead>
      <tr>
        <th
          v-bind:key="header.id"
          v-for="header in props.headers"
          :class="{ fit: header.fit }"
        >
          <div style="display: flex; align-items: center">
            <p @click="sort_data(header.id)" class="clickable">
              {{ header.name }}
            </p>
            <v-btn
              v-if="header.sortable"
              variant="plain"
              :icon="
                sort_ascending.at(index_from_header(header.id))
                  ? 'mdi-chevron-down'
                  : 'mdi-chevron-up'
              "
              size="small"
              @click="sort_order(header.id)"
            ></v-btn>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in entries" :key="item.id">
        <td
          v-bind:key="header.id"
          v-for="header in props.headers"
          :class="{ fit: header.fit }"
        >
          <div
            v-if="header.type === RowType.IMAGE"
            style="display: flex; align-items: center"
            @click="route_to(item.route_to(header.id))"
            :class="actual_route(item.route_to(header.id)) ? 'clickable' : ''"
          >
            <img :src="header.get(item)" class="image" alt="Portrait" />
          </div>
          <div
            v-if="header.type === RowType.AVATAR"
            style="display: flex; align-items: center"
            @click="route_to(item.route_to(header.id))"
            :class="actual_route(item.route_to(header.id)) ? 'clickable' : ''"
          >
            <Avatar :name="header.get(item)" size="default" />
          </div>
          <div
            v-if="header.type === RowType.CHECKBOX"
            @click="route_to(item.route_to(header.id))"
            :class="actual_route(item.route_to(header.id)) ? 'clickable' : ''"
          >
            <input type="checkbox" v-model="item.student" />
          </div>
          <!-- Check or cross icon for boolean-->
          <div
            v-if="header.type === RowType.BOOLEAN"
            @click="route_to(item.route_to(header.id))"
            :class="actual_route(item.route_to(header.id)) ? 'clickable' : ''"
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
            @click="route_to(item.route_to(header.id))"
            :class="actual_route(item.route_to(header.id)) ? 'clickable' : ''"
          ></v-btn>
          <p
            v-if="header.type === RowType.TEXT"
            @click="route_to(item.route_to(header.id))"
            :class="actual_route(item.route_to(header.id)) ? 'clickable' : ''"
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
import { Header } from "@/components/table/Header";
import { ref } from "vue";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  // we use any because the type is generic
  entries: { type: Array<any>, require: true },
  headers: { type: Array<Header<any>>, require: true, default: [] },
  sort: { type: Function, require: true, default: () => {} },
});

const entries = ref(props.entries);
const sort_ids = ref(props.headers.map((header) => header.id));
const sort_ascending = ref(props.headers.map(() => true));

function index_from_header(header_id: number) {
  return sort_ids.value.indexOf(header_id);
}

function sort_order(header_id: number) {
  // togle sort order
  const index = index_from_header(header_id);
  sort_ascending.value[index] = !sort_ascending.value[index];

  // sort the data
  sort_data(header_id);
}

function sort_data(header_id: number) {
  // remove elements
  const index = index_from_header(header_id);
  sort_ids.value.splice(index, 1);
  const ascending = sort_ascending.value[index];
  sort_ascending.value.splice(index, 1);

  // place them up front
  sort_ids.value.unshift(header_id);
  sort_ascending.value.unshift(ascending);

  // sort the entries
  props.sort(entries.value, sort_ids.value, sort_ascending.value);
}

function bool_icon(bool: boolean): string {
  return bool ? "mdi-check" : "mdi-close";
}

function bool_color(bool: boolean): string {
  return bool ? "success" : "red";
}

function actual_route(route: string): boolean {
  return route !== "";
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
