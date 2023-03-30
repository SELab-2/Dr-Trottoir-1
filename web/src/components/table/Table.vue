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
              icon="mdi-chevron-down"
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
              @click="route_to(header.routeto)"
              :class="actual_route(header.routeto) ? 'clickable': ''"
            >
              <img :src="header.get(item)" class="image" alt="Portrait" />
            </div>
            <div
              v-if="header.type === RowType.AVATAR"
              style="display: flex; align-items: center"
              @click="route_to(header.routeto)"
              :class="actual_route(header.routeto) ? 'clickable': ''"
            >
              <Avatar :name="header.get(item)" clickable/>
            </div>
            <div 
              v-if="header.type === RowType.CHECKBOX"
              @click="route_to(header.routeto)"
              :class="actual_route(header.routeto) ? 'clickable': ''"
            >
              <input type="checkbox" v-model="item.student" />
            </div>
            <!-- Check or cross icon for boolean-->
            <div 
              v-if="header.type === RowType.BOOLEAN"
              @click="route_to(header.routeto)"
              :class="actual_route(header.routeto) ? 'clickable': ''"
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
              @click="route_to(header.routeto)"
              :class="actual_route(header.routeto) ? 'clickable': ''"
            ></v-btn>
            <p 
              v-if="header.type === RowType.TEXT"
              @click="route_to(header.routeto)"
              :class="actual_route(header.routeto) ? 'clickable': ''"
            >{{ header.get(item) }}</p>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
import Avatar from "@/components/Avatar.vue";
import { RowType } from "@/components/table/RowType";
import { Header } from "@/components/table/Header";
import router from "@/router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps(["entries", "headers"]);

function bool_icon(bool: boolean): string{
  return bool ? 'mdi-check' : 'mdi-close'; 
}

function bool_color(bool: boolean): string{
  return bool ? 'success' : 'red'; 
}

function actual_route(route: string): boolean{
  return route !== ""
}

function route_to(route: string){
  if(actual_route(route)){
    router.push(route)
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
