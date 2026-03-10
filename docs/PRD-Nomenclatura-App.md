# PRD - Aplicación de Nomenclatura Unificada de Documentos
## Forvis Mazars - Sistema de Renombrado Automático de Archivos

**Versión:** 2.0
**Fecha:** 2026-03-10
**Estado:** DEF
**Autor:** Equipo de Desarrollo

---

## 1. Resumen Ejecutivo

Este documento define los requisitos del producto para una aplicación de renombrado automático de archivos que implementa la **Nomenclatura Unificada de Documentos** de Forvis Mazars (FORMAZ-PRO-01 v2.0). La aplicación permitirá a los usuarios arrastrar archivos a una interfaz web, responder preguntas guiadas y obtener el nombre correcto del archivo según la estructura obligatoria:

```
<ALIAS_CLIENTE>-<SERVICIO_AX>-<PERIODO_SERVICIO>-<ACRÓNIMO_DOCUMENTO>-<AÑO_FECHA_DOCUMENTO>-<VERSIÓN>-<ESTADO_DOCUMENTO>
```

Adicionalmente, el sistema se integrará con **Microsoft Teams** mediante un chatbot que permitirá a los usuarios renombrar archivos directamente desde la plataforma de comunicación corporativa.

---

## 2. Problema y Oportunidad

### 2.1 Problema Actual
- Los empleados nombran archivos de forma inconsistente, dificultando la trazabilidad y búsqueda.
- El proceso manual de consulta de catálogos (acrónimos, servicios AX, estados) es lento y propenso a errores.
- No existe una herramienta automatizada que valide la nomenclatura antes del almacenamiento.
- La falta de estandarización dificulta la integración con sistemas automatizados (RPA, IA, SharePoint).

### 2.2 Oportunidad
- Automatizar el 100% del proceso de nomenclatura reduce errores humanos.
- Integración con Teams permite adopción masiva sin cambiar el flujo de trabajo.
- Cumplimiento normativo (ISO 9001, ISQM, ENS, ISO 27001) verificable automáticamente.
- Base para futura integración con SharePoint, Power Automate y ERP AX.

---

## 3. Objetivos del Producto

| ID | Objetivo | Métrica de Éxito |
|----|----------|------------------|
| O1 | Reducir errores de nomenclatura | < 2% de archivos mal nombrados |
| O2 | Acelerar el proceso de renombrado | < 60 segundos por archivo |
| O3 | Adopción por parte de usuarios | > 80% de usuarios activos en 3 meses |
| O4 | Integración con Teams | Chatbot operativo en Teams |
| O5 | Cumplimiento normativo | 100% de documentos trazables |

---

## 4. Alcance

### 4.1 En Alcance (MVP)
- Aplicación web con drag & drop para renombrado de archivos
- Búsqueda guiada de catálogos (Servicio AX, Acrónimo Documento, Estado Documento)
- Validación automática de nomenclatura
- Generación de vista previa del nombre antes de renombrar
- Chatbot de Teams (vía Microsoft Copilot Studio + Power Automate)
- Soporte para renombrado individual y por lotes

### 4.2 Fuera de Alcance (v1)
- Integración directa con ERP AX (requiere API)
- Integración con Microsoft Graph API (no disponible actualmente)
- Almacenamiento automático en SharePoint
- OCR para detección automática de tipo de documento

---

## 5. Usuarios Objetivo

| Perfil | Descripción | Frecuencia de Uso |
|--------|-------------|-------------------|
| Auditor | Genera informes de auditoría, cartas, actas | Diario |
| Consultor | Crea documentos de consultoría y due diligence | Semanal |
| Administrativo | Gestiona correspondencia y documentación general | Diario |
| Socio/Director | Revisa y firma documentos definitivos | Semanal |
| Calidad | Supervisa cumplimiento de nomenclatura | Mensual |

---

## 6. Requisitos Funcionales

### 6.1 RF-01: Interfaz de Drag & Drop

**Descripción:** Los usuarios podrán arrastrar uno o múltiples archivos a la zona de drop de la aplicación web.

