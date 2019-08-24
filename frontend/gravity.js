import  { delay } from "./util";

const length = 400;
const initial_radius = 100;
const radius = 10;
const coeff = 50000;
const repulsion = 10;
const interval = 0.0005;
const cycles = 5000;
const time = 2;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let num;
let bowls = [];
let players = [];

canvas.width = length;
canvas.height = length;

function clear_board() {
    ctx.clearRect(0, 0, length, length);
}

function draw(bowl) {
    let x = bowl.x;
    let y = bowl.y;
    ctx.moveTo(x+radius, y);
    ctx.arc(x, y, radius, 0, 2*Math.PI);
}

export function create_players(names) {
    num = names.length;
    bowls = [];
    players = [];
    clear_board();
    ctx.beginPath();
    for (let player = 0; player < num; player++)
    {
        let angle = 2*Math.PI*player/(num);
        let x = length/2 + initial_radius*Math.sin(angle);
        let y = length/2 - initial_radius*Math.cos(angle);
        let bowl =
        {
            id : names[player],
            x : x,
            y : y,
            vx : 0,
            vy : 0,
            fx : 0,
            fy : 0,
            in : true
        };
        bowls.push(bowl);
        players.push(player);
        draw(bowl);
    }
    ctx.fill();
}

export function set_id(player) {
    id = player;
}

function clear() {
    for (let i = 0; i < num; i++)
    {
        let player = players[i];
        let bowl = bowls[player];
        bowl.fx = 0;
        bowl.fy = 0;
    }
}

function out_of_bounds(player) {
    let bowl = bowls[player];
    if (bowl.x + radius < 0 || bowl.x - radius > length
        || bowl.y + radius < 0 || bowl.y - radius > length)
    {
        players.splice(player, 1);
        bowl.in = false;
        num--;
        return true;
    }
    else
    {
        return false;
    }
}

function gravity() {
    clear();
    const collisions = [];
    for (let i = 0; i < num; i++)
    {
        let player = players[i];
        let bowl = bowls[player];
        for (let j = 0; j < num; j++)
        {
            let opponent = players[j];
            let other = bowls[opponent];
            if (opponent >= player)
            {
                break;
            }
            let diff_x = other.x - bowl.x;
            let diff_y = other.y - bowl.y;
            let r2 = diff_x*diff_x + diff_y*diff_y;
            let r = Math.sqrt(r2);

            let f = r <= 2 * radius
            ? -(2 * radius - r) * repulsion
            : coeff / r2;

            let fx = f * diff_x/r;
            let fy = f * diff_y/r;

            bowl.fx += fx;
            bowl.fy += fy;
            other.fx -= fx;
            other.fy -= fy;

          if (r < 2 * radius) {
            collisions.push([i, j]);
          }
        }
    }

    collisions.forEach(([i, j]) => {
      const bowl = bowls[i];
      const other = bowls[j];

      const diff_x = other.x - bowl.x;
      const diff_y = other.y - bowl.y;

      const r = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

      const direction_x = diff_x / r;
      const direction_y = diff_y / r;

      const bowlVDotDirection = direction_x * bowl.vx + direction_y * bowl.vy;
      const otherVDotDirection = direction_x * other.vx + direction_y * other.vy;

      if (bowlVDotDirection > 0) {
        bowl.vx -= bowlVDotDirection * direction_x;
        bowl.vy -= bowlVDotDirection * direction_y;
        other.vx += bowlVDotDirection * direction_x;
        other.vy += bowlVDotDirection * direction_x;
      }

      if (otherVDotDirection < 0) {
        other.vx -= otherVDotDirection * direction_x;
        other.vy -= otherVDotDirection * direction_y;
        bowl.vx += otherVDotDirection * direction_x;
        bowl.vy += otherVDotDirection * direction_x;
      }
    });
}

function iterate() {
    gravity();
    clear_board();
    ctx.beginPath();
    for (let i = 0; i < num; i++)
    {
        let player = players[i];
        let bowl = bowls[player];
        // Location calculations s = ut + 1/2 at^2
        bowl.x += bowl.vx*interval + 0.5*bowl.fx*interval*interval;
        bowl.y += bowl.vy*interval + 0.5*bowl.fy*interval*interval;
        // Out of bounds calculations
        if (out_of_bounds(player))
        {
            gravity();
            continue;
        } else
        {
            draw(bowl);
        }
        // Velocity calculations v = u + ft
        bowl.vx += bowl.fx*interval;
        bowl.vy += bowl.fy*interval;
    }
    ctx.fill();
}

export async function move(vectors) {
    for (let i = 0; i < num; i++)
    {
        let player = players[i];
        let bowl = bowls[player];
        let vector = vectors[player]
        bowl.vx += vector.vx;
        bowl.vy += vector.vy;
    }
    for (let cycle = 0; cycle < cycles; cycle++)
    {
        iterate();
        await delay(time *1000 / cycles);
    }
}
