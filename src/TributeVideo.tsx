import {AbsoluteFill, Audio, Series, staticFile} from 'remotion';
import {TributeScene} from './TributeScene';
import {TributeIntro, TributeOutro} from './components/TributeCards';
import {
  tributeActors,
  DEFAULT_SCENE_FRAMES,
  INTRO_FRAMES,
  OUTRO_FRAMES,
  TRIBUTE_TITLE,
  TRIBUTE_SUBTITLE,
  TRIBUTE_MUSIC,
} from './tributeData';

/**
 * Video de tributo completo: intro → escena por actor → outro, encadenados
 * con funde a negro. La lista de actores vive en tributeData.ts.
 */
export const TributeVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {TRIBUTE_MUSIC ? <Audio src={staticFile(TRIBUTE_MUSIC)} volume={0.7} /> : null}
      <Series>
        <Series.Sequence durationInFrames={INTRO_FRAMES}>
          <TributeIntro title={TRIBUTE_TITLE} subtitle={TRIBUTE_SUBTITLE} />
        </Series.Sequence>

        {tributeActors.map((actor, i) => (
          <Series.Sequence
            key={i}
            durationInFrames={actor.sceneFrames ?? DEFAULT_SCENE_FRAMES}
          >
            <TributeScene {...actor} />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={OUTRO_FRAMES}>
          <TributeOutro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
