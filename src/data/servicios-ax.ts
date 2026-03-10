import type { ServicioAX } from '@/types';

export const serviciosAX: ServicioAX[] = [
  // SUS - Sostenibilidad
  { codigo: 'SUS_ASSU', descripcion: 'Sustainability Assurance', categoria: 'SUS', tags: ['sostenibilidad', 'assurance', 'sustainability'] },
  { codigo: 'SUS_REPORT', descripcion: 'Sustainability Reporting', categoria: 'SUS', tags: ['sostenibilidad', 'reporting', 'informe'] },
  { codigo: 'SUS_STRA', descripcion: 'Strategy & Due Diligence', categoria: 'SUS', tags: ['sostenibilidad', 'estrategia', 'due diligence'] },
  { codigo: 'SUS_TRA', descripcion: 'Implementation and Transformation', categoria: 'SUS', tags: ['sostenibilidad', 'implementacion', 'transformacion'] },
  // AUD - Auditoría
  { codigo: 'AUD_CAOCON', descripcion: 'Auditoría Obligatoria de Cuentas Anuales Consolidada LAC', categoria: 'AUD', tags: ['auditoria', 'obligatoria', 'consolidada', 'cuentas anuales', 'LAC'] },
  { codigo: 'AUD_CAOIN', descripcion: 'Auditoría Obligatoria de Cuentas Anuales Individuales LAC', categoria: 'AUD', tags: ['auditoria', 'obligatoria', 'individual', 'cuentas anuales', 'LAC'] },
  { codigo: 'AUD_CAVCON', descripcion: 'Auditoría Voluntaria de Cuentas Anuales Consolidadas LAC', categoria: 'AUD', tags: ['auditoria', 'voluntaria', 'consolidada', 'cuentas anuales', 'LAC'] },
  { codigo: 'AUD_CAVIN', descripcion: 'Auditoría Voluntaria de Cuentas Anuales Individuales LAC', categoria: 'AUD', tags: ['auditoria', 'voluntaria', 'individual', 'cuentas anuales', 'LAC'] },
  { codigo: 'AUD_IFH', descripcion: 'Auditoría Información Financiera Histórica NO LAC', categoria: 'AUD', tags: ['auditoria', 'informacion financiera', 'historica'] },
  { codigo: 'AUD_OEF_CO', descripcion: 'Auditoría otros estados financieros Obligatorias LAC', categoria: 'AUD', tags: ['auditoria', 'estados financieros', 'obligatoria', 'LAC'] },
  { codigo: 'AUD_OEF_IN', descripcion: 'Auditoría otros estados financieros Voluntarias LAC', categoria: 'AUD', tags: ['auditoria', 'estados financieros', 'voluntaria', 'LAC'] },
  { codigo: 'AUD_CONSUL', descripcion: 'Consulting', categoria: 'AUD', tags: ['auditoria', 'consulting', 'consultoria'] },
  // IES - Informes Especiales
  { codigo: 'IES_AUDBAL', descripcion: 'Auditoría obligatoria de Balance', categoria: 'IES', tags: ['auditoria', 'balance', 'obligatoria'] },
  { codigo: 'IES_AUDBAV', descripcion: 'Auditoría voluntaria de Balance', categoria: 'IES', tags: ['auditoria', 'balance', 'voluntaria'] },
  { codigo: 'IES_CAPCRE', descripcion: 'Capitalización de Créditos', categoria: 'IES', tags: ['capitalizacion', 'creditos'] },
  // ECO - Ecología
  { codigo: 'ECO_ECOEM', descripcion: 'Ecoembes', categoria: 'ECO', tags: ['ecoembes', 'ecologia', 'medioambiente'] },
  { codigo: 'ECO_ECOTIC', descripcion: 'Ecotic', categoria: 'ECO', tags: ['ecotic', 'ecologia', 'medioambiente'] },
  // GRC - Gobierno, Riesgo y Cumplimiento
  { codigo: 'GRC_ASDEAI', descripcion: 'Asesoría en el Desarrollo de Auditoría Interna', categoria: 'GRC', tags: ['asesoria', 'auditoria interna', 'desarrollo'] },
  { codigo: 'GRC_CGSR', descripcion: 'Corporate Governance & Social Responsibility', categoria: 'GRC', tags: ['gobierno corporativo', 'responsabilidad social'] },
  { codigo: 'GRC_ICM', descripcion: 'Internal Control Management', categoria: 'GRC', tags: ['control interno', 'gestion'] },
  { codigo: 'GRC_OPRM', descripcion: 'Operational Risk Management', categoria: 'GRC', tags: ['riesgo operacional', 'gestion'] },
  { codigo: 'GRC_SAI', descripcion: 'Servicios Auditoría Interna', categoria: 'GRC', tags: ['auditoria interna', 'servicios'] },
  { codigo: 'GRC_SOX', descripcion: 'SOX', categoria: 'GRC', tags: ['SOX', 'sarbanes', 'oxley'] },
  // SUB - Subvenciones
  { codigo: 'SUB', descripcion: 'Subvenciones', categoria: 'SUB', tags: ['subvenciones', 'ayudas'] },
  { codigo: 'SUB_RSUB', descripcion: 'Revisión de Subvenciones', categoria: 'SUB', tags: ['subvenciones', 'revision'] },
  { codigo: 'SUB_RSUB_L', descripcion: 'Revisión de Subvenciones (bajo independencia LAC)', categoria: 'SUB', tags: ['subvenciones', 'revision', 'LAC', 'independencia'] },
  // COM - Compliance
  { codigo: 'COM_AGDPR', descripcion: 'Auditoría GDPR', categoria: 'COM', tags: ['GDPR', 'auditoria', 'proteccion datos'] },
  { codigo: 'COM_IEEBC', descripcion: 'Informe experto externo Blanqueo Capitales', categoria: 'COM', tags: ['blanqueo', 'capitales', 'informe', 'experto'] },
  { codigo: 'COM_LOPD', descripcion: 'Revisión LOPD', categoria: 'COM', tags: ['LOPD', 'proteccion datos', 'revision'] },
  { codigo: 'COM_MGDPR', descripcion: 'Servicio de soporte y mantenimiento GDPR', categoria: 'COM', tags: ['GDPR', 'soporte', 'mantenimiento'] },
  { codigo: 'COM_RPE', descripcion: 'Responsabilidad Penal de Empresas', categoria: 'COM', tags: ['responsabilidad penal', 'empresas'] },
  { codigo: 'COM_SAGDPR', descripcion: 'Servicio adecuación GDPR', categoria: 'COM', tags: ['GDPR', 'adecuacion'] },
  { codigo: 'COM_SALBC', descripcion: 'Servicio adecuación Ley de Blanqueo de Capitales', categoria: 'COM', tags: ['blanqueo', 'capitales', 'adecuacion'] },
  { codigo: 'COM_SGCED', descripcion: 'Servicio de gestión Canal Ético de Denuncias', categoria: 'COM', tags: ['canal etico', 'denuncias', 'gestion'] },
  { codigo: 'COM_SOX', descripcion: 'Ley Sarbanes-Oxley (SOX)', categoria: 'COM', tags: ['SOX', 'sarbanes', 'oxley', 'compliance'] },
  // IT
  { codigo: 'IT_AUDIT', descripcion: 'IT Audit', categoria: 'IT', tags: ['IT', 'auditoria', 'tecnologia'] },
  { codigo: 'IT_RISEC', descripcion: 'IT Risk & Security', categoria: 'IT', tags: ['IT', 'riesgo', 'seguridad', 'ciberseguridad'] },
  // OTA - Otros Trabajos de Aseguramiento
  { codigo: 'OTA_AIFH', descripcion: 'Auditoría Información Financiera Histórica - Colaboración', categoria: 'OTA', tags: ['auditoria', 'financiera', 'historica', 'colaboracion'] },
  { codigo: 'OTA_CHC', descripcion: 'Certificación de Hechos Concretos', categoria: 'OTA', tags: ['certificacion', 'hechos'] },
  { codigo: 'OTA_CTAC', descripcion: 'Consultas Técnicas Sobre Aspectos Contables', categoria: 'OTA', tags: ['consultas', 'tecnicas', 'contables'] },
  { codigo: 'OTA_ICREQ', descripcion: 'Informes Complementarios Requeridos por Supervisadores', categoria: 'OTA', tags: ['informes', 'complementarios', 'supervisores'] },
  { codigo: 'OTA_OTEI', descripcion: 'Otros Trabajos Como Experto Independiente', categoria: 'OTA', tags: ['experto', 'independiente', 'trabajos'] },
  { codigo: 'OTA_OTR', descripcion: 'Otros', categoria: 'OTA', tags: ['otros'] },
  { codigo: 'OTA_PAIF', descripcion: 'Procedimientos Acordados Sobre Información Financiera', categoria: 'OTA', tags: ['procedimientos', 'acordados', 'financiera'] },
  { codigo: 'OTA_PAINF', descripcion: 'Procedimientos Acordados Sobre Información NO Financiera', categoria: 'OTA', tags: ['procedimientos', 'acordados', 'no financiera'] },
  { codigo: 'OTA_RLIFH', descripcion: 'Revisión Limitada Información Financiera Histórica', categoria: 'OTA', tags: ['revision', 'limitada', 'financiera', 'historica'] },
  { codigo: 'OTA_TADIFH', descripcion: 'Trabajos de Aseguramiento Distintos de Información Financiera Histórica', categoria: 'OTA', tags: ['aseguramiento', 'no financiera'] },
  { codigo: 'OTA_TEIRL', descripcion: 'Trabajos Como Expertos Independientes Requeridos Por Ley', categoria: 'OTA', tags: ['experto', 'independiente', 'ley'] },
  // CFIN - Corporate Finance
  { codigo: 'CFIN', descripcion: 'Corporate Finance', categoria: 'CFIN', tags: ['corporate finance', 'finanzas corporativas'] },
  { codigo: 'IPO', descripcion: 'Capital Markets (IPO)', categoria: 'CFIN', tags: ['IPO', 'capital', 'mercados', 'bolsa'] },
  { codigo: 'DEDI', descripcion: 'Due Diligence', categoria: 'CFIN', tags: ['due diligence', 'diligencia debida'] },
  { codigo: 'FOIN', descripcion: 'Forensic Investigation', categoria: 'CFIN', tags: ['forensic', 'investigacion', 'forense'] },
  { codigo: 'PRFI', descripcion: 'Project Finance', categoria: 'CFIN', tags: ['project finance', 'financiacion proyectos'] },
  { codigo: 'RESE', descripcion: 'Restructuring Services', categoria: 'CFIN', tags: ['reestructuracion', 'restructuring'] },
  { codigo: 'VAL', descripcion: 'Valuations', categoria: 'CFIN', tags: ['valoraciones', 'valuations'] },
  // ACC - Accounting
  { codigo: 'ACC', descripcion: 'Accounting', categoria: 'ACC', tags: ['contabilidad', 'accounting'] },
  { codigo: 'MIX', descripcion: 'Mixto', categoria: 'ACC', tags: ['mixto', 'contabilidad'] },
  { codigo: 'PAY', descripcion: 'Payroll', categoria: 'ACC', tags: ['nominas', 'payroll'] },
  // TAX - Fiscal
  { codigo: 'ASFI', descripcion: 'Asesoramiento fiscal', categoria: 'TAX', tags: ['asesoramiento', 'fiscal', 'tax'] },
  { codigo: 'DUED', descripcion: 'Due Diligence (Tax)', categoria: 'TAX', tags: ['due diligence', 'fiscal', 'tax'] },
  { codigo: 'PLFI', descripcion: 'Planificación Fiscal', categoria: 'TAX', tags: ['planificacion', 'fiscal'] },
  { codigo: 'PRTR', descripcion: 'Precios de Transferencia', categoria: 'TAX', tags: ['precios', 'transferencia', 'transfer pricing'] },
  { codigo: 'REFI', descripcion: 'Revisión fiscal', categoria: 'TAX', tags: ['revision', 'fiscal'] },
  { codigo: 'OTFI', descripcion: 'Otros fiscal', categoria: 'TAX', tags: ['otros', 'fiscal'] },
  { codigo: 'PREC', descripcion: 'Procedimiento Económicos y Contenciosos', categoria: 'TAX', tags: ['procedimiento', 'economico', 'contencioso'] },
  // LEGAL
  { codigo: 'ASLA', descripcion: 'Asesoría Laboral', categoria: 'LEGAL', tags: ['asesoria', 'laboral', 'trabajo'] },
  { codigo: 'CONC', descripcion: 'Concursal', categoria: 'LEGAL', tags: ['concursal', 'concurso', 'insolvencia'] },
  { codigo: 'CONT', descripcion: 'Contractual', categoria: 'LEGAL', tags: ['contractual', 'contratos'] },
  { codigo: 'PROC', descripcion: 'Procesal', categoria: 'LEGAL', tags: ['procesal', 'litigio'] },
  { codigo: 'SOCI', descripcion: 'Societario', categoria: 'LEGAL', tags: ['societario', 'sociedades', 'mercantil'] },
  { codigo: 'DEFI', descripcion: 'Derecho financiero', categoria: 'LEGAL', tags: ['derecho', 'financiero', 'bancario'] },
  // INTERNAL
  { codigo: 'ACT_FUNCIO', descripcion: 'Actividades Funcionales', categoria: 'INTERNAL', tags: ['actividades', 'funcionales', 'interno'] },
  { codigo: 'ACT_NO_OPE', descripcion: 'Actividades No Operativas', categoria: 'INTERNAL', tags: ['actividades', 'no operativas'] },
  { codigo: 'DES_COMERC', descripcion: 'Desarrollo comercial', categoria: 'INTERNAL', tags: ['desarrollo', 'comercial'] },
  { codigo: 'FORMACION', descripcion: 'Formación', categoria: 'INTERNAL', tags: ['formacion', 'capacitacion'] },
  { codigo: 'O_NO_ASIGN', descripcion: 'Oficina No Asignado', categoria: 'INTERNAL', tags: ['oficina', 'no asignado'] },
  { codigo: 'REC_HUMANO', descripcion: 'Recursos Humanos', categoria: 'INTERNAL', tags: ['recursos humanos', 'RRHH'] },
  { codigo: 'RM_CALIDAD', descripcion: 'Risk Management & Control de Calidad', categoria: 'INTERNAL', tags: ['riesgo', 'calidad', 'control'] },
  // ACT - Actuarial
  { codigo: 'ACT_ACT', descripcion: 'Servicios Actuariales', categoria: 'ACT', tags: ['actuarial', 'servicios'] },
  // OTHER
  { codigo: 'VAC', descripcion: 'Vacaciones', categoria: 'OTHER', tags: ['vacaciones'] },
  { codigo: 'BAJ', descripcion: 'Baja por enfermedad', categoria: 'OTHER', tags: ['baja', 'enfermedad'] },
];
