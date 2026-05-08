import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { Scene1Standard } from "./scenes/Scene1Standard";
import { Scene2Execution } from "./scenes/Scene2Execution";
import { Scene3Audit } from "./scenes/Scene3Audit";
import { C } from "./theme";

const D = 180; // 6s per scene at 30fps

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Sequence from={0} durationInFrames={D}>
        <Scene1Standard durationInFrames={D} />
      </Sequence>
      <Sequence from={D} durationInFrames={D}>
        <Scene2Execution durationInFrames={D} />
      </Sequence>
      <Sequence from={D * 2} durationInFrames={D}>
        <Scene3Audit durationInFrames={D} />
      </Sequence>
    </AbsoluteFill>
  );
};