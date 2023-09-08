export function makeRound(path) {
    const rects: {position: {x: number, y:number}, sideLength: number}[] = [];

    let index = 0;

    // create poisition data
    while (index < path.length) {
        const rect: any = {
            position: {
                x: undefined,
                y: undefined,
            },
            sideLength: undefined,
        }
        if (path[index] === "M") {
            index+=2;
            let sub = path.substring(index);
            const x = sub.substring(0, sub.indexOf(','));
            rect.position.x = parseFloat(x);
            index+= x.length+1;
            sub = path.substring(index);
            const y = sub.substring(0, sub.indexOf(' '));
            rect.position.y = parseFloat(y);
            index+= y.length+3
            sub = path.substring(index);
            const sL = sub.substring(0, sub.indexOf(','));
            rect.sideLength = parseFloat(sL);
            index+= sL.length+1;
            rects.push(rect);
            while (path[index] !== "z") index++;
            index+=2;
        }
    }
    // console.log(rects);
    let width = 0;
    let height = 0;
    const sideLength = rects[0].sideLength;
    for (const r of rects) {
        if (r.position.x > width) width = r.position.x;
        if (r.position.y > height) height = r.position.y;
    }

    // create boolean grid
    const square: boolean[][] = [];
    for (let i = 0; i <= width/sideLength; i++) {
        square[i] = [];
        for (let j = 0; j <= height/sideLength; j++) {
            square[i][j] = false;
        }
    }
    const corners: null|any[][] = [...square]

    for (const r of rects) {
        square[r.position.x/sideLength][r.position.y/sideLength] = true;
    }

    // create corner-data grid
    for (let x = 0; x < square.length; x++) {
        const col = square[x];
        for (let y = 0; y < col.length; y++) {
            if (square[x][y] === false) {corners[x][y] = null; continue;}

            const cornerMap = {
                topLeft: cornerCheck(x, y, "tl"),
                topRight: cornerCheck(x, y, "tr"),
                bottomLeft: cornerCheck(x, y, "bl"),
                bottomRight: cornerCheck(x, y, "br"),
            }

            corners[x][y] = cornerMap;

        }   
    }



    function cornerCheck(x, y, corner) {
        switch (corner) {
            case "tl": {
                if (square[x-1]) {
                    const col = square[x-1]
                    if (col[y] || col[y-1]) return false;
                }
                if (square[x][y-1]) return false;
                return true;
            }
            case "tr": {
                if (square[x+1]) {
                    const col = square[x+1]
                    if (col[y] || col[y-1]) return false;
                }
                if (square[x][y-1]) return false;
                return true;
            }
            case "bl": {
                if (square[x-1]) {
                    const col = square[x-1]
                    if (col[y] || col[y+1]) return false;
                }
                if (square[x][y+1]) return false;
                return true;
            }
            case "br": {
                if (square[x+1]) {
                    const col = square[x+1]
                    if (col[y] || col[y+1]) return false;
                }
                if (square[x][y+1]) return false;
                return true;
            }
        }
    }


    // create svg path data
    const hsl = sideLength/2; // Half Side Length
    const qsl = sideLength/4; // Quarter Side Length
    const curveDist = qsl;
    let instructions = "";
    for (let x = 0; x < square.length; x++) {
        const col = square[x];
        for (let y = 0; y < col.length; y++) {
            const pixel = corners[x][y];
            // if (x === 20 && y == 13) console.log(pixel);
            if (!pixel) continue;
            let instruction = `M${x*sideLength+(hsl)},${y*sideLength}`;
            // top right
            if (pixel.topRight) {
                instruction+=`q${qsl+curveDist} ${qsl-curveDist},${hsl} ${hsl}`
                
            } else {
                instruction+=`h${hsl}v${hsl}`
            }
            // bottom right
            if (pixel.bottomRight) {
                instruction+=`q${-qsl+curveDist} ${qsl+curveDist},${-hsl} ${hsl}`
            } else {
                instruction+=`v${hsl}h${-hsl}`
            }
            // bottom left
            if (pixel.bottomLeft) {
                instruction+=`q${-qsl-curveDist} ${-qsl+curveDist},${-hsl} ${-hsl}`
            } else {
                instruction+=`h${-hsl}v${-hsl}`
            }
            // top left
            if (pixel.topLeft) {
                instruction+=`q${qsl-curveDist} ${-qsl-curveDist},${hsl} ${-hsl}`
            } else {
                instruction+=`v${-hsl}h${hsl}`
            }
            instructions+=(instruction);
        }
    }
    return instructions;
}
console.log(makeRound("M 0,0 l 37,0 0,37 -37,0 z M 37,0 l 37,0 0,37 -37,0 z M 74,0 l 37,0 0,37 -37,0 z M 111,0 l 37,0 0,37 -37,0 z M 148,0 l 37,0 0,37 -37,0 z M 185,0 l 37,0 0,37 -37,0 z M 222,0 l 37,0 0,37 -37,0 z M 370,0 l 37,0 0,37 -37,0 z M 444,0 l 37,0 0,37 -37,0 z M 481,0 l 37,0 0,37 -37,0 z M 592,0 l 37,0 0,37 -37,0 z M 666,0 l 37,0 0,37 -37,0 z M 703,0 l 37,0 0,37 -37,0 z M 740,0 l 37,0 0,37 -37,0 z M 814,0 l 37,0 0,37 -37,0 z M 851,0 l 37,0 0,37 -37,0 z M 888,0 l 37,0 0,37 -37,0 z M 925,0 l 37,0 0,37 -37,0 z M 962,0 l 37,0 0,37 -37,0 z M 999,0 l 37,0 0,37 -37,0 z M 1036,0 l 37,0 0,37 -37,0 z M 0,37 l 37,0 0,37 -37,0 z M 222,37 l 37,0 0,37 -37,0 z M 296,37 l 37,0 0,37 -37,0 z M 370,37 l 37,0 0,37 -37,0 z M 481,37 l 37,0 0,37 -37,0 z M 518,37 l 37,0 0,37 -37,0 z M 555,37 l 37,0 0,37 -37,0 z M 592,37 l 37,0 0,37 -37,0 z M 629,37 l 37,0 0,37 -37,0 z M 666,37 l 37,0 0,37 -37,0 z M 814,37 l 37,0 0,37 -37,0 z M 1036,37 l 37,0 0,37 -37,0 z M 0,74 l 37,0 0,37 -37,0 z M 74,74 l 37,0 0,37 -37,0 z M 111,74 l 37,0 0,37 -37,0 z M 148,74 l 37,0 0,37 -37,0 z M 222,74 l 37,0 0,37 -37,0 z M 444,74 l 37,0 0,37 -37,0 z M 518,74 l 37,0 0,37 -37,0 z M 703,74 l 37,0 0,37 -37,0 z M 740,74 l 37,0 0,37 -37,0 z M 814,74 l 37,0 0,37 -37,0 z M 888,74 l 37,0 0,37 -37,0 z M 925,74 l 37,0 0,37 -37,0 z M 962,74 l 37,0 0,37 -37,0 z M 1036,74 l 37,0 0,37 -37,0 z M 0,111 l 37,0 0,37 -37,0 z M 74,111 l 37,0 0,37 -37,0 z M 111,111 l 37,0 0,37 -37,0 z M 148,111 l 37,0 0,37 -37,0 z M 222,111 l 37,0 0,37 -37,0 z M 296,111 l 37,0 0,37 -37,0 z M 333,111 l 37,0 0,37 -37,0 z M 370,111 l 37,0 0,37 -37,0 z M 444,111 l 37,0 0,37 -37,0 z M 481,111 l 37,0 0,37 -37,0 z M 518,111 l 37,0 0,37 -37,0 z M 555,111 l 37,0 0,37 -37,0 z M 629,111 l 37,0 0,37 -37,0 z M 703,111 l 37,0 0,37 -37,0 z M 814,111 l 37,0 0,37 -37,0 z M 888,111 l 37,0 0,37 -37,0 z M 925,111 l 37,0 0,37 -37,0 z M 962,111 l 37,0 0,37 -37,0 z M 1036,111 l 37,0 0,37 -37,0 z M 0,148 l 37,0 0,37 -37,0 z M 74,148 l 37,0 0,37 -37,0 z M 111,148 l 37,0 0,37 -37,0 z M 148,148 l 37,0 0,37 -37,0 z M 222,148 l 37,0 0,37 -37,0 z M 333,148 l 37,0 0,37 -37,0 z M 481,148 l 37,0 0,37 -37,0 z M 592,148 l 37,0 0,37 -37,0 z M 629,148 l 37,0 0,37 -37,0 z M 666,148 l 37,0 0,37 -37,0 z M 703,148 l 37,0 0,37 -37,0 z M 814,148 l 37,0 0,37 -37,0 z M 888,148 l 37,0 0,37 -37,0 z M 925,148 l 37,0 0,37 -37,0 z M 962,148 l 37,0 0,37 -37,0 z M 1036,148 l 37,0 0,37 -37,0 z M 0,185 l 37,0 0,37 -37,0 z M 222,185 l 37,0 0,37 -37,0 z M 296,185 l 37,0 0,37 -37,0 z M 333,185 l 37,0 0,37 -37,0 z M 407,185 l 37,0 0,37 -37,0 z M 444,185 l 37,0 0,37 -37,0 z M 518,185 l 37,0 0,37 -37,0 z M 555,185 l 37,0 0,37 -37,0 z M 740,185 l 37,0 0,37 -37,0 z M 814,185 l 37,0 0,37 -37,0 z M 1036,185 l 37,0 0,37 -37,0 z M 0,222 l 37,0 0,37 -37,0 z M 37,222 l 37,0 0,37 -37,0 z M 74,222 l 37,0 0,37 -37,0 z M 111,222 l 37,0 0,37 -37,0 z M 148,222 l 37,0 0,37 -37,0 z M 185,222 l 37,0 0,37 -37,0 z M 222,222 l 37,0 0,37 -37,0 z M 296,222 l 37,0 0,37 -37,0 z M 370,222 l 37,0 0,37 -37,0 z M 444,222 l 37,0 0,37 -37,0 z M 518,222 l 37,0 0,37 -37,0 z M 592,222 l 37,0 0,37 -37,0 z M 666,222 l 37,0 0,37 -37,0 z M 740,222 l 37,0 0,37 -37,0 z M 814,222 l 37,0 0,37 -37,0 z M 851,222 l 37,0 0,37 -37,0 z M 888,222 l 37,0 0,37 -37,0 z M 925,222 l 37,0 0,37 -37,0 z M 962,222 l 37,0 0,37 -37,0 z M 999,222 l 37,0 0,37 -37,0 z M 1036,222 l 37,0 0,37 -37,0 z M 333,259 l 37,0 0,37 -37,0 z M 370,259 l 37,0 0,37 -37,0 z M 407,259 l 37,0 0,37 -37,0 z M 518,259 l 37,0 0,37 -37,0 z M 592,259 l 37,0 0,37 -37,0 z M 666,259 l 37,0 0,37 -37,0 z M 703,259 l 37,0 0,37 -37,0 z M 0,296 l 37,0 0,37 -37,0 z M 37,296 l 37,0 0,37 -37,0 z M 74,296 l 37,0 0,37 -37,0 z M 111,296 l 37,0 0,37 -37,0 z M 148,296 l 37,0 0,37 -37,0 z M 222,296 l 37,0 0,37 -37,0 z M 259,296 l 37,0 0,37 -37,0 z M 296,296 l 37,0 0,37 -37,0 z M 333,296 l 37,0 0,37 -37,0 z M 407,296 l 37,0 0,37 -37,0 z M 444,296 l 37,0 0,37 -37,0 z M 481,296 l 37,0 0,37 -37,0 z M 629,296 l 37,0 0,37 -37,0 z M 740,296 l 37,0 0,37 -37,0 z M 777,296 l 37,0 0,37 -37,0 z M 851,296 l 37,0 0,37 -37,0 z M 925,296 l 37,0 0,37 -37,0 z M 999,296 l 37,0 0,37 -37,0 z M 37,333 l 37,0 0,37 -37,0 z M 74,333 l 37,0 0,37 -37,0 z M 296,333 l 37,0 0,37 -37,0 z M 370,333 l 37,0 0,37 -37,0 z M 444,333 l 37,0 0,37 -37,0 z M 481,333 l 37,0 0,37 -37,0 z M 629,333 l 37,0 0,37 -37,0 z M 666,333 l 37,0 0,37 -37,0 z M 703,333 l 37,0 0,37 -37,0 z M 740,333 l 37,0 0,37 -37,0 z M 777,333 l 37,0 0,37 -37,0 z M 814,333 l 37,0 0,37 -37,0 z M 851,333 l 37,0 0,37 -37,0 z M 888,333 l 37,0 0,37 -37,0 z M 1036,333 l 37,0 0,37 -37,0 z M 111,370 l 37,0 0,37 -37,0 z M 148,370 l 37,0 0,37 -37,0 z M 185,370 l 37,0 0,37 -37,0 z M 222,370 l 37,0 0,37 -37,0 z M 296,370 l 37,0 0,37 -37,0 z M 370,370 l 37,0 0,37 -37,0 z M 444,370 l 37,0 0,37 -37,0 z M 481,370 l 37,0 0,37 -37,0 z M 518,370 l 37,0 0,37 -37,0 z M 555,370 l 37,0 0,37 -37,0 z M 592,370 l 37,0 0,37 -37,0 z M 629,370 l 37,0 0,37 -37,0 z M 814,370 l 37,0 0,37 -37,0 z M 851,370 l 37,0 0,37 -37,0 z M 37,407 l 37,0 0,37 -37,0 z M 74,407 l 37,0 0,37 -37,0 z M 111,407 l 37,0 0,37 -37,0 z M 259,407 l 37,0 0,37 -37,0 z M 518,407 l 37,0 0,37 -37,0 z M 555,407 l 37,0 0,37 -37,0 z M 592,407 l 37,0 0,37 -37,0 z M 703,407 l 37,0 0,37 -37,0 z M 740,407 l 37,0 0,37 -37,0 z M 777,407 l 37,0 0,37 -37,0 z M 851,407 l 37,0 0,37 -37,0 z M 925,407 l 37,0 0,37 -37,0 z M 999,407 l 37,0 0,37 -37,0 z M 74,444 l 37,0 0,37 -37,0 z M 148,444 l 37,0 0,37 -37,0 z M 185,444 l 37,0 0,37 -37,0 z M 222,444 l 37,0 0,37 -37,0 z M 296,444 l 37,0 0,37 -37,0 z M 333,444 l 37,0 0,37 -37,0 z M 370,444 l 37,0 0,37 -37,0 z M 444,444 l 37,0 0,37 -37,0 z M 481,444 l 37,0 0,37 -37,0 z M 518,444 l 37,0 0,37 -37,0 z M 555,444 l 37,0 0,37 -37,0 z M 592,444 l 37,0 0,37 -37,0 z M 629,444 l 37,0 0,37 -37,0 z M 703,444 l 37,0 0,37 -37,0 z M 925,444 l 37,0 0,37 -37,0 z M 962,444 l 37,0 0,37 -37,0 z M 37,481 l 37,0 0,37 -37,0 z M 74,481 l 37,0 0,37 -37,0 z M 185,481 l 37,0 0,37 -37,0 z M 407,481 l 37,0 0,37 -37,0 z M 703,481 l 37,0 0,37 -37,0 z M 740,481 l 37,0 0,37 -37,0 z M 777,481 l 37,0 0,37 -37,0 z M 814,481 l 37,0 0,37 -37,0 z M 851,481 l 37,0 0,37 -37,0 z M 888,481 l 37,0 0,37 -37,0 z M 1036,481 l 37,0 0,37 -37,0 z M 0,518 l 37,0 0,37 -37,0 z M 37,518 l 37,0 0,37 -37,0 z M 74,518 l 37,0 0,37 -37,0 z M 148,518 l 37,0 0,37 -37,0 z M 222,518 l 37,0 0,37 -37,0 z M 333,518 l 37,0 0,37 -37,0 z M 444,518 l 37,0 0,37 -37,0 z M 518,518 l 37,0 0,37 -37,0 z M 555,518 l 37,0 0,37 -37,0 z M 740,518 l 37,0 0,37 -37,0 z M 814,518 l 37,0 0,37 -37,0 z M 851,518 l 37,0 0,37 -37,0 z M 925,518 l 37,0 0,37 -37,0 z M 962,518 l 37,0 0,37 -37,0 z M 0,555 l 37,0 0,37 -37,0 z M 148,555 l 37,0 0,37 -37,0 z M 259,555 l 37,0 0,37 -37,0 z M 296,555 l 37,0 0,37 -37,0 z M 333,555 l 37,0 0,37 -37,0 z M 407,555 l 37,0 0,37 -37,0 z M 444,555 l 37,0 0,37 -37,0 z M 555,555 l 37,0 0,37 -37,0 z M 592,555 l 37,0 0,37 -37,0 z M 703,555 l 37,0 0,37 -37,0 z M 740,555 l 37,0 0,37 -37,0 z M 777,555 l 37,0 0,37 -37,0 z M 888,555 l 37,0 0,37 -37,0 z M 999,555 l 37,0 0,37 -37,0 z M 37,592 l 37,0 0,37 -37,0 z M 74,592 l 37,0 0,37 -37,0 z M 148,592 l 37,0 0,37 -37,0 z M 222,592 l 37,0 0,37 -37,0 z M 296,592 l 37,0 0,37 -37,0 z M 481,592 l 37,0 0,37 -37,0 z M 518,592 l 37,0 0,37 -37,0 z M 555,592 l 37,0 0,37 -37,0 z M 592,592 l 37,0 0,37 -37,0 z M 629,592 l 37,0 0,37 -37,0 z M 703,592 l 37,0 0,37 -37,0 z M 925,592 l 37,0 0,37 -37,0 z M 962,592 l 37,0 0,37 -37,0 z M 0,629 l 37,0 0,37 -37,0 z M 37,629 l 37,0 0,37 -37,0 z M 296,629 l 37,0 0,37 -37,0 z M 333,629 l 37,0 0,37 -37,0 z M 370,629 l 37,0 0,37 -37,0 z M 407,629 l 37,0 0,37 -37,0 z M 592,629 l 37,0 0,37 -37,0 z M 666,629 l 37,0 0,37 -37,0 z M 703,629 l 37,0 0,37 -37,0 z M 740,629 l 37,0 0,37 -37,0 z M 777,629 l 37,0 0,37 -37,0 z M 814,629 l 37,0 0,37 -37,0 z M 851,629 l 37,0 0,37 -37,0 z M 888,629 l 37,0 0,37 -37,0 z M 962,629 l 37,0 0,37 -37,0 z M 1036,629 l 37,0 0,37 -37,0 z M 0,666 l 37,0 0,37 -37,0 z M 74,666 l 37,0 0,37 -37,0 z M 111,666 l 37,0 0,37 -37,0 z M 222,666 l 37,0 0,37 -37,0 z M 259,666 l 37,0 0,37 -37,0 z M 333,666 l 37,0 0,37 -37,0 z M 555,666 l 37,0 0,37 -37,0 z M 740,666 l 37,0 0,37 -37,0 z M 851,666 l 37,0 0,37 -37,0 z M 962,666 l 37,0 0,37 -37,0 z M 0,703 l 37,0 0,37 -37,0 z M 74,703 l 37,0 0,37 -37,0 z M 296,703 l 37,0 0,37 -37,0 z M 333,703 l 37,0 0,37 -37,0 z M 370,703 l 37,0 0,37 -37,0 z M 444,703 l 37,0 0,37 -37,0 z M 518,703 l 37,0 0,37 -37,0 z M 592,703 l 37,0 0,37 -37,0 z M 666,703 l 37,0 0,37 -37,0 z M 851,703 l 37,0 0,37 -37,0 z M 888,703 l 37,0 0,37 -37,0 z M 999,703 l 37,0 0,37 -37,0 z M 0,740 l 37,0 0,37 -37,0 z M 111,740 l 37,0 0,37 -37,0 z M 148,740 l 37,0 0,37 -37,0 z M 222,740 l 37,0 0,37 -37,0 z M 296,740 l 37,0 0,37 -37,0 z M 370,740 l 37,0 0,37 -37,0 z M 444,740 l 37,0 0,37 -37,0 z M 481,740 l 37,0 0,37 -37,0 z M 518,740 l 37,0 0,37 -37,0 z M 629,740 l 37,0 0,37 -37,0 z M 666,740 l 37,0 0,37 -37,0 z M 703,740 l 37,0 0,37 -37,0 z M 740,740 l 37,0 0,37 -37,0 z M 777,740 l 37,0 0,37 -37,0 z M 814,740 l 37,0 0,37 -37,0 z M 851,740 l 37,0 0,37 -37,0 z M 888,740 l 37,0 0,37 -37,0 z M 962,740 l 37,0 0,37 -37,0 z M 999,740 l 37,0 0,37 -37,0 z M 1036,740 l 37,0 0,37 -37,0 z M 296,777 l 37,0 0,37 -37,0 z M 407,777 l 37,0 0,37 -37,0 z M 518,777 l 37,0 0,37 -37,0 z M 592,777 l 37,0 0,37 -37,0 z M 629,777 l 37,0 0,37 -37,0 z M 740,777 l 37,0 0,37 -37,0 z M 888,777 l 37,0 0,37 -37,0 z M 925,777 l 37,0 0,37 -37,0 z M 962,777 l 37,0 0,37 -37,0 z M 999,777 l 37,0 0,37 -37,0 z M 1036,777 l 37,0 0,37 -37,0 z M 0,814 l 37,0 0,37 -37,0 z M 37,814 l 37,0 0,37 -37,0 z M 74,814 l 37,0 0,37 -37,0 z M 111,814 l 37,0 0,37 -37,0 z M 148,814 l 37,0 0,37 -37,0 z M 185,814 l 37,0 0,37 -37,0 z M 222,814 l 37,0 0,37 -37,0 z M 296,814 l 37,0 0,37 -37,0 z M 333,814 l 37,0 0,37 -37,0 z M 370,814 l 37,0 0,37 -37,0 z M 481,814 l 37,0 0,37 -37,0 z M 555,814 l 37,0 0,37 -37,0 z M 592,814 l 37,0 0,37 -37,0 z M 666,814 l 37,0 0,37 -37,0 z M 703,814 l 37,0 0,37 -37,0 z M 740,814 l 37,0 0,37 -37,0 z M 814,814 l 37,0 0,37 -37,0 z M 888,814 l 37,0 0,37 -37,0 z M 925,814 l 37,0 0,37 -37,0 z M 962,814 l 37,0 0,37 -37,0 z M 0,851 l 37,0 0,37 -37,0 z M 222,851 l 37,0 0,37 -37,0 z M 370,851 l 37,0 0,37 -37,0 z M 407,851 l 37,0 0,37 -37,0 z M 518,851 l 37,0 0,37 -37,0 z M 555,851 l 37,0 0,37 -37,0 z M 666,851 l 37,0 0,37 -37,0 z M 703,851 l 37,0 0,37 -37,0 z M 740,851 l 37,0 0,37 -37,0 z M 888,851 l 37,0 0,37 -37,0 z M 999,851 l 37,0 0,37 -37,0 z M 0,888 l 37,0 0,37 -37,0 z M 74,888 l 37,0 0,37 -37,0 z M 111,888 l 37,0 0,37 -37,0 z M 148,888 l 37,0 0,37 -37,0 z M 222,888 l 37,0 0,37 -37,0 z M 296,888 l 37,0 0,37 -37,0 z M 333,888 l 37,0 0,37 -37,0 z M 407,888 l 37,0 0,37 -37,0 z M 444,888 l 37,0 0,37 -37,0 z M 481,888 l 37,0 0,37 -37,0 z M 518,888 l 37,0 0,37 -37,0 z M 629,888 l 37,0 0,37 -37,0 z M 740,888 l 37,0 0,37 -37,0 z M 777,888 l 37,0 0,37 -37,0 z M 814,888 l 37,0 0,37 -37,0 z M 851,888 l 37,0 0,37 -37,0 z M 888,888 l 37,0 0,37 -37,0 z M 962,888 l 37,0 0,37 -37,0 z M 999,888 l 37,0 0,37 -37,0 z M 0,925 l 37,0 0,37 -37,0 z M 74,925 l 37,0 0,37 -37,0 z M 111,925 l 37,0 0,37 -37,0 z M 148,925 l 37,0 0,37 -37,0 z M 222,925 l 37,0 0,37 -37,0 z M 296,925 l 37,0 0,37 -37,0 z M 333,925 l 37,0 0,37 -37,0 z M 370,925 l 37,0 0,37 -37,0 z M 407,925 l 37,0 0,37 -37,0 z M 481,925 l 37,0 0,37 -37,0 z M 592,925 l 37,0 0,37 -37,0 z M 851,925 l 37,0 0,37 -37,0 z M 925,925 l 37,0 0,37 -37,0 z M 962,925 l 37,0 0,37 -37,0 z M 1036,925 l 37,0 0,37 -37,0 z M 0,962 l 37,0 0,37 -37,0 z M 74,962 l 37,0 0,37 -37,0 z M 111,962 l 37,0 0,37 -37,0 z M 148,962 l 37,0 0,37 -37,0 z M 222,962 l 37,0 0,37 -37,0 z M 296,962 l 37,0 0,37 -37,0 z M 333,962 l 37,0 0,37 -37,0 z M 370,962 l 37,0 0,37 -37,0 z M 444,962 l 37,0 0,37 -37,0 z M 555,962 l 37,0 0,37 -37,0 z M 592,962 l 37,0 0,37 -37,0 z M 666,962 l 37,0 0,37 -37,0 z M 703,962 l 37,0 0,37 -37,0 z M 777,962 l 37,0 0,37 -37,0 z M 814,962 l 37,0 0,37 -37,0 z M 851,962 l 37,0 0,37 -37,0 z M 888,962 l 37,0 0,37 -37,0 z M 925,962 l 37,0 0,37 -37,0 z M 962,962 l 37,0 0,37 -37,0 z M 999,962 l 37,0 0,37 -37,0 z M 0,999 l 37,0 0,37 -37,0 z M 222,999 l 37,0 0,37 -37,0 z M 296,999 l 37,0 0,37 -37,0 z M 407,999 l 37,0 0,37 -37,0 z M 444,999 l 37,0 0,37 -37,0 z M 592,999 l 37,0 0,37 -37,0 z M 666,999 l 37,0 0,37 -37,0 z M 703,999 l 37,0 0,37 -37,0 z M 740,999 l 37,0 0,37 -37,0 z M 777,999 l 37,0 0,37 -37,0 z M 888,999 l 37,0 0,37 -37,0 z M 925,999 l 37,0 0,37 -37,0 z M 999,999 l 37,0 0,37 -37,0 z M 0,1036 l 37,0 0,37 -37,0 z M 37,1036 l 37,0 0,37 -37,0 z M 74,1036 l 37,0 0,37 -37,0 z M 111,1036 l 37,0 0,37 -37,0 z M 148,1036 l 37,0 0,37 -37,0 z M 185,1036 l 37,0 0,37 -37,0 z M 222,1036 l 37,0 0,37 -37,0 z M 296,1036 l 37,0 0,37 -37,0 z M 333,1036 l 37,0 0,37 -37,0 z M 370,1036 l 37,0 0,37 -37,0 z M 444,1036 l 37,0 0,37 -37,0 z M 481,1036 l 37,0 0,37 -37,0 z M 518,1036 l 37,0 0,37 -37,0 z M 629,1036 l 37,0 0,37 -37,0 z M 703,1036 l 37,0 0,37 -37,0 z M 814,1036 l 37,0 0,37 -37,0 z M 888,1036 l 37,0 0,37 -37,0 z M 925,1036 l 37,0 0,37 -37,0 z M 962,1036 l 37,0 0,37 -37,0 z "));