import {Player} from './player.js';

const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// 簡易光照
scene.add(new THREE.AmbientLight(0x404040));
const dir = new THREE.DirectionalLight(0xffffff,1);
dir.position.set(1,2,3); scene.add(dir);

// 地板
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100,100),
  new THREE.MeshLambertMaterial({color:0x228B22})
);
floor.rotation.x = -Math.PI/2; scene.add(floor);

// 牆壁（迷宮 3×3）
const walls = [];
const wallGeo = new THREE.BoxGeometry(1,2,10);
const wallMat = new THREE.MeshLambertMaterial({color:0x8B4513});
for(let i=0;i<3;i++){
  for(let j=0;j<3;j++){
    if((i+j)%2){
      const w = new THREE.Mesh(wallGeo,wallMat);
      w.position.set(i*6-3,1,j*6-3);
      scene.add(w); walls.push(w);
    }
  }
}

// 玩家與控制
const player = new Player(camera, scene);

// 觸控搖桿
const joy = document.getElementById('joystick');
const stick = document.getElementById('stick');
const fireBtn = document.getElementById('fire');
let touchId, joyOrigin;
const joyRadius = 60;
joy.addEventListener('touchstart', e=>{
  touchId = e.changedTouches[0].identifier;
  joyOrigin = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
});
window.addEventListener('touchmove', e=>{
  for(const t of e.changedTouches){
    if(t.identifier!==touchId) continue;
    const dx = t.clientX - joyOrigin[0];
    const dy = t.clientY - joyOrigin[1];
    const dist = Math.min(Math.hypot(dx,dy), joyRadius);
    const ang = Math.atan2(dy,dx);
    stick.style.transform = `translate(${Math.cos(ang)*dist}px, ${Math.sin(ang)*dist}px)`;
    player.move(Math.cos(ang)*dist/joyRadius, Math.sin(ang)*dist/joyRadius);
  }
});
window.addEventListener('touchend', e=>{
  for(const t of e.changedTouches){
    if(t.identifier===touchId){touchId=null;stick.style.transform='translate(-50%,-50%)';}
  }
});
fireBtn.addEventListener('touchstart', ()=>player.shoot());

// 鎖指標 (手機上雙擊進入全螢幕瞄準)
renderer.domElement.addEventListener('dblclick', ()=>document.body.requestFullscreen());

// 動畫循環
function animate(){
  requestAnimationFrame(animate);
  player.update();
  renderer.render(scene, camera);
}
animate();

// 旋轉視角（陀螺儀）
window.addEventListener('deviceorientation', e=>{
  if(!e.alpha) return;
  camera.rotation.y = -e.gamma*Math.PI/180;
  camera.rotation.x =  e.beta *Math.PI/180 - Math.PI/4;
});