**Criterios de Aceptación:**
- La zona de drop acepta cualquier tipo de archivo
- Soporta arrastrar múltiples archivos simultáneamente
- Muestra el nombre original del archivo tras el drop
- Detecta automáticamente la extensión del archivo y la preserva
- Si el archivo ya tiene un nombre con formato de nomenclatura válido, pre-rellena los campos automáticamente
- Detecta versiones existentes (v1, v2...) y sugiere la versión siguiente

### 6.2 RF-02: Campo ALIAS_CLIENTE (Entrada Manual)

**Descripción:** Campo de texto libre donde el usuario introduce el identificador corto del cliente.

**Criterios de Aceptación:**
- Campo de texto con validación (solo caracteres alfanuméricos, sin espacios ni caracteres especiales)
- Máximo 20 caracteres
- Obligatorio
- Historial de alias usados recientemente (almacenamiento local)
- Autocompletado basado en historial

### 6.3 RF-03: Campo SERVICIO_AX (Búsqueda en Catálogo)

**Descripción:** Barra de búsqueda con autocompletado que permite al usuario encontrar el código de servicio AX correcto buscando por descripción.

**Catálogo completo de Servicios AX:**

| Código | Descripción |
|--------|-------------|
| SUS_ASSU | Sustainability Assurance |
| SUS_REPORT | Sustainability reporting |
| SUS_STRA | Estrategy & Due Diligence |
| SUS_TRA | Implementation and Transformation |
| AUD_CAOCON | Auditoría Obligatoria de Cuentas Anuales Consolidada LAC |
| AUD_CAOIN | Auditoría Obligatoria de Cuentas Anuales Individuales LAC |
| AUD_CAVCON | Auditoría Voluntaria de Cuentas Anuales Consolidadas LAC |
| AUD_CAVIN | Auditoría Voluntaria de Cuentas Anuales Individuales LAC |
| AUD_IFH | Auditoría Información Financiera Histórica NO LAC |
| AUD_OEF CO | Auditoría otros estados financieros o documentos contables Obligatorias LAC |
| AUD_OEF IN | Auditoría otros estados financieros o documentos contables Voluntarias LAC |
| IES_AUDBAL | Auditoría obligatoria de Balance |
| IES_AUDBAV | Auditoría voluntaria de Balance |
| ECO_ECOEM | Ecoembes |
| ECO_ECOTIC | Ecotic |
| GRC_ASDEAI | Asesoría en el Desarrollo de Auditoría Interna |
| GRC_CGSR | Corporate Governance & Social Responsibility |
| GRC_ICM | Internal Control Management |
| GRC_OPRM | Operational Risk Management |
| GRC_SAI | Servicios Auditoría Interna |
| GRC_SOX | SOX |
| AUD_CONSUL | Consulting |
| IES_CAPCRE | Capitalización de Créditos |
| SUB | Subvenciones |
| SUB_RSUB | Revisión de Subvenciones |
| SUB_RSUB_L | Revisión de Subvenciones (bajo independencia LAC) |
| COM_AGDPR | Auditoría GDPR |
| COM_IEEBC | Informe experto externo Blanqueo Capitales |
| COM_LOPD | Revisión LOPD |
| COM_MGDPR | Servicio de soporte y mantenimiento GDPR |
| COM_RPE | Responsabilidad Penal de Empresas |
| COM_SAGDPR | Servicio adecuación GDPR |
| COM_SALBC | Servicio adecuación Ley de Blanqueo de Capitales |
| COM_SGCED | Servicio de gestión Canal Ético de Denuncias |
| COM_SOX | Ley Sarbanes-Oxley (SOX) |
| IT_AUDIT | IT Audit |
| IT_RI&SEC | IT Risk & Security |
| OTA_AIFH | Auditoría Información Financiera Histórica - Colaboración |
| OTA_CHC | Certificación de Hechos Concretos |
| OTA_CTAC | Consultas Técnicas Sobre Aspectos Contables |
| OTA_ICREQ | Informes Complementarios a los de Auditoría de Cuentas Requeridos por Supervisadores |
| OTA_OTEI | Otros Trabajos Como Experto Independiente |
| OTA_OTR | Otros |
| OTA_PAIF | Procedimientos Acordados Sobre Información Financiera |
| OTA_PAINF | Procedimientos Acordados Sobre Información NO Financiera |
| OTA_RLIFH | Revisión Limitada Información Financiera Histórica |
| OTA_TADIFH | Trabajos de Aseguramiento Distintos a los de Información Financiera Histórica |
| OTA_TEIRL | Trabajos Como Expertos Independientes Requeridos Por Ley |
| CFIN | Corporate Finance |
| IPO | Capital Markets (IPO) |
| DEDI | Due diligence |
| FOIN | Forensic Investigation |
| PRFI | Project Finance |
| RESE | Restructuring Services |
| VAL | Valuations |
| ACC | Accounting |
| MIX | Mixto |
| PAY | Payroll |
| ASFI | Asesoramiento fiscal |
| DUED | Due diligence (Tax) |
| PLFI | Planificación Fiscal |
| PRTR | Precios de Transferencia |
| REFI | Revisión fiscal |
| OTFI | Otros fiscal |
| PREC | Procedimiento Económicos y Contenciosos |
| ASLA | Asesoría Laboral |
| CONC | Concursal |
| CONT | Contractual |
| PROC | Procesal |
| SOCI | Societario |
| DEFI | Derecho financiero |

