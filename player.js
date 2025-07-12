import {Bullet} from './bullet.js';

export class Player{
  constructor(camera, scene){
    this.camera = camera;
    this.scene = scene;
    this.speed = 0.1;
    this.vx = this.vz = 0;
    camera.position.set(0,1.6,0);

    // 簡易準星
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({color:0xff0000})
    );
    sprite.scale.set(0.01,0.01,1);
    sprite.position.set(0,0,-1);
    camera.add(sprite);
  }
  move(x,z){
    this.vx = x*this.speed;
    this.vz = z*this.speed;
  }
  update(){
    const nx = this.camera.position.x + this.vx;
    const nz = this.camera.position.z + this.vz;
    if(Math.abs(nx)<20 && Math.abs(nz)<20){
      this.camera.position.x = nx;
      this.camera.position.z = nz;
    }
  }
  shoot(){
    new Bullet(this.camera, this.scene);
  }
}
