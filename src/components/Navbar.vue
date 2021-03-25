<template>
  <div class="navbar navbar-dark bg-dark">
    <router-link to="/" class="navbar-brand"> Formularios </router-link>
    <div class="d-flex">
      <router-link class="btn btn-dark" to="/" v-if="usuarioAutenticado">
        Tareas
      </router-link>
      <router-link
        class="btn btn-dark"
        to="/ingreso"
        v-if="!usuarioAutenticado"
      >
        Ingresar
      </router-link>
      <router-link
        class="btn btn-dark"
        to="/registro"
        v-if="!usuarioAutenticado"
      >
        Registrar
      </router-link>
      <button
        @click="cerrarSesion"
        class="btn btn-primary"
        v-if="usuarioAutenticado"
      >
        Cerrar sesión
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Navbar",
  computed: {
    ...mapGetters(["usuarioAutenticado"]),
  },
  methods: {
    ...mapActions(["cerrarSesion"]),
  },
};
</script>
