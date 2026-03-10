# Guía de Integración: Chatbot de Nomenclatura en Microsoft Teams
## Forvis Mazars - Manual de Implementación

**Versión:** 1.0
**Fecha:** 2026-03-09
**Estado:** DRF

---

## 1. Introducción

Esta guía detalla paso a paso cómo implementar un chatbot en Microsoft Teams que permita a los usuarios de Forvis Mazars generar nombres de archivo conformes a la Nomenclatura Unificada de Documentos (FORMAZ-PRO-01 v2.0), **sin necesidad de Microsoft Graph API**.

### 1.1 Solución Seleccionada

**Microsoft Copilot Studio + Power Automate**

Esta combinación fue seleccionada como la más conveniente por las siguientes razones:

| Criterio | Ventaja |
|----------|---------|
| Sin Graph API | Usa conectores nativos de Power Platform |
| Sin código | Configurable desde interfaz visual |
| Nativo en Teams | Publicación directa sin infraestructura |
| Mantenimiento | Microsoft gestiona el backend |
| Costo | Incluido en muchos planes M365 |
| Escalabilidad | Agregar funcionalidades sin reescribir |
| Tiempo | Implementación en 2-3 semanas |

---

## 2. Prerrequisitos

### 2.1 Licencias Necesarias

| Componente | Licencia Requerida |
|------------|-------------------|
| Microsoft Copilot Studio | Copilot Studio license (incluida en M365 E3/E5 con complemento, o licencia standalone) |
| Power Automate | Power Automate license (incluida en M365) |
| SharePoint Online | Incluido en M365 |
| Excel Online | Incluido en M365 |
| Microsoft Teams | Incluido en M365 |

### 2.2 Permisos Necesarios

- **Administrador de Teams** o permisos para publicar apps
- **Creador de entornos** en Power Platform
- **Editor** en el sitio SharePoint donde se almacenarán los catálogos
- **Maker** en Copilot Studio

### 2.3 Preparación de Datos

Antes de comenzar, subir el archivo `Catálogos incluidos.xlsx` a SharePoint Online:

1. Crear un sitio de SharePoint: `Nomenclatura-Forvis`
2. En la biblioteca de documentos, subir `Catálogos incluidos.xlsx`
3. Verificar que el archivo tiene 3 secciones:
   - **Acrónimo_Documento** (filas 1-31): Tipos de documento
   - **Servicio AX** (filas 35-116): Códigos de servicio
   - **ESTADO_DOCUMENTO** (filas 120-130): Estados del documento

---

## 3. Paso 1: Crear el Bot en Copilot Studio

### 3.1 Acceder a Copilot Studio

1. Ir a [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com)
2. Iniciar sesión con credenciales corporativas de Forvis Mazars
3. Seleccionar el entorno correcto de Power Platform

### 3.2 Crear un Nuevo Copilot

1. Clic en **"+ Crear"** (o "Create")
2. Seleccionar **"Nuevo copilot"**
3. Configurar:
   - **Nombre:** `Nomenclatura Forvis Mazars`
   - **Descripción:** `Asistente para generar nombres de archivo según la nomenclatura unificada FORMAZ-PRO-01`
   - **Idioma principal:** Español
   - **Icono:** Subir logo de Forvis Mazars o usar icono de documento

4. Clic en **"Crear"**

### 3.3 Configurar Mensaje de Bienvenida

1. Ir a **Temas** > **Temas del sistema** > **Saludo**
2. Editar el mensaje de saludo:

```
¡Hola! Soy el asistente de Nomenclatura de Forvis Mazars.

Puedo ayudarte a:
📝 Generar un nombre de archivo correcto
🔍 Buscar códigos de servicio AX
📋 Buscar acrónimos de documentos
✅ Validar un nombre existente
❓ Consultar la guía de nomenclatura

¿Qué necesitas?
```

---

## 4. Paso 2: Crear los Temas (Topics) del Bot

### 4.1 Tema: "Renombrar Archivo" (Flujo Principal)

Este es el tema más importante. Guía al usuario a través de los 7 campos de la nomenclatura.

