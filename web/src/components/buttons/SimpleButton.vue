<template>
  <!-- Set default style and pass attributes -->
  <v-btn
    v-bind="{ ...$attrs }"
    class="text-none"
  >
    <!-- Pass all the slots -->
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </v-btn>
</template>
