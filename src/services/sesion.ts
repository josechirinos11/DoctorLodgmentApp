import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

// Sesión segura de la app.
//
// - El token vive en expo-secure-store (Keychain en iOS, Keystore en Android), cifrado y
//   solo para este dispositivo. Antes estaba en AsyncStorage, que es un fichero sin cifrar.
// - Las peticiones van por un cliente propio (`api`), no por los valores globales de axios:
//   así el token solo viaja a la API de DoctorLodgment.
// - Un 401 de sesión inválida en cualquier petición cierra la sesión (avisa al contexto).
// - Nada de lo que se registra en logs lleva contraseña, token ni datos personales.

export const API_URL = 'https://api.doctorlodgment.com';
const CLAVE = 'doctorlodgment.token';
const CLAVE_ANTIGUA = 'token'; // AsyncStorage, versiones anteriores de la app

const OPCIONES: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

let tokenEnMemoria: string | null = null;
let alSesionInvalida: () => void = () => {};

export const almacenToken = {
  async leer(): Promise<string | null> {
    if (tokenEnMemoria) return tokenEnMemoria;
    tokenEnMemoria = await SecureStore.getItemAsync(CLAVE, OPCIONES);
    if (!tokenEnMemoria) {
      // Migración: una instalación anterior dejó el token en AsyncStorage sin cifrar.
      // Se mueve al almacén seguro y se borra de AsyncStorage.
      const antiguo = await AsyncStorage.getItem(CLAVE_ANTIGUA);
      if (antiguo) {
        await SecureStore.setItemAsync(CLAVE, antiguo, OPCIONES);
        tokenEnMemoria = antiguo;
      }
      await AsyncStorage.removeItem(CLAVE_ANTIGUA);
    }
    return tokenEnMemoria;
  },
  async guardar(token: string): Promise<void> {
    tokenEnMemoria = token;
    await SecureStore.setItemAsync(CLAVE, token, OPCIONES);
  },
  async borrar(): Promise<void> {
    tokenEnMemoria = null;
    await SecureStore.deleteItemAsync(CLAVE, OPCIONES);
    await AsyncStorage.removeItem(CLAVE_ANTIGUA);
  },
};

export const alInvalidarSesion = (fn: () => void) => { alSesionInvalida = fn; };

// El backend responde 401 { message: 'Token inválido' } a una sesión cerrada, anulada o
// caducada (y las versiones anteriores, 403 con ese mensaje).
export function esSesionInvalida(error: unknown): boolean {
  const e = error as AxiosError<{ message?: string }>;
  const status = e?.response?.status;
  return status === 401 || (status === 403 && e?.response?.data?.message === 'Token inválido');
}

// Lo único que se puede registrar de un error: estado y mensaje de la API. Nunca el
// objeto de axios entero, que lleva `config.data` (con la contraseña en el login) y
// `config.headers` (con el token).
export function describirError(error: unknown): string {
  const e = error as AxiosError<{ message?: string }>;
  const status = e?.response?.status;
  const mensaje = e?.response?.data?.message || e?.message || 'Error desconocido';
  return status ? `${status} ${mensaje}` : mensaje;
}

export const api = axios.create({ baseURL: API_URL, timeout: 15000 });

api.interceptors.request.use(async (config) => {
  const token = await almacenToken.leer();
  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(undefined, async (error) => {
  // Solo si la petición llevaba sesión: un 401 del login (credenciales malas) no es esto.
  const conSesion = Boolean(error?.config?.headers?.Authorization);
  if (conSesion && esSesionInvalida(error)) {
    await almacenToken.borrar();
    alSesionInvalida();
  }
  return Promise.reject(error);
});

// Anula en el servidor el token que se está cerrando. Va con ese token explícito porque
// la copia local se borra antes de llamar. Si falla (sin conexión), la sesión local se
// cierra igual.
export async function anularEnServidor(token: string): Promise<void> {
  await axios.post(`${API_URL}/auth/logout`, null, {
    headers: { Authorization: `Bearer ${token}` },
    timeout: 5000,
  });
}
