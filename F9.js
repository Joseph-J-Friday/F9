"use strict";
let obj = function(params){
	params = params || {};
	this.space = params.space || document.body;
	this.main = params.main !== undefined ? params.main : false;
	this.main ? MAIN = this : null;
	this.x = params.x || 0;
	this.jcount = 0;
	this.maxH = params.maxH || 25;
	this.y = params.y|| 0;
	this.fixedX = this.x;
	this.fixedY = this.y;
	this.w = sizeW(params.w || 8);
	this.h = sizeH(params.h || 8);
	this.mass = params.mass || 0;
	this.massReserve = this.mass;
	this.mass !== 0 ? this.landed = false : this.landed = true;
	this.inertia = params.inertia || .5;
	this.restitution = params.restitution || 5;
	this.hue = params.hue || ranHue;
	this.texture = params.texture;
	this.force = calcForce(this.mass);
	this.forceReserve = this.force;
	this.stroke = params.stroke || 0;
	this.speed = params.speed || calcSpeed(this.mass);
	this.speedReserve = this.speed;
	this.onMe = this;
	this.floor = this;
	this.id = Math.random()*100;
	this.base = this.y+this.h;
	this.collided = this;
	this.pushingMe = this;
	this.walking = false;
	this.massScale = 0;
	this.massMul = this.mass;
	this.pushSrc = this;
	this.dir = undefined;
	this.locked = false;
	this.prevCollided = this;
	this.showmass = params.showMass === undefined ? false : params.showMass;
	this.trimX = params.trimX !== undefined ? params.trimX : false;
	this.trimX ? this.boundX = (0.17*this.w) : this.boundX = 0;
	this.tuD = document.createElement("div");
	showmass && this.showmass ? this.tuD.innerHTML = this.mass + "kg" : null;
	this.hooker = false;
	this.on_ground = false;
	this.lock_R = false;
	this.lock_L = false;
	this.ws = this.tuD.style;
	this.ws.position = "fixed";
	this.ws.width = this.w + "%";
	this.ws.height = this.h + "%";
	this.ws.top = this.y + "%";
	this.ws.left = this.x + "%";
	this.ws.fontSize = "40%";
	this.ws.textAlign = "center";
	this.ws.fontWeight = "bolder";
	this.ws.overflow = "hidden";
	this.ws.display = "block";
	this.roundness = params.roundness || 0;
	this.ws.borderRadius = this.roundness + "%";
	if(this.texture !== undefined){
		this.ws.backgroundImage = "URL(" + this.texture + ")";
		this.ws.backgroundOrigin = "top";
		this.ws.backgroundSize = "100% 100%";
		this.ws.backgroundRepeat = "no-repeat";
	}else{this.ws.backgroundColor = this.hue;}
	this.ws.border = this.stroke + "px solid white"
	this.w += sizeW(this.stroke*2);
	this.h += sizeH(this.stroke*2);
	
}
/**
const checkCollision = (obj1,obj2) =>{
	if(obj1.collided === obj2 || obj2.collided === obj1){return true}
	else{requestAnimationFrame(checkCollision)}
}
obj.prototype.collidesWith = function(body){
	if(this.collided === body || body.collided === this){return true}
	else{requestAnimationFrame(()=>{this.collidesWith()})}
}**/
obj.prototype.setMass = function(value){
	this.mass = this.massReserve = value;
	this.force = this.forceReserve = calcForce(this.mass);
	this.speed = calcSpeed(this.mass);
	this.mass !== 0 ? this.landed = false : this.landed = true;
}
obj.prototype.setRoundness = function(value){
	this.roundness = value;
	this.ws.borderRadius = this.roundness + "%";
}
obj.prototype.halt = function(AF,speed=0){
	AF === 0 ? cancelAnimationFrame(this.mlA) : cancelAnimationFrame(this.mrA);
	preLoop();
}
obj.prototype.jump = function(){
	if(this.landed && this.on_ground){
		this.on_ground = false;
		const jmp = () =>{
			this.y -= 1;
			//this.onMe.jump();
			for(let i = 0; i<Bodies.length; i++){
				if(this!==Bodies[i]){
					let b1 = this.y+this.h;
					let b2 = Bodies[i].y+Bodies[i].h;
					if((this.y<=b2) && (b1>b2) && ((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)) && ((this.x+this.w)-(this.boundX)>Bodies[i].x)){
						if(Bodies[i].mass !== 0 && Bodies[i].landed && Bodies[i].mass<this.mass){
							Bodies[i].force = this.force;
							Bodies[i].floor = Bodies[i];
							this.onMe = this;
							Bodies[i].jump();
						}
						Bodies[i].mass === 0 || Bodies[i].mass === this.mass ? this.jcount = this.maxH : null;
						Bodies[i].mass>this.mass ? this.jcount = this.maxH : null;
						this.force = this.forceReserve;
						preLoop()
						}
						else{this.ws.top = this.y + "%";}
					}
				}
		
			if(this.jcount<this.maxH){
				this.jcount++;
				this.jAnim = requestAnimationFrame(()=>{jmp()});
			}
			else if(this.jcount>=this.maxH){
				this.jcount = 0;
				this.force = this.forceReserve;
				this.landed = false;
				cancelAnimationFrame(this.jAnim);
				return;
			}
		}
		jmp();
	}
}
obj.prototype.fall = function(){
	if(this.landed === false){
		this.y += this.force;
		this.onMe.base = HEIGHT;
		this.onMe.landed = false;
		for(let i = 0; i<Bodies.length; i++){
			if(this!==Bodies[i]){
				let b1 = this.y+this.h;
				let b2 = Bodies[i].y+Bodies[i].h;
				if((b1>=Bodies[i].y) && (b1<b2) && ((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)) && ((this.x+this.w)-(this.boundX)>Bodies[i].x)){
					Bodies[i].mass !== 0 && Bodies[i].landed === false && Bodies[i].mass<this.mass ? Bodies[i].force = this.force+.001 : null;
					Bodies[i].mass !== 0 ? this.base = Bodies[i].base-Bodies[i].h : this.base = Bodies[i].y;
					this.floor = Bodies[i];
					Bodies[i].onMe = this;
					this.force = this.forceReserve;
					preLoop()
				}
			}
		}
		if((this.y+this.h)>=this.base){
			this.landed = true;
			this.on_ground = true;
			this.force = this.forceReserve;
			this.y = this.base-this.h;
			this.ws.top = this.y + "%";
		}
		else if(this.y+this.h >= HEIGHT){
			this.landed = true;
			this.on_ground = true;
			this.y = HEIGHT-this.h;
			this.ws.top = this.y + "%";
		}
		else{
			this.ws.top = this.y + "%";
		}
	}
	else{return}
}

