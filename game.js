/** Global variables */
var scene, camera, target, renderer, clock; 
var mouseDown = 0;
var bullets = [];
var mouse = { x: 0, y: 0 }, hit = 0;
var WIDTH = window.innerWidth, HEIGHT = window.innerHeight

var keyboard = {};
var player = { height:1.8, turnSpeed:Math.PI*0.02, canShoot:0 };

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

/**
	 * Checks browser to see if cursor can be locked, locks cursor
	 * if so otherwise present error message.
	 * @param {boolean} havePointerLock - The boolean determining whether browser is capable of pointer lock.
	 * @return {None}
*/
function lockCursor(havePointerLock) {
	if (havePointerLock) {
		var element = document.body;
		var pointerlockchange = function ( event ) {
			if ( document.pointerLockElement === element 
				|| document.mozPointerLockElement === element 
				|| document.webkitPointerLockElement === element ) {
				controls.enabled = true;

				blocker.style.display = 'none';
			} else {

				controls.enabled = false;

				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';

				instructions.style.display = '';

			}

		}

		var pointerlockerror = function ( event ) {
			instructions.style.display = '';
		}

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		instructions.addEventListener( 'click', function ( event ) {
			instructions.style.display = 'none';

			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

			if ( /Firefox/i.test( navigator.userAgent ) ) {

				var fullscreenchange = function ( event ) {

					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

						element.requestPointerLock();
					}

				}

				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

				element.requestFullscreen();

			} else {
				element.requestPointerLock();
			}
		}, false );
	} else {
		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}
}
lockCursor(havePointerLock)

/**
	 * Randomizes location of target to click
	 * @param {int} min - The int specifying the min -- lower bound.
	 * @param {int} max - The int specifying the max -- lower bound.
	 * @return {number} Location of target
*/
function getRandomLoc(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

/**
	 * Randomizes size of target to click
	 * @param {int} min - The int specifying the min -- lower bound.
	 * @param {int} max - The int specifying the max -- lower bound.
	 * @return {number} Size of target
*/
function getRandomSize(min, max) {
	return Math.random() * (max - min) + min;
}

/**
	 * Spawns THREE.js geometric target with position and size determined from
	 * getRandomLoc() and getRandomSize()
	 * @param {THREE} scene - The world instance of the game
	 * @return {None}
*/
function spawnTarget(scene) {
	const geometry = new THREE.SphereGeometry(getRandomSize(0.2, 0.9), 32, 32);
	const material = new THREE.MeshBasicMaterial( {color: 0xffbf00} );
	target = new THREE.Mesh( geometry, material );
	scene.add( target );

	target.position.x += getRandomLoc(-10,10);
	target.position.y += getRandomLoc(1,5);
	target.position.z += getRandomLoc(0,10);

	scene.add(target);
}

/**
	 * Creates THREE.js geometric floor, walls, and ceiling to create scene
	 * of playing area
	 * @param {THREE} scene - The world instance of the game
	 * @return {None}
*/
function createSpace(scene) {
	floor = new THREE.Mesh(
		new THREE.PlaneGeometry(150,150,150,150),
		new THREE.MeshBasicMaterial({color:0xa9a9a9})
	);
	floor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
	scene.add(floor);

	wall1 = new THREE.Mesh(
		new THREE.BoxGeometry(200, 40, 20),
		new THREE.MeshBasicMaterial({color:0x282828})
	);
	wall1.position.y -= 1;
	wall1.position.z += 20;
	scene.add(wall1);

	wall2 = new THREE.Mesh(
		new THREE.BoxGeometry(20, 40, 200),
		new THREE.MeshBasicMaterial({color:0x282828})
	);
	wall2.position.y -= 1;
	wall2.position.x += 30;
	scene.add(wall2);

	wall3 = new THREE.Mesh(
		new THREE.BoxGeometry(20, 40, 200),
		new THREE.MeshBasicMaterial({color:0x282828})
	);
	wall3.position.y -= 1;
	wall3.position.x -= 30;
	scene.add(wall3);
	
	wall4 = new THREE.Mesh(
		new THREE.BoxGeometry(200, 40, 20),
		new THREE.MeshBasicMaterial({color:0x606060})
	);
	wall4.position.y -= 1;
	wall4.position.z -= 40;
	scene.add(wall4);

	ceiling = new THREE.Mesh(
		new THREE.BoxGeometry(200, 1, 200),
		new THREE.MeshBasicMaterial({color:0x484848})
	);
	ceiling.position.y += 40;
	scene.add(ceiling);
}

/**
	 * Creates THREE.js player with THREE.js camera perspective and predetermined controls
	 * @param {THREE} scene - The world instance of the game
	 * @return {None}
*/
function createPlayer(scene) {
	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));

	controls = new THREE.PointerLockControls(camera, document.body)
	scene.add(controls.getObject())
}

/**
	 * Adds score to HUD
	 * @return {None}
*/
function addScore() {
	$('body').append('<div id="hud"><p>Score: <span id="score">0</span></p></div>');
}

/**
	 * Renders THREE.js WebGL scene
	 * @param {THREE} scene - The world instance of the game
	 * @return {None}
*/
function render(scene) {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	document.body.appendChild(renderer.domElement);
}

/**
	 * Initializes the world, game, player, and targets
	 * @return {None}
*/
function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
	clock = new THREE.Clock();
	
	createSpace(scene)
	spawnTarget(scene)
	addScore()
	createPlayer(scene)

	/*var reticle = new THREE.Mesh(
		new THREE.RingBufferGeometry( 0.85 * 500, 500, 32),
		new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide })
	  );
	reticle.position.z = -4;
	reticle.lookAt(camera.position);
	camera.add(reticle);
	scene.add(camera)*/

	render(scene)
	animate()
}

/**
	 * Animates the scene
	 * @return {None}
*/
function animate(){
	requestAnimationFrame(animate);
	
	target.rotation.x += 0.01;
	target.rotation.y += 0.02;
	
	trackBullets();

	renderer.render(scene, camera);
}

/**
	 * Detects when a key has been pressed down
	 * @param {event} event - Keyboard event
	 * @return {None}
*/
function keyDown(event){
	keyboard[event.keyCode] = true;
}

/**
	 * Detects when mouse is clicked down
	 * @return {None}
*/
document.body.onmousedown = function() {
	var bullet = new THREE.Mesh(
		new THREE.SphereGeometry(0.05,8,8),
		new THREE.MeshBasicMaterial({color:0xffffff})
	);
	bullet.position.set(0, player.height, -5);
	
	bullet.velocity = new THREE.Vector3(-Math.sin(camera.rotation.y),0,Math.cos(camera.rotation.y));
	bullet.alive = true;

	setTimeout(function() {
		bullet.alive = false;
		scene.remove(bullet);
	}, 1000);
	
	bullets.push(bullet);
	scene.add(bullet);
	player.canShoot = 10;
}

/**
	 * Keeps track of bullets array, removing bullets that miss
	 * @return {None}
*/
function trackBullets() {
	for(var index=0; index < bullets.length; index+=1){
		if (bullets[index] === undefined ) {
			continue;
		}

		if (bullets[index].alive == false ) {
			bullets.splice(index,1);
			continue;
		}
		
		bullets[index].position.add(bullets[index].velocity);
	}
}

/**
	 * Detects when a key has been pressed down
	 * @param {event} event - Keyboard event
	 * @return {None}
*/
function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;

/**
	 * Handles window resizing
	 * @return {None}
*/
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize, false )