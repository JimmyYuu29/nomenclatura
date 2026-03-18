# Nomenclatura App V2.1

Aplicación web para el renombrado automático de archivos según la nomenclatura unificada de **Forvis Mazars**, con base de datos de verificación de integridad.

## Formato de nomenclatura

```
ALIAS-SERVICIO-PERIODO-ACRONIMO-FECHA-VERSION-ESTADO.ext
```

## Novedades V2.1

- **Base de datos de verificación** — Sistema SQLite en el servidor que registra el hash SHA-256 y el nombre de cada archivo renombrado, permitiendo detección de duplicados y verificación de integridad
- **Sugerencia automática de versión** — Cuando un archivo coincide con un registro existente (mismo alias, servicio, periodo y acrónimo), el sistema sugiere automáticamente la siguiente versión disponible, mostrando los archivos relacionados como referencia
- **Verificación de integridad por hash** — Al subir un archivo que ya sigue la nomenclatura, el sistema compara su hash con la base de datos y advierte si el contenido ha cambiado, sugiriendo incrementar la versión
- **Indicador de conexión a base de datos** — El pie de página muestra en tiempo real si la base de datos del servidor está conectada o no disponible
- **Degradación elegante** — Todas las funciones de base de datos son opcionales; la app funciona normalmente sin backend

## Novedades V2.0

- **Catálogos actualizados** — Acrónimos de documentos, Servicios AX y Estados de documento sincronizados con la revisión V2 de Belén
- **Actualización de catálogos por Excel** — Los usuarios autorizados pueden subir un archivo Excel (dos columnas: Código + Descripción) para actualizar Acrónimo Documento, Servicio AX y Estado Documento, con resolución de conflictos y protección por contraseña
- **Selector de año/mes mejorado** — Los campos de fecha ahora incluyen selectores desplegables de mes y año para navegar rápidamente a fechas lejanas
- **Selector de departamento** — Soporte multi-departamento (Auditoría, Otros) desde el encabezado, preparado para reglas de nomenclatura por departamento
- **Pie de página corporativo** — Identificación IT Innovation V2.0 con dirección de oficina Barcelona

## Arquitectura

```
┌────────────────┐       ┌──────────────────┐       ┌──────────────┐
│  Frontend SPA  │──────▶│  Nginx (puerto 80)│──────▶│  Express API │
│  React 19      │  /api  │  Proxy reverso   │       │  (puerto 3001)│
└────────────────┘       └──────────────────┘       └──────┬───────┘
                                                           │
                                                    ┌──────▼───────┐
                                                    │   SQLite DB   │
                                                    │ /home/rootadmin│
                                                    │ /data/nomenclatura│
                                                    └──────────────┘
```

## Tecnologías

| Componente | Tecnología |
|------------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7 |
| UI | shadcn/ui + Tailwind CSS 4 |
| Fechas | date-fns 4 (locale es) |
| Búsqueda | Fuse.js 7 |
| Archivos | react-dropzone 15 |
| Excel | xlsx (lectura de catálogos) |
| Backend | Express 5 + better-sqlite3 |
| Hash | Web Crypto API (SHA-256) |
| Deploy | Docker (Node.js + Nginx) |

## Desarrollo

```bash
# Terminal 1: Backend API
cd server
npm install
npm run dev

# Terminal 2: Frontend (proxy automático /api → localhost:3001)
npm install
npm run dev
```

## Build producción

```bash
npm run build
cd server && npm run build
```

## Docker

```bash
docker compose up -d
```

La base de datos se almacena en `/home/rootadmin/data/nomenclatura/nomenclatura.db` (montada como volumen en Docker).

## Documentación

- [PRD (ES)](docs/PRD-Nomenclatura-App.md)
- [PRD (CN)](docs/PRD-Nomenclatura-App-CN.md)
- [Despliegue (CN)](docs/Deployment-Server-Guide-CN.md)
- [Teams Chatbot (ES)](docs/Guia-Integracion-Teams-Chatbot.md)

---

Desarrollado por **IT Innovation** · Forvis Mazars · Barcelona
