import {Composition} from 'remotion';
import {VideoEdit} from './VideoEdit';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="VideoEdit"
      component={VideoEdit}
      durationInFrames={1500}
      fps={25}
      width={1280}
      height={720}
    />
  );
};
