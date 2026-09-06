import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'mantenimiento_its_token';
const DEMO_USERNAME = 'cicfelipe';
const DEMO_PASSWORD = 'cicfelipepass';

export const authService = {
  async login(username, password) {
    const credentials =
      username === DEMO_USERNAME && password === DEMO_PASSWORD
        ? { username: 'emilys', password: 'emilyspass' }
        : { username, password };

    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
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
};
