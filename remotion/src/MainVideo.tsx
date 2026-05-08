import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { Scene1Standard } from "./scenes/Scene1Standard";
import { Scene2Execution } from "./scenes/Scene2Execution";
import { Scene3CrossTeam } from "./scenes/Scene3CrossTeam";
import { Scene4Feedback } from "./scenes/Scene4Feedback";
import { Scene5AuditPlaybook } from "./scenes/Scene5AuditPlaybook";
import { C } from "./theme";

const D = 240; // 8s per scene at 30fps

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
        <Scene3CrossTeam durationInFrames={D} />
      </Sequence>
      <Sequence from={D * 3} durationInFrames={D}>
        <Scene4Feedback durationInFrames={D} />
      </Sequence>
      <Sequence from={D * 4} durationInFrames={D}>
        <Scene5AuditPlaybook durationInFrames={D} />
      </Sequence>
    </AbsoluteFill>
  );
};