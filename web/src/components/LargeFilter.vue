<template>
  <!-- Card that lets you select the round -->
  <v-card class="ma-3" >
    <template v-slot:prepend v-if="search_by_labels.length != 0">
        <v-icon icon="mdi-magnify"></v-icon>
    </template>
    <template v-slot:title v-if="search_by_labels.length != 0">
        <v-text-field
            :label="search_placeholder()"
            v-model="search_querry"
            @update:model-value="$emit('onSearch', search_querry)"
            variant="underlined"
            clearable
        />
    </template>
    <template v-slot:append>
        <v-btn
            prepend-icon="mdi-filter"
            :append-icon="dropdown ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="dropdown = !dropdown"
            variant="flat"
        >
            Filter
        </v-btn>
    </template>
    <v-expand-transition>
      <div v-show="dropdown">
        <v-divider/>
        <v-select
        variant="solo"
        label="Zoekcategorie"
        :items="search_by_labels"
        v-model="serach_label"
        @update:model-value="$emit('seachLabel', serach_label)"
        />
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  // indicates what the search bar can function for
  // the first element will be the default search option
  // []: no search bar
  // 1 elem: search bar, no selection to search by other values
  // more elems: search bar, selection box to select the value to search by (name, place, etc)
  // the search querry is emitted with 'onSearch'
  // the updated label is emitted with 'seachLabel'
  search_by_labels: { type: Array<string>, default: []},
});

// State to show or don't show the extra filter options
const dropdown = ref<boolean>(false);

// The search querry in the main search bar
// This is emitted with 'onSearch'
const search_querry = ref<string>("");

// The selcted value to seach by
// This is emitted with 'seachLabel'
const serach_label = ref<string>(props.search_by_labels[0]);

const search_placeholder = () => {
    return 'Zoek per ' + serach_label.value.toLowerCase();
}
</script>
