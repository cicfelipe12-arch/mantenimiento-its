import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'mantenimiento_its_token';

export const authService = {
  async login(username, password) {
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 120,
      }),
    });

    if (!response.ok) {
      throw new Error('Usuario o contraseña incorrectos.');
    }

    const data = await response.json();

    await SecureStore.setItemAsync(TOKEN_KEY, data.accessToken);

    return data;
  },

  async getToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async removeToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  async getCurrentUser(token) {
    const response = await fetch('https://dummyjson.com/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('La sesión ya no es válida.');
    }

    return await response.json();
  },
};