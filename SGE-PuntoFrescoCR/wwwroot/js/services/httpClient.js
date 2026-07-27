/* Cliente HTTP (única responsabilidad: peticiones JSON). */
'use strict';

window.SGE = window.SGE || {};

SGE.Http = {
  async jsonFetch(url, method, body) {
    const init = { method, credentials: 'same-origin' };
    const m = (method || 'GET').toUpperCase();
    if (body != null && m !== 'GET' && m !== 'HEAD') {
      init.headers = { 'Content-Type': 'application/json' };
      init.body = JSON.stringify(body);
    }
    const res = await fetch(url, init);
    if (res.status === 401) {
      // Sesión expirada (inactividad) o cuenta desactivada: recargar hacia el login
      // en vez de mostrar un error de "Unauthorized" que no dice nada al usuario.
      window.location.href = '/Account/Login';
      return new Promise(() => {}); // corta la cadena de ejecución mientras redirige
    }
    if (!res.ok) {
      let msg = res.statusText;
      try {
        const j = await res.json();
        if (j.error) msg = j.error;
        else if (j.errors && typeof j.errors === 'object') {
          const first = Object.values(j.errors)[0];
          if (Array.isArray(first) && first.length) msg = first[0];
        }
      } catch (_) { /* ignore */ }
      throw new Error(msg);
    }
    if (res.status === 204) return null;
    const t = await res.text();
    if (!t) return null;
    try {
      return JSON.parse(t);
    } catch {
      return t;
    }
  }
};
