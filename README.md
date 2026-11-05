# Gestión de libros con Angular Laravel y MongoDB

Proyecto académico de César Meza Corella. Incluye el frontend Angular, la API REST con Laravel, almacenamiento en MongoDB y documentación interactiva con Scramble.

## Funciones

- Consultar el catálogo desde Angular con `HttpClient`.
- Crear y actualizar libros mediante formularios reactivos.
- Eliminar libros con confirmación en la interfaz.
- Validar título, autor y año en el backend.
- Consultar y probar los endpoints desde Scramble.

## Estructura

- `frontend/`: interfaz Angular, componentes, servicio HTTP y pruebas.
- `backend/`: controladores, validaciones, modelo MongoDB, rutas y pruebas.
- `documentacion/capturas/`: capturas reales de la verificación local del 5 de noviembre de 2026.
- `compose.yaml` y `compose.override.yaml`: entorno local Docker.

## Ejecutar una copia nueva

Requisitos: Git, Docker y Docker Compose v2 compatible con `!override`. Los comandos usan credenciales de demostración incluidas en Compose; no son credenciales de producción.

```bash
git clone https://github.com/YvnPretty/api2.0.git
cd api2.0
cp backend/.env.example backend/.env
docker compose build
docker compose run --rm laravel composer install
docker compose run --rm laravel php artisan key:generate
docker compose run --rm angular npm ci
docker compose up -d
```

Compose configura la conexión interna a MongoDB. La colección de libros se genera al guardar el primer registro. No se incluyen los datos personales ni los volúmenes de la máquina original.

- Angular: http://localhost:4201
- API: http://localhost:8000/api/libros
- Scramble: http://localhost:8000/docs/api

El proxy de Angular utiliza `http://laravel:8000`, por lo que estas instrucciones ejecutan Angular dentro de Docker. Los puertos de Compose se limitan a localhost mediante el archivo override. No elimines los volúmenes para conservar los registros.

## Endpoints

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | `/api/libros` | Lista de libros, 200 |
| POST | `/api/libros` | Libro creado, 201 |
| GET | `/api/libros/{id}` | Libro encontrado, 200 o 404 |
| PUT / PATCH | `/api/libros/{id}` | Libro actualizado, 200 o 404 |
| DELETE | `/api/libros/{id}` | Sin contenido, 204 o 404 |

Los datos inválidos devuelven 422. Título y autor son obligatorios al crear. PUT y PATCH admiten actualizaciones parciales en esta implementación.

## Verificación realizada

```bash
docker compose exec angular npm run build
docker compose exec angular npm test -- --watch=false
docker compose exec laravel php artisan test --compact
```

Resultados del 5 de noviembre de 2026: compilación completada, 1 prueba Angular aprobada y 5 pruebas Laravel aprobadas con 42 aserciones. El build avisa que el paquete inicial mide 522.24 kB frente al presupuesto recomendado de 500 kB; no impide compilar.

Se comprobó en navegador la consulta, creación y edición desde Angular. La eliminación del registro temporal se comprobó por HTTP con respuesta 204; el catálogo volvió a los cinco registros originales. Scramble devolvió 200 en la consulta del catálogo. Las pruebas del backend utilizan una base de datos separada.

## Procedencia

La estructura Docker se basa en la plantilla de [Facultad Autodidacta](https://github.com/facultadautodidacta/laravel-angular-mongo). El backend continúa la práctica [YvnPretty/rest](https://github.com/YvnPretty/rest). Esta entrega integra el CRUD Angular y la API de libros. Las capturas documentan la ejecución actual; el historial y los archivos permiten revisar la evolución del proyecto.

## Alcance

Práctica local sin autenticación ni paginación. Los archivos `.env`, las dependencias, los respaldos y las credenciales locales de Portainer quedan fuera de Git. Configura tus propios secretos antes de cualquier despliegue público.