**Criterios de Aceptación:**
- Barra de búsqueda con filtrado en tiempo real
- Búsqueda por código O por descripción (fuzzy search)
- Dropdown con resultados filtrados
- Agrupación por categoría (AUD, SUS, GRC, COM, IT, OTA, etc.)
- Obligatorio seleccionar un valor del catálogo

### 6.4 RF-04: Campo PERIODO_SERVICIO (Selector de Fecha)

**Descripción:** Fecha de cierre del periodo auditado en formato YYYYMMDD.

**Criterios de Aceptación:**
- Selector de fecha (date picker) con formato visual amigable
- Conversión automática a formato YYYYMMDD
- Obligatorio
- Validación de fecha válida

### 6.5 RF-05: Campo ACRÓNIMO_DOCUMENTO (Búsqueda en Catálogo)

**Descripción:** Barra de búsqueda para seleccionar el tipo de documento según catálogo oficial.

**Catálogo de Acrónimos:**

| Acrónimo | Descripción |
|----------|-------------|
| ACEPT | Aceptación nombramiento auditoría |
| ACKAPPx | Acknowledgement Appendix X |
| ACT* | Acta |
| C* | Carta |
| CACT | Carta de Actas |
| CCAA | Cuentas Anuales |
| CCAAC | Cuentas Anuales Consolidadas |
| CM | Carta de Manifestaciones |
| CRI | Carta Recepción de Informe |
| CSCCAAF | Carta solicitud CCAA formuladas |
| DD | Due Diligence |
| DRAFTIA | Carta envío borrador informe auditoría |
| EEFFRM | Formularios Estados Financieros Registro Mercantil |
| FAX* | Fax |
| IA | Informe auditoría |
| IAC | Informe auditoría cuentas consolidadas |
| IE* | Informe Especial |
| IE ECO E | Informe Ecoembes |
| IEECOTIC | Informe Ecotic |
| IEEFFFES | Informe Estados Financieros Fines Específicos |
| IPA* | Informe Procedimientos Acordados |
| MAIL* | e_mail |
| NOMB | Acta nombramiento |
| NSF | Nota Síntesis Final |
| NSJ | Nota Síntesis Junio |
| NSP | Nota Síntesis Preliminar |
| PRAUDIT | Propuesta auditoría |
| PRIE | Propuesta informe especial |
| PRIPA | Propuesta procedimientos acordados |
| QCONT | Cuestionario continuidad |

> **Nota:** Los acrónimos con asterisco (*) indican que pueden tener sufijos variables.

**Criterios de Aceptación:**
- Misma mecánica de búsqueda que Servicio AX
- Búsqueda por acrónimo O por descripción
- Obligatorio

### 6.6 RF-06: Campo AÑO_FECHA_DOCUMENTO (Selector de Fecha)

**Descripción:** Fecha de creación del documento en formato YYYYMMDD.

**Criterios de Aceptación:**
- Selector de fecha con valor por defecto = fecha actual
- Conversión automática a YYYYMMDD
- Editable por el usuario
- Obligatorio

### 6.7 RF-07: Campo VERSIÓN (Auto-detección + Manual)

**Descripción:** Versión incremental del documento (v1, v2, v3...).

