"use strict";
let obj = function(params){
	params = params || {};
	this.space = space || document.body;
	this.main = params.main !== undefined ? params.main : false;
	this.x = params.x || 0;
	this.y = params.y|| 0;
	this.w = sizeW(params.w || 8);
	this.h = sizeH(params.h || 8);
	this.mass = params.mass || 0;
	this.mass !== 0 ? this.landed = false : null;
	this.inertia = params.inertia || .5;
	this.restitution = params.restitution || 5;
	this.hue = params.hue || ranHue;
	this.texture = params.texture;
	this.force = calcForce(this.mass);
	this.forceReserve = this.force;
	this.stroke = params.stroke || 0;
	this.speed = params.speed || calcSpeed(this.mass);
	this.onMe = this;
	this.floor = this;
	this.id = Math.random()*100;
	this.base = HEIGHT;
	this.collided = this;
	this.pushingMe = this;
	this.walking = false;
	this.massScale = 0;
	this.dir = undefined;
	this.prevCollided = this;
	this.showmass = params.showMass === undefined ? true : params.showMass;
	this.tuD = document.createElement("div");
	showmass && this.showmass ? this.tuD.innerHTML = this.mass + "kg" : null;
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
	this.roundness = params.roundness || 0;
	this.ws.borderRadius = this.roundness + "%";
	if(this.texture !== undefined){
		this.ws.backgroundImage = "URL(" + this.texture + ")";
		this.ws.backgroundOrigin = "top"
		this.ws.backgroundSize = "cover"
	}else{this.ws.backgroundColor = this.hue;}
	this.ws.border = this.stroke + "px solid white"
	this.w += sizeW(this.stroke*2);
	this.h += sizeH(this.stroke*2);
	this.space.appendChild(this.tuD);
}
const checkCollision = (obj1,obj2) =>{
	if(obj1.collided === obj2/** || obj2.collided === obj1**/){return true}
	else{requestAnimationFrame(checkCollision)}
}
obj.prototype.collidesWith = function(body){
	if(this.collided === body /**|| body.collided === this**/){return true}
	else{requestAnimationFrame(()=>{this.collidesWith()})}
}
obj.prototype.setRoundness = function(value){
	this.roundness = value;
	this.ws.borderRadius = this.roundness + "%";
}
obj.prototype.halt = function(AF){
	AF === 0 ? cancelAnimationFrame(this.mlA) : cancelAnimationFrame(this.mrA);
	preLoop();
}
obj.prototype.jump = function(){
	if(this.landed === true){
		
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
				if((b1>=Bodies[i].y) && (b1<b2) && (this.x<=(Bodies[i].x+Bodies[i].w)) && ((this.x+this.w)>=Bodies[i].x)){
					Bodies[i].mass !== 0 && Bodies[i].landed === false && Bodies[i].mass<this.mass ? Bodies[i].force = this.force+.001 : null;
					Bodies[i].mass !== 0 ? this.base = Bodies[i].base-Bodies[i].h : this.base = Bodies[i].y;
					this.tuD.style.top = this.y + "%";
					this.floor = Bodies[i];
					Bodies[i].onMe = this;
					this.force = this.forceReserve;
					preLoop()
				}
			}
		}
		if((this.y+this.h)>=this.base){
			this.landed = true;
			this.force = this.forceReserve;
			this.ws.top = (this.base-this.h) + "%";
		}
		else{
			this.ws.top = this.y + "%";
		}
	}
	else{return}
}

