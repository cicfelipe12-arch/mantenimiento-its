import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://dummyjson.com/products';
const TOKEN_KEY = 'mantenimiento_its_token';

const getHeaders = async () => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(await getHeaders()),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API_${response.status}`);
  }

  return await response.json();
};

const toEquipment = (product) => ({
  name: product.title,
  category: product.category || 'Equipo electromecánico',
  location: product.brand || 'Ubicación no definida',
  status: product.stock > 0 ? 'Operativo' : 'En falla',
});

export const equipmentService = {
  async getAll() {
    const data = await request(API_URL);

    return data.products.map(toEquipment);
  },

  async create(equipment) {
    return await request(`${API_URL}/add`, {
      method: 'POST',
      body: JSON.stringify({
        title: equipment.name,
        category: equipment.category,
        brand: equipment.location,
        stock: equipment.status === 'En falla' ? 0 : 1,
      }),
    });
  },

  async update(id, equipment) {
    return await request(`${API_URL}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: equipment.name,
        category: equipment.category,
        brand: equipment.location,
        stock: equipment.status === 'En falla' ? 0 : 1,
      }),
    });
  },

  async remove(id) {
    return await request(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
  },
};
