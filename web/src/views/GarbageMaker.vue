<template>
    <div class="mx-4">
        <v-row>
            <v-col>
                <v-select variant='solo' v-model="selectedBuilding" :items="buildings" label="Select Building"></v-select>
            </v-col>
            <v-col>
                <v-select variant='solo' v-model="selectedWeek" :items="weeks" label="Select Week"></v-select>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-select variant='solo' v-model="selectedDay" :items="days" label="Select Day"></v-select>
            </v-col>
            <v-col>
                <v-select variant='solo' v-model="selectedGarbage" :items="garbageTypes" label="Select Garbage"></v-select>    
            </v-col>
            <v-col>
                <v-select variant='solo' v-model="selectedAction" :items="actions" label="Select Action"></v-select>
            </v-col>
        </v-row>
        <v-table v-if="(selectedBuilding && selectedWeek && buildingItems.length > 0)">
            <thead>
                <tr>
                    <th class="text-left">
                    Gebouw
                    </th>
                    <th class="text-left">
                    Vuilnis
                    </th>
                    <th class="text-left">
                    Week
                    </th>
                    <th class="text-left">
                    Dag
                    </th>
                    <th class="text-left">
                    Actie
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in buildingItems" :key="item.building">
                    <td>{{ item.building }}</td>
                    <td>{{ item.garbage }}</td>
                    <td>{{ item.week }}</td>
                    <td>{{ item.day }}</td>
                    <td>{{ item.action }}</td>
                </tr>

            </tbody>
            
        </v-table>
        <div class="d-flex flex-row-reverse">
            <v-btn v-if="(buildingItems.length == 0 && selectedBuilding && selectedDay && selectedWeek && selectedAction) " @click="addItem">Toevoegen</v-btn>
        </div>
        
        <!-- && selectedBuilding.value&& selectedDay.value && selectedGarbage.value && selectedAction.value -->
      <!--
      <v-card v-if="selectedBuilding || selectedGarbage">
        <v-card-title>Selected Building Info</v-card-title>
        <v-data-table :headers="buildingHeaders" :items="buildingItems" hide-default-footer></v-data-table>
        <v-btn v-if="buildingItems.length === 0" @click="addItem">Add</v-btn>
      </v-card>
      -->
    </div>
</template>
  
<script lang="ts" setup>
import { reactive, computed,ref } from 'vue'

const buildings = ['Building A', 'Building B', 'Building C', 'Building D', 'Building E'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const weeks = ['Odd', 'Even'];
const garbageTypes = ['Garbage Type 1', 'Garbage Type 2', 'Garbage Type 3'];
const actions = ['Action 1', 'Action 2', 'Action 3'];
const selectedBuilding = ref('');
const selectedDay = ref('');
const selectedWeek=  ref('');
const selectedGarbage = ref('');
const selectedAction = ref('');
const buildingData: {building:string; garbage:String; day:String; week:String; action:String}[] = reactive([
    { building: 'Building A', garbage: 'Garbage Type 1', day: 'Monday', week: 'Odd', action: 'Action 1' },
    { building: 'Building B', garbage: 'Garbage Type 2', day: 'Tuesday', week: 'Even', action: 'Action 2' },
    { building: 'Building C', garbage: 'Garbage Type 1', day: 'Wednesday', week: 'Odd', action: 'Action 3' },
    { building: 'Building D', garbage: 'Garbage Type 3', day: 'Thursday', week: 'Even', action: 'Action 1' },
    { building: 'Building E', garbage: 'Garbage Type 2', day: 'Friday', week: 'Odd', action: 'Action 2' },
]);

const buildingItems = computed(() => {
  if (selectedBuilding.value) {
    if (selectedGarbage.value) {
      if (selectedDay.value ) {
        if (selectedWeek.value) {
          return buildingData.filter(item => item.building === selectedBuilding.value && item.garbage === selectedGarbage.value && item.day === selectedDay.value && item.week === selectedWeek.value)
        } else {
          return buildingData.filter(item => item.building === selectedBuilding.value && item.garbage === selectedGarbage.value && item.day === selectedDay.value)
        }
      } else if (selectedWeek.value) {
        return buildingData.filter(item => item.building === selectedBuilding.value && item.garbage === selectedGarbage.value && item.week === selectedWeek.value)
      } else {
        return buildingData.filter(item => item.building === selectedBuilding.value && item.garbage === selectedGarbage.value)
      }
    } else if (selectedDay.value) {
      if (selectedWeek.value) {
        return buildingData.filter(item => item.building === selectedBuilding.value && item.day === selectedDay.value && item.week === selectedWeek.value)
      } else {
        return buildingData.filter(item => item.building === selectedBuilding.value && item.day === selectedDay.value)
      }
    } else if (selectedWeek.value) {
      return buildingData.filter(item => item.building === selectedBuilding.value && item.week === selectedWeek.value)
    } else {
      return buildingData.filter(item => item.building === selectedBuilding.value)
    }
  } else {
    return buildingData;
  }
})

const addItem = () => {
  if (selectedBuilding.value && selectedDay.value && selectedWeek.value && selectedGarbage.value && selectedAction.value) {
    buildingData.push({
      building: selectedBuilding.value,
      day: selectedDay.value,
      week: selectedWeek.value,
      garbage: selectedGarbage.value,
      action: selectedAction.value,
    })
    selectedDay.value = ''
    selectedGarbage.value = ''
    selectedAction.value = ''
  }
}
</script>
