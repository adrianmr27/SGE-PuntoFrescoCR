/* ═══════════════════════════════════════════════════════
   Errores de formulario a nivel de campo.

   Antes, cualquier fallo al guardar terminaba en un cuadro que solo decía
   "Error": el backend respondía BadRequest() sin cuerpo y el cliente se
   quedaba con el texto "Bad Request". Ahora el servidor envía

     { error, codigo, campo }

   y este módulo pinta el mensaje bajo el control correspondiente, marca el
   campo en rojo y le da el foco, de modo que la persona ve exactamente qué
   corregir y dónde.
   ═══════════════════════════════════════════════════════ */
'use strict';

window.SGE = window.SGE || {};

const CLASE_INVALIDO = 'is-invalid';
const CLASE_MENSAJE = 'field-error';

/** Devuelve el contenedor .form-group que envuelve al control, si existe. */
function grupoDe(el) {
  return el.closest('.form-group') || el.parentElement;
}

/** Quita el mensaje y la marca de error de un control concreto. */
function limpiarCampo(el) {
  if (!el) return;
  el.classList.remove(CLASE_INVALIDO);
  el.removeAttribute('aria-invalid');
  el.removeAttribute('aria-describedby');
  const grupo = grupoDe(el);
  grupo?.querySelector('.' + CLASE_MENSAJE)?.remove();
}

SGE.FormErrors = {
  /**
   * Marca un campo como inválido y muestra el motivo debajo.
   * @param {string} campoId  id del control (ej. "u-email")
   * @param {string} mensaje  texto en español, ya listo para mostrar
   */
  mostrar(campoId, mensaje) {
    const el = document.getElementById(campoId);
    if (!el) return false;

    limpiarCampo(el);

    el.classList.add(CLASE_INVALIDO);
    el.setAttribute('aria-invalid', 'true');

    const idMensaje = `${campoId}-error`;
    el.setAttribute('aria-describedby', idMensaje);

    const aviso = document.createElement('p');
    aviso.className = CLASE_MENSAJE;
    aviso.id = idMensaje;
    // role="alert" hace que el lector de pantalla lo anuncie al aparecer.
    aviso.setAttribute('role', 'alert');
    aviso.textContent = mensaje;

    grupoDe(el)?.appendChild(aviso);

    // Lleva a la persona hasta el campo: en formularios largos el error
    // puede quedar fuera de la parte visible del modal.
    try {
      el.focus({ preventScroll: true });
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    } catch (_) {
      el.focus();
    }

    return true;
  },

  /** Limpia todos los errores dentro de un modal o contenedor. */
  limpiar(contenedorId) {
    const raiz = contenedorId ? document.getElementById(contenedorId) : document;
    if (!raiz) return;
    raiz.querySelectorAll('.' + CLASE_INVALIDO).forEach((el) => {
      el.classList.remove(CLASE_INVALIDO);
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
    });
    raiz.querySelectorAll('.' + CLASE_MENSAJE).forEach((el) => el.remove());
  },

  /**
   * Punto único para tratar un fallo al guardar.
   *
   * Si el error trae el campo culpable, se resalta ahí mismo dentro del modal
   * y no se abre ningún cuadro de diálogo: el usuario corrige y reintenta sin
   * perder lo que ya escribió. Si no hay campo (permisos, conflicto general),
   * se muestra el mensaje del servidor tal cual, que ya viene redactado.
   *
   * @param {Error} error      error lanzado por SGE.Http.jsonFetch
   * @param {string} modalId   id del modal donde limpiar y resaltar
   * @param {string} respaldo  texto por si el servidor no envió ninguno
   */
  manejar(error, modalId, respaldo = 'No fue posible completar la operación.') {
    this.limpiar(modalId);

    const mensaje = (error && error.message) || respaldo;
    const campo = error && error.campo;

    if (campo && this.mostrar(campo, mensaje)) return;

    SGE.Toast.show(mensaje, 'error');
  },

  /**
   * Validación en el cliente. Recibe una lista de comprobaciones y se detiene
   * en la primera que falle, resaltando ese campo.
   *
   * Existe para que el usuario no tenga que esperar una ida y vuelta al
   * servidor por un campo vacío, pero NO sustituye a la validación del
   * backend: esa es la que manda y se ejecuta siempre.
   *
   * @param {string} modalId
   * @param {Array<{campo:string, valido:boolean, mensaje:string}>} reglas
   * @returns {boolean} true si todo está correcto
   */
  validar(modalId, reglas) {
    this.limpiar(modalId);

    for (const regla of reglas) {
      if (regla.valido) continue;
      if (!this.mostrar(regla.campo, regla.mensaje)) {
        SGE.Toast.show(regla.mensaje, 'error');
      }
      return false;
    }

    return true;
  }
};
