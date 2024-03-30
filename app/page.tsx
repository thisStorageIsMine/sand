"use client"

import { useEffect, useRef, useState } from 'react';
import { createGrid, drawRect, fillGrid } from './utilities/utils'
import { grainSettings } from './utilities/config'

export default function Home() {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grid = useRef<number[][]>([[]]);
  const intervalID = useRef<NodeJS.Timeout | null>(null);
  let hueRotate = 10;
  // drawing a grid
  const draw = () => {

    const ctx = (canvasRef.current) && canvasRef.current.getContext("2d");
    if (!ctx) return;

    const cols = canvasRef.current.height / grainSettings.size;
    const rows = canvasRef.current.width / grainSettings.size;
    if (!cols && !rows) return;



    if (grid.current[0].length === 0) {
      grid.current = createGrid(cols, rows);
      // grid.current = fillGrid(grid.current, hueRotate);
    }



    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        drawRect(ctx, j * grainSettings.size, i * grainSettings.size, grainSettings.size, grid.current[i][j]);
      }
    }

    const nextGrid: number[][] = createGrid(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const state = grid.current[i][j];
        if (state > 0) {
          if (nextGrid[i + 1] === undefined) {
            nextGrid[i][j] = grid.current[i][j];
            continue
          };

          const randomSide = ((Math.random() * 1) < 0.5) ? -1 : 1

          const below = grid.current[i + 1][j];
          const belowA = grid.current[i + 1][j - randomSide];
          const belowB = grid.current[i + 1][j + randomSide];
          const thisCellColor = grid.current[i][j]

          if (below === 0) { // Down
            nextGrid[i][j] = 0;
            nextGrid[i + 1][j] = thisCellColor;
          } else if (belowA === 0) {    // Left || right
            nextGrid[i][j] = 0;
            nextGrid[i + 1][j - randomSide] = thisCellColor;
          } else if (belowB === 0) {  // Left || right
            nextGrid[i][j] = 0;
            nextGrid[i + 1][j + randomSide] = thisCellColor;
          } else if (grid.current[i + 1][j] > 0) { // If down if filled
            nextGrid[i][j] = thisCellColor;
          }
        }
      }
    }


    hueRotate = (hueRotate + 1 > 360) ? 10 : hueRotate + 1;
    grid.current = nextGrid;
    requestAnimationFrame(draw);
  }
  // end of grid drawing
  useEffect(draw, [canvasRef]);


  useEffect(() => {
  }, [])

  const spawnGrain = (mouseCol: number, mouseRow: number) => {
    let matrix = 5;
    const extand = Math.floor(matrix / 2);

    for (let i = -extand; i < extand; i++) {
      for (let j = -extand; j < extand; j++) {
        let col = mouseCol + i;
        let row = mouseRow + j;

        if (Math.random() > 0.5) continue;
        grid.current[col][row] = hueRotate;
      }
    }

  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const col = Math.floor((e.clientY - rect.y) / grainSettings.size);
    const row = Math.floor((e.clientX - rect.x) / grainSettings.size);

    spawnGrain(col, row);




    setIsMouseDown(true);
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();

    if (!rect || !isMouseDown) return;


    const col = Math.floor((e.clientY - rect.y) / grainSettings.size);
    const row = Math.floor((e.clientX - rect.x) / grainSettings.size);


    if (intervalID.current) clearInterval(intervalID.current)

    intervalID.current = setInterval(() => {
      spawnGrain(col, row);
    }, 5)


    spawnGrain(col, row);

  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsMouseDown(false);
    if (intervalID.current) clearInterval(intervalID.current);
  }



  return (
    <main className='h-screen grid place-items-center'>
      <canvas className='border-2 border-white'
        width={600}
        height={800}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        ref={canvasRef}></canvas>
    </main>
  );
}
