const width = 400;
const height = 400;
const initial_radius = 100;
const radius = 10;
const coeff = 1;
const interval = 0.1;
const cycles = 20;

let id;
let num;
let bowls = [];

function create_players(num_players) {
    num = num_players;
    for (let player = 0; player < num; player++)
    {
        let angle = 2*Math.PI*player/(num_players+1);
        let x = width/2 + initial_radius*Math.sin(angle);
        let y = height/2 + initial_radius*Math.cos(angle);
        bowls.push(
        {
            id : player,
            x : x,
            y : y,
            vx : 0,
            vy : 0,
            fx : 0,
            fy : 0,
        });
    }
}

function clear() {
    for (let player = 0; player < num; player++) {
        let bowl = bowls[player];
        bowl.fx = 0;
        bowl.fy = 0;
    }
}

function out_of_bounds(player) {
    let bowl = bowls[player];
    if (bowl.x + r < 0 || bowl.x - r > width
        || bowl.y + r < 0 || bowl.y - r > height) {
        return true;
    } else {
        bowls.splice(player, 1);
        return false;
    }
}

function gravity() {
    clear();
    for (let player = 0; player < num; player++)
    {
        let bowl = bowls[player];
        for (let other_id = 0; other_id < num; other_id++)
        {
            let other = bowls[other_id];
            if (other_id >= player)
            {
                break;
            }
            let diff_x = other.x - bowl.x;
            let diff_y = other.y - bowl.y;
            let r2 = diff_x*diff_x + diff_y*diff_y;
            let r = Math.sqrt(r2);
            let fx = diff_x/(r2*r);
            let fy = diff_y/(r2*r);
            bowl.fx += fx;
            bowl.fy += fy;
            other.fx -= fx;
            other.fy -= fy;
        }
    }

    function iterate() {
        gravity();
        for (let player = 0; player < num; player++) {
            let bowl = bowls[player];
            // Location calculations s = ut + 1/2 at^2
            bowl.x += bowl.vx*interval + 0.5*bowl.fx*interval*interval;
            bowl.y += bowl.vy*interval + 0.5*bowl.fy*interval*interval;
            // Out of bounds calculations
            if (out_of_bounds(bowl))
            {
                gravity();
                continue;
            }
            // Velocity calculations v = u + ft
            bowl.vx += bowl.fx*interval;
            bowl.vy += bowl.fy*interval;
        }
    }

    function move(vectors) {
        for (let player = 0; player < num; player++) {
            let bowl = bowls[player];
            let vector = vectors[player]
            bowl.vx += vector.vx;
            bowl.vy += vector.vy;
        }
        for (let cycle = 0; cycle < cycles; cycle++) {
            iterate();
        }
    }
}