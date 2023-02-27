<template>
    <v-container>
        <v-row no-gutters>

            <v-col>
                <v-card width="100%">
                    <v-card-title>
                        <h3>Nieuwe ronde voor: </h3>
                        <div class="d-flex">
                            <v-select label="Student"
                                :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-select>
                            <v-btn>Klaar</v-btn>
                        </div>

                    </v-card-title>


                    <v-divider></v-divider>
                    <v-layout>

                        <v-list width="100%">
                            <v-list-item v-for="(building, i) in round" :key="i" :value="building" fluid>
                                <v-list-item-title v-text="building.name"></v-list-item-title>
                                <v-list-item-subtitle v-text="building.adress"></v-list-item-subtitle>
                                <v-list-item-subtitle class="text-right align-self-start">Vuilnistype</v-list-item-subtitle>

                                <template v-slot:prepend>
                                    <v-icon icon="mdi-chevron-up" @click="moveBuildingUp(i, building)"></v-icon>
                                    <v-icon icon="mdi-chevron-down" @click="moveBuildingDown(i, building)"></v-icon>
                                    <v-icon icon="mdi-close" @click="deleteBuildingFromRound(i, building)"></v-icon>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-layout>
                </v-card>
            </v-col>


            <v-col>
                <v-card width="100%">
                    <v-card-title>
                        <h3>Beschikbare gebouwen</h3>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-layout>

                        <v-list background-color="rgba(75,75,75,1)" width="100%">
                            <v-list-item background-color="rgba(75,75,75,1)" v-for="(building, i) in buildings" :key="i"
                                :value="building" fluid>
                                <v-list-item-title v-text="building.name"></v-list-item-title>
                                <v-list-item-subtitle v-text="building.adress"></v-list-item-subtitle>
                                <v-list-item-subtitle class="text-right align-self-start"></v-list-item-subtitle>
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-arrow-left-bold"
                                        @click="deleteBuildingFromAvailable(i, building)"></v-icon>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-layout>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script lang="ts">
import { reactive } from 'vue'

export default {
    setup() {
        const buildings: any[] = reactive(
            [{ 'adress': '10841 Sutter CircleSutter Creek95685', 'name': 'Lee' },
            { 'adress': '915 Sacramento StreetBakersfield93305', 'name': 'Lartigue' },
            { 'adress': '1383 Purdue StreetSan Leandro94579', 'name': 'Anderson' },
            { 'adress': '553 South Arlington RoadOrange92869', 'name': 'Campbell' },
            { 'adress': '450 C StreetHayward94541', 'name': 'Kahn' },
            { 'adress': '915 Sacramento StreetBakersfield93305', 'name': 'Amezaga' },
            { 'adress': '800 California 116Sebastopol95472', 'name': 'Petersen' },
            { 'adress': '7725 Ney AvenueOakland94605', 'name': 'Hof' },
            { 'adress': '3777 Mowry AvenueFremont94538', 'name': 'Johnson' },
            { 'adress': '1011 San Jose StreetSan Leandro94577', 'name': 'Rodriguez' }]
        )
        const round: any[] = reactive([])

        function deleteBuildingFromRound(index: number, building: { adress: string, name: string }) {
            round.splice(index, 1)
            buildings.push(building)
        }

        function moveBuildingUp(index: number, building: { adress: string, name: string }) {
            if (index > 0) {
                let temp = round[index];
                round[index] = round[index - 1];
                round[index - 1] = temp;
            }
        }

        function moveBuildingDown(index: number, building: { adress: string, name: string }) {
            if (round.length - 1 > index) {
                let temp = round[index];
                round[index] = round[index + 1];
                round[index + 1] = temp;
            }
        }

        function deleteBuildingFromAvailable(index: number, building: { adress: string, name: string }) {
            buildings.splice(index, 1);
            round.push(building)
        }



        return {
            buildings,
            round,
            deleteBuildingFromAvailable,
            deleteBuildingFromRound,
            moveBuildingUp,
            moveBuildingDown
        };
    },
}

</script>
