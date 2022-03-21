const grid = document.querySelector('#grid')
const up = document.querySelector('#up')
const down = document.querySelector('#down')
const left = document.querySelector('#left')
const right = document.querySelector('#right')
let botPos = {x:0, y:0, i:0}
let starPos1 = {x:0, y:0}
let starPos2 = {x:0, y:0}
let starPos3 = {x:0, y:0}
let nStars = 0
let level = 1

for (let row=0; row<10; row++){
  for (let col=0; col<10; col++){
    let dot = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    gsap.set(dot, {attr:{cx:5+col*10, cy:5+row*10, r:1, class:'dot'}})
    grid.appendChild(dot)
  }
}

start()
function start(){
  botPos = {x:0, y:0, i:0}
  
  for (let i=1; i<=3; i++){
    let starPos = eval('starPos'+i)
    starPos.x = gsap.utils.random(1, 9, 1) * 10
    starPos.y = gsap.utils.random(3*(i-1), (i<3)?i*3-1:9, 1) * 10
  }
  gsap.timeline()
    .set('svg', {opacity:1})
    .set('#star1', {...starPos1, transformOrigin:'50%'})
    .set('#star2', {...starPos2, transformOrigin:'50%'})
    .set('#star3', {...starPos3, transformOrigin:'50%'})    
    .to('text', {duration:0.4, opacity:0, scale:2, transformOrigin:'50%', ease:'back.in(3)'}, 0.5)
    .fromTo('.dot', {scale:0.5, rotate:0, opacity:0, svgOrigin:'50 50'}, {scale:1, opacity:1, stagger:{grid:[10,10],from:'center',amount:0.4}, ease:'back.out(3)'}, 1)
    .fromTo('#bot, .stars use', {opacity:0, scale:1},{opacity:1, stagger:0.05, ease:'expo'})
}

function move(t){
  gsap.fromTo(t, {attr:{fill:'#fff'}}, {attr:{fill:'#000'}, duration:0.2, ease:'power2.in', overwrite:'auto'})
  if (gsap.isTweening('#bot')) return;
  if (t == up && botPos.y>0){ botPos.y-=10; botPos.i-=10 }
  if (t == down && botPos.y<90){ botPos.y+=10; botPos.i+=10 }
  if (t == left && botPos.x>0){ botPos.x-=10; botPos.i-=1 }
  if (t == right && botPos.x<90){ botPos.x+=10; botPos.i+=1 }
  gsap.to('#bot', {duration:0.2, ease:'back', x:botPos.x, y:botPos.y})
  
  for (let i=1; i<=3; i++){
    const starPos = eval('starPos'+i)
    if ( botPos.x==starPos.x && botPos.y==starPos.y ){
      starPos.x = -1
      gsap.to('#star'+i, {scale:3, opacity:0})
      nStars++
      gsap.fromTo('.mouth', {attr:{d:'M3,6.8L4,6.8L6,6.8L7,6.8'}},{attr:{d:'M3,6L4,7L6,7L7,6'}, yoyo:true, repeat:1, ease:'expo.inOut', repeatDelay:0.2})
      gsap.to('.markers use', {attr:{fill:(i)=>(i+1<=nStars)?'#fff':'#000'}, onComplete:end})      
    }
  }
}

function end(){
  if (nStars==3){
    nStars = 0
    level++
    gsap.timeline({onComplete:start})
    .to('#bot', {opacity:0, ease:'expo.inOut'})
    .fromTo('.dot', {scale:1, svgOrigin:'50 50', opacity:1, rotate:0}, {rotate:(level%2==0)?-45:45, scale:0.6, opacity:0, stagger:{grid:[10,10],from:'center',amount:0.6}, ease:'back.inOut'}, '-=0.5')
    .to('.markers use', {attr:{fill:'#000'}, ease:'power2.inOut', stagger:-0.1})
    .fromTo('text', {scale:0, opacity:0, textContent:'LEVEL '+level},{scale:1, opacity:1, ease:'back.out(3)'})
    .set('#bot',  {x:0, y:0})
  }
}

up.onpointerup = down.onpointerup = 
left.onpointerup = right.onpointerup = (e)=> move(e.currentTarget)

window.onkeydown = (e)=> {
  if (e.keyCode){
    if (e.keyCode==38) move(up)
    if (e.keyCode==40) move(down)
    if (e.keyCode==37) move(left)
    if (e.keyCode==39) move(right)
  }
}
