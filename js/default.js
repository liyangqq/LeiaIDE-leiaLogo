 var windowWidth = window.innerWidth,
     windowHeight = window.innerHeight;
 var camera, renderer, scene;
 var mesh1;
 var sizeM = 30;
 var sizeMesh1 = sizeM;
 var newMeshReady = false;
 head.ready(function() {
     Init();
     animate();
 });

 function Init() {
     scene = new THREE.Scene();

     //setup camera
     camera = new LeiaCamera({
         cameraPosition: new THREE.Vector3(_camPosition.x, _camPosition.y, _camPosition.z),
         targetPosition: new THREE.Vector3(_tarPosition.x, _tarPosition.y, _tarPosition.z)
     });
     scene.add(camera);


     //setup rendering parameter
     renderer = new LeiaWebGLRenderer({
         antialias: true,
         renderMode: _renderMode,
         shaderMode: _nShaderMode,
         colorMode: _colorMode,
         devicePixelRatio: 1
     });
     renderer.Leia_setSize({
         width: windowWidth,
         height: windowHeight,
         autoFit: true
     });
     document.body.appendChild(renderer.domElement);

     //add object to Scene
     addObjectsToScene();

     //add Light
     addLights();

     //add Gyro Monitor
     //addGyroMonitor();
 }

 function animate() {
     requestAnimationFrame(animate);
    // renderer.setClearColor(new THREE.Color().setRGB(1.0, 1.0, 1.0));
   if(newMeshReady === true){
       mesh1.rotation.set(0.2 * Math.sin(3.2 * LEIA.time), 0 * Math.PI / 2, 0.25 * Math.sin(4 * LEIA.time));
     mesh1.position.z = 3;
   }

     renderer.Leia_render({
         scene: scene,
         camera: camera,
         holoScreenSize: _holoScreenSize,
         holoCamFov: _camFov,
         upclip: _up,
         downclip: _down,
         messageFlag: _messageFlag
     });
 }

 function addObjectsToScene() {
     //Add your objects here
     // var graph = new THREE.Mesh(new THREE.SphereGeometry(8, 30, 10), new   THREE.MeshLambertMaterial({color:0xffffff}));
     // scene.add(graph);
     readSTLs('resource/leialogo2.stl', '', '');
     LEIA_setBackgroundPlane('resource/brickwall_900x600_small.jpg');
 }

 function addLights() {
     //Add Lights Here
     var xl = new THREE.DirectionalLight(0x555555);
     xl.position.set(1, 0, 2);
     scene.add(xl);
     var pl = new THREE.PointLight(0x111111);
     pl.position.set(-20, 10, 20);
     scene.add(pl);
     var ambientLight = new THREE.AmbientLight(0x111111);
     scene.add(ambientLight);


 }

 function readSTLs(filename1, filename2, filename3) {
     var xhr1 = new XMLHttpRequest();
     xhr1.onreadystatechange = function() {
         if (xhr1.readyState == 4) {
             if (xhr1.status == 200 || xhr1.status === 0) {
                 var rep = xhr1.response;

                 mesh1 = parseStlBinary(rep, 0xffffff);
                 mesh1.material.side = THREE.DoubleSide;
                 mesh1.castShadow = true;
                 mesh1.receiveShadow = true;
                 mesh1.material.metal = true;

                 mesh1.scale.set(sizeMesh1, sizeMesh1, sizeMesh1);
                 scene.add(mesh1);
                 newMeshReady = true;
             }
         }
     };
     xhr1.onerror = function(e) {
         console.log(e);
     };
     xhr1.open("GET", filename1, true);
     xhr1.responseType = "arraybuffer";
     xhr1.send(null);
 }

function LEIA_setBackgroundPlane(filename, aspect) {
    var foregroundPlaneTexture = new THREE.ImageUtils.loadTexture(filename);
    foregroundPlaneTexture.wrapS = foregroundPlaneTexture.wrapT = THREE.RepeatWrapping;
    foregroundPlaneTexture.repeat.set(1, 1);

    //
    var planeMaterial = new THREE.MeshPhongMaterial({
        map: foregroundPlaneTexture,
        color: 0xffdd99
    });
    var planeGeometry = new THREE.PlaneGeometry(80, 60, 10, 10);
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.z = -6;
    plane.castShadow = false;
    plane.receiveShadow = true;
    scene.add(plane);
}