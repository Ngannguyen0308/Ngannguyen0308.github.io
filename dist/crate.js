import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

      // Create a scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffc0cb); 

      // Create a camera
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Create a renderer
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // Create textures
      const textureLoader = new THREE.TextureLoader();
      const texture1 = textureLoader.load('/dist/textures/Bump.png');
      const texture2 = textureLoader.load('/dist/textures/Diffus.png');
      const texture3 = textureLoader.load('/dist/textures/Normal.png');

      // Create materials with different textures
      const material1 = new THREE.MeshBasicMaterial({ map: texture1 });
      const material2 = new THREE.MeshBasicMaterial({ map: texture2 });
      const material3 = new THREE.MeshBasicMaterial({ map: texture3 });

      // Create crates with different materials
      const geometry = new THREE.BoxGeometry();

      const crate1 = new THREE.Mesh(geometry, material1);
      crate1.position.x = -2;

      const crate2 = new THREE.Mesh(geometry, material2);
      crate2.position.x = 0;

      const crate3 = new THREE.Mesh(geometry, material3);
      crate3.position.x = 2;

      // Add crates to the scene
      scene.add(crate1);
      scene.add(crate2);
      scene.add(crate3);

      // Create an animation loop
      const animate = function () {
        requestAnimationFrame(animate);

        // Rotate crates
        crate1.rotation.x += 0.01;
        crate1.rotation.y += 0.01;

        crate2.rotation.x += 0.01;
        crate2.rotation.y += 0.01;

        crate3.rotation.x += 0.01;
        crate3.rotation.y += 0.01;

        // Render the scene
        renderer.render(scene, camera);
      };

      // Run the animation loop
      animate();