**Criterios de Aceptación:**
- Valor por defecto: v1
- Si el archivo arrastrado ya contiene una versión en su nombre (e.g., "informe-v2.docx"), detectarla automáticamente y sugerir v3
- Detección de patrones: "v1", "V1", "v01", "version1", "ver1", "_v1", "-v1"
- El usuario puede modificar manualmente
- Solo se permiten valores incrementales: v1, v2, v3...
- Formato de salida normalizado: v1, v2, v3 (minúscula, sin ceros a la izquierda)

### 6.8 RF-08: Campo ESTADO_DOCUMENTO (Búsqueda en Catálogo)

**Descripción:** Estado del ciclo de vida del documento.

**Catálogo de Estados:**

| Estado | Descripción |
|--------|-------------|
| DRF | Borrador (Draft). Documento en fase inicial de redacción. Puede sufrir modificaciones estructurales o de contenido. No válido para uso operativo. |
| REV | En revisión. Documento en proceso de validación por parte de responsables designados (IT, Legal, Compliance, Dirección, etc.). |
| OBS | Con observaciones. Documento revisado que requiere ajustes antes de su aprobación. Contiene comentarios pendientes de resolver. |
| APR | Aprobado. Documento validado formalmente por el responsable designado. Pendiente de firma si aplica. |
| DEF | Definitivo. Versión final aprobada y publicada. Vigente para su aplicación. |
| FDO | Firmado. Documento formalmente firmado por la Dirección o responsable autorizado. Tiene validez oficial. |
| VIG | Vigente. Documento actualmente en aplicación dentro de la organización. |
| SUS | Suspendido. Documento temporalmente fuera de aplicación. |
| OBSOL | Obsoleto. Documento retirado oficialmente y sustituido por una nueva versión. |
| ARC | Archivado. Documento histórico sin vigencia operativa, conservado por requisitos legales o normativos. |

**Criterios de Aceptación:**
- Dropdown con búsqueda
- Muestra descripción completa al seleccionar
- Valor por defecto: DRF (borrador)
- Obligatorio
- **Regla de negocio:** Documentos con estado DEF o FDO no pueden retroceder a DRF

### 6.9 RF-09: Vista Previa y Confirmación

**Descripción:** Antes de renombrar, mostrar vista previa del nombre final.

**Criterios de Aceptación:**
- Mostrar nombre actual vs. nombre nuevo lado a lado
- Resaltar cada componente del nombre con colores diferentes
- Validar que todos los campos estén completos
- Botón "Renombrar" y "Cancelar"
- Confirmar que el nombre cumple todas las reglas (sin espacios, sin caracteres especiales, fechas YYYYMMDD, guiones como delimitadores)
- Mostrar la extensión original preservada

### 6.10 RF-10: Renombrado por Lotes

**Descripción:** Permitir arrastrar múltiples archivos y aplicar la misma configuración base.

**Criterios de Aceptación:**
- Arrastrar múltiples archivos a la vez
- Campos comunes (cliente, servicio, periodo) se comparten
- Acrónimo de documento y versión se configuran individualmente por archivo
- Vista previa de todos los nombres antes de confirmar
- Progreso de renombrado visible

### 6.11 RF-11: Validación de Reglas de Negocio

**Descripción:** Aplicar todas las reglas del procedimiento FORMAZ-PRO-01.

**Reglas a Validar:**
1. Uso obligatorio de guiones medios (-) como delimitadores
2. No se permiten espacios ni caracteres especiales en el nombre
3. Fechas en formato YYYYMMDD estricto
4. Versión incremental obligatoria (no se puede saltar v1 a v3 sin v2)
5. Documentos DEF o FDO no pueden volver a DRF
6. Documentos sustituidos deben marcarse como OBSOL
7. Solo se permiten acrónimos y servicios del catálogo oficial
8. El alias de cliente no puede contener caracteres especiales

### 6.12 RF-12: Historial y Favoritos

**Descripción:** Almacenamiento local de configuraciones frecuentes.

**Criterios de Aceptación:**
- Guardar últimos 50 renombrados
- Buscar en historial
- Marcar combinaciones como "favoritas" para reutilización rápida
- Exportar/importar configuraciones

---

## 7. Requisitos No Funcionales

