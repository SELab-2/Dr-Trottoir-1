<template>
  <div class='building-screen'>
    <div class='heading-image'>
      <v-img cover src='https://source.unsplash.com/featured/1920x1080'></v-img>
    </div>
    <v-sheet rounded class='building-info'>
      <h1 class='building-name'>Gebouw {{id}}</h1>
      <p class='building-description'><i>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</i></p>
      <div class='building-actions'>
        <v-btn class='building-action-button' prepend-icon='mdi-map-search'>google maps</v-btn>
        <v-btn class='building-action-button' prepend-icon='mdi-file-pdf-box'>handleiding</v-btn>
      </div>
      <building-schedule :id='id'/>
      <v-card class='building-comments' title='Opmerkingen'>
        <v-list>
          <v-list-item class='building-comment' title='Poort Nummer' subtitle='1234'></v-list-item>
          <v-list-item class='building-comment' title='Noodtelefoon' subtitle='+320 00 00 00 00'></v-list-item>
        </v-list>
      </v-card>
      <building-photos :id='id'/>
    </v-sheet>
  </div>
</template>

<script>
import BuildingSchedule from '@/components/BuildingSchedule'
import BuildingPhotos from '@/components/buildingPhotos'
export default {
  name: 'BuildingScreen',
  components: { BuildingPhotos, BuildingSchedule },
  data () {
    return {
      id: this.$route.params.id
    }
  },
}
</script>

<style scoped lang="scss">
  @import 'src/assets/styles/base';

  // wrapper for the whole screen, used for basic properties that apply to the whole page.
  .building-screen{
    height: 100%;
    width: 100%;
    background-color: $primary;
  }

  // the image of the building displayed in the top bar.
  .heading-image{
    height: 25%;
    //max-height: 300px;
    width: 100%;
    top: 0;
  }

  // the container for all the building text, should be in the center of the screen.
  .building-info{
    width: 1200px;
    max-width: 90%;
    padding: 20px;
    position: absolute;
    color: $primary;
    background-color: rgba($secondary, 0.9);
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.5vh;
  }

  // the title at the top of the page.
  .building-name{
    font-size: 7vh;
    text-align: center;
    margin: 0;
  }

  // a detailed description of the building just beneath the title.
  .building-description{
    width: 80%;
    margin-left: 10%;
    margin-bottom: 20px;
    font-size: 1.5vh;
  }

  // container for the buttons under the description.
  .building-actions{
    display: flex;
    margin: 10px;
  }

  // the buttons under the description.
  .building-action-button{
    margin-left: 10px;
    margin-right: 10px;
  }

  .building-comments {
    margin: 20px;
  }

  .building-comment {
    margin-left: 30px;
  }
</style>
