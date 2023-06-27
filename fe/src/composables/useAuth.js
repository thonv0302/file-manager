import authService from '../services/authService';

export default function useAuth() {
  const { login, register } = authService;

  return {
    login,
    register,
  };
}
