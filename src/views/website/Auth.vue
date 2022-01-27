<!--
 * @Author: truxcoder
 * @Date: 2021-10-14 17:00:33
 * @LastEditTime: 2022-01-17 13:13:34
 * @LastEditors: truxcoder
 * @Description:
-->
<template>
  <div>
    <div><img :src="photo" /></div>
  </div>
</template>

<script>
import { getToken, GetQueryValue } from '@/utils/auth'
import { request } from '@/api'
const defaultSettings = require('@/settings.js')
export default {
  name: 'Auth',
  data() {
    return {
      token: [],
      redirect: undefined,
      photo: ''
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
    const ticket = GetQueryValue('ticket')
    console.log('ticket:', ticket)
    // const service = 'http://' + defaultSettings.URL + '/auth'
    const service = 'http://' + defaultSettings.URL
    const v = false
    if (v) {
      const params = { ticket, service }
      request('user', 'login', {}, params).then(response => {
        console.log('login response:', response)
        if (!response.isValid) {
          this.$router.push('/403')
        } else {
          this.$store.dispatch('user/login', response.token).then(() => {
            this.$router.push({ path: this.redirect || '/dashboard' })
          })
        }
      })
      // request('user', 'police', {}, params).then(response => {
      //   console.log('res:', response)
      //   if (!response.isValid) {
      //     this.$router.push('/403')
      //   } else {
      //     this.token = this.$store.dispatch('user/auth', response.data).then(res => {
      //       // request('user', 'photo', {}, { id: response.data.id }).then(r => {
      //       //   this.photo = r.data
      //       //   this.$store.dispatch('user/setAvatar', r.data)
      //       // })
      //       this.token = res
      //       if (response.data.roles[0] === 'normal') {
      //         this.$router.push({ path: 'perdetail', query: { id: response.data.id } })
      //       } else {
      //         this.$router.push({ path: this.redirect || '/' })
      //       }
      //     })
      //   }
      // })
      // getAuth(params).then(res => {
      //   console.log('res:', res)
      // })
    } else {
      const token = getToken()
      console.log('token: ', token)
      this.token = token
      if (!token) {
        window.location.href = defaultSettings.centerURL + '?service=' + service
      }
    }

    // this.$store.dispatch('user/auth')
    // this.$store.commit('SET_TOKEN', 'admin-token')
    // setToken('admin-token')
    // this.token = this.$store.dispatch('user/auth').then(res => {
    //   this.token = res
    //   this.$router.push({ path: this.redirect || '/' })
    // })
  }
}
</script>

<style></style>
