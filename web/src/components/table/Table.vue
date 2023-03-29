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
          <router-link :to="item.detailPageUrl()">
            <div
              v-if="header.type === RowType.IMAGE"
              style="display: flex; align-items: center"
              @click="handle_click($event, header)"
            >
              <img :src="header.get(item)" class="image" alt="Portrait" />
            </div>
            <div
              v-if="header.type === RowType.AVATAR"
              style="display: flex; align-items: center"
              @click="handle_click($event, header)"
            >
              <Avatar :name="header.get(item)" />
            </div>
            <div v-if="header.type === RowType.BOOLEAN">
              <input type="checkbox" v-model="item.student" />
            </div>
            <v-btn
              v-if="header.type === RowType.ICON"
              variant="plain"
              v-bind:icon="header.get(item)"
              size="small"
              @click="handle_click($event, header)"
            ></v-btn>
            <p 
              v-if="header.type === RowType.TEXT"
              @click="handle_click($event, header)"
            >{{ header.get(item) }}</p>
          </router-link>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
import Avatar from "@/components/Avatar.vue";
import { RowType } from "@/components/table/RowType";
import { Header } from "@/components/table/Header";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps(["entries", "headers"]);

function handle_click(event: MouseEvent, header: Header<any>){
  if(header.clickable){
    // prevent the parrent click
    event.preventDefault();
    // execute the action for this column item
    header.onclick();
  }
};
</script>

<style lang="sass" scoped>
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