| ID | Requisito | Especificación |
|----|-----------|----------------|
| RNF-01 | Rendimiento | Renombrado < 1 segundo por archivo |
| RNF-02 | Compatibilidad | Chrome, Edge, Firefox (últimas 2 versiones) |
| RNF-03 | Responsividad | Funcional en pantallas >= 1024px |
| RNF-04 | Accesibilidad | WCAG 2.1 nivel AA |
| RNF-05 | Idioma | Interfaz en español (con soporte futuro para inglés) |
| RNF-06 | Almacenamiento | Datos de catálogo embebidos en la app (sin backend requerido para MVP) |
| RNF-07 | Seguridad | No se transmiten archivos a ningún servidor; renombrado local |
| RNF-08 | Disponibilidad | 99.5% uptime para el chatbot de Teams |

---

## 8. Arquitectura del Sistema

### 8.1 Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIOS FINALES                          │
│                                                              │
│   ┌──────────────┐          ┌──────────────────────┐        │
│   │  Web App      │          │  Microsoft Teams      │        │
│   │  (Drag&Drop)  │          │  (Chatbot)            │        │
│   └──────┬───────┘          └──────────┬───────────┘        │
│          │                              │                    │
└──────────┼──────────────────────────────┼────────────────────┘
           │                              │
           ▼                              ▼
┌──────────────────┐      ┌───────────────────────────┐
│  Frontend SPA     │      │  Microsoft Copilot Studio  │
│  (React/Next.js)  │      │  (Bot Framework)           │
│                   │      └─────────────┬─────────────┘
│  - Drag & Drop    │                    │
│  - Catálogos JSON │                    ▼
│  - Validación     │      ┌───────────────────────────┐
│  - File API       │      │  Power Automate Flows      │
│                   │      │                             │
└──────────────────┘      │  - Búsqueda catálogos       │
                          │  - Validación nomenclatura   │
                          │  - Renombrado archivo        │
                          │  - SharePoint connector      │
                          └───────────────────────────────┘
                                         │
                                         ▼
                          ┌───────────────────────────┐
                          │  Datos                     │
                          │                             │
                          │  - Catálogos (Excel/JSON)   │
                          │  - SharePoint (archivos)    │
                          │  - Historial renombrados    │
                          └───────────────────────────────┘
```

### 8.2 Stack Tecnológico - Web App

| Componente | Tecnología | Justificación |
|------------|-----------|---------------|
| Frontend | React 18 + TypeScript | Ecosistema maduro, componentes reutilizables |
| UI Framework | Tailwind CSS + shadcn/ui | Diseño moderno, accesible, personalizable |
| Drag & Drop | react-dropzone | Librería estándar, bien mantenida |
| Búsqueda | Fuse.js | Fuzzy search en cliente, sin backend |
| Build | Vite | Rápido, moderno |
| Hosting | Azure Static Web Apps / SharePoint | Integración con ecosistema Microsoft |

### 8.3 Stack Tecnológico - Chatbot Teams

| Componente | Tecnología | Justificación |
|------------|-----------|---------------|
| Bot Platform | Microsoft Copilot Studio | No-code, nativo en Teams, sin Graph API |
| Automatización | Power Automate | Conectores nativos SharePoint/Excel |
| Datos | SharePoint Lists / Excel Online | Accesible sin Graph API |
| Despliegue | Microsoft 365 Admin Center | Gestión centralizada |

---

## 9. Diseño de UI/UX

### 9.1 Pantalla Principal - Web App

```
┌────────────────────────────────────────────────────────────────┐
│  🔷 Nomenclatura Forvis Mazars              [Historial] [FAQ] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │           Arrastra tus archivos aquí                      │  │
│  │           o haz clic para seleccionar                     │  │
│  │                                                          │  │
│  │           📁 Soporta múltiples archivos                   │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ── Archivo: "informe_auditoria_final.pdf" ──────────────────  │
│                                                                │
│  ALIAS_CLIENTE        [________________] (ej: FMZ00)          │
│                                                                │
│  SERVICIO_AX          [🔍 Buscar servicio...         ▼]       │
│                                                                │
│  PERIODO_SERVICIO     [📅 31/12/2025                  ]       │
│                                                                │
│  ACRÓNIMO_DOCUMENTO   [🔍 Buscar tipo documento...   ▥]       │
│                                                                │
│  FECHA_DOCUMENTO      [📅 09/03/2026 (hoy)           ]       │
│                                                                │
│  VERSIÓN              [v1 ▼] (auto-detectado)                 │
│                                                                │
│  ESTADO_DOCUMENTO     [🔍 Buscar estado...           ▥]       │
│                                                                │
│  ────────────────────────────────────────────────────────────  │
│  Vista Previa:                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  FMZ00-AUD_CAOIN-20251231-IA-20260309-v1-DRF.pdf        │  │
│  │  ^^^^^ ^^^^^^^^^  ^^^^^^^^ ^^ ^^^^^^^^ ^^ ^^^            │  │
│  │  Alias  Servicio   Periodo  Doc  Fecha   V  Estado       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│                    [Cancelar]  [✓ Renombrar]                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 9.2 Flujo del Chatbot en Teams