**Crear el tema:**

1. Ir a **Temas** > **+ Nuevo tema** > **Desde cero**
2. Nombre: `Renombrar archivo`
3. Trigger phrases (frases de activación):
   - "renombrar"
   - "nombre de archivo"
   - "nomenclatura"
   - "generar nombre"
   - "rename"
   - "cómo nombro este archivo"
   - "/rename"

**Diseñar el flujo de conversación:**

#### Paso 1 - ALIAS_CLIENTE
```
Nodo: Mensaje
Texto: "Paso 1 de 7: ALIAS DEL CLIENTE
Escribe el identificador corto del cliente (ej: FMZ00, ACME01)"

Nodo: Pregunta
Variable: VarAliasCliente
Tipo: Texto libre
Validación: Solo alfanumérico, sin espacios
```

#### Paso 2 - SERVICIO_AX
```
Nodo: Mensaje
Texto: "Paso 2 de 7: SERVICIO AX
Escribe una palabra clave para buscar el servicio (ej: 'auditoría', 'consulting', 'SOX')"

Nodo: Pregunta
Variable: VarBusquedaServicio
Tipo: Texto libre

Nodo: Acción (Power Automate)
Flow: BuscarServicioAX
Input: VarBusquedaServicio
Output: VarResultadosServicio

Nodo: Mensaje con opciones adaptativas
Mostrar resultados y permitir selección

Nodo: Pregunta
Variable: VarServicioAX
Tipo: Opción múltiple (generada dinámicamente)
```

#### Paso 3 - PERIODO_SERVICIO
```
Nodo: Mensaje
Texto: "Paso 3 de 7: PERIODO DE SERVICIO
¿Cuál es la fecha de cierre del periodo? (formato: DD/MM/AAAA, ej: 31/12/2025)"

Nodo: Pregunta
Variable: VarPeriodoServicio
Tipo: Fecha
```

#### Paso 4 - ACRÓNIMO_DOCUMENTO
```
Nodo: Mensaje
Texto: "Paso 4 de 7: TIPO DE DOCUMENTO
Escribe una palabra clave para buscar el tipo (ej: 'informe', 'carta', 'propuesta')"

Nodo: Pregunta
Variable: VarBusquedaAcronimo
Tipo: Texto libre

Nodo: Acción (Power Automate)
Flow: BuscarAcronimo
Input: VarBusquedaAcronimo
Output: VarResultadosAcronimo

Nodo: Pregunta
Variable: VarAcronimo
Tipo: Opción múltiple
```

#### Paso 5 - AÑO_FECHA_DOCUMENTO
```
Nodo: Mensaje
Texto: "Paso 5 de 7: FECHA DEL DOCUMENTO
¿Fecha de creación? (por defecto HOY: [fecha actual])
Escribe una fecha o 'hoy' para usar la actual."

Nodo: Pregunta
Variable: VarFechaDocumento
Tipo: Fecha
Valor por defecto: utcNow()
```

#### Paso 6 - VERSIÓN
```
Nodo: Mensaje
Texto: "Paso 6 de 7: VERSIÓN
¿Qué versión es? (por defecto: v1)"

Nodo: Pregunta
Variable: VarVersion
Tipo: Opción múltiple
Opciones: v1, v2, v3, v4, v5, Otra
```

#### Paso 7 - ESTADO_DOCUMENTO
```
Nodo: Mensaje
Texto: "Paso 7 de 7: ESTADO DEL DOCUMENTO"

Nodo: Pregunta
Variable: VarEstado
Tipo: Opción múltiple
Opciones:
- DRF - Borrador
- REV - En revisión
- OBS - Con observaciones
- APR - Aprobado
- DEF - Definitivo
- FDO - Firmado
- VIG - Vigente
- SUS - Suspendido
- OBSOL - Obsoleto
- ARC - Archivado
```

