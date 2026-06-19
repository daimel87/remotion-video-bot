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
import {WindowsXlite2Edit} from './WindowsXlite2Edit';
import {WindowsXlite3Edit} from './WindowsXlite3Edit';
import {WindowsXlite4Edit} from './WindowsXlite4Edit';
import {WindowsXlite5Edit} from './WindowsXlite5Edit';
import {WindowsXlite6Edit} from './WindowsXlite6Edit';
import {WindowsXlite7Edit} from './WindowsXlite7Edit';
import {WindowsXliteFinalEdit} from './WindowsXliteFinalEdit';
import {MessiRonaldoEdit} from './MessiRonaldoEdit';
import {RichestAthletesEdit} from './RichestAthletesEdit';
import {RichestActorsEdit} from './RichestActorsEdit';

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
      <Composition
        id="WindowsXlite2Edit"
        component={WindowsXlite2Edit}
        durationInFrames={639}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WindowsXlite3Edit"
        component={WindowsXlite3Edit}
        durationInFrames={1519}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WindowsXlite4Edit"
        component={WindowsXlite4Edit}
        durationInFrames={444}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WindowsXlite5Edit"
        component={WindowsXlite5Edit}
        durationInFrames={857}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WindowsXlite6Edit"
        component={WindowsXlite6Edit}
        durationInFrames={1468}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WindowsXlite7Edit"
        component={WindowsXlite7Edit}
        durationInFrames={1865}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WindowsXliteFinalEdit"
        component={WindowsXliteFinalEdit}
        durationInFrames={1270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RichestAthletesEdit"
        component={RichestAthletesEdit}
        durationInFrames={9000}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RichestActorsEdit"
        component={RichestActorsEdit}
        durationInFrames={5400}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MessiRonaldoEdit"
        component={MessiRonaldoEdit}
        durationInFrames={5400}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
