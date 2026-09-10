import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';

// Prueba: tapa la marca de agua "Veo" (esquina inferior derecha) con el
// botón de LIKE, que además sirve como CTA de engagement.
export const FoxReactionTest: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('fox-reaction-test.mp4')} />

      <Img
        src={staticFile('assets/pngtree-like-button-for-youtube-vector-png-image_16285919.png')}
        style={{
          position: 'absolute',
          bottom: -50,
          right: -10,
          width: 190,
        }}
      />
    </AbsoluteFill>
  );
};
