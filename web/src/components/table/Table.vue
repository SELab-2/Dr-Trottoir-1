<template :key="props.entries">
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
    <tbody v-if="entries">
      <tr v-for="item in entries?.filter((e) => e !== null)" :key="item.id">
        <td
          v-bind:key="header.id"
          v-for="header in headers"
          :class="{ fit: header.fit }"
          style="cursor: pointer"
          @click="router.push(item.route())"
        >
          <div
            v-if="header.type === RowType.IMAGE"
            style="display: flex; align-items: center"
          >
            <img :src="header.get(item)" class="image" alt="Portrait" />
          </div>
          <div
            v-if="header.type === RowType.AVATAR"
            style="display: flex; align-items: center"
          >
            <Avatar :name="header.get(item)" size="default" />
          </div>
          <div v-if="header.type === RowType.CHECKBOX">
            <input type="checkbox" v-model="item.student" />
          </div>
          <!-- Check or cross icon for boolean-->
          <div v-if="header.type === RowType.BOOLEAN">
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
            @click="() => header.onClick(item, entries!)"
          ></v-btn>
          <p v-if="header.type === RowType.TEXT">
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
import { ref } from "vue";
import { Header } from "@/components/table/Header";
import router from "@/router";

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
</script>

<style lang="sass" scoped>
.clickable
  cursor: pointer

tr:nth-child(even), th
  background-color: #F5F5F5

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