```
Usuario: /renombrar
Bot: ¡Hola! Voy a ayudarte a renombrar tu archivo.

Bot: 1️⃣ ¿Cuál es el alias del cliente?
Usuario: FMZ00

Bot: 2️⃣ ¿Qué servicio AX necesitas? Escribe para buscar:
Usuario: auditoría obligatoria
Bot: Encontré estas opciones:
     1. AUD_CAOCON - Auditoría Obligatoria CCAA Consolidada LAC
     2. AUD_CAOIN - Auditoría Obligatoria CCAA Individuales LAC
     Selecciona un número:
Usuario: 2

Bot: 3️⃣ ¿Fecha de cierre del periodo? (DD/MM/AAAA)
Usuario: 31/12/2025

Bot: 4️⃣ ¿Tipo de documento? Escribe para buscar:
Usuario: informe
Bot: Opciones:
     1. IA - Informe auditoría
     2. IAC - Informe auditoría cuentas consolidadas
     3. IE* - Informe Especial
     ...
Usuario: 1

Bot: 5️⃣ ¿Fecha de creación? (por defecto hoy 09/03/2026)
Usuario: hoy

Bot: 6️⃣ ¿Versión? (por defecto v1)
Usuario: v1

Bot: 7️⃣ ¿Estado del documento?
     DRF (Borrador) | REV (En revisión) | APR (Aprobado) | DEF (Definitivo) | FDO (Firmado)
Usuario: DRF

Bot: ✅ Nombre generado:
     FMZ00-AUD_CAOIN-20251231-IA-20260309-v1-DRF

     ¿Deseas copiar al portapapeles? [Copiar] [Nuevo]
```

---

## 10. Integración con Teams Chatbot - Solución Recomendada

### 10.1 Análisis de Opciones

| Opción | Complejidad | Costo | Requiere Graph API | Tiempo Impl. | Recomendada |
|--------|-------------|-------|-------------------|---------------|-------------|
| **Microsoft Copilot Studio + Power Automate** | Baja | Incluido en M365* | NO | 2-3 semanas | **SI** |
| Azure Bot Service + Bot Framework SDK | Alta | Azure consumption | NO | 6-8 semanas | NO |
| Power Apps + Power Automate | Media | Incluido en M365* | NO | 3-4 semanas | Alternativa |
| Incoming/Outgoing Webhooks | Baja | Mínimo | NO | 1-2 semanas | Limitada |

> *Copilot Studio requiere licencia Microsoft Copilot Studio que puede estar incluida en algunos planes M365 E3/E5 o adquirirse por separado.

### 10.2 Solución Recomendada: Microsoft Copilot Studio + Power Automate

**Justificación:**
1. **Sin necesidad de Graph API** - Usa conectores nativos de Power Platform
2. **No-code/Low-code** - Configurable sin desarrolladores especializados
3. **Nativo en Teams** - Publicación directa, sin infraestructura adicional
4. **Mantenimiento mínimo** - Microsoft gestiona la infraestructura
5. **Escalable** - Puede agregar funcionalidades sin reescribir
6. **Conectores** - Acceso a SharePoint, Excel Online, OneDrive sin Graph API

### 10.3 Arquitectura del Chatbot

