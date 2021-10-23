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
	this.weight = calcWeight(this.mass);
	this.weightReserve = this.weight;
	this.Jspeed = params.JumpSpeed || 1;
	this.stroke = params.stroke || 0;
	this.speed = params.speed || calcSpeed(this.mass);
	this.speedReserve = this.speed;
	this.onMe = this;
	this.floor = this;
	this.base = HEIGHT;
	this.collided = this;
	this.pushingMe = this;
	this.walking = false;
	this.massScale = 0;
	this.massMul = this.mass;
	this.dir = undefined;
	this.locked = false;
	this.prevCollided = this;
	this.butKicKer = this;
	this.showMass = params.showMass === undefined ? false : params.showMass;
	this.XcropRatio = (params.XcropRatio/100) || 0.17;
	this.YcropRatio = (params.YcropRatio/100) || 0.17;
	this.cropX = params.cropX !== undefined ? params.cropX : false;
	this.cropX ? this.boundX = (this.XcropRatio*this.w) : this.boundX = 0;
	this.cropY = params.cropY !== undefined ? params.cropY : false;
	this.cropY ? this.boundY = (this.YcropRatio*this.h) : this.boundY = 0;
	this.tuD = document.createElement("div");
	showmass && this.showMass ? this.tuD.innerHTML = this.mass + "kg" : null;
	this.hooker = false;
	this.on_ground = false;
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
obj.prototype.setMass = function(value){
	this.mass = this.massReserve = value;
	this.weight = this.weightReserve = calcWeight(this.mass);
	this.speed = this.speedReserve = calcSpeed(this.mass);
	this.showMass && showmass ? this.tuD.innerHTML = this.mass + "kg" : null;
	value === 0 ? this.landed = true : this.landed = false;
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
	if(this.landed && this.on_ground){
		const jmp = () =>{
			this.y -= this.butKicKer.Jspeed;
			this.ws.top = this.y + "%";
			for(let i = 0; i<Bodies.length; i++){
				if(this!==Bodies[i]){
					let b1 = (this.y+this.h+1)-this.boundY;
					let b2 = Bodies[i].y+Bodies[i].h;
					if(((this.y+this.boundY)-1<=b2) && (b1>b2) && ((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)) && ((this.x+this.w)-(this.boundX)>Bodies[i].x)){
						if(Bodies[i].landed && Bodies[i].mass<this.mass){
							Bodies[i].floor = Bodies[i];
							this.onMe = this;
							Bodies[i].butKicKer = this;
							Bodies[i].jump();
						}
						else if(!Bodies[i].landed && Bodies[i].mass<this.mass){
							Bodies[i].landed = true;
							Bodies[i].on_ground = true;
							Bodies[i].floor = Bodies[i];
							this.onMe = this;
							Bodies[i].butKicKer = this;
							Bodies[i].jump();
						}
						if(Bodies[i].mass === 0 || Bodies[i].mass>this.mass || Bodies[i].mass === this.mass){
							this.jcount = this.maxH;
							if(this.butKicKer !== this){
								this.butKicKer.jcount = this.butKicKer.maxH;
								this.butKicKer = this;
							}
						}
					this.weight = this.weightReserve;
					preLoop()
					}
					else{this.ws.top = this.y + "%";}
				}
			}
		
			if(this.jcount<this.maxH){
				this.jcount += this.butKicKer.Jspeed;
				this.jAnim = requestAnimationFrame(jmp);
			}
			else if(this.jcount>=this.maxH){
				this.jcount = 0;
				this.weight = this.weightReserve;
				this.landed = false;
				cancelAnimationFrame(this.jAnim);
				return;
			}
		}
		if((this.onMe === this ) || (this.onMe !== this && this.mass>this.onMe.mass)){
			this.on_ground = false;
			jmp();
		}
		else{return}
	}
}
obj.prototype.fall = function(){
	if(this.landed === false){
		this.y += this.weight;
		this.onMe.base = HEIGHT;
		this.onMe.landed = false;
		for(let i = 0; i<Bodies.length; i++){
			if(this!==Bodies[i]){
				let b1 = (this.y+this.h)-this.boundY;
				let b2 = (Bodies[i].y+Bodies[i].h);
				if((b1>=(Bodies[i].y+Bodies[i].boundY)) && (b1<b2) && ((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX) && ((this.x+this.w)-(this.boundX)>(Bodies[i].x+Bodies[i].boundX))){
					Bodies[i].mass !== 0 && Bodies[i].landed === false && Bodies[i].mass<this.mass ? Bodies[i].weight = this.weight+.001 : null;
					Bodies[i].mass === 0 ? this.base = (Bodies[i].y+this.boundY) : this.base = (Bodies[i].base-Bodies[i].h)+Bodies[i].boundY+this.boundY;
					this.floor = Bodies[i];
					Bodies[i].onMe = this;
					this.weight = this.weightReserve;
					preLoop()
				}
			}
		}
		if(((this.y+this.h)-this.boundY)>=this.base){
			this.landed = true;
			this.on_ground = true;
			this.weight = this.weightReserve;
			this.y = (this.base-this.h);
			this.butKicKer.butKicKer = this.butKicKer;
			this.butKicKer = this;
			this.ws.top = this.y + "%";
		}
		else if((this.y+this.h)-this.boundY>=yend){
			this.landed = true;
			this.on_ground = true;
			this.y = (yend-this.h)+this.boundY;
			this.butKicKer.butKicKer = this.butKicKer;
			this.butKicKer = this;
			this.ws.top = this.y + "%";
		}
		else{
			this.ws.top = this.y + "%";
		}
	}
	else{return}
}

obj.prototype.right = function(step=false,v=this.speed,pusher=this){
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
	!step ? this.pushingMe = this : null;
	this.collided = this;
	if(this.main === false){
		this.x += v;
		this.fixedX += v;
	}
	else{
		if(this.x<50 || xlim>=WIDTH){
			this.Xmidway = false;
			this.x += v;
			this.fixedX += v;
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
			this.Xmidway = true;
			this.x = 50;
			this.ws.left = this.x + "%";
			xbegin -= v;
			xend -= v;
			xlim += v;
			for(let i = 0; i<Bodies.length;i++){
				if(this.x >= 50 && xlim<WIDTH && Bodies[i] !== this){
					Bodies[i].x -= v;
					Bodies[i].ws.left = Bodies[i].x + "%";	
				}
			}
		}
	}	
	if((this.x+this.boundX)>=(this.floor.x+this.floor.w)-this.floor.boundX){
		this.landed = false;
		this.pushingMe.collided = this.pushingMe;
		this.base = HEIGHT;
		this.floor.onMe = this.floor;
		this.floor = this;
	}
	if(((this.x+this.w)-(this.boundX))>=xend){
		this.x = xend-(this.w-(this.boundX));
		this.pushingMe !== this ? this.alignR(this.x) : this.ws.left = this.x + "%";
		return;
	}
	if((this.x+(this.boundX))>=((this.onMe.x+this.onMe.w)-this.onMe.boundX)){
		this.onMe.landed = false;
		this.onMe.base = HEIGHT;
		this.onMe = this;
	}
	for(let i = 0; i<Bodies.length;i++){
		if(Bodies[i] !== this && Bodies[i] !== this.floor){
			if(((this.x+this.w)-(this.boundX)>(Bodies[i].x+Bodies[i].boundX)) && ((this.x+this.w)-(this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX)){
				if(((this.y+this.h)-this.boundY>(Bodies[i].y+Bodies[i].boundY)) && ((this.y+this.h+1)-this.boundY<((Bodies[i].y+Bodies[i].h+this.h)-Bodies[i].boundY))){
					pusher.massMul *= Bodies[i].mass;
					this.collided = Bodies[i];
					this.prevCollided !== Bodies[i] ? pusher.massScale += Bodies[i].mass : null;
					if(Bodies[i].mass === 0){
						pusher.x === 50 ? UnDoo(v,1) : null;
						this.x = (Bodies[i].x+Bodies[i].boundX)-(this.w-this.boundX);
						this.pushingMe !== this ? this.alignR(this.x) : this.ws.left = this.x + "%";
						pusher !== this ? pusher.hooker = true : null;
						return;
					}
					else{		
						Bodies[i].pushingMe = this;
						this.prevCollided = Bodies[i];
						if(pusher.massScale<pusher.mass){
							this.onMe === Bodies[i] ? null : this.collided.right(true,v,pusher);
						}
						else if(this.collided !== this && pusher.massScale>=pusher.mass){
							pusher.x === 50 ? UnDoo(v,1) : null;
							this.x = (Bodies[i].x+Bodies[i].boundX)-(this.w-this.boundX);
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
obj.prototype.left = function(step=false,v=this.speed,pusher=this){
	if(this.hooker){
		this.hooker = false;
		return;
	}
	if(this.dir === 1){
		preLoop();
		this.dir = 0;
	}else{this.dir = 0}
	!step ? this.pushingMe = this : null;
	this.collided = this;
	if(this.main === false){
		this.x -= v;
		this.fixedX -= v;
	}
	else{
		if(this.Xmidway === true && xlim<=100){
			this.Xmidway = false;
			xlim = 100;
			for(let i = 0; i<Bodies.length; i++){
				if(Bodies[i]!==MAIN){
					Bodies[i].x = Bodies[i].fixedX;
					Bodies[i].ws.left = Bodies[i].x + "%";
				}
			}
			this.x -= v;
			this.fixedX -= v;
		}
		if(this.x>50 && xlim>=WIDTH){
			this.x -= v;
			this.fixedX -= v;
		}
		else{
			this.Xmidway = true;
			}
		if(this.Xmidway === true && xlim>100){
			this.x = 50;
			this.ws.left = this.x + "%";
			xbegin += v;
			xend += v;
			xlim -= v;
			for(let i = 0; i<Bodies.length;i++){
				if(this.Xmidway === true && xlim>100 && Bodies[i] !== this){
					Bodies[i].x += v;
					Bodies[i].ws.left = Bodies[i].x + "%";
				}
			}
		}
	}
	if((this.x+this.w)-(this.boundX)<=(this.floor.x+this.floor.boundX)){
		this.landed = false;
		this.pushingMe.collided = this.pushingMe;
		this.base = HEIGHT;
		this.floor.onMe = this.floor;
		this.floor = this;
	}
	if((this.x+this.boundX)<=xbegin){
		this.x = xbegin-(this.boundX);
		this.pushingMe !== this ? this.alignL(this.x) : this.ws.left = this.x + "%";;
		return;
	}
	if((this.x+this.w)-this.boundX<=(this.onMe.x+this.onMe.boundX)){
		this.onMe.landed = false;
		this.onMe.base = HEIGHT;
		this.onMe = this;
	}
	for(let i = 0; i<Bodies.length;i++){
		if(Bodies[i] !== this && Bodies[i] !== this.floor){
			if(((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX) && ((this.x+this.boundX)>(Bodies[i].x+Bodies[i].boundX))){
				if(((this.y+this.h)-this.boundY>(Bodies[i].y+Bodies[i].boundY)) && ((this.y+this.h+1)-this.boundY<((Bodies[i].y+Bodies[i].h+this.h)-Bodies[i].boundY))){
					this.collided = Bodies[i];		
					this.prevCollided !== Bodies[i] ? pusher.massScale += Bodies[i].mass : null;					
					if(Bodies[i].mass === 0){
						pusher.x === 50 ? UnDoo(v,0) : null;
						this.x = (Bodies[i].x+Bodies[i].w)-(Bodies[i].boundX+this.boundX);
						this.pushingMe !== this ? this.alignL(this.x) : this.ws.left = this.x + "%";
						pusher !== this ? pusher.hooker = true : null;
						return;
					}
					else{
						Bodies[i].pushingMe = this;
						this.prevCollided = Bodies[i];
						if(pusher.massScale<pusher.mass){
							this.onMe === Bodies[i] ? null : this.collided.left(true,v,pusher);
						}
						else if(this.collided !== this && pusher.massScale>=pusher.mass){
							pusher.x === 50 ? UnDoo(v,0) : null;
							this.x = (Bodies[i].x+Bodies[i].w)-(Bodies[i].boundX+this.boundX);
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
	this.halt(0);
	this.pushingMe !== this ? this.pushingMe.alignL((this.x-this.boundX)+(this.w-this.pushingMe.boundX)) : this.ws.left = this.x + "%";
}
obj.prototype.alignR = function(x){
	this.x = this.fixedX = x;
	this.ws.left = this.x + "%";
	this.halt(1);
	this.pushingMe !== this ? this.pushingMe.alignR((this.x+this.boundX)-(this.pushingMe.w-this.pushingMe.boundX)) : this.ws.left = this.x + "%";
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
	window.showmass = true;
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
F9.prototype.hideMass = function(req=true){
	if(req){
		showmass = false;
		for(let i = 0; i<Bodies.length; i++){
			Bodies[i].tuD.innerHTML = "";	
		}
	}
	else{
		showmass = true;
		for(let i = 0; i<Bodies.length; i++){
			Bodies[i].showMass ? Bodies[i].tuD.innerHTML = Bodies[i].mass + "kg" : null;
		}
	}
}
F9.prototype.bind = function(body){
	if(body.length>0){
		for(let i = 0; i<body.length; i++){
			Bodies.push(body[i]);
			Bodies[i].space.appendChild(Bodies[i].tuD);
		//	console.log(Object.keys(Bodies[i]));
		}
	}
	else{
		Bodies.push(body);
		body.space.appendChild(body.tuD);
	//	console.log(Object.keys(body));
	}
}
const PULLL = () =>{
	if(gravitySwitch){
		for(let i = 0; i<Bodies.length; i++){
			!Bodies[i].landed ? Bodies[i].fall() : null;
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
const calcWeight = (m) =>{return m*(g/100);}
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