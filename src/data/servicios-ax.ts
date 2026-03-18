import type { ServicioAX } from '@/types';

const STORAGE_KEY = 'nomenclatura_custom_servicios';

const defaultServiciosAX: ServicioAX[] = [
  // GRC - Gobierno, Riesgo y Cumplimiento
  { codigo: 'CON_GRC-ER', descripcion: 'Enterprise Risk Management', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'enterprise', 'risk', 'management'] },
  { codigo: 'CON_GRC-SY', descripcion: 'ERM: Implantación de Sistemas de Gestión Integral de Riesgos', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'erm', 'implantación', 'sistemas', 'gestión'] },
  { codigo: 'CON_GRC-IC', descripcion: 'Control Interno: Optimización y soporte de la función de control interno', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'control', 'interno', 'optimización', 'soporte'] },
  { codigo: 'CON_GRC-SC', descripcion: 'Control interno (SCIIF) sobre información financiera en entidades cotizadas. Normativa CNMV', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'control', 'interno', 'sciif', 'información'] },
  { codigo: 'CON_GRC-AI', descripcion: 'Auditoría Interna: Soporte en el desarrollo y ejecución de los planes de auditoría interna', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'auditoría', 'interna', 'soporte', 'desarrollo'] },
  { codigo: 'CON_GRC-GB', descripcion: 'Optimización y adaptación del gobierno corporativo', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'optimización', 'adaptación', 'corporativo'] },
  { codigo: 'CON_GRC-CD', descripcion: 'Gestión externa Canal de Denuncias', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'gestión', 'externa', 'canal', 'denuncias'] },
  { codigo: 'CON_GRC-IB', descripcion: 'Informe Experto Externo control interno Prevención  Blanqueo de Capitales', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'informe', 'experto', 'externo', 'control'] },
  { codigo: 'CON_GRC-AB', descripcion: 'Servicios de Adecuación a la Ley de Blanqueo de Capitales', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'servicios', 'adecuación', 'ley', 'blanqueo'] },
  { codigo: 'CON_GRC-CP', descripcion: 'Compliance Penal', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'penal'] },
  { codigo: 'CON_GRC-PR', descripcion: 'Protección de datos', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'protección', 'datos'] },
  { codigo: 'CON_GRC-FR', descripcion: 'Fraude: Desarrollo e implantación de procedimientos y sistemas de control y prevención', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'fraude', 'desarrollo', 'implantación', 'procedimientos'] },
  { codigo: 'CON_GRC-FO', descripcion: 'Formación', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'formación'] },
  { codigo: 'CON_GRC-CO', descripcion: 'Compliance Digital', categoria: 'GRC', tags: ['gobierno', 'riesgo', 'cumplimiento', 'compliance', 'digital'] },
  // IT - Tecnología
  { codigo: 'IT_INTCM', descripcion: 'IT Internal Control Management', categoria: 'IT', tags: ['IT', 'tecnologia', 'internal', 'control', 'management'] },
  { codigo: 'IT_AUDINT', descripcion: 'Auditoria Interna IT', categoria: 'IT', tags: ['IT', 'tecnologia', 'auditoria', 'interna'] },
  { codigo: 'CON_IT_BCP', descripcion: 'Plan de continuidad de negocio', categoria: 'IT', tags: ['IT', 'tecnologia', 'plan', 'continuidad', 'negocio'] },
  { codigo: 'CON_IT_CIB', descripcion: 'Ciberseguridad. Gestión del riesgo tecnológico', categoria: 'IT', tags: ['IT', 'tecnologia', 'ciberseguridad', 'gestión', 'riesgo', 'tecnológico'] },
  { codigo: 'CON_IT_TRD', descripcion: 'Soporte en transformación digital', categoria: 'IT', tags: ['IT', 'tecnologia', 'soporte', 'transformación', 'digital'] },
  { codigo: 'CON_IT_PDS', descripcion: 'Plan Director de Seguridad', categoria: 'IT', tags: ['IT', 'tecnologia', 'plan', 'director', 'seguridad'] },
  { codigo: 'CON_IT_PD', descripcion: 'Planes directores IT: Definición e implantación', categoria: 'IT', tags: ['IT', 'tecnologia', 'planes', 'directores', 'definición', 'implantación'] },
  { codigo: 'CON_IT_RIS', descripcion: 'Mapa Riesgos Tecnológicos: Revisión y adecuaciones', categoria: 'IT', tags: ['IT', 'tecnologia', 'mapa', 'riesgos', 'tecnológicos', 'revisión', 'adecuaciones'] },
  { codigo: 'CON_IT_SGS', descripcion: 'Certificaciones Seguridad IT: 27001, 22301 y otras', categoria: 'IT', tags: ['IT', 'tecnologia', 'certificaciones', 'seguridad', '27001', '22301', 'otras'] },
  { codigo: 'CON_IT_ENS', descripcion: 'ENS - Esquema Nacional de Seguridad', categoria: 'IT', tags: ['IT', 'tecnologia', 'ens', 'esquema', 'nacional', 'seguridad'] },
  { codigo: 'CON_IT_SOX', descripcion: 'Ley Sarbanes-Oxley (SOX), JSOX y LSF', categoria: 'IT', tags: ['IT', 'tecnologia', 'ley', 'sarbanes', 'oxley', 'sox', 'jsox', 'lsf'] },
  { codigo: 'CON_IT_FOR', descripcion: 'Formación a medida en Seguridad y Buen Gobierno IT', categoria: 'IT', tags: ['IT', 'tecnologia', 'formación', 'medida', 'seguridad', 'buen', 'gobierno'] },
  // ACT - Actuarial
  { codigo: 'ACT_ACT', descripcion: 'Servicios Actuariales', categoria: 'ACT', tags: ['actuarial', 'servicios', 'actuariales'] },
  // BC - Business Consulting
  { codigo: 'CON_BC-STR', descripcion: 'Definición estratégica', categoria: 'BC', tags: ['consulting', 'business consulting', 'definición', 'estratégica'] },
  { codigo: 'CON_BC-GC', descripcion: 'Gestión del cambio', categoria: 'BC', tags: ['consulting', 'business consulting', 'gestión', 'cambio'] },
  { codigo: 'CON_BC-DSO', descripcion: 'Diseño organizativo', categoria: 'BC', tags: ['consulting', 'business consulting', 'diseño', 'organizativo'] },
  { codigo: 'CON_BC-PMI', descripcion: 'PMI', categoria: 'BC', tags: ['consulting', 'business consulting', 'pmi'] },
  { codigo: 'CON_BC-PRO', descripcion: 'Optimización de procesos', categoria: 'BC', tags: ['consulting', 'business consulting', 'optimización', 'procesos'] },
  { codigo: 'CON_BC-CLN', descripcion: 'Analítica de clientes', categoria: 'BC', tags: ['consulting', 'business consulting', 'analítica', 'clientes'] },
  { codigo: 'CON_BC-REP', descripcion: 'Cuadro de Mando: Optimización y diseño del reporting', categoria: 'BC', tags: ['consulting', 'business consulting', 'cuadro', 'mando', 'optimización', 'diseño', 'reporting'] },
  { codigo: 'CON_BC-PMO', descripcion: 'PMO: Definición y dirección de oficinas de gestión de proyectos', categoria: 'BC', tags: ['consulting', 'business consulting', 'pmo', 'definición', 'dirección', 'oficinas', 'gestión', 'proyectos'] },
  { codigo: 'CON_BC-TCG', descripcion: 'Asistencia técnica para la gestión', categoria: 'BC', tags: ['consulting', 'business consulting', 'asistencia', 'técnica', 'gestión'] },
  { codigo: 'CON_BC-CFO', descripcion: 'Asistencia técnica captación de fondos', categoria: 'BC', tags: ['consulting', 'business consulting', 'asistencia', 'técnica', 'captación', 'fondos'] },
  { codigo: 'CON_BC-EVA', descripcion: 'Asistencia técnica para la evaluación', categoria: 'BC', tags: ['consulting', 'business consulting', 'asistencia', 'técnica', 'evaluación'] },
  { codigo: 'CON_BC-SUB', descripcion: 'Asistencia técnica en subvenciones', categoria: 'BC', tags: ['consulting', 'business consulting', 'asistencia', 'técnica', 'subvenciones'] },
  { codigo: 'CON_BC-BI', descripcion: 'Business intelligence: Desarrollo e implantación de soluciones basadas en la analítica del dato', categoria: 'BC', tags: ['consulting', 'business consulting', 'business', 'intelligence', 'desarrollo', 'implantación', 'soluciones'] },
  { codigo: 'CON_BC-FOR', descripcion: 'Formación', categoria: 'BC', tags: ['consulting', 'business consulting', 'formación'] },
  // RF - Riesgos Financieros
  { codigo: 'CON_RF-VAL', descripcion: 'Valoración de carteras, instrumentos derivados y  test eficacia de coberturas', categoria: 'RF', tags: ['riesgo financiero', 'financial risk', 'valoración', 'carteras', 'instrumentos', 'derivados', 'test', 'eficacia'] },
  { codigo: 'CON_RF-DAT', descripcion: 'Data Analytics Solutions', categoria: 'RF', tags: ['riesgo financiero', 'financial risk', 'data', 'analytics', 'solutions'] },
  { codigo: 'CON_RF-RC', descripcion: 'Riesgo Crédito', categoria: 'RF', tags: ['riesgo financiero', 'financial risk', 'riesgo', 'crédito'] },
  { codigo: 'CON_RF-RM', descripcion: 'Riesgo de mercado', categoria: 'RF', tags: ['riesgo financiero', 'financial risk', 'riesgo', 'mercado'] },
  { codigo: 'CON_RF-RF', descripcion: 'Otros riesgos financieros', categoria: 'RF', tags: ['riesgo financiero', 'financial risk', 'otros', 'riesgos', 'financieros'] },
  { codigo: 'CON_RF-DAQ', descripcion: 'Gobierno y calidad del dato', categoria: 'RF', tags: ['riesgo financiero', 'financial risk', 'gobierno', 'calidad', 'dato'] },
  // AUD - Auditoría
  { codigo: 'AUD_CAOCON', descripcion: 'Auditoria Obligatoria de Cuentas Anuales Consolidada LAC', categoria: 'AUD', tags: ['auditoria', 'obligatoria', 'cuentas', 'anuales', 'consolidada', 'lac'] },
  { codigo: 'AUD_CAOIN', descripcion: 'Auditoria Obligatoria de Cuentas Anuales Individuales LAC', categoria: 'AUD', tags: ['auditoria', 'obligatoria', 'cuentas', 'anuales', 'individuales', 'lac'] },
  { codigo: 'AUD_CAVCON', descripcion: 'Auditoria Voluntaria de Cuentas Anuales Consolidadas LAC', categoria: 'AUD', tags: ['auditoria', 'voluntaria', 'cuentas', 'anuales', 'consolidadas', 'lac'] },
  { codigo: 'AUD_CAVIN', descripcion: 'Auditoria Voluntaria de Cuentas Anuales Individuales LAC', categoria: 'AUD', tags: ['auditoria', 'voluntaria', 'cuentas', 'anuales', 'individuales', 'lac'] },
  { codigo: 'AUD_IAASB', descripcion: 'Auditoria según normas IFAC IAASB Informacion Financiera Histórica', categoria: 'AUD', tags: ['auditoria', 'normas', 'ifac', 'iaasb', 'informacion', 'financiera', 'histórica'] },
  { codigo: 'AUD_PCAOB', descripcion: 'Auditoria según normas PCAOB Informacion Financiera Histórica', categoria: 'AUD', tags: ['auditoria', 'normas', 'pcaob', 'informacion', 'financiera', 'histórica'] },
  { codigo: 'AUD_OEFOB', descripcion: 'Auditoria Obligatoria otros estados financieros o documentos contables LAC', categoria: 'AUD', tags: ['auditoria', 'obligatoria', 'estados', 'financieros', 'documentos', 'contables', 'lac'] },
  { codigo: 'AUD_OEFVOL', descripcion: 'Auditoria Voluntaria otros estados financieros o documentos contables LAC', categoria: 'AUD', tags: ['auditoria', 'voluntaria', 'estados', 'financieros', 'documentos', 'contables', 'lac'] },
  // CIG - Colaboración con Auditores
  { codigo: 'CIG_AUDIFH', descripcion: 'Colaboración con Auditores Públicos - Auditoría Información Financiera Historica', categoria: 'CIG', tags: ['colaboracion', 'auditores publicos', 'colaboración', 'auditores', 'públicos', 'auditoría', 'información', 'financiera'] },
  // IES - Informes Especiales
  { codigo: 'IES_LSC301', descripcion: 'Informe Especial Aumento Capital Compensación Créditos', categoria: 'IES', tags: ['informe especial', 'aumento', 'capital', 'compensación', 'créditos'] },
  { codigo: 'IES_LSC303', descripcion: 'Informe Especial Aumento Capital con Cargo a Reservas', categoria: 'IES', tags: ['informe especial', 'aumento', 'capital', 'cargo', 'reservas'] },
  { codigo: 'IES_IPAC', descripcion: 'Informe Anual del Auditor sobre Protección de Activos de Clientes', categoria: 'IES', tags: ['informe especial', 'anual', 'auditor', 'protección', 'activos', 'clientes'] },
  { codigo: 'IES_COTSAL', descripcion: 'Informe Especial Seguimiento Salvedades Ejercicio Anterior - Entidad Cotizada en Bolsa de Valores', categoria: 'IES', tags: ['informe especial', 'seguimiento', 'salvedades', 'ejercicio', 'anterior', 'cotizada', 'bolsa'] },
  { codigo: 'IES_ECRLIM', descripcion: 'Informe Especial Seguimiento Limitaciones al alcance Ejercicio Anterior - Entidades Capital Riesgo', categoria: 'IES', tags: ['informe especial', 'seguimiento', 'limitaciones', 'alcance', 'ejercicio', 'capital', 'riesgo'] },
  { codigo: 'IES_TITULI', descripcion: 'Informe Especial en relación con Procesos de Titulización requerido por CNMV', categoria: 'IES', tags: ['informe especial', 'titulización', 'procesos', 'cnmv', 'requerido'] },
  { codigo: 'IES_PMPP', descripcion: 'Informe Especial certificación del auditor artículo 13.3 bis Ley 38/2003 General de Subvenciones', categoria: 'IES', tags: ['informe especial', 'certificación', 'auditor', 'subvenciones', 'ley'] },
  { codigo: 'IES_COM-CA', descripcion: 'Informe Especial y Complementario al de Auditoria de Cuentas Anuales Requerido por Supervisores', categoria: 'IES', tags: ['informe especial', 'complementario', 'auditoria', 'cuentas', 'anuales', 'supervisores'] },
  // AUP - Procedimientos Acordados
  { codigo: 'AUP_ECOEMB', descripcion: 'ISRS 4400 AUP Declaración ECOEMBES', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'declaración', 'ecoembes'] },
  { codigo: 'AUP_ECOTIC', descripcion: 'ISRS 4400 AUP Declaración ECOTIC', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'declaración', 'ecotic'] },
  { codigo: 'AUP_ECOVID', descripcion: 'ISRS 4400 AUP Declaración ECOVIDRIO', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'declaración', 'ecovidrio'] },
  { codigo: 'AUP_ECO-OT', descripcion: 'ISRS 4400 AUP Declaración Otros SCRAP o SIRAP', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'declaración', 'scrap', 'sirap'] },
  { codigo: 'AUP_CORES', descripcion: 'ISRS 4400 AUP Declaración ventas productos petrolíferos territorio nacional (CORES)', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'ventas', 'petrolíferos', 'cores'] },
  { codigo: 'AUP_SICBIO', descripcion: 'ISRS 4400 AUP Sistema Certificacion Biocarburantes y Otros Combustibles Renovables (SICBIOS)', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'certificacion', 'biocarburantes', 'sicbios'] },
  { codigo: 'AUP_SBNLAC', descripcion: 'ISRS 4400 AUP Cuenta Justificativa Subvenciones NO sujeto requerimientos independencia', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'subvenciones', 'justificativa', 'independencia'] },
  { codigo: 'AUP_SUBLAC', descripcion: 'ISRS 4400 AUP Cuenta Justificativa Subvenciones SUJETO a requerimientos independencia', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'subvenciones', 'justificativa', 'independencia'] },
  { codigo: 'AUP_SUB-PP', descripcion: 'ISRS 4400 AUP Cumplimiento Plazo Legal Pago a Proveedores (art. 13.3.bis LGS)', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'cumplimiento', 'plazo', 'proveedores', 'lgs'] },
  { codigo: 'AUP_COVENT', descripcion: 'ISRS 4400 AUP Covenants-Ratios ligados a contratos de financiación', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'covenants', 'ratios', 'financiación'] },
  { codigo: 'AUP_VABELE', descripcion: 'ISRS 4400 AUP Cálculo Valor Añadido Bruto - Electrointensivo', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'valor', 'añadido', 'electrointensivo'] },
  { codigo: 'AUP_VABGAS', descripcion: 'ISRS 4400 AUP Cálculo Valor Añadido Bruto - Gasintensivo', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'valor', 'añadido', 'gasintensivo'] },
  { codigo: 'AUP_OT-INF', descripcion: 'ISRS 4400 - AUP Otra Información Financiera', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'información', 'financiera'] },
  { codigo: 'AUP_NO-INF', descripcion: 'ISRS 4400 - AUP Sobre Información NO Financiera', categoria: 'AUP', tags: ['procedimientos acordados', 'ISRS 4400', 'información', 'no financiera'] },
  // NAS - Servicios No Aseguramiento
  { codigo: 'NAS_IS4410', descripcion: 'ISRS 4410 Compilación Información Financiera', categoria: 'NAS', tags: ['no aseguramiento', 'non-assurance', 'isrs', '4410', 'compilación', 'información', 'financiera'] },
  { codigo: 'NAS_SCIIF', descripcion: 'Informe No Aseguramiento sobre Información relativa al Sistema Control Interno sobre Información Financiera (SCIIF / ICFR)', categoria: 'NAS', tags: ['no aseguramiento', 'non-assurance', 'sciif', 'icfr', 'control', 'interno', 'financiera'] },
  { codigo: 'NAS_CONCON', descripcion: 'Consulta Sobre Cuestiones Contables', categoria: 'NAS', tags: ['no aseguramiento', 'non-assurance', 'consulta', 'cuestiones', 'contables'] },
  { codigo: 'NAS_ERES', descripcion: 'ERE - Acreditación pérdidas actuales/ disminución persistente ingresos ordinarios o ventas', categoria: 'NAS', tags: ['no aseguramiento', 'non-assurance', 'ere', 'acreditación', 'pérdidas', 'ingresos', 'ventas'] },
  { codigo: 'NAS_CONCUR', descripcion: 'Concursal - Certificación del auditor requerida por Ley  Concursal', categoria: 'NAS', tags: ['no aseguramiento', 'non-assurance', 'concursal', 'certificación', 'auditor', 'ley'] },
  { codigo: 'NAS_CL-IPO', descripcion: 'Comfort Letter - IPO Ofertas acciones o deuda SI registrada en Mercado de Valores (initial public offerings)', categoria: 'NAS', tags: ['no aseguramiento', 'non-assurance', 'comfort', 'letter', 'ipo', 'acciones', 'deuda'] },
  { codigo: 'NAS_CL-IPP', descripcion: 'Comfort Letter - IPP Ofertas acciones o deuda NO registrada en Mercado de Valores (initial private placements)', categoria: 'NAS', tags: ['no aseguramiento', 'non-assurance', 'comfort', 'letter', 'ipp', 'acciones', 'deuda'] },
  { codigo: 'NAS-OTROS', descripcion: 'Otros encargos NO Assurance', categoria: 'NAS', tags: ['no aseguramiento', 'non-assurance', 'otros', 'encargos'] },
  { codigo: 'NAS_FORCLI', descripcion: 'Formación a clientes', categoria: 'NAS', tags: ['no aseguramiento', 'non-assurance', 'formación', 'clientes'] },
  { codigo: 'NAS_FORPRO', descripcion: 'Formación a prospects', categoria: 'NAS', tags: ['no aseguramiento', 'non-assurance', 'formación', 'prospects'] },
  // ASS - Aseguramiento
  { codigo: 'ASS_IEISFS', descripcion: 'ISFS-Informe Especial sobre Informe  Situación Financiera y de Solvencia aseguradoras', categoria: 'ASS', tags: ['aseguramiento', 'assurance', 'isfs', 'informe', 'situación', 'financiera', 'solvencia'] },
  { codigo: 'ASS_IS3000', descripcion: 'ISAE 3000_Encargo Aseguramiento Distintos a los de Auditoria y Revisión', categoria: 'ASS', tags: ['aseguramiento', 'assurance', 'isae', '3000', 'encargo', 'auditoria', 'revisión'] },
  { codigo: 'ASS_IS3400', descripcion: 'ISAE 3400_Encargo Aseguramiento sobre información financiera prospectiva', categoria: 'ASS', tags: ['aseguramiento', 'assurance', 'isae', '3400', 'información', 'financiera', 'prospectiva'] },
  { codigo: 'ASS_IS3402', descripcion: 'ISAE 3402_Encargo Aseguramiento sobre controles en las organizaciones de servicios', categoria: 'ASS', tags: ['aseguramiento', 'assurance', 'isae', '3402', 'controles', 'organizaciones', 'servicios'] },
  { codigo: 'ASS_IS3410', descripcion: 'ISAE 3410_Encargo Aseguramiento sobre declaraciones de gases de efecto invernadero', categoria: 'ASS', tags: ['aseguramiento', 'assurance', 'isae', '3410', 'declaraciones', 'gases', 'efecto', 'invernadero'] },
  { codigo: 'ASS_IS3420', descripcion: 'ISAE 3420_Encargo Aseguramiento compilación información financiera proforma incluida en folleto', categoria: 'ASS', tags: ['aseguramiento', 'assurance', 'isae', '3420', 'compilación', 'información', 'financiera', 'proforma'] },
  { codigo: 'ASS_SOC1', descripcion: 'AICPA-SSAE_SOC 1 Assurance Reporting on Financial Reporting Controls at a Service Organization (Type I or Type II)', categoria: 'ASS', tags: ['aseguramiento', 'assurance', 'aicpa', 'ssae', 'soc', 'reporting', 'financial', 'controls'] },
  { codigo: 'ASS_SOC2', descripcion: 'AICPA-SSAE_SOC 2 Assurance Reporting on Non-Financial Reporting Controls at a Service Organization (Type I or SOC2-Type II)_security, availability, processing integrity, confidentiality, and privacy of a system', categoria: 'ASS', tags: ['aseguramiento', 'assurance', 'aicpa', 'ssae', 'soc', 'non-financial', 'security', 'privacy'] },
  { codigo: 'ASS_RL2410', descripcion: 'ISRE 2410_Encargos Revisión Información Financiera Histórica por el auditor de la entidad', categoria: 'ASS', tags: ['aseguramiento', 'assurance', 'isre', '2410', 'revisión', 'información', 'financiera', 'histórica'] },
  { codigo: 'ASS_RL2400', descripcion: 'ISRE 2400_Encargos Revisión Información Financiera Histórica no siendo el auditor de la entidad', categoria: 'ASS', tags: ['aseguramiento', 'assurance', 'isre', '2400', 'revisión', 'información', 'financiera', 'histórica'] },
  { codigo: 'ASS_SCIFF', descripcion: 'Informe Aseguramiento sobre Información relativa al Sistema Control Interno sobre Información Financiera (SCIIF / ICFR)', categoria: 'ASS', tags: ['aseguramiento', 'assurance', 'sciif', 'icfr', 'control', 'interno', 'información', 'financiera'] },
  // EXP - Experto Independiente
  { codigo: 'EXP_LSC475', descripcion: 'Transformación Sociedad Anónima española existente en Sociedad Anónima Europea', categoria: 'EXP', tags: ['experto independiente', 'transformación', 'sociedad', 'anónima', 'europea'] },
  { codigo: 'EXP_TRSDOM', descripcion: 'Informe traslado domicilio social a España sociedad extranjera de capital NO Espacio Económico Europeo', categoria: 'EXP', tags: ['experto independiente', 'traslado', 'domicilio', 'social', 'españa', 'extranjera'] },
  { codigo: 'EXP_O-NLEY', descripcion: 'Otros Informes Experto Independiente - NO requerido por ley o regulacion', categoria: 'EXP', tags: ['experto independiente', 'informes', 'no requerido', 'ley', 'regulacion'] },
  { codigo: 'EXP_O-SLEY', descripcion: 'Otros Informes Experto Independiente - Requerido por ley o regulacion', categoria: 'EXP', tags: ['experto independiente', 'informes', 'requerido', 'ley', 'regulacion'] },
  // ── Códigos originales conservados (sin conflicto con Excel) ──
  // SUS - Sostenibilidad
  { codigo: 'SUS_ASSU', descripcion: 'Sustainability Assurance', categoria: 'SUS', tags: ['sostenibilidad', 'assurance', 'sustainability'] },
  { codigo: 'SUS_REPORT', descripcion: 'Sustainability Reporting', categoria: 'SUS', tags: ['sostenibilidad', 'reporting', 'informe'] },
  { codigo: 'SUS_STRA', descripcion: 'Strategy & Due Diligence', categoria: 'SUS', tags: ['sostenibilidad', 'estrategia', 'due diligence'] },
  { codigo: 'SUS_TRA', descripcion: 'Implementation and Transformation', categoria: 'SUS', tags: ['sostenibilidad', 'implementacion', 'transformacion'] },
  // AUD - Auditoría (originales sin conflicto)
  { codigo: 'AUD_IFH', descripcion: 'Auditoría Información Financiera Histórica NO LAC', categoria: 'AUD', tags: ['auditoria', 'informacion financiera', 'historica'] },
  { codigo: 'AUD_OEF_CO', descripcion: 'Auditoría otros estados financieros o documentos contables Obligatorias LAC', categoria: 'AUD', tags: ['auditoria', 'estados financieros', 'obligatoria', 'LAC'] },
  { codigo: 'AUD_OEF_IN', descripcion: 'Auditoría otros estados financieros o documentos contables Voluntarias LAC', categoria: 'AUD', tags: ['auditoria', 'estados financieros', 'voluntaria', 'LAC'] },
  { codigo: 'AUD_CONSUL', descripcion: 'Consulting', categoria: 'AUD', tags: ['auditoria', 'consulting', 'consultoria'] },
  // IES - Informes Especiales (originales sin conflicto)
  { codigo: 'IES_AUDBAL', descripcion: 'Auditoría obligatoria de Balance', categoria: 'IES', tags: ['auditoria', 'balance', 'obligatoria'] },
  { codigo: 'IES_AUDBAV', descripcion: 'Auditoría voluntaria de Balance', categoria: 'IES', tags: ['auditoria', 'balance', 'voluntaria'] },
  { codigo: 'IES_CAPCRE', descripcion: 'Capitalización de Créditos', categoria: 'IES', tags: ['capitalizacion', 'creditos'] },
  // ECO - Ecología
  { codigo: 'ECO_ECOEM', descripcion: 'Ecoembes', categoria: 'ECO', tags: ['ecoembes', 'ecologia', 'medioambiente'] },
  { codigo: 'ECO_ECOTIC', descripcion: 'Ecotic', categoria: 'ECO', tags: ['ecotic', 'ecologia', 'medioambiente'] },
  // GRC - Gobierno, Riesgo y Cumplimiento (originales sin conflicto)
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
  // IT (originales sin conflicto)
  { codigo: 'IT_AUDIT', descripcion: 'IT Audit', categoria: 'IT', tags: ['IT', 'auditoria', 'tecnologia'] },
  { codigo: 'IT_RISEC', descripcion: 'IT Risk & Security', categoria: 'IT', tags: ['IT', 'riesgo', 'seguridad', 'ciberseguridad'] },
  // OTA - Otros Trabajos de Aseguramiento
  { codigo: 'OTA_AIFH', descripcion: 'Auditoría Información Financiera Histórica - Colaboración', categoria: 'OTA', tags: ['auditoria', 'financiera', 'historica', 'colaboracion'] },
  { codigo: 'OTA_CHC', descripcion: 'Certificación de Hechos Concretos', categoria: 'OTA', tags: ['certificacion', 'hechos'] },
  { codigo: 'OTA_CTAC', descripcion: 'Consultas Técnicas Sobre Aspectos Contables', categoria: 'OTA', tags: ['consultas', 'tecnicas', 'contables'] },
  { codigo: 'OTA_ICREQ', descripcion: 'Informes Complementarios a los de Auditoría de Cuentas Requeridos por Supervisadores', categoria: 'OTA', tags: ['informes', 'complementarios', 'supervisores'] },
  { codigo: 'OTA_OTEI', descripcion: 'Otros Trabajos Como Experto Independiente', categoria: 'OTA', tags: ['experto', 'independiente', 'trabajos'] },
  { codigo: 'OTA_OTR', descripcion: 'Otros', categoria: 'OTA', tags: ['otros'] },
  { codigo: 'OTA_PAIF', descripcion: 'Procedimientos Acordados Sobre Información Financiera', categoria: 'OTA', tags: ['procedimientos', 'acordados', 'financiera'] },
  { codigo: 'OTA_PAINF', descripcion: 'Procedimientos Acordados Sobre Información NO Financiera', categoria: 'OTA', tags: ['procedimientos', 'acordados', 'no financiera'] },
  { codigo: 'OTA_RLIFH', descripcion: 'Revisión Limitada Información Financiera Histórica', categoria: 'OTA', tags: ['revision', 'limitada', 'financiera', 'historica'] },
  { codigo: 'OTA_TADIFH', descripcion: 'Trabajos de Aseguramiento Distintos a los de Información Financiera Histórica', categoria: 'OTA', tags: ['aseguramiento', 'no financiera'] },
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
  // OTHER
  { codigo: 'VAC', descripcion: 'Vacaciones', categoria: 'OTHER', tags: ['vacaciones'] },
  { codigo: 'BAJ', descripcion: 'Baja por enfermedad', categoria: 'OTHER', tags: ['baja', 'enfermedad'] },
];

function loadCustomServicios(): ServicioAX[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCustomServicios(items: ServicioAX[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getServiciosAX(): ServicioAX[] {
  const custom = loadCustomServicios();
  if (custom.length === 0) return defaultServiciosAX;
  const merged = [...defaultServiciosAX];
  for (const c of custom) {
    const idx = merged.findIndex(m => m.codigo === c.codigo);
    if (idx >= 0) merged[idx] = c;
    else merged.push(c);
  }
  return merged;
}

export const serviciosAX: ServicioAX[] = defaultServiciosAX;
