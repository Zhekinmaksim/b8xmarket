# B8X demo: analysis beta

Review recording: `output/demo/b8x-demo.mp4`, 82.2 seconds, 1440 x 1000, English captions burned in. Matching subtitles: `output/demo/b8x-demo.en.srt`. These local review files are intentionally not published by Vercel. Audio is not included because no authenticated Suno session or supplied track was available. This is a product review recording, not the final submitted video.

Record the deployed application at 1440 x 1000. The video uses English captions, actual requests and sample inputs. Do not add trading footage, fabricated notifications or investment-performance graphics.

1. Open the catalogue. Caption: B8X Market. Four categories, editable inputs, and results you can inspect.
2. Point to read-only scope. Caption: This build runs free, read-only analysis. It does not request wallet permissions.
3. Run the sample grid. Show the cost rejection. Change levels from 12 to 5 and rerun; show the change in the calculated result.
4. Run LP rebalancing. Show range bounds and move cost. Explain that fees are a supplied scenario and no position is changed.
5. Run Yield optimisation. Show the route excluded for liquidity/lock constraints.
6. Run Health factor. Increase the price shock from 20% to 40% and show the changed decision.
7. Select the live PancakeSwap price for grid analysis. Show the mainnet block, pool and provenance. Range bounds stay as entered, so an outside-range result is valid.
8. Download the JSON. Show history and the public URL.

The recording automation is in `scripts/record-demo.js`. Captions are an editorial overlay; all calculations are real API responses. No human comparison or paid hiring is shown.

## Music direction for Suno

Instrumental only. Restrained electronic product-demo soundtrack, 112 BPM, clean bass pulse, light percussion, subtle synth sequence. Confident and calm, with space for narration. No vocals, no lyrics, no dramatic drops. Roughly 100 seconds with a clean ending.

Music has not been generated or licensed through this repository. Add a track the team has permission to publish. Do not describe the video as having Suno music until that audio exists.
