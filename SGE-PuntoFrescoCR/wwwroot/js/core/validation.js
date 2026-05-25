/* Validaciones reutilizables para formularios del SPA. */
'use strict';

window.SGE = window.SGE || {};

SGE.Validate = {
  /** Cédula física, DIMEX o cédula jurídica CR: solo dígitos, longitud razonable */
  identificacion(raw) {
    const d = String(raw || '').replace(/\D/g, '');
    return d.length >= 9 && d.length <= 12;
  },

  telefono(raw) {
    const d = String(raw || '').replace(/\D/g, '');
    return d.length === 0 || (d.length >= 8 && d.length <= 15);
  },

  email(raw) {
    if (!raw || !String(raw).trim()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(raw).trim());
  },

  numeroPositivo(val, allowZero = true) {
    const n = Number(val);
    if (Number.isNaN(n)) return false;
    if (!allowZero && n <= 0) return false;
    return n >= 0;
  },

  enteroPositivo(val, allowZero = true) {
    const n = parseInt(String(val), 10);
    if (Number.isNaN(n)) return false;
    if (!allowZero && n <= 0) return false;
    return n >= 0;
  },

  juridica(raw) {
    const d = String(raw || '').replace(/\D/g, '');
    return d.length >= 9 && d.length <= 12;
  }
};