#### Generación y Confirmación
```
Nodo: Acción (Power Automate)
Flow: GenerarNombre
Input: Todas las variables
Output: VarNombreFinal

Nodo: Mensaje
Texto: "✅ Nombre generado:

{VarNombreFinal}

Componentes:
- Cliente: {VarAliasCliente}
- Servicio: {VarServicioAX}
- Periodo: {VarPeriodoFormateado}
- Documento: {VarAcronimo}
- Fecha: {VarFechaFormateada}
- Versión: {VarVersion}
- Estado: {VarEstado}

¿Qué deseas hacer?"

Nodo: Pregunta
Opciones: "Copiar nombre" | "Nuevo renombrado" | "Finalizar"
```

### 4.2 Tema: "Buscar Servicio AX"

1. Nombre: `Buscar servicio`
2. Triggers: "buscar servicio", "servicio AX", "código servicio"
3. Flujo:
   - Preguntar término de búsqueda
   - Llamar Power Automate flow `BuscarServicioAX`
   - Mostrar resultados con código y descripción

### 4.3 Tema: "Buscar Acrónimo"

1. Nombre: `Buscar acrónimo`
2. Triggers: "buscar tipo", "acrónimo", "tipo documento"
3. Flujo similar al de servicio pero contra el catálogo de acrónimos

### 4.4 Tema: "Ver Estados"

1. Nombre: `Ver estados`
2. Triggers: "estados", "qué estados hay", "estado documento"
3. Mostrar tabla de estados con descripciones

### 4.5 Tema: "Validar Nombre"

1. Nombre: `Validar nombre`
2. Triggers: "validar", "verificar nombre", "está bien este nombre"
3. Flujo:
   - Pedir el nombre completo del archivo
   - Llamar Power Automate flow `ValidarNomenclatura`
   - Mostrar resultado de validación con detalles

### 4.6 Tema: "Ayuda"

1. Nombre: `Ayuda nomenclatura`
2. Triggers: "ayuda", "help", "cómo funciona", "guía"
3. Mostrar resumen de la estructura de nomenclatura y reglas

---

## 5. Paso 3: Crear los Flows de Power Automate

### 5.1 Flow: BuscarServicioAX

**Tipo:** Flujo de nube instantáneo (Cloud flow - Instant)

**Trigger:** When Copilot Studio calls a flow

**Pasos:**

1. **Trigger: Power Virtual Agents**
   - Input: `searchTerm` (texto de búsqueda)

2. **Acción: List rows present in a table (Excel Online)**
   - Location: SharePoint site `Nomenclatura-Forvis`
   - Document Library: `Documentos`
   - File: `Catálogos incluidos.xlsx`
   - Table name: `TablaServicioAX` (crear tabla con nombre en Excel)

3. **Acción: Filter array**
   - From: output del paso anterior
   - Condition: `contains(toLower(item()?['Descripción']), toLower(triggerBody()?['searchTerm']))`

4. **Acción: Select**
   - From: output filtrado
   - Map: `Código: item()?['Servicio AX'] - Descripción: item()?['Descripción']`

5. **Acción: Compose**
   - Crear string formateado con los resultados (máximo 10)

6. **Response: Return value(s) to Power Virtual Agents**
   - Output: `resultados` (string con opciones formateadas)

### 5.2 Flow: BuscarAcronimo

**Estructura idéntica** a BuscarServicioAX pero consultando la tabla de Acrónimos.

1. **Trigger:** searchTerm
2. **Excel Online:** Leer tabla `TablaAcronimos`
3. **Filter:** por descripción
4. **Response:** resultados formateados

### 5.3 Flow: GenerarNombre

**Trigger:** When Copilot Studio calls a flow

**Inputs:**
- aliasCliente (string)
- servicioAX (string)
- periodoServicio (string - fecha)
- acronimoDocumento (string)
- fechaDocumento (string - fecha)
- version (string)
- estadoDocumento (string)

**Pasos:**

1. **Compose - Formatear Periodo:**
   ```
   formatDateTime(triggerBody()?['periodoServicio'], 'yyyyMMdd')
   ```

2. **Compose - Formatear Fecha Documento:**
   ```
   formatDateTime(triggerBody()?['fechaDocumento'], 'yyyyMMdd')
   ```

