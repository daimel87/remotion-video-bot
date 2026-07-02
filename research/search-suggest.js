// Trae las sugerencias reales del buscador de YouTube para un término (el
// autocompletado que ve cualquier persona al escribir en la barra de
// búsqueda). No es parte de la YouTube Data API — es el mismo endpoint de
// autocompletado de Google que usan varias herramientas gratuitas de
// keyword research, consumido con la técnica JSONP (una etiqueta <script>)
// para no chocar con CORS, sin necesidad de ningún proxy.
//
// Nota: no se pudo probar en vivo en el entorno de desarrollo (el sandbox
// bloquea este dominio específico). Debería funcionar en un navegador
// normal; si Google cambia el formato, esta función simplemente devuelve
// una lista vacía sin romper el resto de la app.

/**
 * @param {string} query
 * @param {number} timeoutMs
 * @returns {Promise<string[]>}
 */
export function fetchSearchSuggestions(query, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const callbackName = `ytSuggest_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const script = document.createElement("script");
    let done = false;

    function finish(result) {
      if (done) return;
      done = true;
      delete window[callbackName];
      script.remove();
      resolve(result);
    }

    window[callbackName] = (data) => {
      const suggestions = (data?.[1] ?? [])
        .map((item) => (Array.isArray(item) ? item[0] : item))
        .filter((s) => typeof s === "string");
      finish(suggestions);
    };

    script.src = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}&callback=${callbackName}`;
    script.onerror = () => finish([]);
    document.head.appendChild(script);

    setTimeout(() => finish([]), timeoutMs);
  });
}
