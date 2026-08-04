// Transicion de zoom hecha a mano con CSS puro (scale + opacity), siguiendo
// el mismo patron que @remotion/transitions/fade.js. NO usamos las
// transiciones "zoom-in-out"/"cross-zoom"/"dreamy-zoom" que trae la
// libreria: esas dependen de OffscreenCanvas + un shader (HtmlInCanvas), que
// no esta soportado en todos los entornos de render (falla duro con
// "HTML_IN_CANVAS_UNSUPPORTED_MESSAGE" en render por software, y no hay
// forma de garantizar que el navegador del usuario final si lo soporte). Un
// pipeline 100% automatico no se puede dar el lujo de una transicion que
// puede tumbar el render entero -- esta version DOM-only funciona en
// cualquier navegador.
import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';

type ZoomProps = Record<string, never>;

const ZoomPresentation: React.FC<TransitionPresentationComponentProps<ZoomProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const isEntering = presentationDirection === 'entering';
  const style = useMemo((): React.CSSProperties => {
    if (isEntering) {
      // el plano nuevo entra agrandandose desde 0.82 hasta el tamaño normal
      const scale = 0.82 + presentationProgress * 0.18;
      return {opacity: presentationProgress, transform: `scale(${scale})`};
    }
    // el plano viejo se aleja de-agrandandose (zoom out) mientras se desvanece
    const scale = 1 + presentationProgress * 0.18;
    return {opacity: 1 - presentationProgress, transform: `scale(${scale})`};
  }, [isEntering, presentationProgress]);
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const zoomTransition = (): TransitionPresentation<ZoomProps> => ({
  component: ZoomPresentation,
  props: {},
});
