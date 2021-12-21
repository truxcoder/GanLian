<template>
  <div>{{ token }}</div>
</template>

<script>
// import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'Auth',
  data() {
    return {
      token: [],
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.$store.dispatch('user/auth')
    // this.$store.commit('SET_TOKEN', 'admin-token')
    // setToken('admin-token')
    this.token = this.$store.dispatch('user/auth').then(res => {
      this.token = res
      this.$router.push({ path: this.redirect || '/' })
    })
  }
}
</script>

<style></style>