obj.prototype.right = function(step=false,v,pusher){
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
		(this.x+this.w<100) ? this.x += this.speed : null;
	}
	else{
		if(this.x<50 || xlim>=WIDTH){
			this.midway = false;
			(this.x+this.w<100) ? this.x += this.speed : null;
		}
		if(this.x>=50 && xlim<WIDTH){
			this.midway = true;
			console.log(xlim)
			xbegin -= this.speed;
			xlim += this.speed;
		}
	}	
	if(this.x>=(this.floor.x+this.floor.w)){
		this.landed = false;
		this.onMe.landed = false;
		this.pushingMe.collided = this.pushingMe;
		this.base = HEIGHT;
		this.floor.onMe = this.floor;
	}
	if((this.x+this.w)>=100){
		this.x = (100-this.w);
		this.pushingMe !== this ? this.pushingMe.alignR(this.x-this.pushingMe.w) : null;
	}
	if(this.x>(this.onMe.x+this.onMe.w)){
		this.onMe.landed = false;
		this.onMe.base = HEIGHT;
		this.onMe = this;
	}
	for(let i = 0; i<Bodies.length;i++){
		if(this.main === true && this.x >= 50 && xlim<WIDTH && Bodies[i] !== this){
			Bodies[i].x -= this.speed;
			Bodies[i].ws.left = Bodies[i].x + "%";
		}
		if(this.collided === this && this.id!==Bodies[i].id && Bodies[i].id!==this.floor.id){
			if(((this.x+this.w)>=Bodies[i].x) && ((this.x+this.w)<(Bodies[i].x+Bodies[i].w))){
				if(((this.y+this.h)>(Bodies[i].y)) && ((this.y+this.h)<Bodies[i].y+Bodies[i].h+this.h-.1)){
					if(Bodies[i].mass !== 0){		
						this.collided = Bodies[i];
						if(!step){
							p = this;
							this.prevCollided !== Bodies[i] ? p.massScale += Bodies[i].mass : null;
							console.log(p.massScale + " 1st " + this.mass)
						}
						else{
							this.prevCollided !== Bodies[i] ? p.massScale += Bodies[i].mass : null;
						}
						Bodies[i].pushingMe = this;
						this.prevCollided = Bodies[i];
					//Compare masses and push
						if(p !== undefined && p.massScale<p.mass){
							this.collided.right(true,this.speed,p);
						}
						else if(this.collided !== this && p.massScale>=p.mass){
							this.pushingMe !== this ? this.alignR(this.collided.x-this.w) : null;
							return;
						}
					//stop	
					}
					else{
						this.x = (Bodies[i].x-this.w);
						this.pushingMe !== this ? this.pushingMe.alignR(this.x-this.pushingMe.w) : null;
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

obj.prototype.left = function(step=false,v,pusher){
	if(this.dir === 1){
		preLoop();
		this.dir = 0;
	}else{this.dir = 0}
	let p = pusher;
	!step ? this.pushingMe = this : null;
	this.collided = this;
	this.speed = v || this.speed;
	if(this.main === false){
		this.x>xbegin ? this.x -= this.speed : null;
	}
	else{
		if(this.midway === true && xlim<=100){
			this.midway = false;
			this.x>xbegin ? this.x -= this.speed : null;
		}
		if(this.x>50 && xlim>=WIDTH){
			this.x>xbegin ? this.x -= this.speed : null;
		}
		else{this.midway = true}
		if(this.midway === true && xlim>100){
			console.log(xlim)
			xbegin += this.speed;
			xlim -= this.speed;
		}
	}
	if((this.x+this.w)<=this.floor.x){
		this.landed = false;
		this.onMe.landed = false;
		this.pushingMe.collided = this.pushingMe;
		this.base = HEIGHT;
		this.floor.onMe = this.floor;
	}
	if(this.x<=xbegin){
		this.x = xbegin;
		this.pushingMe !== this ? this.pushingMe.alignL(this.x+this.w) : null;
	}
	if((this.x+this.w)<this.onMe.x){
		this.onMe.landed = false;
		this.onMe.base = HEIGHT;
		this.onMe = this;
	}
	for(let i = 0; i<Bodies.length;i++){
		if(this.main === true && this.midway === true && xlim>100 && Bodies[i] !== this){
			Bodies[i].x += this.speed;
			Bodies[i].ws.left = Bodies[i].x + "%";
		}
		if(this.id!==Bodies[i].id && Bodies[i].id!==this.floor.id){
			if((this.x<=(Bodies[i].x+Bodies[i].w)) && ((this.x)>Bodies[i].x)){
				if(((this.y+this.h)>(Bodies[i].y)) && ((this.y+this.h)<=Bodies[i].y+Bodies[i].h+this.h-.1)){
					if(Bodies[i].mass !== 0){
						this.collided = Bodies[i];		
						if(!step){
							p = this;
							this.prevCollided !== Bodies[i] ? p.massScale += Bodies[i].mass : null;
							console.log(p.massScale + " 1st " + this.mass)
						}
						else{
							this.prevCollided !== Bodies[i] ? p.massScale += Bodies[i].mass : null;	
						}
						Bodies[i].pushingMe = this;
						this.prevCollided = Bodies[i];
					//Compare masses and push
						if(p !== undefined && p.massScale<p.mass){
							this.collided.left(true,this.speed,p);
						}
						else if(this.collided !== this && p.massScale>=p.mass){
							this.pushingMe !== this ? this.alignL(this.collided.x+this.collided.w) : null;
							return;
						}
					//stop	
					}
					else{
						this.x = (Bodies[i].x+Bodies[i].w);
						this.pushingMe !== this ? this.pushingMe.alignL(this.x+this.w) : null;
					}
				}
				else{}
			}
			else{}
		}
		else{}	
	}	
	this.ws.left = this.x + "%";
	step ? null : this.mlA = requestAnimationFrame(()=>{this.left()});
}
obj.prototype.alignL = function(x){
	this.x = x;
	this.ws.left = this.x + "%";
	this.pushingMe !== this ? this.pushingMe.alignL(this.x+this.w) : null;
}
obj.prototype.alignR = function(x){
	this.x = x;
	this.ws.left = this.x + "%";
	this.pushingMe !== this ? this.pushingMe.alignR(this.x-this.pushingMe.w) : null;
}
let F9 = function(){
	window.g = 9.82;
	window.Bodies = [];
	window.ranHue = randomColor();
	window.WIDTH = window.xlim = 100;
	window.HEIGHT = window.ylim = 100;
	window.xbegin = window.ybegin = 0;
	window.showmass = false;
	pull();
}
F9.prototype.mapSize = function(w,h){
	WIDTH = w;
	HEIGHT = h;
}
F9.prototype.showMass = function(req=true){
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
		}
	}
	else{
		Bodies.push(body)
	}
}
const pull = () =>{
	for(let i = 0; i<Bodies.length; i++){
		Bodies[i].mass !== 0 || !Bodies[i].landed ? Bodies[i].fall() : null;
	}
	requestAnimationFrame(pull);
}
const preLoop = () =>{
		for(let i = 0; i<Bodies.length; i++){
			if(Bodies[i].mass > 0){
				Bodies[i].prevCollided = Bodies[i];
				Bodies[i].massScale = 0;
				Bodies[i].speed = calcSpeed(Bodies[i].mass);
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
