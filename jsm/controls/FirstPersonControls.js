
var FirstPersonControls = function ( player, domElement ) {


	this.player = player;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API
	this.center = new THREE.Vector3( player.position.x, player.position.y, player.position.z );
	this.moveSpeed = 0.3;
	this.turnSpeed = 0.04;
	this.tiltSpeed = 0.01;
	this.maxSpeed = 0.8;
	this.defaultSpeed = 0.2;
	var keyState = {};

	this.update = function() { 

		this.checkKeyStates();

	};

	this.checkKeyStates = function () {

	    if (keyState[38] || keyState[87]) {

	        // 'w' - forward
			this.player.translateZ(this.moveSpeed);
	    }

	    if (keyState[40] || keyState[83]) {

	        // 's' - back
			this.player.translateZ(-this.moveSpeed);

		}
	    if (keyState[37] || keyState[65]) {

	        // left arrow or 'a' - rotate left
	        this.player.rotation.x += this.turnSpe1ed;

	    }

	    if (keyState[39] || keyState[68]) {

	        // right arrow or 'd' - rotate right
	        this.player.rotation.x -= this.turnSpeed;

	    }

		if (keyState[16]) {
			// 'shift' - speed up
			if(this.moveSpeed < this.maxSpeed){
				this.moveSpeed += 0.005;
			}
		}
		else{
			if(this.moveSpeed > this.defaultSpeed){
				var diff = (this.moveSpeed - this.defaultSpeed)/20;
				this.moveSpeed -= diff;

			}
		}
	};

	function onKeyDown( event ) {

    	event = event || window.event;

        keyState[event.keyCode || event.which] = true;

    }

    function onKeyUp( event ) {

        event = event || window.event;

        keyState[event.keyCode || event.which] = false;

    }

	this.domElement.addEventListener('keydown', onKeyDown, false );
	this.domElement.addEventListener('keyup', onKeyUp, false );

};

export { FirstPersonControls };
