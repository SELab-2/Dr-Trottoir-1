<template>
  <v-card class='building-photos' title="Opvolg foto's">
    <div class='building-photos'>
      <v-btn class='building-photo' prepend-icon='mdi-camera'>foto aankomst</v-btn>
      <v-btn class='building-photo' prepend-icon='mdi-camera'>foto afval</v-btn>
      <v-btn class='building-photo' prepend-icon='mdi-camera'>foto vertrek</v-btn>
    </div>
    <div class='big-actions'>
      <v-btn class='big-action' icon="mdi-cached" color="info" />
      <v-btn class='big-action' icon="mdi-check-bold" color="success"/>
      <v-btn class='big-action' icon="mdi-close-thick" color="error" />
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'buildingPhotos'
}
</script>

<style scoped lang="scss">
  @import 'src/assets/styles/base';

  .big-actions {
    display: flex;
    width: 60%;
    margin: auto;
  }

  .big-action {
    margin: auto auto 20px;
  }

  .building-photo {
    width: 90%;
    margin: 20px 20px 20px 5%;
    background-color: $secondary;
    color: $primary;
  }
</style>
