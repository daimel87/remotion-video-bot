import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ColumnChart3D} from './components/ColumnChart3D';

export const RichestActorsEdit: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#0a0a1a'}}>
    <ColumnChart3D />
  </AbsoluteFill>
);