3. **Compose - Generar Nombre:**
   ```
   concat(
     triggerBody()?['aliasCliente'], '-',
     triggerBody()?['servicioAX'], '-',
     outputs('Formatear_Periodo'), '-',
     triggerBody()?['acronimoDocumento'], '-',
     outputs('Formatear_Fecha'), '-',
     triggerBody()?['version'], '-',
     triggerBody()?['estadoDocumento']
   )
   ```

4. **Compose - Validar:**
   - Verificar que no contiene espacios
   - Verificar formato de fechas
   - Verificar que acrónimo está en catálogo

5. **Response:** nombreFinal (string)

### 5.4 Flow: ValidarNomenclatura

**Trigger:** When Copilot Studio calls a flow

**Input:** nombreArchivo (string)

**Pasos:**

1. **Compose - Split por guiones:**
   ```
   split(triggerBody()?['nombreArchivo'], '-')
   ```

2. **Condition - Verificar 7 partes:**
   - Si length(split) != 7 → Error: "El nombre debe tener exactamente 7 campos separados por guiones"

3. **Verificar cada campo:**
   - Campo 1 (alias): solo alfanumérico
   - Campo 2 (servicio): existe en catálogo
   - Campo 3 (periodo): formato YYYYMMDD válido
   - Campo 4 (acrónimo): existe en catálogo
   - Campo 5 (fecha): formato YYYYMMDD válido
   - Campo 6 (versión): formato v + número
   - Campo 7 (estado): valor válido (DRF, REV, OBS, APR, DEF, FDO, VIG, SUS, OBSOL, ARC)

4. **Response:**
   - esValido (boolean)
   - errores (string con lista de errores encontrados)

### 5.5 Flow: GuardarHistorial (Opcional)

**Trigger:** When Copilot Studio calls a flow

**Pasos:**

1. **Acción: Create item (SharePoint)**
   - Site: `Nomenclatura-Forvis`
   - List: `HistorialRenombrados`
   - Fields: NombreOriginal, NombreNuevo, Usuario, Fecha, Fuente

---

## 6. Paso 4: Preparar los Catálogos en Excel Online

### 6.1 Crear Tablas con Nombre en Excel

Para que Power Automate pueda leer los datos, es necesario crear **tablas con nombre** en el Excel:

1. Abrir `Catálogos incluidos.xlsx` en Excel Online
2. **Tabla 1 - Acrónimos:**
   - Seleccionar rango A1:B31 (Acrónimo_Documento + Descripción)
   - Insertar > Tabla
   - Nombre de tabla: `TablaAcronimos`

3. **Tabla 2 - Servicios AX:**
   - Seleccionar rango A35:B116 (Servicio AX + Descripción)
   - Insertar > Tabla
   - Nombre de tabla: `TablaServicioAX`

4. **Tabla 3 - Estados:**
   - Seleccionar rango A120:B130 (ESTADO_DOCUMENTO + Descripción)
   - Insertar > Tabla
   - Nombre de tabla: `TablaEstados`

### 6.2 Crear SharePoint List para Historial (Opcional)

1. En el sitio SharePoint `Nomenclatura-Forvis`
2. Crear lista: `HistorialRenombrados`
3. Columnas:
   - NombreOriginal (texto, una línea)
   - NombreNuevo (texto, una línea)
   - Usuario (persona)
   - Fecha (fecha y hora)
   - Fuente (opción: WebApp, Chatbot)

---

## 7. Paso 5: Publicar el Bot en Teams

### 7.1 Probar en Copilot Studio

1. En Copilot Studio, usar el panel de **prueba** (Test bot) en la esquina inferior izquierda
2. Probar cada tema:
   - Escribir "renombrar" → verificar que inicia el flujo
   - Completar los 7 pasos → verificar nombre generado
   - Probar "buscar servicio" → verificar resultados
   - Probar "validar" → verificar validación

### 7.2 Publicar en Teams

