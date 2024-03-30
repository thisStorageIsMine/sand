import { grainSettings } from "./config";

const createGrid = (cols: number, rows: number) => {
    const grid = [];

    for (let i = 0; i < cols; i++) {
        const row = new Array(rows).fill(0);

        grid.push(row)
    }

    return grid;
}

const drawRect = (ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: number,
) => {


    ctx.fillStyle = (color > 0) ? `hsl(${color},100%, 50%)` : "#000"; // Изменить это на hue-rotate
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.closePath();
    ctx.fill();

}

const fillGrid = (grid: number[][], hue: number) => {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            const randomNumber = Math.floor(Math.random() * 100) + 1

            grid[i][j] = (randomNumber <= 30) ? hue : 0;
        }
    }

    return grid;
}


export { createGrid };
export { drawRect };
export { fillGrid }