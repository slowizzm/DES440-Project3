
function onWindowResize(event) {
    uniforms.res.value.x = window.innerWidth;
    uniforms.res.value.y = window.innerHeight;
    renderer.setSize( window.innerWidth, window.innerHeight );
};

function getCubeMap() {
    var cubeMap = new THREE.Texture();
    cubeMap.format = THREE.RGBFormat;
    cubeMap.flipY = false;

    var envMaps =
        {file: "shinyblue.jpg", size: 1024};

    var loader = new THREE.ImageLoader();
    var pre = "./Textures/";
    var file = pre + envMaps.file;
    var size = envMaps.size;

    loader.load(file, function (image) {
        var getSide = function (x, y) {

            var canvas = document.createElement('myCanvas');
            canvas.width = size;
            canvas.height = size;

            var context = canvas.getContext('2d');
            context.drawImage(image, -x * size, -y * size);

            return canvas;

        }

        cubeMap.image[ 0 ] = getSide(2, 1); // px
        cubeMap.image[ 1 ] = getSide(0, 1); // nx
        cubeMap.image[ 2 ] = getSide(1, 0); // py
        cubeMap.image[ 3 ] = getSide(1, 2); // ny
        cubeMap.image[ 4 ] = getSide(1, 1); // pz
        cubeMap.image[ 5 ] = getSide(3, 1); // nz
        cubeMap.needsUpdate = true;

    });

    return cubeMap;
};

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

function izzmRandom(min, max) {
    return Math.random() * (max - min) + min;
};

function handle_load(geometry, materials) {
    var selfMaskMesh = new THREE.Mesh(geometry, waterMat);

    selfMaskMesh.scale.x = 2500;
    selfMaskMesh.scale.y = 2500;
    selfMaskMesh.scale.z = 2500;
    selfMaskMesh.position.y = -666;
    selfMaskMesh.position.z = 900;
    selfMaskMesh.rotation.x = 90;
    waterMat.color.set("rgb(33,33,33)");

    scene.add(selfMaskMesh);
};
