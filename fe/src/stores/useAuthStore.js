import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import authService from '../services/authService';
import { notify } from '@kyvg/vue3-notification';

export const useAuthStore = defineStore('authStore', () => {
  const user = useLocalStorage('metadata', {});
  const login = async ({ email, password }) => {
    try {
      const { data } = await authService.login({ email, password });
      if (data.metadata) {
        user.value = data.metadata;
      }
      setUserData(data.metadata);
      notify({
        type: 'success',
        title: 'Login successfully.',
      });
    } catch (error) {
      notify({
        type: 'error',
        title: 'Login fail.',
      });
    }
  };
  const register = async ({ email, password }) => {
    try {
      const { data } = await authService.register({ email, password });
      setUserData(data.metadata);
      notify({
        type: 'success',
        title: 'Register successfully.',
      });
    } catch (error) {
      notify({
        type: 'error',
        title: 'Register fail.',
      });
    }
  };
  const setUserData = async (data) => {
    if (data) {
      user.value = data;
    }
  };
  const logout = async () => {
    user.value = {};
    location.reload();
  };
  return {
    user,
    login,
    register,
    logout,
  };
});
