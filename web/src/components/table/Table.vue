<template>
  <v-table>
    <thead>
    <tr>
      <th v-bind:key="header.id" v-for="header in headers" :class="{ fit: header.fit }">
        <div style="display: flex; align-items: center">
          <p>
            {{ header.name }}
          </p>
          <v-btn v-if="header.sortable" variant="plain" icon="mdi-chevron-down" size="small"></v-btn>
        </div>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="item in entries"
      :key="item.id"
    >
      <td v-bind:key="header.id" v-for="header in headers" :class="{ fit: header.fit }">
        <div v-if="header.type === RowType.IMAGE" style="display: flex; align-items: center">
          <img v-bind:src="item.portrait" class="image" alt="Portrait">
        </div>
        <div v-if="header.type === RowType.BOOLEAN">
          <input type="checkbox" v-model="item.student">
        </div>
        <v-btn v-if="header.type === RowType.ICON" variant="plain" v-bind:icon="header.get(item)" size="small"></v-btn>
        <p v-if="header.type === RowType.TEXT">{{header.get(item)}}</p>
      </td>
    </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { RowType } from "@/components/table/RowType";

export default {
  props: ['entries', 'headers'],
  data() {
    return {
      RowType,
    }
  },
}
</script>

<style lang="sass">
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
</style>
