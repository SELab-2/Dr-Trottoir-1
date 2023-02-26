<template>
  <h1>planningsoverzicht</h1>
  <div class="rondekiezer">
    <label>Kies een ronde:</label>
    <select id="ronde">
      <option value="" disabled selected hidden>{{ huidige_ronde.nummer }}</option>
      <option v-for="(ronde, index) in rondes" :key="ronde" :value="index">{{ ronde.nummer }}</option>
    </select>
    <button type="button" v-on:click="verander_huidig()">update</button>
  </div>

  <ul class="d-flex flex-row justify-center" v-for="gebouw in huidige_ronde.gebouwen" :key="gebouw">
    <v-sheet class="ma-2 pa-2">
      <b>{{ gebouw.naam }}</b>
      <p>{{ gebouw.adres }}</p>
      <p>{{ gebouw.info }}</p>
    </v-sheet>
    <!-- dit is het planningsrooster, moet nog aangepast worden,
    maar ik weet niet precies hoe de planning opgeslagen wordt-->
    <div class="grid-container">
      <div class="grid-head">MA</div>
      <div class="grid-head">DI</div>
      <div class="grid-head">WO</div>
      <div class="grid-head">DO</div>
      <div class="grid-head">VR</div>
      <div class="grid-item">REST</div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item">PMD</div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item">PAPIER</div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item"></div>
      <div class="grid-item">GLAS</div>
    </div>
    <v-sheet class="checkbox">
      <v-checkbox></v-checkbox>
    </v-sheet>
  </ul>
</template>

<script>
export default {
  name: "SchedulingScreenStudents",
  data() {
    return {
      // test data
      rondes: [{
        nummer: 1, gebouwen: [{
          naam: "gebouw1", adres: "coolestraat 69", info: "meer info/opmerkingen"
          , ophaling: "data met type afval"
        }, {
          naam: "gebouw2", adres: "anderestraat 420",
          info: "wegens werken dient de achteringang genomen te worden"
          , ophaling: "data met type afval"
        }, {
          naam: "gebouw3", adres: "teamstraat 1", info: "meer info/opmerkingen"
          , ophaling: "data met type afval"
        }]
      },
        {
          nummer: 2, gebouwen: [{
            naam: "gebouw3", adres: "geeninspiratiestraat 13", info: "meer info/opmerkingen"
            , ophaling: "data met type afval"
          },]
        }], // wss nog meer velden, maar niet allemaal nodig hier
      huidige_ronde: {
        nummer: 1, gebouwen: [{
          naam: "gebouw1", adres: "coolestraat 69", info: "meer info/opmerkingen"
          , ophaling: "data met type afval"
        }, {
          naam: "gebouw2", adres: "anderestraat 420",
          info: "wegens werken dient de achteringang genomen te worden"
          , ophaling: "data met type afval"
        }, {
          naam: "gebouw3", adres: "teamstraat 1", info: "meer info/opmerkingen"
          , ophaling: "data met type afval"
        }]
      }
    }
  },
  methods: {
    verander_huidig(){
      this.huidige_ronde = this.rondes[document.getElementById("ronde").value];
    }
  }
}
</script>

<style scoped>

label{
  margin-right: 5px;
}
select {
  border: black 1px solid;
  -webkit-appearance: listbox !important;
  margin-right: 5px;
}

button{
  background-color: grey;
  border-radius: 8px;
  border: black 1px solid;
  color: white;
  padding: 5px;
}

h1{
  text-align: center;
}

.rondekiezer{
  text-align: center;
}

.d-flex{
  align-self: center;
}

.ma-2{
  width: 200px;
}

.grid-container {
  display: grid;
  alignment: center;
  grid-template-columns: auto auto auto auto auto;
  padding: 10px;
}
.grid-item {
  border: 1px solid black;
  font-size: 20px;
  padding: 5px;
  text-align: center;
}
.grid-head {
  background-color: grey;
  border: 1px solid black;
  font-size: 20px;
  padding: 2px;
  text-align: center;
}
</style>
