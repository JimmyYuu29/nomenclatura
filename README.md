# Nomenclatura App V2.0

Aplicación web para el renombrado automático de archivos según la nomenclatura unificada de **Forvis Mazars**.

## Formato de nomenclatura

```
ALIAS-SERVICIO-PERIODO-ACRONIMO-FECHA-VERSION-ESTADO.ext
```

## Novedades V2.0

- **Catálogos actualizados** — Acrónimos de documentos, Servicios AX y Estados de documento sincronizados con la revisión V2 de Belén
- **Actualización de catálogos por Excel** — Los usuarios autorizados pueden subir un archivo Excel (dos columnas: Código + Descripción) para actualizar Acrónimo Documento, Servicio AX y Estado Documento, con resolución de conflictos y protección por contraseña
- **Selector de año/mes mejorado** — Los campos de fecha ahora incluyen selectores desplegables de mes y año para navegar rápidamente a fechas lejanas
- **Selector de departamento** — Soporte multi-departamento (Auditoría, Otros) desde el encabezado, preparado para reglas de nomenclatura por departamento
- **Pie de página corporativo** — Identificación IT Innovation V2.0 con dirección de oficina Barcelona

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
| Deploy | Docker + Nginx |

## Desarrollo

```bash
npm install
npm run dev
```

## Build producción

```bash
npm run build
npm run preview
```

## Docker

```bash
docker compose up -d
```

## Documentación

- [PRD (ES)](docs/PRD-Nomenclatura-App.md)
- [PRD (CN)](docs/PRD-Nomenclatura-App-CN.md)
- [Despliegue (CN)](docs/Deployment-Server-Guide-CN.md)
- [Teams Chatbot (ES)](docs/Guia-Integracion-Teams-Chatbot.md)

---

Desarrollado por **IT Innovation** · Forvis Mazars · Barcelona
