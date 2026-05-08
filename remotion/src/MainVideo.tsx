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

// Hero's story · StoryBrand 7. Slow pacing · 30fps · ~88s total.
const SCENES: { dur: number; render: (d: number) => React.ReactNode }[] = [
  { dur: 300, render: (d) => <S1_MeetSarah    durationInFrames={d} /> }, // 10s · CHARACTER (you, the manager)
  { dur: 330, render: (d) => <S2_MondayMorning durationInFrames={d} /> }, // 11s · PROBLEM external · standards in heads
  { dur: 330, render: (d) => <S3_PressureAbove durationInFrames={d} /> }, // 11s · PROBLEM internal · AI complication
  { dur: 360, render: (d) => <S4_SilosAround  durationInFrames={d} /> }, // 12s · PROBLEM philosophical · silos + drift
  { dur: 330, render: (d) => <S5_TheBreak     durationInFrames={d} /> }, // 11s · GUIDE · LIZA appears
  { dur: 270, render: (d) => <S6_TheGuide     durationInFrames={d} /> }, // 9s  · PLAN · 3 moves
  { dur: 360, render: (d) => <S7_ThePlan      durationInFrames={d} /> }, // 12s · STAKES · with vs without
  { dur: 360, render: (d) => <S8_NewMonday    durationInFrames={d} /> }, // 12s · SUCCESS + CTA
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