1. En Copilot Studio, ir a **Canales** (Channels)
2. Seleccionar **Microsoft Teams**
3. Clic en **"Activar Teams"** (Turn on Teams)
4. Configurar:
   - **Nombre del bot:** Nomenclatura Forvis Mazars
   - **Descripción corta:** Asistente de nomenclatura de archivos
   - **Descripción larga:** Genera nombres de archivo conformes a la nomenclatura unificada FORMAZ-PRO-01. Busca servicios AX, acrónimos y estados de documento.
   - **Icono:** Logo personalizado (192x192 px)

5. Clic en **"Publicar"**

### 7.3 Configurar Disponibilidad

**Opción A: Disponible para toda la organización**
1. Ir a **Centro de administración de Teams** (Teams Admin Center)
2. **Aplicaciones de Teams** > **Administrar aplicaciones**
3. Buscar "Nomenclatura Forvis Mazars"
4. Cambiar estado a **"Permitido"**
5. En **Directivas de configuración de aplicaciones**, agregar a la directiva global

**Opción B: Disponible para usuarios específicos**
1. Crear una **directiva de configuración de apps** personalizada
2. Agregar la app del bot
3. Asignar la directiva a los grupos de usuarios deseados

### 7.4 Fijar el Bot en Teams (Recomendado)

Para facilitar el acceso:
1. En Teams Admin Center > **Directivas de configuración de apps**
2. En la sección **Apps fijadas**, agregar "Nomenclatura Forvis Mazars"
3. El bot aparecerá en la barra lateral de Teams de todos los usuarios

---

## 8. Paso 6: Configuración Avanzada

### 8.1 Adaptive Cards (Tarjetas Interactivas)

Para una experiencia más visual, usar **Adaptive Cards** en las respuestas del bot:

**Ejemplo de Adaptive Card para resultados de búsqueda:**
```json
{
  "type": "AdaptiveCard",
  "version": "1.4",
  "body": [
    {
      "type": "TextBlock",
      "text": "Resultados de Servicio AX",
      "weight": "Bolder",
      "size": "Medium"
    },
    {
      "type": "ColumnSet",
      "columns": [
        {
          "type": "Column",
          "width": "30",
          "items": [{"type": "TextBlock", "text": "**Código**", "weight": "Bolder"}]
        },
        {
          "type": "Column",
          "width": "70",
          "items": [{"type": "TextBlock", "text": "**Descripción**", "weight": "Bolder"}]
        }
      ]
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "AUD_CAOIN",
      "data": {"servicio": "AUD_CAOIN"}
    },
    {
      "type": "Action.Submit",
      "title": "AUD_CAOCON",
      "data": {"servicio": "AUD_CAOCON"}
    }
  ]
}
```

**Ejemplo de Adaptive Card para resultado final:**
```json
{
  "type": "AdaptiveCard",
  "version": "1.4",
  "body": [
    {
      "type": "TextBlock",
      "text": "Nombre Generado",
      "weight": "Bolder",
      "size": "Large",
      "color": "Good"
    },
    {
      "type": "TextBlock",
      "text": "FMZ00-AUD_CAOIN-20251231-IA-20260309-v1-DRF",
      "fontType": "Monospace",
      "size": "Medium",
      "wrap": true
    },
    {
      "type": "FactSet",
      "facts": [
        {"title": "Cliente", "value": "FMZ00"},
        {"title": "Servicio", "value": "AUD_CAOIN"},
        {"title": "Periodo", "value": "31/12/2025"},
        {"title": "Documento", "value": "IA - Informe auditoría"},
        {"title": "Fecha", "value": "09/03/2026"},
        {"title": "Versión", "value": "v1"},
        {"title": "Estado", "value": "DRF - Borrador"}
      ]
    }
  ],
  "actions": [
    {"type": "Action.Submit", "title": "Nuevo Renombrado", "data": {"action": "new"}},
    {"type": "Action.OpenUrl", "title": "Ver Guía", "url": "https://sharepoint-url/guia"}
  ]
}
```

### 8.2 Integración con Archivos en Teams (sin Graph API)

Sin Graph API, el chatbot puede trabajar con archivos de las siguientes formas:

**Opción 1: Solo generación de nombres (Recomendada para MVP)**
- El bot genera el nombre correcto
- El usuario renombra manualmente el archivo
- Pros: Simple, sin permisos adicionales

