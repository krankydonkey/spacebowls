const width = 400;
const height = 400;
const coeff = 1;
const interval = 0.1;
const cycles = 20;

let id;
let num;
let bowls;

function create_players(num_players) {
    num = num_players;
    let players = [];
    for (let player = 0; player < num; player++) {
        let x = 0;
        let y = 0;
        players.push({
            x : x,
            y : y
        });
    }
}

function forces(vectors) {
    for (let cycle = 0; cycle < cycles; cycle++) {
        for (let player = 0; player < num; player++) {
            let bowl = bowls[player];
            let sum_x;
            let sum_y;
            let sum_z;
            for (let other = 0; other < num; other++) {
                let other_bowl = bowls[other];
                if (other == player) {
                    continue;
                }
                let diff_x = other.x - bowl.x;
                let diff_y = other.y - bowl.y;
                let r2 = diff_x*diff_x + diff_y*diff_y;
                sum_x += diff_x/r2;
                sum_y += diff_y/r2;
            }
        }
    }
}