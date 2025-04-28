import { login as apiLogin, register as apiRegister } from './api';

export const login = async (email, password) => {
  try {
    const { token, user } = await apiLogin(email, password);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id);
    return user;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const { token, user } = await apiRegister(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id);
    return user;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  return token && userId ? { token, userId } : null;
};