**Opción 2: Power Automate + SharePoint connector**
- El usuario sube el archivo a una carpeta específica de SharePoint
- Power Automate detecta el nuevo archivo (trigger: "When a file is created")
- El flow renombra automáticamente usando los metadatos
- Pros: Automatización completa
- Contras: Requiere workflow adicional

**Opción 3: OneDrive connector**
- Similar a SharePoint pero usando OneDrive del usuario
- Power Automate puede renombrar archivos en OneDrive sin Graph API
- Usar acción "Rename file" del conector OneDrive for Business

### 8.3 Notificaciones Proactivas

Configurar el bot para enviar recordatorios:

1. En Power Automate, crear un flow programado (scheduled)
2. Trigger: Recurrence (cada lunes a las 9:00)
3. Acción: Enviar mensaje al canal de Teams con recordatorio de nomenclatura
4. Incluir enlace al bot y a la guía

---

## 9. Mantenimiento y Actualización

### 9.1 Actualización de Catálogos

Cuando se agreguen nuevos servicios AX, acrónimos o estados:

1. Editar `Catálogos incluidos.xlsx` en SharePoint
2. Asegurarse de que los nuevos datos están dentro de las tablas con nombre
3. Los flows de Power Automate leerán automáticamente los datos actualizados
4. No es necesario modificar el bot ni los flows

### 9.2 Agregar Nuevos Temas al Bot

1. Ir a Copilot Studio
2. Temas > + Nuevo tema
3. Configurar triggers y flujo
4. Probar en el panel de test
5. Publicar actualización

### 9.3 Monitoreo

**En Copilot Studio:**
- Panel de **Analytics** muestra:
  - Número de conversaciones
  - Tasa de resolución
  - Temas más usados
  - Preguntas sin respuesta

**En Power Automate:**
- Historial de ejecución de cada flow
- Errores y fallos
- Tiempos de respuesta

### 9.4 Checklist de Mantenimiento Mensual

- [ ] Verificar que los catálogos están actualizados
- [ ] Revisar analytics del bot
- [ ] Revisar logs de errores en Power Automate
- [ ] Actualizar temas si hay nuevas preguntas frecuentes
- [ ] Verificar que las licencias están activas

---

## 10. Solución de Problemas

### 10.1 Problemas Comunes

| Problema | Causa | Solución |
|----------|-------|----------|
| Bot no responde en Teams | No publicado | Verificar publicación en Copilot Studio > Canales |
| Flow no encuentra datos | Tabla Excel sin nombre | Crear tabla con nombre en Excel Online |
| Búsqueda no devuelve resultados | Filtro case-sensitive | Usar toLower() en el filtro del flow |
| Bot no aparece en Teams | Directiva de apps | Verificar en Teams Admin Center |
| Error en formato de fecha | Formato regional | Usar formatDateTime() en Power Automate |
| Flow falla intermitentemente | Timeout de conexión | Aumentar timeout en configuración del flow |

### 10.2 Logs y Diagnóstico

1. **Copilot Studio:** Temas > Test bot > Ver traza de conversación
2. **Power Automate:** Mis flows > Historial de ejecución > Ver detalle
3. **Teams Admin Center:** Aplicaciones > Diagnóstico

---

## 11. Alternativas Evaluadas

### 11.1 Opción B: Azure Bot Service + Bot Framework SDK

Si en el futuro se dispone de desarrolladores y se necesita más control:

**Pros:**
- Control total del código
- Integración más profunda
- Escalabilidad ilimitada

**Contras:**
- Requiere desarrollo en C# o Node.js
- Infraestructura Azure (costo)
- Mantenimiento por el equipo de desarrollo
- Tiempo de implementación: 6-8 semanas

**Cuándo migrar:** Si el volumen supera 10,000 interacciones/día o si se necesita Graph API.

### 11.2 Opción C: Power Apps + Power Automate

Una app embebida en Teams con formulario visual:

**Pros:**
- Interfaz visual más rica que un chatbot
- Integración con Power Automate
- Sin código

