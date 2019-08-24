import  { delay } from "./util";

const width = 400;
const height = 400;
const initial_radius = 100;
const radius = 10;
const coeff = 50000;
const repulsive = 5000000;
const interval = 0.01;
const cycles = 5000;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let num;
let bowls = [];
let players = [];

canvas.width = width;
canvas.height = height;

function draw(bowl) {
    let x = bowl.x;
    let y = bowl.y;
    //console.log({ id: bowl.id, x, y });
    ctx.moveTo(x+radius, y);
    ctx.arc(x, y, radius, 0, 2*Math.PI);
}

export function create_players(names) {
    num = names.length;
    bowls = [];
    players = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let player = 0; player < num; player++)
    {
        let angle = 2*Math.PI*player/(num);
        let x = width/2 + initial_radius*Math.sin(angle);
        let y = height/2 - initial_radius*Math.cos(angle);
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
    ctx.stroke();
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
    if (bowl.x + radius < 0 || bowl.x - radius > width
        || bowl.y + radius < 0 || bowl.y - radius > height)
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
            let edge_dist = Math.max(0.1, r - 2 * radius);
            let den = Math.pow(edge_dist, 7);
            
            let fx = diff_x/r * (coeff/r2 - repulsive/den);
            let fy = diff_y/r * (coeff/r2 - repulsive/den);
            bowl.fx += fx;
            bowl.fy += fy;
            other.fx -= fx;
            other.fy -= fy;
        }
    }
}

function iterate() {
    gravity();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    ctx.stroke();
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
        await delay(1000 * interval);
    }
}