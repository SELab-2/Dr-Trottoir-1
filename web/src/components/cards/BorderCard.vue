<template>
<!-- Set default style and pass attributes -->
<v-card 
    style="border: #BDBDBD 1px solid"
    variant="flat"
    v-bind="{ ...$attrs }" 
>
    <!-- Pass all the slots -->
    <template v-for="(_, slotName) in $slots" #[slotName]>
        <slot :name="slotName" />
    </template>
</v-card>
</template>
<!-- Based on -->
<!-- https://dev.to/kouts/create-wrapper-components-for-vuetify-components-2aah -->