import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { Scene1Standard } from "./scenes/Scene1Standard";
import { Scene2Execution } from "./scenes/Scene2Execution";
import { Scene3CrossTeam } from "./scenes/Scene3CrossTeam";
import { Scene4Signal } from "./scenes/Scene4Signal";
import { Scene5Update } from "./scenes/Scene5Update";
import { Scene6Audit } from "./scenes/Scene6Audit";
import { Scene7Playbook } from "./scenes/Scene7Playbook";
import { C } from "./theme";

// Per-scene durations in frames (30fps). Slower pacing, more screens.
const SCENES: { dur: number; render: (d: number) => React.ReactNode }[] = [
  { dur: 270, render: (d) => <Scene1Standard durationInFrames={d} /> },   // 9s — publish + standard
  { dur: 270, render: (d) => <Scene2Execution durationInFrames={d} /> },  // 9s — three tools, one answer
  { dur: 240, render: (d) => <Scene3CrossTeam durationInFrames={d} /> },  // 8s — workbooks inherit
  { dur: 180, render: (d) => <Scene4Signal durationInFrames={d} /> },     // 6s — field signal alone
  { dur: 240, render: (d) => <Scene5Update durationInFrames={d} /> },     // 8s — Sarah reviews, ships v2.5
  { dur: 210, render: (d) => <Scene6Audit durationInFrames={d} /> },      // 7s — audit log
  { dur: 210, render: (d) => <Scene7Playbook durationInFrames={d} /> },   // 7s — AACE playbook reveal
];

export const MainVideo: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {SCENES.map((s, i) => {
        const from = cursor;
        cursor += s.dur;
        return (
          <Sequence key={i} from={from} durationInFrames={s.dur}>
            {s.render(s.dur)}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};