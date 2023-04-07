<template>
<v-card 
    style="border: #BDBDBD 1px solid"
    variant="flat"
    v-bind="{ ...$attrs }" 
>
    <template v-for="(_, slotName) in $slots" #[slotName]>
        <slot :name="slotName" />
    </template>
</v-card>
</template>