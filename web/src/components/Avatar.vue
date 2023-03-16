<template>
  <v-avatar :color="color" :size="size">
    {{ initials }}
  </v-avatar>
</template>

<script lang="ts" setup>
const props = defineProps({
  name: String,
  size: {
    type: String,
    default: "large",
  },
});

// very basic hash function, not secure
function hash(str: string, modulo: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
    hash = hash % modulo;
  }
  return hash;
}

// get the avatar color
const colors = [
  "red",
  "blue",
  "green",
  "orange",
  "black",
  "pink",
  "yellow",
  "purple",
  "indigo",
  "light-blue",
  "deep-purple",
  "teal",
  "lime",
  "brown",
  "amber",
];
const color = colors[hash(String(props.name), colors.length)];

// get the initials from the name
function getInitials(str: string) {
  return str
    .split(" ")
    .map((c) => c[0])
    .join("");
}
const initials = getInitials(String(props.name));
</script>

<style scoped></style>