```
┌─────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Teams       │────▶│  Copilot Studio       │────▶│  Power Automate  │
│  (Usuario)   │◀────│  (Gestión diálogo)    │◀────│  (Lógica negocio)│
└─────────────┘     └──────────────────────┘     └────────┬────────┘
                                                           │
                              ┌─────────────────────────────┤
                              ▼                             ▼
                    ┌──────────────────┐         ┌──────────────────┐
                    │  SharePoint List  │         │  Excel Online     │
                    │  (Historial)      │         │  (Catálogos)      │
                    └──────────────────┘         └──────────────────┘
```

### 10.4 Componentes del Chatbot

**Temas (Topics) en Copilot Studio:**

| Tema | Trigger | Acción |
|------|---------|--------|
| Saludo | "hola", "renombrar", "nomenclatura" | Mensaje de bienvenida + opciones |
| Renombrar archivo | "renombrar", "/rename" | Flujo guiado de 7 pasos |
| Buscar servicio | "servicio", "buscar servicio" | Búsqueda en catálogo Servicio AX |
| Buscar acrónimo | "tipo documento", "acrónimo" | Búsqueda en catálogo Acrónimos |
| Ver estados | "estados", "estado documento" | Lista de estados con descripción |
| Ayuda | "ayuda", "help" | Guía rápida de nomenclatura |
| Validar nombre | "validar", "verificar" | Comprueba si un nombre es válido |

**Flows de Power Automate:**

| Flow | Trigger | Función |
|------|---------|---------|
| BuscarServicioAX | HTTP request (Copilot) | Busca en Excel Online el catálogo de servicios |
| BuscarAcronimo | HTTP request (Copilot) | Busca en Excel Online el catálogo de acrónimos |
| ValidarNomenclatura | HTTP request (Copilot) | Valida que el nombre cumple todas las reglas |
| GenerarNombre | HTTP request (Copilot) | Concatena los campos y devuelve el nombre final |
| GuardarHistorial | HTTP request (Copilot) | Registra el renombrado en SharePoint List |

---

## 11. Modelo de Datos

### 11.1 Catálogo Servicio AX (JSON embebido / Excel Online)
```json
{
  "servicios": [
    {
      "codigo": "AUD_CAOIN",
      "descripcion": "Auditoría Obligatoria de Cuentas Anuales Individuales LAC",
      "categoria": "AUD",
      "tags": ["auditoría", "obligatoria", "individual", "LAC"]
    }
  ]
}
```

### 11.2 Catálogo Acrónimos (JSON embebido / Excel Online)
```json
{
  "acronimos": [
    {
      "codigo": "IA",
      "descripcion": "Informe auditoría",
      "wildcard": false,
      "tags": ["informe", "auditoría"]
    }
  ]
}
```

### 11.3 Catálogo Estados (JSON embebido / Excel Online)
```json
{
  "estados": [
    {
      "codigo": "DRF",
      "descripcion": "Borrador (Draft)",
      "descripcionCompleta": "Documento en fase inicial de redacción...",
      "transicionesPermitidas": ["REV", "OBS"],
      "esFinal": false
    }
  ]
}
```

### 11.4 Historial de Renombrados (SharePoint List / LocalStorage)
```json
{
  "historial": [
    {
      "id": "uuid",
      "nombreOriginal": "informe_final.pdf",
      "nombreNuevo": "FMZ00-AUD_CAOIN-20251231-IA-20260309-v1-DRF.pdf",
      "usuario": "jperez@forvis.com",
      "fecha": "2026-03-09T10:30:00Z",
      "fuente": "webapp|chatbot"
    }
  ]
}
```

---

## 12. Reglas de Negocio Detalladas

### 12.1 Reglas de Nomenclatura (del procedimiento FORMAZ-PRO-01)

| # | Regla | Validación |
|---|-------|-----------|
| R1 | Uso obligatorio de guiones medios como delimitadores | Regex: no permite espacios, _, ni otros separadores |
| R2 | No se permiten espacios ni caracteres especiales | Regex: solo [A-Za-z0-9-] |
| R3 | Fechas en formato YYYYMMDD | Validación de fecha + formato |
| R4 | La versión inicial siempre será v1 | Default + validación |
| R5 | El cambio de versión implica incremento obligatorio | v(n) -> v(n+1) |
| R6 | Documentos DEF o FDO no pueden volver a DRF | Validación de transición |
| R7 | Documentos sustituidos deben marcarse como OBSOL | Warning al usuario |
| R8 | El código de cliente debe ser único | Validación formato |
| R9 | Acrónimos solo del catálogo oficial | Validación contra lista |
| R10 | Extensión del archivo se preserva siempre | Automático |

