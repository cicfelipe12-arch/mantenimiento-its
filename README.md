# Mantenimiento ITS

Aplicacion movil educativa para registrar equipos electromecanicos.

Esta hecha con React Native, Expo y JavaScript.

## Iniciar el proyecto

1. Abre una terminal en la carpeta del proyecto.
2. Ejecuta `npm install`.
3. Ejecuta `npx expo start -c`.
4. Escanea el codigo QR con Expo Go.

## Inicio de sesion

Usuario: cicfelipe  
Contrasena: cicfelipepass

## Funciones principales

- Inicio de sesion seguro.
- Menu lateral y pestañas de navegacion.
- Registro, edicion y eliminacion de equipos.
- Guardado local con SQLite.
- Consulta de una API REST.
- Funcionamiento sin internet.
- Sincronizacion al recuperar la conexion.
- Alertas para equipos en falla.
- Modo claro y oscuro.
- Adaptacion a diferentes tamaños de pantalla.

## Prueba sin internet

1. Desactiva el Wi-Fi y los datos moviles.
2. Registra o edita un equipo.
3. Comprueba que el cambio aparezca en la aplicacion.
4. Activa nuevamente internet.
5. Regresa a la pantalla de equipos para permitir la sincronizacion.

## Tecnologias utilizadas

- React Native.
- Expo SDK 54.
- SQLite.
- SecureStore.
- NetInfo.
- React Navigation.
- API de prueba DummyJSON.

DummyJSON se utiliza con fines educativos. Sus cambios remotos son simulados,
por eso SQLite conserva los datos de la aplicacion en el telefono.

## Estructura basica

App.js
src/
  context/
  database/
  navigation/
  screens/
  services/
  theme/
