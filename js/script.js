console.clear();

var ww = window.innerWidth,
    wh = window.innerHeight;

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('canvas')
});
renderer.setSize(ww, wh);
renderer.setClearColor(0x001a2d);

var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x001a2d, 80, 140);

var camera = new THREE.PerspectiveCamera(45, ww/wh, 0.1, 200);
camera.position.x = 70;
camera.position.y = 30;
camera.position.z = 5;
camera.lookAt(new THREE.Vector3());

// var controls = new THREE.OrbitControls(camera, renderer.domElement);

/* LIGHTS */
var moonLight = new THREE.PointLight(0xffffff, 2, 150);
scene.add( moonLight );

var moon;
function createMoon() {
  var geometry = new THREE.SphereGeometry(8, 32, 32);
  var material = new THREE.MeshPhongMaterial({
    color: 0x26fdd9,
    shininess:15,
    emissive: 0x2bb2e6,
    emissiveIntensity:0.8
  });
  moon = new THREE.Mesh(geometry, material);
  moon.position.x = -9;
  moon.position.z = -6.5;
  moon.position.y = 1;
  moon.rotation.y = -1;
  scene.add(moon);
  moonLight.position.copy(moon.position);
  moonLight.position.y += 4;
  var moonLight2 = new THREE.PointLight(0xffffff, 0.6, 150);
  scene.add(moonLight2);
  moonLight2.position.x += 20;
  moonLight2.position.y -= 20;
  moonLight2.position.z -= 25;
}

function createTerrain () {
  var geometry = new THREE.PlaneGeometry(150,150,120,120);
  var m = new THREE.Matrix4();
  m.makeRotationX(Math.PI * -0.5);
  geometry.applyMatrix(m);
  for(var i=0;i<geometry.vertices.length;i++) {
    var vector = geometry.vertices[i];
    var ratio = noise.simplex3(vector.x*0.03, vector.z*0.03, 0);
    vector.y = ratio * 10;
  }
  var material = new THREE.MeshPhongMaterial({  
    color: 0x198257,
    emissive: 0x032f50
  });
  var plane = new THREE.Mesh(geometry, material);
  scene.add( plane );
}

var stars = new THREE.Group();
scene.add(stars);
var starsLights = new THREE.Group();
scene.add(starsLights);
var starsAmount = 20;
function createStars() {
  var geometry = new THREE.SphereGeometry(0.3, 16, 16);
  var material = new THREE.MeshBasicMaterial({color: 0xffffff});
  for(var i=0;i<starsAmount;i++) {
    var star = new THREE.Mesh(geometry, material);
    star.position.x = (Math.random() - 0.5) * 150;
    star.position.z = (Math.random() - 0.5) * 150;
    var ratio = noise.simplex3(star.position.x*0.03, star.position.z*0.03, 0);
    star.position.y = ratio * 10 + 0.3;
    stars.add(star);
    var velX = (Math.random() + 0.1) * 0.1 * (Math.random()<0.5?-1:1);
    var velY = (Math.random() + 0.1) * 0.1 * (Math.random()<0.5?-1:1);
    star.vel = new THREE.Vector2(velX, velY);
    var starLight = new THREE.PointLight(0xffffff, 0.8, 3);
    starLight.position.copy(star.position);
    starLight.position.y += 0.5;
    starsLights.add(starLight);
  }
}

function updateStar(star, index) {
  if (star.position.x < -75) {
    star.position.x = 75;
  }
  if (star.position.x > 75) {
    star.position.x = -75;
  }
  if (star.position.z < -75) {
    star.position.z = 75;
  }
  if (star.position.z > 75) {
    star.position.z = -75;
  }
  
  star.position.x += star.vel.x;
  star.position.z += star.vel.y;
  var ratio = noise.simplex3(star.position.x*0.03, star.position.z*0.03, 0);
  star.position.y = ratio * 10 + 0.3;
  
  
  starsLights.children[index].position.copy(star.position);
  starsLights.children[index].position.y += 0.5;
}

function render(a) {
  requestAnimationFrame(render);
  for(var i=0;i<starsAmount;i++) {
    updateStar(stars.children[i], i);
  }
  renderer.render(scene, camera);
}

function onResize() {
  ww = window.innerWidth;
  wh = window.innerHeight;
  camera.aspect = ww / wh;
  camera.updateProjectionMatrix();
  renderer.setSize(ww, wh);
}

createMoon();
createTerrain();
createStars();
requestAnimationFrame(render);
window.addEventListener('resize', onResize);