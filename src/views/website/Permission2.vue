<template>
  <div class="app-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <ul>
      <li v-for="(route, index) in routesHasMeta" :key="index">{{ route.meta.title }}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Permission',
  computed: {
    ...mapGetters([
      'permission_routes',
      'name'
    ]),
    routesHasMeta() {
      return this.permission_routes.filter(item => item.meta)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
