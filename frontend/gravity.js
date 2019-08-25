import  { delay } from "./util";
import { id } from "./main";

const length = 400;
const initial_radius = 100;
export const radius = 10;
const coeff = 40000;
const repulsion = 100;
const interval = 0.01;
const cycles = 1000;
const time = 2;
const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");
    ctx.font = "16px Courier New";
const half = length/2;

let num;
export let bowls = [];
let players = [];
let ranks = [];

canvas.width = length;
canvas.height = length;

export function clear_board() {
  ctx.clearRect(0, 0, length, length);
}

export function draw_line(x1, y1, x2, y2) {
  let angle = Math.atan2(y2-y1, x2-x1);
  let r = Math.sqrt((y2-y1)*(y2-y1) + (x2-x1)*(x2-x1));
  let headlength = 0.2*r;
  let gap = Math.PI/6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x2 - headlength * Math.cos(angle - gap), y2 - headlength * Math.sin(angle - gap));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headlength * Math.cos(angle + gap), y2 - headlength * Math.sin(angle + gap));
  ctx.stroke();
}

function draw(player) {
  ctx.fillStyle = (player == id) ? "green" : "red";

  const bowl = bowls[player];

  let x = bowl.x;
  let y = bowl.y;
  ctx.beginPath();
  ctx.moveTo(x+radius, y);
  ctx.arc(x, y, radius, 0, 2*Math.PI);
  ctx.fill();

  ctx.fillText(bowls[player].id, x + radius, y - radius);
}

export function draw_all() {
  for (let i = 0; i < num; ++i) {
    draw(players[i]);
  }
}

export function create_players(names) {
  num = names.length;
  bowls = [];
  players = [];
  ranks = [];
  clear_board();
  // ctx.beginPath();
  for (let player = 0; player < 8; player++)
  {
    if(player < num){
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
      ranks.push(player);
      document.getElementById(`p${player + 1}`).innerText = `${names[player]} [A]`;
    } else{
        document.getElementById(`p${player + 1}`).innerText = `Waiting...`;
    }
  }

  draw_all();
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

function out_of_bounds(i) {
  let player = players[i];
    let bowl = bowls[player];
    if (bowl.x + radius < 0 || bowl.x - radius > length
        || bowl.y + radius < 0 || bowl.y - radius > length)
    {
      document.getElementById(`p${player + 1}`).innerText = `${bowl.id} [D]`;
      players.splice(i, 1);
      bowl.in = false;
      ranks[player] = num;
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
        other.vy += bowlVDotDirection * direction_y;
      }

      if (otherVDotDirection < 0) {
        other.vx -= otherVDotDirection * direction_x;
        other.vy -= otherVDotDirection * direction_y;
        bowl.vx += otherVDotDirection * direction_x;
        bowl.vy += otherVDotDirection * direction_y;
      }
    });
}

function iterate() {
  gravity();
  clear_board();
  // ctx.beginPath();
  for (let i = num - 1; i >= 0; i--)
  {
    let player = players[i];
    let bowl = bowls[player];
    // Location calculations s = ut + 1/2 at^2
    bowl.x += bowl.vx*interval + 0.5*bowl.fx*interval*interval;
    bowl.y += bowl.vy*interval + 0.5*bowl.fy*interval*interval;
    // Out of bounds calculations
    if (out_of_bounds(i))
    {
        gravity();
        continue;
    }
    // Velocity calculations v = u + ft
    bowl.vx += bowl.fx*interval;
    bowl.vy += bowl.fy*interval;
  }

  draw_all()
}

export async function move(vectors) {
  console.log(vectors);
    for (let i = 0; i < num; i++)
    {
      let player = players[i];
      let bowl = bowls[player];
      let [vx, vy] = vectors[player]
      bowl.vx += vx;
      bowl.vy += vy;
    }
    for (let cycle = 0; cycle < cycles; cycle++)
    {
      iterate();
      await delay(time * 1000 / cycles);
    }
}

export async function rank() {
  let sorted = [];
  for (let i = 0; i < num; i++) {
    let player = players[i];
    let bowl = bowls[player];
    let d2 = (bowl.x-half)*(bowl.x-half) + (bowl.y-half)*(bowl.y-half);
    sorted.push({player, d2});
  }
  sorted.sort(function(a, b) {
    return b.d2 - a.d2;
  });
  console.log(sorted)
  for (let i = 0; i < num; i++) {
    let player = sorted[i].player;
    ranks[player] = i+1;
  }
  return ranks;
}