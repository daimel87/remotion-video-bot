# Origen

Copiado completo (201 escenas + utilidades) desde
https://github.com/lifeprompt-team/remotion-scenes (licencia MIT).

Cambios respecto al original:
- `common/fonts.ts`: se reemplazo la carga de Inter via Google Fonts por una
  pila de fuentes de sistema, para que el render no dependa de una red
  externa (evita fallos detras de proxies/firewalls). El resto del codigo
  esta sin modificar.

`MontagePreview` (en `src/montage/`) reusa `TextMaskReveal` y `TextKinetic`
de aqui tal cual; el resto de escenas quedan disponibles para usar segun se
necesite en futuros bloques.
