import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { Scene1_Character } from "./scenes/Scene1_Character";
import { Scene2_Problem }   from "./scenes/Scene2_Problem";
import { Scene3_Guide }     from "./scenes/Scene3_Guide";
import { Scene4_Plan }      from "./scenes/Scene4_Plan";
import { Scene5_Success }   from "./scenes/Scene5_Success";
import { C } from "./theme";

/* 5-scene hero's journey · persistent left-rail · 30fps · ~90s total. */
const SCENES: { dur: number; render: (d: number) => React.ReactNode }[] = [
  { dur: 660, render: (d) => <Scene1_Character durationInFrames={d} /> }, // 22s · CHARACTER
  { dur: 540, render: (d) => <Scene2_Problem   durationInFrames={d} /> }, // 18s · PROBLEM
  { dur: 540, render: (d) => <Scene3_Guide     durationInFrames={d} /> }, // 18s · GUIDE
  { dur: 540, render: (d) => <Scene4_Plan      durationInFrames={d} /> }, // 18s · PLAN
  { dur: 420, render: (d) => <Scene5_Success   durationInFrames={d} /> }, // 14s · SUCCESS
];
// total: 2700 frames @ 30fps = 90s

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
