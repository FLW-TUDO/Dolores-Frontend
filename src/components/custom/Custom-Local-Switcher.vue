<template>
  <select v-model="$i18n.locale">
    <option v-for="(locale, i) in locales" :key="`locale-${i}`" :value="locale">
      {{ locale }}
    </option>
  </select>
</template>

<script>
export default {
  name: "Custom-Local-Switcher",
  data() {
    return { locales: ["de", "en"] };
  }
};
</script>