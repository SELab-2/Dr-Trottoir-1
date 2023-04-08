<template>
  <!-- Set default style and pass attributes -->
  <v-card

    variant="flat"
    v-bind="{ ...$attrs }"
    style="border: rgba(189, 189, 189, 0.50) 1px solid;"
  >
    <!-- Pass all the slots -->
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </v-card>
</template>
<!-- Based on -->
<!-- https://dev.to/kouts/create-wrapper-components-for-vuetify-components-2aah -->