obj.prototype.right = function(step=false,v,pusher=this){
	if(this.hooker){
		this.hooker = false;
		console.log(this.hooker," ",this.mass,"kg");
		return;
	}
	if(this.dir === 0){
		preLoop();
		this.dir = 1;
	}
	else{this.dir = 1}
	let p = pusher;
	!step ? this.pushingMe = this : null;
	this.collided = this;
	this.speed = v || this.speed;
	if(this.main === false){
		if(this.x+this.w<xend){this.x += this.speed; this.fixedX += this.speed}
	}
	else{
		if(this.x<50 || xlim>=WIDTH){
			this.midway = false;
			if(this.x+this.w<WIDTH){this.x += this.speed; this.fixedX += this.speed}
		}
		if(xlim>=WIDTH){
			for(let i = 0; i<Bodies.length; i++){
				if(Bodies[i]!==MAIN){
					Bodies[i].x = Bodies[i].fixedX-(WIDTH-100);
					Bodies[i].ws.left = Bodies[i].x + "%";
				}
			}
			xlim = WIDTH;
		}
		if(this.x>=50 && xlim<WIDTH){
			this.midway = true;
			this.x = 50;
			this.ws.left = this.x + "%";
			xbegin -= this.speed;
			xend -= this.speed;
			xlim += this.speed;
			for(let i = 0; i<Bodies.length;i++){
				if(this.x >= 50 && xlim<WIDTH && Bodies[i] !== this){
					Bodies[i].x -= this.speed;
					Bodies[i].ws.left = Bodies[i].x + "%";	
				}
			}
		}
	}	
	if((this.x+this.boundX)>=(this.floor.x+this.floor.w)){
		this.landed = false;
		this.onMe.landed = false;
		this.pushingMe.collided = this.pushingMe;
		this.base = HEIGHT;
		this.floor.onMe = this.floor;
	}
	if(((this.x+this.w)-(this.boundX*2))>=xend){
		this.x = xend-(this.w-(this.boundX*2));
		this.pushingMe !== this ? this.alignR(this.x) : this.ws.left = this.x + "%";
		return;
	}
	if((this.x+(this.boundX))>(this.onMe.x+this.onMe.w)){
		this.onMe.landed = false;
		this.onMe.base = HEIGHT;
		this.onMe = this;
	}
	for(let i = 0; i<Bodies.length;i++){
		if(this.collided === this && this.id!==Bodies[i].id && Bodies[i].id!==this.floor.id){
			if(((this.x+this.w)-(this.boundX)>=Bodies[i].x) && ((this.x+this.w)-(this.boundX)<(Bodies[i].x+Bodies[i].w))){
				if(((this.y+this.h)>(Bodies[i].y)) && ((this.y+this.h)<Bodies[i].y+Bodies[i].h+this.h-.1)){
					p.massMul *= Bodies[i].mass;
					//console.log(p.massMul);
					this.collided = Bodies[i];
					this.prevCollided !== Bodies[i] ? p.massScale += Bodies[i].mass : null;
					if(Bodies[i].mass === 0){
						pusher.x === 50 ? UnDoo(this.speed,1) : null;
						this.x = Bodies[i].x-(this.w-(this.boundX));
						this.pushingMe !== this ? this.alignR(this.x) : this.ws.left = this.x + "%";
						pusher !== this ? pusher.hooker = true : null;
						return;
					}
					else{		
						Bodies[i].pushingMe = this;
						this.prevCollided = Bodies[i];
						if(p.massScale<p.mass){
							this.collided.right(true,this.speed,p);
						}
						else if(this.collided !== this && p.massScale>=p.mass){
							pusher.x === 50 ? UnDoo(this.speed,1) : null;
							this.x = Bodies[i].x-(this.w-(this.boundX));
							this.pushingMe !== this ? this.alignR(this.x) : this.ws.left = this.x + "%";
							return;
						}
					}
				}
				else{}
			}
			else{}
		}
		else{}	
	}
	this.ws.left = this.x + "%";
	step ? null : this.mrA = requestAnimationFrame(()=>{this.right()});
}
obj.prototype.left = function(step=false,v,pusher=this){
	if(this.hooker){
		this.hooker = false;
		return;
	}
	if(this.dir === 1){
		preLoop();
		this.dir = 0;
	}else{this.dir = 0}
	let p = pusher;
	!step ? this.pushingMe = this : null;
	this.collided = this;
	this.speed = v || this.speed;
	if(this.main === false){
		if(this.x>xbegin){this.x -= this.speed; this.fixedX -= this.speed}
	}
	else{
		if(this.midway === true && xlim<=100){
			this.midway = false;
			xlim = 100;
			for(let i = 0; i<Bodies.length; i++){
				if(Bodies[i]!==MAIN){
					Bodies[i].x = Bodies[i].fixedX;
					Bodies[i].ws.left = Bodies[i].x + "%";
				}
			}
			if(this.x>xbegin){this.x -= this.speed; this.fixedX -= this.speed}
		}
		if(this.x>50 && xlim>=WIDTH){
			if(this.x>xbegin){this.x -= this.speed; this.fixedX -= this.speed}
		}
		else{
			this.midway = true;
			}
		if(this.midway === true && xlim>100){
			this.x = 50;
			this.ws.left = this.x + "%";
			xbegin += this.speed;
			xend += this.speed;
			xlim -= this.speed;
			for(let i = 0; i<Bodies.length;i++){
				if(this.midway === true && xlim>100 && Bodies[i] !== this){
					Bodies[i].x += this.speed;
					Bodies[i].ws.left = Bodies[i].x + "%";
				}
			}
		}
	}
	if((this.x+this.w)-(this.boundX)<=this.floor.x){
		this.landed = false;
		this.onMe.landed = false;
		this.pushingMe.collided = this.pushingMe;
		this.base = HEIGHT;
		this.floor.onMe = this.floor;
	}
/**	if(this.x<=xbegin-(this.boundX)){
		this.x = xbegin-(7);
		this.pushingMe !== this ? this.alignL(this.x) : this.ws.left = this.x + "%";;
		return;
	}**/
	if((this.x+this.w)<this.onMe.x){
		this.onMe.landed = false;
		this.onMe.base = HEIGHT;
		this.onMe = this;
	}
	for(let i = 0; i<Bodies.length;i++){
		if(this.id!==Bodies[i].id && Bodies[i].id!==this.floor.id){
			if(((this.x+this.boundX)<=(Bodies[i].x+Bodies[i].w)) && ((this.x+this.boundX)>Bodies[i].x)){
				if(((this.y+this.h)>(Bodies[i].y)) && ((this.y+this.h)<=Bodies[i].y+Bodies[i].h+this.h-.1)){
					this.collided = Bodies[i];		
					this.prevCollided !== Bodies[i] ? p.massScale += Bodies[i].mass : null;
					
					if(Bodies[i].mass === 0){
						pusher.x === 50 ? UnDoo(this.speed,0) : null;
						this.x = Bodies[i].x + (Bodies[i].w-(this.boundX));
						this.pushingMe !== this ? this.alignL(this.x) : this.ws.left = this.x + "%";
						pusher !== this ? pusher.hooker = true : null;
						return;
					}
					else{
						Bodies[i].pushingMe = this;
						this.prevCollided = Bodies[i];
						if(p.massScale<p.mass){
							this.collided.left(true,this.speed,p);
						}
						else if(this.collided !== this && p.massScale>=p.mass){
							pusher.x === 50 ? UnDoo(this.speed,0) : null;
							this.x = Bodies[i].x + (Bodies[i].w-(this.boundX));
							this.pushingMe !== this ? this.alignL(this.x) : this.ws.left = this.x + "%";;
							return;
						}
					}
				}else{}
			}
			else{}
		}
		else{}	
	}	
	this.ws.left = this.x + "%";
	step ? null : this.mlA = requestAnimationFrame(()=>{this.left()});
}
obj.prototype.alignL = function(x){
	this.x = this.fixedX = x;
	this.ws.left = this.x + "%";
	this.halt(0,this.speed);
	this.pushingMe !== this ? this.pushingMe.alignL(this.x+(this.w-(this.pushingMe.boundX))) : this.ws.left = this.x + "%";
}
obj.prototype.alignR = function(x){
	this.x = this.fixedX = x;
	this.ws.left = this.x + "%";
	this.halt(1,this.speed);
	this.pushingMe !== this ? this.pushingMe.alignR(this.x-(this.pushingMe.w-(this.pushingMe.boundX))) : this.ws.left = this.x + "%";
}
window.F9 = window.F9World = window.F9Physics = window.F9PhysicsWorld = function(){
	window.g = 10;
	window.gravitySwitch = true;
	window.Bodies = [];
	window.MAIN = undefined;
	window.ranHue = randomColor();
	window.WIDTH = window.xend = window.xlim = 100;
	window.HEIGHT = window.yend = window.ylim = 100;
	window.xbegin = window.ybegin = 0;
	window.showmass = false;
	PULLL();
}
F9.prototype.enableGravity = function(){
	gravitySwitch = true;
}
F9.prototype.disableGravity = function(){
	gravitySwitch = false;
}
F9.prototype.mapSize = function(w,h){
	if(w<100){
		WIDTH = xend = 100;
	}else{WIDTH = xend = w;}
	if(h<100){
		HEIGHT = yend = 100;
	}else{HEIGHT = yend = h;}
}
F9.prototype.displayMass = function(req=true){
	if(req){
		showmass = true;
		for(let i = 0; i<Bodies.length; i++){
			Bodies[i].showmass ? Bodies[i].tuD.innerHTML = Bodies[i].mass + "kg" : null;
		}
	}
	else{
		showmass = false;
		for(let i = 0; i<Bodies.length; i++){
			Bodies[i].tuD.innerHTML = "";
		}
	}
}
F9.prototype.bind = function(body){
	if(body.length>0){
		for(let i = 0; i<body.length; i++){
			Bodies.push(body[i]);
			Bodies[i].space.appendChild(Bodies[i].tuD);
		}
	}
	else{
		Bodies.push(body);
		body.space.appendChild(body.tuD);
	}
}
const PULLL = () =>{
	if(gravitySwitch){
		for(let i = 0; i<Bodies.length; i++){
			Bodies[i].mass !== 0 || !Bodies[i].landed ? Bodies[i].fall() : null;
		}
	}
		requestAnimationFrame(PULLL);
}
const UnDoo = (v,which) =>{
	if(which === 0){
		xbegin -= v;
		xend -= v;
		xlim += v
		for(let i = 0; i<Bodies.length; i++){
			if(Bodies[i] !== MAIN){
				Bodies[i].x -= v;
				Bodies[i].ws.left = Bodies[i].x + "%";	
			}	
		}
	}
	else{
		xbegin += v;
		xend += v;
		xlim -= v;
		for(let i = 0; i<Bodies.length; i++){
			if(Bodies[i] !== MAIN){
				Bodies[i].x += v;
				Bodies[i].ws.left = Bodies[i].x + "%";
			}			
		}
	}
}
const preLoop = () =>{
		for(let i = 0; i<Bodies.length; i++){
			if(Bodies[i].mass > 0){
				Bodies[i].prevCollided = Bodies[i];
				Bodies[i].massScale = 0;
				Bodies[i].massMul = Bodies[i].mass;
				Bodies[i].speed = Bodies[i].speedReserve;
			}
		}
}
const calcForce = (m) =>{return m*(g/100);}
const calcSpeed = (m) =>{return (g*.5)/(m)}
const sizeW = (w) =>{return (w/window.innerWidth)*100}
const sizeH = (h) =>{return (h/window.innerHeight)*100}
const randomColor = () =>{
	let r = 0, g = 0, b = 0;
	r = Math.floor(Math.random() * 256);
	g = Math.floor(Math.random() * 256);
	b = Math.floor(Math.random() * 256);	
	return "rgb(" + r + "," + g + ","  + b + ")";
}
