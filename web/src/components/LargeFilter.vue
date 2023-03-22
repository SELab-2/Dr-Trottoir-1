<template>
  <!-- Card that lets you select the round -->
  <v-card>
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
        :append-icon="dropdown ? 'mdi-menu-up' : 'mdi-menu-down'"
        @click="dropdown = !dropdown"
        variant="flat"
      >
        Filter
      </v-btn>
    </template>
    <v-expand-transition>
      <div v-show="dropdown">
        <v-divider class="mb-3" />
        <v-row class="mx-0">
          <v-col>
            <v-text-field
              label="Eerste dag"
              type="date"
              variant="solo"
              v-model="start_day"
              @update:model-value="
                $emit('startDate', date_string_to_date(start_day))
              "
            />
          </v-col>
          <v-col>
            <v-text-field
              label="Laatste dag"
              type="date"
              variant="solo"
              v-model="end_day"
              @update:model-value="
                $emit('startDate', date_string_to_date(end_day))
              "
            />
          </v-col>
          <v-col>
            <v-select
              variant="solo"
              label="Zoekcategorie"
              :items="search_by_labels"
              v-model="search_label"
              @update:model-value="$emit('seachLabel', search_label)"
            />
          </v-col>
        </v-row>

        <v-row class="ml-2">
          <!-- Filter column -->
          <v-col v-if="filter_items.length != 0">
            <v-label class="mb-2">
              <v-icon icon="mdi-filter" class="mr-2" />
              Filter opties
            </v-label>
            <!-- the density option is kind of broken, but an invalid string gives the correct result -->
            <v-checkbox
              v-for="item in filter_items"
              :key="item"
              :label="item"
              color="primary"
              v-model="filters"
              :value="item"
              density=""
              @update:model-value="$emit('filters', filters)"
            />
          </v-col>
          <!-- Search order column -->
          <v-col v-if="sort_items.length != 0">
            <v-radio-group
              v-model="sort_by"
              color="primary"
              @update:model-value="$emit('sortBy', sort_by)"
            >
              <v-label class="mb-2">
                <v-icon icon="mdi-sort" class="mr-2" />
                Sorteer volgens
              </v-label>
              <v-radio
                v-for="option in sort_items"
                :key="option"
                :label="option"
                :value="option"
              />
            </v-radio-group>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps({
  // indicates what the search bar can function for
  // the first element will be the default search option
  // []: no search bar
  // 1 elem: search bar, no selection to search by other values
  // more elems: search bar, selection box to select the value to search by (name, place, etc)
  // the search querry is emitted with 'onSearch'
  // the updated label is emitted with 'seachLabel'
  search_by_labels: { type: Array<string>, default: [] },

  // All the filter options
  filter_items: { type: Array<string>, default: [] },

  // The inital selected filters
  // The list of selected filters is emitted with 'filter'
  selected_filters: { type: Array<string>, default: [] },


  // All the search options
  // The first option will be the default
  // The updated option is emitted with 'sortBy'
  sort_items: { type: Array<string>, default: [] },

  // The start and end date, current time as default
  // Option to show it or not
  // The updated dates will be emitted with 'startDate' and 'endDate'
  start_date: {
    type: String,
    default: new Date().toISOString().substring(0, 10),
  },
  enable_start_date: { type: Boolean, default: true },
  end_date: {
    type: String,
    default: new Date().toISOString().substring(0, 10),
  },
  enable_end_date: { type: Boolean, default: true },
});

// State to show or don't show the extra filter options
const dropdown = ref<boolean>(false);

// The search querry in the main search bar
// This is emitted with 'onSearch'
const search_querry = ref<string>("");

// The selcted value to seach by
// This is emitted with 'seachLabel'
const search_label = ref<string>(props.search_by_labels[0]);

const search_placeholder = () => {
  return "Zoek per " + search_label.value.toLowerCase();
};

// The currently selected sort option
// This is emitted with 'sortBy'
const sort_by = ref<string>(props.sort_items[0]);

// The currently selected filters
// This is emitted with 'filters'
const filters = ref<string[]>(props.selected_filters);

// The start and end date
// These are emitted with 'startDate' and 'endDate'
const start_day = ref<string>(props.start_date);
const end_day = ref<string>(props.end_date);

const date_string_to_date = (date_string: string) => {
  const date_list: string[] = date_string.split("/");
  return new Date(date_list[2], date_list[1], date_list[0]);
};
</script>