**Contras:**
- No es conversacional
- Requiere abrir la app (más pasos)
- Menor adopción que un chatbot

**Cuándo considerar:** Si los usuarios prefieren formularios sobre conversaciones.

### 11.3 Opción D: Outgoing Webhook + Azure Function

La más ligera, sin Copilot Studio:

**Pros:**
- Implementación rápida (1-2 días)
- Sin licencia adicional
- Control total

**Contras:**
- Interacción limitada (solo texto)
- Sin botones ni tarjetas adaptativas
- Requiere hosting (Azure Function)
- Mantenimiento manual

**Implementación rápida:**
```
1. Crear Azure Function con HTTP trigger
2. La función recibe el mensaje, parsea los comandos
3. Busca en catálogo embebido (JSON)
4. Devuelve el nombre generado
5. Registrar como Outgoing Webhook en Teams
```

---

## 12. Roadmap de Evolución

### Fase 1 (Actual): Generador de Nombres
- Chatbot genera nombres correctos
- Usuario renombra manualmente

### Fase 2: Integración con SharePoint
- Bot puede buscar archivos en SharePoint
- Renombrado automático via Power Automate
- Historial en SharePoint List

### Fase 3: Graph API (Cuando esté disponible)
- Acceso directo a OneDrive/SharePoint del usuario
- Renombrado sin salir de Teams
- Búsqueda de archivos mal nombrados
- Notificaciones proactivas de incumplimiento

### Fase 4: IA y Automatización
- Detección automática de tipo de documento (OCR + IA)
- Sugerencia automática de campos basada en contenido
- Integración con ERP AX para validar clientes
- Dashboard de cumplimiento de nomenclatura

---

## Anexo A: Checklist de Implementación

- [ ] Verificar licencias (Copilot Studio, Power Automate, M365)
- [ ] Subir Catálogos incluidos.xlsx a SharePoint
- [ ] Crear tablas con nombre en Excel Online
- [ ] Crear el bot en Copilot Studio
- [ ] Configurar tema de saludo
- [ ] Crear tema "Renombrar archivo" (7 pasos)
- [ ] Crear tema "Buscar servicio AX"
- [ ] Crear tema "Buscar acrónimo"
- [ ] Crear tema "Ver estados"
- [ ] Crear tema "Validar nombre"
- [ ] Crear tema "Ayuda"
- [ ] Crear flow "BuscarServicioAX" en Power Automate
- [ ] Crear flow "BuscarAcronimo" en Power Automate
- [ ] Crear flow "GenerarNombre" en Power Automate
- [ ] Crear flow "ValidarNomenclatura" en Power Automate
- [ ] (Opcional) Crear flow "GuardarHistorial"
- [ ] (Opcional) Crear SharePoint List "HistorialRenombrados"
- [ ] Probar todos los flujos en Copilot Studio test panel
- [ ] Publicar bot en Teams
- [ ] Configurar disponibilidad en Teams Admin Center
- [ ] Fijar bot en barra lateral de Teams
- [ ] Comunicar a usuarios y proporcionar formación
- [ ] Configurar monitoreo mensual

---

## Anexo B: Expresiones Útiles de Power Automate

```
# Formatear fecha a YYYYMMDD
formatDateTime(triggerBody()?['fecha'], 'yyyyMMdd')

# Concatenar campos con guiones
concat(campo1, '-', campo2, '-', campo3)

# Buscar texto (case-insensitive)
contains(toLower(item()?['Descripcion']), toLower(variables('searchTerm')))

# Validar formato YYYYMMDD
and(
  equals(length(variables('fecha')), 8),
  greaterOrEquals(int(variables('fecha')), 19000101),
  lessOrEquals(int(variables('fecha')), 20991231)
)

# Extraer componentes de un nombre
split(variables('nombreArchivo'), '-')

# Verificar versión válida (v + número)
startsWith(variables('version'), 'v')

# Obtener fecha actual en YYYYMMDD
formatDateTime(utcNow(), 'yyyyMMdd')
```

---

*Documento conforme al procedimiento FORMAZ-PRO-01 v2.0 de Forvis Mazars.*
