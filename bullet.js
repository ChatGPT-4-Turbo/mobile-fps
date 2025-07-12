export class Bullet{
  constructor(camera, scene){
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.05),
      new THREE.MeshBasicMaterial({color:0xffff00})
    );
    this.mesh.position.copy(camera.position);
    this.dir = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);
    scene.add(this.mesh);
  }
  update(){
    this.mesh.position.addScaledVector(this.dir, 0.5);
    if(this.mesh.position.length()>50) this.mesh.removeFromParent();
  }
}
