<template>
  <!-- Card that lets you select the round -->
  <BorderCard>
    <template v-slot:prepend v-if="search_by_labels.length != 0">
      <v-icon icon="mdi-magnify"></v-icon>
    </template>
    <template v-slot:title v-if="search_by_labels.length != 0">
      <v-text-field
        :label="search_placeholder()"
        v-model="filter_data.query"
        @update:model-value="$emit('onUpdate', filter_data)"
        variant="underlined"
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
        <DividerLayout class="mb-3"/>
        <v-row class="mx-0">
          <v-col>
            <v-text-field
              label="Eerste dag"
              type="date"
              variant="solo"
              v-model="s_day"
              @update:model-value="
                filter_data.start_day = formatDate(new Date(s_day));
                $emit('onUpdate', filter_data);
              "
            />
          </v-col>
          <v-col>
            <v-text-field
              label="Laatste dag"
              type="date"
              variant="solo"
              v-model="e_day"
              @update:model-value="
                filter_data.end_day = formatDate(new Date(e_day));
                $emit('onUpdate', filter_data);
              "
            />
          </v-col>
          <v-col v-if="search_by_labels.length > 1">
            <v-select
              variant="solo"
              label="Zoekcategorie"
              :items="search_by_labels"
              v-model="filter_data.search_label"
              @update:model-value="$emit('onUpdate', filter_data)"
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
            <v-checkbox
              v-for="item in filter_items"
              :key="item"
              :label="item"
              :value="item"
              v-model="filter_data.filters"
              color="primary"
              density="compact"
              hide-details
              @update:model-value="$emit('onUpdate', filter_data)"
            />
          </v-col>
          <!-- Search order column -->
          <v-col>
            <v-radio-group
              v-model="filter_data.sort_by"
              color="primary"
              @update:model-value="$emit('onUpdate', filter_data)"
            >
              <v-label class="mb-2">
                <v-icon icon="mdi-sort" class="mr-2" />
                Sorteer
              </v-label>
              <v-btn-toggle
                color="primary"
                variant="tonal"
                density="compact"
                v-model="filter_data.sort_ascending"
                @update:model-value="$emit('onUpdate', filter_data)"
                mandatory
              >
                <v-btn :value="true" prepend-icon="mdi-arrow-up-thin">
                  Stijgend
                </v-btn>

                <v-btn :value="false" append-icon="mdi-arrow-down-thin">
                  Dalend
                </v-btn>
              </v-btn-toggle>
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
  </BorderCard>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import FilterData from "@/components/filter/FilterData";
import { formatDate } from "@/assets/scripts/date";
import BorderCard from "@/layouts/CardLayout.vue";
import DividerLayout from "@/layouts/DividerLayout.vue";

// The filter data is emitted with the 'onUpdate' tag
const props = defineProps({
  // indicates what the search bar can function for
  // the first element will be the default search option
  // []: no search bar
  // 1 elem: search bar, no selection to search by other values
  // more elems: search bar, selection box to select the value to search by (name, place, etc)
  search_by_labels: { type: Array<string>, default: [] },

  // All the filter options
  filter_items: { type: Array<string>, default: [] },

  // The inital selected filters
  selected_filters: { type: Array<string>, default: [] },

  // All the search options
  // The first option will be the default
  sort_items: { type: Array<string>, default: [] },

  // The start and end date, current time as default
  // Option to show it or not
  start_date: {
    type: Date,
    default: new Date(),
  },
  enable_start_date: { type: Boolean, default: true },
  end_date: {
    type: Date,
    default: new Date(),
  },
  enable_end_date: { type: Boolean, default: true },
});

// State to show or don't show the extra filter options
const dropdown = ref<boolean>(false);

const search_placeholder = () => {
  return "Zoek per " + filter_data.value.search_label.toLowerCase();
};

const s_day = ref<string>(props.start_date.toISOString().substring(0, 10));
const e_day = ref<string>(props.end_date.toISOString().substring(0, 10));

// The filter data is emitted with the 'onUpdate' tag
const filter_data = ref<FilterData>({
  // The search querry in the main search bar
  query: "",
  // The selcted value to seach by
  search_label: props.search_by_labels[0],
  // The currently selected sort option
  sort_by: props.sort_items[0],
  // State if we sort ascending or descending
  sort_ascending: true,
  // The currently selected filters
  filters: props.selected_filters,
  // The start and end date
  start_day: formatDate(props.start_date),
  end_day: formatDate(props.end_date),
});
</script>
