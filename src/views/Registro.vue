<template>
  <div class="container">
    <h2 class="my-5">Registro de usuarios</h2>
    <div class="alert alert-danger" v-show="error.tipo !== null">
      {{ error.mensaje }}
    </div>
    <form ref="form" @submit.prevent="procesarFormulario">
      <input
        v-model.trim="email"
        class="form-control my-2"
        :class="[error.tipo === 'Existe' ? 'is-invalid' : '']"
        type="email"
        placeholder="Email"
      />
      <input
        v-model="pass1"
        class="form-control my-2"
        type="password"
        placeholder="Contraseña"
      />
      <input
        v-model="pass2"
        class="form-control my-2"
        type="password"
        placeholder="Contraseña"
      />
      <button
        class="btn btn-primary btn-block"
        type="submit"
        :disabled="bloquear"
      >
        Registrar
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Registro",
  data() {
    return {
      email: "",
      pass1: "",
      pass2: "",
    };
  },
  computed: {
    bloquear() {
      if (!this.email.includes("@")) {
        return true;
      }

      if (this.pass1.length > 5 && this.pass1 == this.pass2) {
        return false;
      }
      return true;
    },
    ...mapState(["error"]),
  },
  methods: {
    ...mapActions(["registrarUsuario"]),
    async procesarFormulario() {
      await this.registrarUsuario({ email: this.email, password: this.pass1 });
      this.$refs.form.reset();
    },
  },
};
</script>

<style></style>
