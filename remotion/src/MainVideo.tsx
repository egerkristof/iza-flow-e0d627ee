import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { S1_MeetSarah }    from "./scenes/S1_MeetSarah";
import { S2_MondayMorning }from "./scenes/S2_MondayMorning";
import { S3_PressureAbove }from "./scenes/S3_PressureAbove";
import { S4_SilosAround }  from "./scenes/S4_SilosAround";
import { S5_TheBreak }     from "./scenes/S5_TheBreak";
import { S6_TheGuide }     from "./scenes/S6_TheGuide";
import { S7_ThePlan }      from "./scenes/S7_ThePlan";
import { S8_NewMonday }    from "./scenes/S8_NewMonday";
import { C } from "./theme";

// Hero's story (StoryBrand). Slow pacing — 30fps. ~88s total.
const SCENES: { dur: number; render: (d: number) => React.ReactNode }[] = [
  { dur: 300, render: (d) => <S1_MeetSarah    durationInFrames={d} /> }, // 10s · CHARACTER
  { dur: 330, render: (d) => <S2_MondayMorning durationInFrames={d} /> }, // 11s · WORLD
  { dur: 330, render: (d) => <S3_PressureAbove durationInFrames={d} /> }, // 11s · PRESSURE FROM ABOVE
  { dur: 360, render: (d) => <S4_SilosAround  durationInFrames={d} /> }, // 12s · SILOS
  { dur: 330, render: (d) => <S5_TheBreak     durationInFrames={d} /> }, // 11s · THE BREAK (villain)
  { dur: 270, render: (d) => <S6_TheGuide     durationInFrames={d} /> }, // 9s  · THE GUIDE (LIZA)
  { dur: 360, render: (d) => <S7_ThePlan      durationInFrames={d} /> }, // 12s · THE PLAN
  { dur: 360, render: (d) => <S8_NewMonday    durationInFrames={d} /> }, // 12s · RESOLUTION
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