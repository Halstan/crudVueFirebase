import { createStore } from "vuex";
import router from "../router";

export default createStore({
  state: {
    tareas: [],
    tarea: {
      id: "",
      nombre: "",
      categorias: [],
      estado: "",
      numero: 0,
    },
    user: null,
    error: { tipo: null, mensaje: null }
  },
  mutations: {
    setError(state, payload) {
      if (payload === null) {
        return state.error = { tipo: null, mensaje: null }
      }
      if (payload === "EMAIL_NOT_FOUND") {
        return state.error = { tipo: "Email", mensaje: "Email no registrado" }
      }
      if (payload === "INVALID_PASSWORD") {
        return state.error = { tipo: "Password", mensaje: "Contraseña no valida" }
      }
      if (payload === "EMAIL_EXISTS") {
        return state.error = { tipo: "Existe", mensaje: "Este correo ya está registrado" }
      }
      if (payload === "INVALID_EMAIL") {
        return state.error = { tipo: "Invalid", mensaje: "Este correo es invalido" }
      }
    },
    setUser(state, payload) {
      state.user = payload;
    },
    cargar(state, payload) {
      state.tareas = payload;
    },
    set(state, payload) {
      state.tareas.push(payload);
    },
    eliminar(state, payload) {
      state.tareas = state.tareas.filter((item) => item.id !== payload);
    },
    tarea(state, payload) {
      if (!state.tareas.find((item) => item.id === payload)) {
        router.push("/");
        return;
      }
      state.tarea = state.tareas.find((item) => item.id === payload);
    },
    update(state, payload) {
      state.tareas = state.tareas.map((item) =>
        item.id === payload.id ? payload : item
      );
      router.push("/");
    },
  },
  actions: {
    cerrarSesion({ commit }) {
      commit("setUser", null);
      router.push("/ingreso");
      sessionStorage.removeItem("usuario");
    },
    async ingresoUsuario({ commit }, usuario) {
      try {
        const res = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBoXJYJXggcs70X8N1eq6xSVyYYcXtUNww",
          {
            method: "POST",
            body: JSON.stringify({
              email: usuario.email,
              password: usuario.password,
              returnSecureToken: true,
            }),
          }
        );
        const data = await res.json();
        if (data.error) {
          return commit("setError", data.error.message)
        }
        commit("setUser", data);
        commit("setError", null)
        router.push("/");
        sessionStorage.setItem("usuario", JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    },
    async registrarUsuario({ commit }, usuario) {
      try {
        const res = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBoXJYJXggcs70X8N1eq6xSVyYYcXtUNww",
          {
            method: "POST",
            body: JSON.stringify({
              email: usuario.email,
              password: usuario.password,
              returnSecureToken: true,
            }),
          }
        );
        const data = await res.json();
        if (data.error) {
          return commit("setError", data.error.message)
        }
        commit("setUser", data);
        commit("setError", null)
        router.push("/");
        sessionStorage.setItem("usuario", JSON.stringify(data));
      } catch (error) {
        console.error();
      }
    },
    async cargarLocalStorage({ commit, state }) {
      if (sessionStorage.getItem("usuario")) {
        commit("setUser", JSON.parse(sessionStorage.getItem("usuario")));
      } else {
        return commit("setUser", null);
      }
      try {
        const res = await fetch(
          `https://udemy-api-4fa6c-default-rtdb.firebaseio.com/tareas/${state.user.localId}.json?auth=${state.user.idToken}`
        );
        const data = await res.json();
        const arrayTareas = [];
        for (let id in data) {
          arrayTareas.push(data[id]);
        }

        commit("cargar", arrayTareas);
      } catch (error) {
        console.error(error);
      }
    },
    async setTareas({ commit, state }, tarea) {
      try {
        const res = await fetch(
          `https://udemy-api-4fa6c-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tarea),
          }
        );

        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
      commit("set", tarea);
    },
    async deleteTareas({ commit, state }, id) {
      try {
        await fetch(
          `https://udemy-api-4fa6c-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${id}.json?auth=${state.user.idToken}`,
          {
            method: "DELETE",
          }
        );
        commit("eliminar", id);
      } catch (error) {
        console.error(error);
      }
    },
    setTarea({ commit }, id) {
      commit("tarea", id);
    },
    async updateTarea({ commit, state }, tarea) {
      try {
        const res = await fetch(
          `https://udemy-api-4fa6c-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`,
          {
            method: "PATCH",
            body: JSON.stringify(tarea),
          }
        );
        const data = await res.json();
        commit("update", data);
      } catch (error) {
        console.error(error);
      }
    },
  },
  getters: {
    usuarioAutenticado(state) {
      return !!state.user;
    },
  },
  modules: {},
});
