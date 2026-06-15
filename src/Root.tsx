import {Composition} from 'remotion';
import {VideoEdit} from './VideoEdit';
import {ProstateEdit} from './ProstateEdit';
import {DoctorIntroEdit} from './DoctorIntroEdit';
import {JitomatePepitaEdit} from './JitomatePepitaEdit';
import {AjoNopalEdit} from './AjoNopalEdit';
import {FrijolChileEdit} from './FrijolChileEdit';
import {CebollaAguacateEdit} from './CebollaAguacateEdit';
import {CurcuminaGranadaEdit} from './CurcuminaGranadaEdit';
import {CierreEdit} from './CierreEdit';
import {WindowsXliteEdit} from './WindowsXliteEdit';

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
      <Composition
        id="DoctorIntroEdit"
        component={DoctorIntroEdit}
        durationInFrames={1142}
        fps={25}
        width={1920}
        height={1080}
      />
      <Composition
        id="JitomatePepitaEdit"
        component={JitomatePepitaEdit}
        durationInFrames={1214}
        fps={25}
        width={1920}
        height={1080}
      />
      <Composition
        id="AjoNopalEdit"
        component={AjoNopalEdit}
        durationInFrames={1115}
        fps={25}
        width={1920}
        height={1080}
      />
      <Composition
        id="FrijolChileEdit"
        component={FrijolChileEdit}
        durationInFrames={1274}
        fps={25}
        width={1920}
        height={1080}
      />
      <Composition
        id="CebollaAguacateEdit"
        component={CebollaAguacateEdit}
        durationInFrames={1346}
        fps={25}
        width={1920}
        height={1080}
      />
      <Composition
        id="CurcuminaGranadaEdit"
        component={CurcuminaGranadaEdit}
        durationInFrames={1215}
        fps={25}
        width={1920}
        height={1080}
      />
      <Composition
        id="CierreEdit"
        component={CierreEdit}
        durationInFrames={1447}
        fps={25}
        width={1920}
        height={1080}
      />
      <Composition
        id="WindowsXliteEdit"
        component={WindowsXliteEdit}
        durationInFrames={531}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
