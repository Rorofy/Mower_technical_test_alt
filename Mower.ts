const validInstruction = ['G', 'D', 'A'];
const validOrientation = ['N', 'E', 'S', 'W'];

const debug : boolean = process.env.DEBUG === 'true';

class Mower {
    private coords: {
        x: number;
        y: number;
        orientation: 'N' | 'E' | 'S' | 'W';
    }

    constructor(x: number, y: number, orientation: 'N' | 'E' | 'S' | 'W') {
        this.coords = {
            x,
            y,
            orientation
        }
    }

    public toString(): string {
        return `${this.coords.x} ${this.coords.y} ${this.coords.orientation}`;
    }

    init(grid: (Mower | null)[][]): boolean {
        if (grid[this.coords.x][this.coords.y] === null) {
            if (debug) console.log('init : ' + this.toString());
            grid[this.coords.x][this.coords.y] = this;
            return true;
        }
        return false;
    }

    public move(instruction: string, grid: (Mower | null)[][]) {
        switch (instruction) {
            case 'G':
                this.turnLeft();
                break;
            case 'D':
                this.turnRight();
                break;
            case 'A':
                this.moveForward(grid);
                break;
            default:
                break;
        }

        if (debug) 
            console.log(`move : ${instruction} (${this.toString()})`)
    }

    private turnLeft() {
        switch (this.coords.orientation) {
            case 'N':
                this.coords.orientation = 'W';
                break;
            case 'E':
                this.coords.orientation = 'N';
                break;
            case 'S':
                this.coords.orientation = 'E';
                break;
            case 'W':
                this.coords.orientation = 'S';
                break;
            default:
                break;
        }
    }

    private turnRight() {
        switch (this.coords.orientation) {
            case 'N':
                this.coords.orientation = 'E';
                break;
            case 'E':
                this.coords.orientation = 'S';
                break;
            case 'S':
                this.coords.orientation = 'W';
                break;
            case 'W':
                this.coords.orientation = 'N';
                break;
            default:
                break;
        }
    }

    private moveForward(grid: (Mower | null)[][]) {
        switch (this.coords.orientation) {
            case 'N':
                if (this.coords.y + 1 < grid.length && grid[this.coords.x][this.coords.y + 1] === null) {
                    grid[this.coords.x][this.coords.y] = null;
                    this.coords.y += 1;
                    grid[this.coords.x][this.coords.y] = this;
                }
                break;
            case 'E':
                if (this.coords.x + 1 < grid.length && grid[this.coords.x + 1][this.coords.y] === null) {
                    grid[this.coords.x][this.coords.y] = null;
                    this.coords.x += 1;
                    grid[this.coords.x][this.coords.y] = this;
                }
                break;
            case 'S':
                if (this.coords.y - 1 >= 0 && grid[this.coords.x][this.coords.y - 1] === null) {
                    grid[this.coords.x][this.coords.y] = null;
                    this.coords.y -= 1;
                    grid[this.coords.x][this.coords.y] = this;
                }
                break;
            case 'W':
                if (this.coords.x - 1 >= 0 && grid[this.coords.x - 1][this.coords.y] === null) {
                    grid[this.coords.x][this.coords.y] = null;
                    this.coords.x -= 1;
                    grid[this.coords.x][this.coords.y] = this;
                }
                break;
            default:
                break;
        }
    }
}


export { Mower, validInstruction, validOrientation };