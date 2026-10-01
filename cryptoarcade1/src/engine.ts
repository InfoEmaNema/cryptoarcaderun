export type Board = number[][];
export const SIZE=8;
export const TYPES=['btc','eth','doge','usdt','bnb','xrp','sol','ltc'];
export const unlockedTypes=(level:number)=>Math.min(4+level,TYPES.length);
const rand=(n:number)=>Math.floor(Math.random()*n);
export function findMatches(board:Board){
 const found=new Set<string>();
 for(let y=0;y<SIZE;y++){let x=0;while(x<SIZE){const t=board[y][x];if(t<0){x++;continue}let e=x+1;while(e<SIZE&&board[y][e]===t)e++;if(e-x>=3)for(let i=x;i<e;i++)found.add(`${i},${y}`);x=e}}
 for(let x=0;x<SIZE;x++){let y=0;while(y<SIZE){const t=board[y][x];if(t<0){y++;continue}let e=y+1;while(e<SIZE&&board[e][x]===t)e++;if(e-y>=3)for(let i=y;i<e;i++)found.add(`${x},${i}`);y=e}}
 return [...found].map(v=>v.split(',').map(Number) as [number,number]);
}
export type Move=[[number,number],[number,number]];
export function findValidMove(board:Board):Move|null{for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++)for(const [dx,dy] of [[1,0],[0,1]]){const nx=x+dx,ny=y+dy;if(nx>=SIZE||ny>=SIZE)continue;if(board[y][x]===-2||board[y][x]===-3||board[ny][nx]===-2||board[ny][nx]===-3)return [[x,y],[nx,ny]];[board[y][x],board[ny][nx]]=[board[ny][nx],board[y][x]];const matches=findMatches(board),ok=matches.some(([mx,my])=>(mx===x&&my===y)||(mx===nx&&my===ny));[board[y][x],board[ny][nx]]=[board[ny][nx],board[y][x]];if(ok)return [[x,y],[nx,ny]]}return null}
export function hasMove(board:Board){return findValidMove(board)!==null}
export function makeBoard(types=5):Board{let b:Board=[];for(let attempt=0;attempt<100;attempt++){b=Array.from({length:SIZE},()=>Array<number>(SIZE).fill(-1));for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){let t:number;do{t=rand(types)}while((x>1&&b[y][x-1]===t&&b[y][x-2]===t)||(y>1&&b[y-1][x]===t&&b[y-2][x]===t));b[y][x]=t}if(!findMatches(b).length&&hasMove(b))return b}return b}
export function reshuffleIfStuck(board:Board,types=5){if(hasMove(board))return false;const fresh=makeBoard(types);for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++)board[y][x]=fresh[y][x];return true}
export function swap(board:Board,a:[number,number],b:[number,number]){const [x,y]=a,[u,v]=b;if(Math.abs(x-u)+Math.abs(y-v)!==1)return false;const first=board[y][x],second=board[v][u];[board[y][x],board[v][u]]=[second,first];if(first===-2||first===-3){board[v][u]=first===-2?-4:-5;return true}if(second===-2||second===-3){board[y][x]=second===-2?-4:-5;return true}const matches=findMatches(board),valid=matches.some(([mx,my])=>(mx===x&&my===y)||(mx===u&&my===v));if(!valid){[board[y][x],board[v][u]]=[board[v][u],board[y][x]];return false}return true}
export function resolve(board:Board,types=5){let score=0,chain=0;while(chain<30){const matches=findMatches(board);const activated=board.flatMap((row,y)=>row.flatMap((v,x)=>(v===-4||v===-5)?[[x,y] as [number,number]]:[]));if(!matches.length&&!activated.length)break;chain++;const clear=new Set([...matches.map(([x,y])=>`${x},${y}`),...activated.map(([x,y])=>`${x},${y}`)]);const special=new Map<string,number>();const groups=new Map<number,[number,number][]>();for(const [x,y] of matches){const t=board[y][x],group=groups.get(t)??[];group.push([x,y]);groups.set(t,group)}for(const group of groups.values()){if(group.length>=5){const [x,y]=group[Math.floor(group.length/2)];special.set(`${x},${y}`,-3)}else if(group.length===4){const [x,y]=group[1];special.set(`${x},${y}`,-2)}}
 for(const k of [...clear]){const [x,y]=k.split(',').map(Number),t=board[y][x];if(t===-2||t===-4)for(let yy=Math.max(0,y-1);yy<=Math.min(7,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(7,x+1);xx++)clear.add(`${xx},${yy}`);if(t===-3||t===-5)for(let xx=0;xx<8;xx++)clear.add(`${xx},${y}`)}
 score+=(clear.size*30+(matches.length===4?120:matches.length>=5?300:0))*chain;for(const k of clear){const [x,y]=k.split(',').map(Number);board[y][x]=-1}for(const [k,t]of special){const [x,y]=k.split(',').map(Number);if(board[y][x]===-1)board[y][x]=t}
 for(let x=0;x<8;x++){const vals=board.map(r=>r[x]).filter(v=>v>=0||v<=-2);while(vals.length<8)vals.unshift(rand(types));for(let y=0;y<8;y++)board[y][x]=vals[y]}
 }reshuffleIfStuck(board,types);return {score,chain};}
export function advanceScore(score:number){return Math.floor(score/1500)+1}
export const bestScore=()=>Number(localStorage.getItem('ca-best')||0);
export const saveBest=(n:number)=>localStorage.setItem('ca-best',String(n));
