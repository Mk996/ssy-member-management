<template>
  <main class="login-page">
    <div class="card-box login-field-container">
      <h2 class="title gap-2">Login Here..</h2>
      <div class="grid-block">
        <input type="email" class="text-field" placeholder="Email" v-model="email" />
      </div>
      <div class="grid-block">
        <input type="password" class="text-field" placeholder="Password" v-model="password" />
      </div>
      <button class="button button-blue gap-2" @click="loginToFirebase">
        Login
      </button>
    </div>
  </main>
</template>

<script>
import { fa } from '../firebase/firebaseinit'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    loginToFirebase () {
      const promise = fa.signInWithEmailAndPassword(this.email, this.password)
      promise.catch(error => console.log(error))
    }
  }
}
</script>

<style lang="scss" scopped>
@import "@/styles/colors.scss";

.login-page {
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-field-container {
  width: 30vw;
}
</style>
