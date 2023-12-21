// import * as THREE from 'three';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
    canvas:canvas
});

renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

scene.background = new THREE.TextureLoader().load("https://media.sketchfab.com/models/845900993a6e484b9d3513c5effb96d6/thumbnails/25a38084b05a4ec5b3364a423c6852f0/888adc12be2242e3b3792ad4cb08ff98.jpeg");

//donut
const torusGeo = new THREE.TorusGeometry(10, 3, 16, 100)
const meshBasicMaterial = new THREE.MeshBasicMaterial({
    color: 0x0095DD,
    wireframe: true,
    wireframeLinewidth: 2
});
const torusMesh = new THREE.Mesh(torusGeo, meshBasicMaterial);
torusMesh.position.set(25, 0, 40);

//sophia
const sphGeo = new THREE.SphereGeometry(20, 8, 6)
const basicMaterial = new THREE.MeshNormalMaterial({
    color: 0x0095DD
});
const sphMesh = new THREE.Mesh(sphGeo, basicMaterial);

//cube
const cubeGeo = new THREE.SphereGeometry(20, 8, 6);
const cubeMaterial = new THREE.MeshPhongMaterial({
    color: 0xcd0a8f,
    emissive: 0xe46511,
    specular: 0xdcdfe5,
    shininess: 19.8,
    opacity: 0.71,
    reflectivity: 1,
    refractionRatio: 0.98,
    depthTest: true,
    depthWrite: true,
    alphaTest: 0.02,
    side: THREE.FrontSide,
    transparent: false,
    visible: true
});
const cubeMesh = new THREE.Mesh(cubeGeo, cubeMaterial);
cubeMesh.position.set(-30, 2, 30);

// Add a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 0).normalize();
scene.add(directionalLight);


scene.add(torusMesh, sphMesh, cubeMesh, directionalLight)
camera.position.z = 70;

function animate() {
	requestAnimationFrame( animate );

	torusMesh.rotation.x += 0.05;
	torusMesh.rotation.y += 0.05;

    sphMesh.rotation.y += 0.09;
    sphMesh.rotation.z += 0.09;

    cubeMesh.rotation.x += 0.02;
    cubeMesh.rotation.z += 0.02;

	renderer.render( scene, camera );
}

animate();