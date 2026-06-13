import {Composition} from 'remotion';
import {VideoEdit} from './VideoEdit';
import {ProstateEdit} from './ProstateEdit';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoEdit"
        component={VideoEdit}
        durationInFrames={1500}
        fps={25}
        width={1280}
        height={720}
      />
      <Composition
        id="ProstateEdit"
        component={ProstateEdit}
        durationInFrames={908}
        fps={25}
        width={1920}
        height={1080}
      />
    </>
  );
};
