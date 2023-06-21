import { readFileSync, existsSync } from 'fs';
import { Mower, validInstruction, validOrientation } from './Mower';

const debug: boolean = process.env.DEBUG === 'true';

const initGrid = (x: number, y: number): (Mower | null)[][] => {
    return new Array(x).fill(null).map(() => new Array(y).fill(null));
}

const main = () => {
    const fileName = process.argv[2];

    if (!fileName) {
        console.error('No filename provided, usage: npm start <filename>');
        process.exit(1);
    }

    if (!existsSync(fileName)) {
        console.error(`File ${fileName} does not exist`);
        process.exit(1);
    }

    const file = readFileSync(fileName, 'utf-8').replace(/\r/g, '');
    const lines = file.split('\n');

    if (lines.length < 3) {
        if (debug) console.log('Not enough information');
        return;
    }

    const gridDimensions: number[] = lines[0].split(' ').map((dimension) =>
        !isNaN(parseInt(dimension)) ? parseInt(dimension) + 1 : NaN
    );

    if (gridDimensions.length !== 2) {
        if (debug) console.log('Invalid grid dimensions input');
        return;
    }

    if (isNaN(gridDimensions[0]) || isNaN(gridDimensions[1])) {
        if (debug) console.log('Invalid grid dimensions input');
        return;
    }

    if (debug)
        console.log('Grid dimensions: ' + gridDimensions[0] + ' ' + gridDimensions[1])

    const grid = initGrid(gridDimensions[0], gridDimensions[1]);

    //2 lines
    //1st => mower coords and orientation
    //2nd => mower instructions

    let indexLine = 1;

    while (indexLine < lines.length) {
        //check if there are enough lines
        if (indexLine + 1 >= lines.length) {
            console.log('End of file reached, ' + indexLine);
            return;
        }

        const mowerX = parseInt(lines[indexLine].split(' ')[0]);
        const mowerY = parseInt(lines[indexLine].split(' ')[1]);

        if (isNaN(mowerX) || isNaN(mowerY)) {
            console.log('Invalid mower coordinates, ' + indexLine);
            continue;
        }

        const mowerOrientationRaw: string = lines[indexLine].split(' ')[2];

        if (!validOrientation.includes(mowerOrientationRaw)) {
            console.log('Invalid mower orientation, ' + indexLine);
            continue;
        }

        const mowerOrientation = mowerOrientationRaw as 'N' | 'E' | 'S' | 'W';

        const mowerInstructions = lines[indexLine + 1].split('');

        if (!mowerInstructions.every((instruction) => validInstruction.includes(instruction))) {
            console.log('Invalid mower instructions, ' + indexLine);
            continue;
        }

        const mower = new Mower(mowerX, mowerY, mowerOrientation);

        if (!mower.init(grid)) {
            console.log('Invalid mower coordinates, ' + indexLine);
            continue;
        }

        mowerInstructions.forEach((instruction) => {
            mower.move(instruction, grid);
        });

        indexLine += 2;
    }

    grid.forEach((row) => {
        row.forEach((col) => {
            if (col !== null) {
                console.log(col.toString());
            }
        });
    });
}

main();