### 12.2 Estructura de Directorios Recomendada
```
/ Año / Cliente / Área / Servicio / Tipo de documento
```
Ejemplo: `/2026/FMZ00/Auditoría/AUD_CAOIN/Informes/`

### 12.3 Transiciones de Estado Permitidas

```
DRF ──▶ REV ──▶ OBS ──▶ REV (ciclo revisión)
                  │
                  ▼
                APR ──▶ DEF ──▶ FDO ──▶ VIG
                                         │
                                    ┌────┴────┐
                                    ▼         ▼
                                   SUS      OBSOL ──▶ ARC
```

---

## 13. Plan de Implementación

### Fase 1: MVP Web App (Semanas 1-4)
- Semana 1-2: Setup proyecto React + UI básica + drag & drop
- Semana 3: Catálogos embebidos + búsqueda fuzzy + validación
- Semana 4: Vista previa + renombrado + testing

### Fase 2: Chatbot Teams (Semanas 5-8)
- Semana 5: Setup Copilot Studio + temas básicos
- Semana 6: Power Automate flows + conexión Excel Online catálogos
- Semana 7: Flujo completo de renombrado en chatbot
- Semana 8: Testing + publicación en Teams

### Fase 3: Mejoras (Semanas 9-12)
- Semana 9-10: Renombrado por lotes + historial
- Semana 11: Integración SharePoint para almacenamiento
- Semana 12: Feedback usuarios + ajustes

---

## 14. Métricas de Éxito

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| Tasa de adopción | > 80% usuarios target | Telemetría app |
| Errores de nomenclatura | < 2% | Auditoría mensual |
| Tiempo de renombrado | < 60 seg/archivo | Telemetría app |
| Satisfacción usuario | > 4/5 | Encuesta trimestral |
| Uso del chatbot | > 30% de renombrados via Teams | Logs Power Automate |

---

## 15. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| Baja adopción | Media | Alto | Capacitación + integración Teams para facilitar uso |
| Catálogos desactualizados | Alta | Medio | Actualización directa por Excel desde la UI (V2.0) + proceso trimestral |
| Licencia Copilot Studio no disponible | Media | Alto | Alternativa: Power Apps o webhook básico |
| Resistencia al cambio | Media | Medio | Periodo de transición con ambos métodos permitidos |
| Limitaciones de Power Automate | Baja | Medio | Diseño modular, migrable a Azure Functions |

---

## Anexo A: Ejemplos Completos de Nomenclatura

| Escenario | Nombre Resultado |
|-----------|-----------------|
| Informe auditoría borrador | FMZ00-AUD_CAOIN-20251231-IA-20260228-v1-DRF |
| Informe definitivo firmado | ABC00-AUD_CAOCON-20241231-IAC-20250315-v3-FDO |
| Propuesta en revisión | CLIENTE01-PRAUDIT-20251231-PRAUDIT-20260110-v2-REV |
| Carta de manifestaciones aprobada | XYZ99-AUD_CAVCON-20251231-CM-20260120-v1-APR |
| Due diligence definitivo | ACME01-DEDI-20260630-DD-20260701-v2-DEF |

---

## Anexo B: Referencia Normativa

- **ISO 9001:2015** - Sistemas de gestión de calidad
- **ISQM 1** - Gestión de calidad para firmas de auditoría
- **ENS** - Esquema Nacional de Seguridad
- **ISO 27001** - Seguridad de la información
- **LOPDGDD** - Protección de datos personales
- **RGPD** - Reglamento General de Protección de Datos

---

*Documento generado conforme al procedimiento FORMAZ-PRO-01 v2.0 de Forvis Mazars.*

---

## Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-03-09 | Versión inicial del PRD |
| 2.0 | 2026-03-10 | Catálogos actualizados (revisión Belén V2). Actualización de catálogos por Excel con protección por contraseña. Selector de año/mes optimizado en campos de fecha. Selector de departamento (Auditoría / Otros). Pie de página corporativo IT Innovation. |
