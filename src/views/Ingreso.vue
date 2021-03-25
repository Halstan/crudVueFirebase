<template>
  <div class="container">
    <h2 class="my-5">Ingreso de usuarios</h2>
    <div class="alert alert-danger" v-show="error.tipo !== null">
      {{ error.mensaje }}
    </div>
    <form ref="form" @submit.prevent="procesarFormulario">
      <input
        v-model.trim="email"
        class="form-control my-2"
        :class="[error.tipo === 'Email' ? 'is-invalid' : '']"
        type="email"
        placeholder="Email"
      />
      <input
        v-model="pass1"
        class="form-control my-2"
        :class="[error.tipo === 'Password' ? 'is-invalid' : '']"
        type="password"
        placeholder="Contraseña"
      />
      <button
        class="btn btn-primary btn-block"
        type="submit"
        :disabled="bloquear"
      >
        Ingresar
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Ingresar",
  data() {
    return {
      email: "",
      pass1: "",
    };
  },
  computed: {
    bloquear() {
      if (!this.email.includes("@")) {
        return true;
      }
      if (this.pass1.length > 5) {
        return false;
      }
      return true;
    },
    ...mapState(["error"]),
  },
  methods: {
    ...mapActions(["ingresoUsuario"]),
    async procesarFormulario() {
      await this.ingresoUsuario({ email: this.email, password: this.pass1 });
      this.$refs.form.reset();
    },
  },
};
</script>

<style></style>
