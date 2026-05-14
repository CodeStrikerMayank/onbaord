function initBackground() {
    const canvas = document.querySelector('#bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 60;

    // Parameters
    const count = window.innerWidth < 768 ? 80 : 150;
    const distanceLimit = 20;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 120;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

        velocities[i * 3] = (Math.random() - 0.5) * 0.05;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.8,
        color: 0x00f2ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Lines
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00f2ff,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    });

    function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        points.rotation.y += 0.001;
        points.rotation.x += 0.0005;
        points.position.x = targetX * 0.2;
        points.position.y = -targetY * 0.2;

        lines.rotation.copy(points.rotation);
        lines.position.copy(points.position);

        const posAttr = geometry.attributes.position;
        const linePos = [];

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            posAttr.array[ix] += velocities[ix];
            posAttr.array[ix + 1] += velocities[ix + 1];
            posAttr.array[ix + 2] += velocities[ix + 2];

            // Bounds
            if (Math.abs(posAttr.array[ix]) > 60) velocities[ix] *= -1;
            if (Math.abs(posAttr.array[ix + 1]) > 60) velocities[ix + 1] *= -1;
            if (Math.abs(posAttr.array[ix + 2]) > 60) velocities[ix + 2] *= -1;

            // Connections
            for (let j = i + 1; j < count; j++) {
                const jx = j * 3;
                const dx = posAttr.array[ix] - posAttr.array[jx];
                const dy = posAttr.array[ix + 1] - posAttr.array[jx + 1];
                const dz = posAttr.array[ix + 2] - posAttr.array[jx + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < distanceLimit) {
                    linePos.push(posAttr.array[ix], posAttr.array[ix + 1], posAttr.array[ix + 2]);
                    linePos.push(posAttr.array[jx], posAttr.array[jx + 1], posAttr.array[jx + 2]);
                }
            }
        }

        posAttr.needsUpdate = true;
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
