# Mantenimiento ITS

Aplicación móvil educativa para registrar equipos electromecánicos.

Está hecha con React Native, Expo y JavaScript.

## Iniciar el proyecto

Abre una terminal en la carpeta del proyecto y ejecuta:

```powershell
npm install
npx expo start -c
```

Después escanea el código QR desde Expo Go.

## Inicio de sesión

```text
Usuario: cicfelipe
Contraseña: cicfelipepass
```

## Funciones principales

- Inicio de sesión seguro.
- Menú lateral y pestañas de navegación.
- Registro, edición y eliminación de equipos.
- Guardado local con SQLite.
- Consulta de API REST.
- Funcionamiento sin internet.
- Sincronización al recuperar la conexión.
- Alertas para equipos en falla.
- Modo claro y oscuro.
- Adaptación a diferentes tamaños de pantalla.

## Prueba sin internet

1. Desactiva el Wi-Fi y los datos móviles.
2. Registra o edita un equipo.
3. Comprueba que el cambio aparezca en la aplicación.
4. Activa nuevamente internet.
5. Regresa a la pantalla de equipos para permitir la sincronización.

## Tecnologías

- React Native.
- Expo SDK 54.
- SQLite.
- SecureStore.
- NetInfo.
- React Navigation.
- API de prueba DummyJSON.

DummyJSON se utiliza con fines educativos. Sus cambios remotos son simulados,
por eso SQLite conserva los datos de la aplicación en el teléfono.

## Estructura básica

```text
App.js
src/
├── context/
├── database/
├── navigation/
├── screens/
├── services/
└── theme/
```

Modificar este README no afecta el funcionamiento de la aplicación.

## Historial de commits

Los commits son puntos de guardado del proyecto. Sirven para demostrar cómo se
fue construyendo la aplicación y permiten volver a una versión anterior.

Para crear un historial:

```powershell
git init
git add .
git commit -m "Crear proyecto Expo y navegación"
```

Después de cada etapa importante:

```powershell
git add .
git commit -m "Agregar autenticación"
```

Ejemplos de commits para este proyecto:

```text
Crear proyecto Expo y navegación
Agregar autenticación con SecureStore
Agregar base de datos SQLite
Conectar API REST
Agregar funcionamiento offline
Agregar interfaz adaptable y accesible
Agregar edición con modal
Finalizar documentación
```

Para ver el historial:

```powershell
git log --oneline
```

Si quieres guardar el proyecto en GitHub:

```powershell
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```
