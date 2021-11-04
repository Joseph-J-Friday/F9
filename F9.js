"use strict";
const button = function(params){
params = params || {};
this.space = params.space || document.body;
this.class = params.styleClass;
this.x = params.x || 0;
this.y = params.y || 0;
this.w = sizeW(params.w || 20);
this.h = sizeH(params.h || 20);
this.texture = params.texture;
this.hue = params.hue || undefined;
this.visibility = params.visibility || 1;
this.mark = params.mark || "";
this.dom = document.createElement("Button");
this.dom.innerHTML = this.mark;
this.class !== undefined ? this.dom.classList.add(this.class) : null;
this.ws = this.dom.style;
this.ws.position = "fixed";
this.ws.width = this.w + "%";
this.ws.height = this.h + "%";
this.ws.top = this.y + "%";
this.ws.left = this.x + "%";
this.ws.border = "1px solid #555";
this.ws.outline = "none";
this.ws.color = "#555";
this.ws.backgroundImage = "URL(" + this.texture + ")";
this.hue === undefined ? this.ws.background = "none" : this.ws.backgroundColor = this.hue;
this.ws.opacity = this.visibility;
this.space.appendChild(this.dom);
}
button.prototype.event = function(e,l){
	this.dom.addEventListener(e,l);
}

const obj = function(params){
	params = params || {};
	this.space = params.space || document.body;
	this.main = params.main !== undefined ? params.main : false;
	this.main ? MAIN = this : null;
	this.x = params.x || 0;
	this.y = params.y || 0;
	this.jcount = 0;
	this.maxH = params.maxH || 25;
	this.fixedX = this.x;
	this.fixedY = this.y;
	this.w = sizeW(params.w || 8);
	this.h = sizeH(params.h || 8);
	this.mass = params.mass || 0;
	this.massReserve = this.mass;
	this.mass !== 0 ? this.landed = false : this.landed = true;
	this.inertia = params.inertia || .5;
	this.restitution = params.restitution || 5;
	this.hue = params.hue;
	this.texture = params.texture;
	this.weight = calcWeight(this.mass);
	this.weightReserve = this.weight;
	this.Jspeed = params.JumpSpeed || 1;
	this.stroke = params.stroke || 0;
	this.speed = params.speed || calcSpeed(this.mass);
	this.speedReserve = this.speed;
	this.onMe = this;
	this.floor = this;
	this.base = ybegin;
	this.collided = this;
	this.pushingMe = this;
	this.walking = false;
	this.massScale = 0;
	this.massMul = this.mass;
	this.dir = undefined;
	this.locked = false;
	this.prevCollided = this;
	this.butKicKer = this;
	this.allowHit = true;
	this.HC = params.baseCollision !== undefined ? params.baseCollision : true;
	this.clear = params.clear !== undefined ? params.clear : true;
	this.showMass = params.showMass === undefined ? false : params.showMass;
	this.XcropRatio = (params.XcropRatio/100) || 0;
	this.YcropRatio = (params.YcropRatio/100) || 0;
	this.boundX = (this.XcropRatio*this.w);
	this.boundY = (this.YcropRatio*this.h);
	this.tuD = document.createElement("div");
	showmass && this.showMass ? this.tuD.innerHTML = this.mass + "kg" : null;
	this.Xhooker = false;
	this.Yhooker = false;
	this.Xmidway = false; 
	this.Ymidway = false;
	this.on_ground = false;
	this.ws = this.tuD.style;
	this.ws.position = "fixed";
	this.ws.width = this.w + "%";
	this.ws.height = this.h + "%";
	this.ws.bottom = this.y + "%";
	this.ws.left = this.x + "%";
	this.ws.fontSize = "40%";
	this.ws.textAlign = "center";
	this.ws.fontWeight = "bolder";
	this.ws.overflow = "hidden";
	this.ws.display = "block";
	this.roundness = params.roundness || 0;
	this.ws.borderRadius = this.roundness + "%";
	this.ws.backgroundImage = "URL(" + this.texture + ")";
	this.ws.backgroundOrigin = "top";
	this.ws.backgroundSize = "100% 100%";
	this.ws.backgroundRepeat = "no-repeat";
	this.mass === 0 ? this.ws.backgroundColor = ranHue : this.ws.backgroundColor = this.hue;
	this.ws.border = this.stroke + "px solid white"
	this.w += sizeW(this.stroke*2);
	this.h += sizeH(this.stroke*2);	
}
obj.prototype.targetMainAt = function(newobj){
	this.main = false;
	newobj.main = true;
	MAIN = newobj;
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
	switch(AF){
		case 0:
			cancelAnimationFrame(this.mlA);
			break;
		case 1:
			cancelAnimationFrame(this.mrA);
			break;
		case 2:
			cancelAnimationFrame(this.mdA);
			break;
		default:
			cancelAnimationFrame(this.muA);
	}
	preLoop();
}
obj.prototype.jump = function(){
	if(this.landed && this.on_ground){
		const jmp = () =>{
			if(!this.main){
				this.y += this.butKicKer.Jspeed;
				this.ws.bottom = this.y + "%";
			}
			else{
				if(this.y+(this.h/2)<CAMERA_POINT || ylim>=HEIGHT){
					this.Ymidway = false;
					this.y += this.butKicKer.Jspeed;
					this.ws.bottom = this.y + "%";
				}
				if(ylim>HEIGHT){
					ylim = HEIGHT;
				}
				if(this.y+(this.h/2)>=CAMERA_POINT && ylim<HEIGHT){
					this.Ymidway = true;
					this.y = CAMERA_POINT-(this.h/2);
					this.ws.bottom = this.y + "%";
					ylim += this.butKicKer.Jspeed;
					yend -= this.butKicKer.Jspeed;
					ybegin -= this.butKicKer.Jspeed;
					for(let i = 0; i<Bodies.length; i++){
						if(Bodies[i] !== this){
							Bodies[i].y -= this.butKicKer.Jspeed;
							Bodies[i].ws.bottom = Bodies[i].y + "%";
						}
					}
				}
			}
			if((this.y+this.h)-this.boundY >= yend){
				this.jcount = this.maxH;
				if(this.butKicKer !== this){
					this.butKicKer.jcount = this.butKicKer.maxH;
					this.butKicKer = this;
				}
			}
			for(let i = 0; i<Bodies.length; i++){
				if(this !== Bodies[i]){
					if(((this.y+this.h+this.Jspeed)-this.boundY>=(Bodies[i].y+Bodies[i].boundY)) && ((this.y+this.boundY)<(Bodies[i].y+Bodies[i].boundY)) && ((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)) && ((this.x+this.w)-(this.boundX)>Bodies[i].x)){
						if(HC && Bodies[i].HC && Bodies[i].landed && Bodies[i].mass<this.mass){
							Bodies[i].floor = Bodies[i];
							this.onMe = this;
							Bodies[i].butKicKer = this;
							Bodies[i].jump();
						}
						else if(HC && Bodies[i].HC && !Bodies[i].landed && Bodies[i].mass<this.mass){
							Bodies[i].landed = true;
							Bodies[i].on_ground = true;
							Bodies[i].floor = Bodies[i];
							this.onMe = this;
							Bodies[i].butKicKer = this;
							Bodies[i].jump();
						}
						if(HC && Bodies[i].HC && Bodies[i].mass === 0 || Bodies[i].mass>this.mass || Bodies[i].mass === this.mass){
							this.jcount = this.maxH;
							this.butKicKBack();
						}
						this.weight = this.weightReserve;
						preLoop()
					}
					else{this.ws.bottom = this.y + "%"}
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
		if((this.onMe === this) || (this.onMe !== this && this.mass>this.onMe.mass)){
			this.on_ground = false;
			jmp();
		}
		else{return}
	}
}
obj.prototype.fall = function(){
	if(this.landed === false){
		this.onMe.base = ybegin;
		this.onMe.landed = false;
		if(!this.main){
			this.y -= this.weight;
			this.ws.bottom = this.y + "%";
		}
		else{
			if(this.Ymidway && ylim<=100){
				this.Ymidway = false;
				ylim = 100;
				this.y -= this.weight;
				this.ws.bottom = this.y + "%";
			}
			if(this.y+(this.h/2)>=CAMERA_POINT && ylim>=HEIGHT){
				ylim = HEIGHT;
				this.y -= this.weight;
				this.ws.bottom = this.y + "%";
			}
			else{
				this.Ymidway = true;
			}
			if(this.Ymidway && ylim>100){
				this.y = CAMERA_POINT-(this.h/2);
				this.ws.bottom = this.y + "%";
				ylim -= this.weight;
				ybegin += this.weight;
				yend += this.weight;
				for(let i = 0; i<Bodies.length; i++){
					if(Bodies[i] !== this){
						Bodies[i].y += this.weight;
						Bodies[i].ws.bottom = Bodies[i].y + "%";
					}
				}
			}
		}
		if(this.y+this.boundY<=ybegin){
	 		this.landed = true;
	 		this.on_ground = true;
	 		this.y = ybegin-this.boundY;
	 		this.butKicKer.butKicKer = this.butKicKer;
	 		this.butKicKer = this;
	 		this.ws.bottom = this.y + "%";
	 	}
		for(let i = 0; i<Bodies.length; i++){
			if(this !== Bodies[i]){
				if((((this.y+this.boundY)<=(Bodies[i].y+Bodies[i].h)-Bodies[i].boundY) && (((this.y+this.h)-this.boundY)>(Bodies[i].y+Bodies[i].boundY)) && ((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX)) && ((this.x+this.w)-(this.boundX)>(Bodies[i].x+Bodies[i].boundX)) && (Bodies[i].mass !== 0 && !Bodies[i].landed && Bodies[i].mass<this.mass)){	
					Bodies[i].weight = this.weight+.01;
				}
				else if((((this.y+this.boundY)<=(Bodies[i].y+Bodies[i].h)-Bodies[i].boundY) && (((this.y+this.h)-this.boundY)>Bodies[i].y+Bodies[i].boundY) && ((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX)) && ((this.x+this.w)-(this.boundX)>(Bodies[i].x+Bodies[i].boundX)) && Bodies[i].landed){
					if(Bodies[i].mass === 0){
						this.base = ((Bodies[i].y+Bodies[i].h)-this.boundY);
					}
					else{
						if(Bodies[i].floor === Bodies[i]){
							this.base = (ybegin+Bodies[i].h)-(Bodies[i].boundY+this.boundY);
						}
						else{
							this.base = (((Bodies[i].floor.y+Bodies[i].floor.h)-Bodies[i].boundY)+Bodies[i].h)-(Bodies[i].boundY+this.boundY);
						}
					}
					this.floor = Bodies[i];
					Bodies[i].onMe = this;
					this.weight = this.weightReserve;
					this.landed = true;
					this.on_ground = true;
					this.weight = this.weightReserve;
					this.y = this.base;
					this.butKicKer.butKicKer = this.butKicKer;
					this.butKicKer = this;
					this.ws.bottom = this.y + "%";
					preLoop()			
				}
				else{
					this.ws.bottom = this.y + "%";
				}
			}
		}
	}
	else{return}
}
obj.prototype.up = function(step=false,v=this.speed,pusher=this){
	if(this.Yhooker){
		this.Yhooker = false;
		return;
	}
	if(this.dir === 1){
		preLoop();
		this.dir = 0;
	}
	else{
		this.dir = 0;
	}
	!step ? this.pushingMe = this : null;
	this.collided = this;
	if(this.main === false){
		this.y += v;
	}
	else{
		if(this.Ymidway === true && ylim<=100){
			this.Ymidway = false;
			ylim = 100;
			this.y += v;
		}
		if(this.y>50-(this.h/2) && ylim>=HEIGHT){
			this.y += v;
		}
		else{
			this.Ymidway = true;
			}
		if(this.Ymidway === true && ylim>100){
			this.y = 50-(this.h/2);
			this.ws.top = this.y + "%";
			ybegin += v;
			yend += v;
			ylim -= v;
			for(let i = 0; i<Bodies.length;i++){
				if(Bodies[i] !== this){
					Bodies[i].y -= v;
					Bodies[i].ws.bottom = Bodies[i].y + "%";
				}
			}
		}
	}
	if((this.y+this.boundY)<=ybegin){
		this.y = ybegin-(this.boundY);
		this.pushingMe !== this ? this.alignU(this.y) : this.ws.top = this.y + "%";
		return;
	}
	for(let i = 0; i<Bodies.length;i++){
		if(Bodies[i] !== this && Bodies[i] !== this.floor){
			if(((this.x+this.w)-(this.boundX)>(Bodies[i].x+Bodies[i].boundX)) && ((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX)){
				if(((this.y+this.boundY)<(Bodies[i].y+Bodies[i].h)-Bodies[i].boundY) && ((this.y+this.h)-this.boundY)>((Bodies[i].y+Bodies[i].boundY))){
					this.collided = Bodies[i];		
					this.prevCollided !== Bodies[i] ? pusher.massScale += Bodies[i].mass : null;					
					if(Bodies[i].mass === 0){
						pusher.y === (50-(pusher.h/2)) ? UnDoo(v,3) : null;
						this.y = (Bodies[i].y+Bodies[i].h+.05)-(Bodies[i].boundY+this.boundY);
						this.pushingMe !== this ? this.alignU(this.y) : this.ws.top = (this.y-.05) + "%";
						pusher !== this ? pusher.Yhooker = true : null;
						return;
					}
					else{
						Bodies[i].pushingMe = this;
						this.prevCollided = Bodies[i];
						if(pusher.massScale<pusher.mass){
							this.collided.up(true,v,pusher);
						}
						else if(this.collided !== this && pusher.massScale>=pusher.mass){
							pusher.y === (50-(pusher.h/2)) ? UnDoo(v,3) : null;
							this.y = (Bodies[i].y+Bodies[i].h+.05)-(Bodies[i].boundY+this.boundY);
							this.pushingMe !== this ? this.alignU(this.y) : this.ws.top = (this.y-.05) + "%";;
							pusher !== this ? pusher.Yhooker = true : null;
							return;
						}
					}
				}else{}
			}
			else{}
		}
		else{}	
	}	
	this.ws.bottom = this.y + "%";
	step ? null : this.muA = requestAnimationFrame(()=>{this.up()});
}
obj.prototype.down = function(step=false,v=this.speed,pusher=this){
	if(this.Yhooker){
		this.Yhooker = false;
		return;
	}
	if(this.dir === 0){
		preLoop();
		this.dir = 1;
	}
	else{
		this.dir = 1;
	}
	!step ? this.pushingMe = this : null;
	this.collided = this;
	if(this.main === false){
		this.y += v;
	}
	else{
		if((this.y+(this.h/2))<50 || ylim>=HEIGHT){
			this.Ymidway = false;
			this.y += v;
		}
		if(ylim>=HEIGHT){
			ylim = HEIGHT;
		}
		if((this.y+(this.h/2))>=50 && ylim<HEIGHT){
			this.Ymidway = true;
			this.y = 50-(this.h/2);
			this.ws.top = this.y + "%";
			ybegin -= v;
			yend -= v;
			ylim += v;
			for(let i = 0; i<Bodies.length;i++){
				if(Bodies[i] !== this){
					Bodies[i].y -= v;
					Bodies[i].ws.top = Bodies[i].y + "%";	
				}
			}
		}
	}	

	if(((this.y+this.h)-(this.boundY))>=yend){
		this.y = yend-(this.h-this.boundY);
		this.pushingMe !== this ? this.alignD(this.y) : this.ws.top = this.y + "%";
		return;
	}
	for(let i = 0; i<Bodies.length;i++){
		if(Bodies[i] !== this && Bodies[i] !== this.floor){
			if(((this.x+this.w)-(this.boundX)>(Bodies[i].x+Bodies[i].boundX)) && ((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX)){
				if(((this.y+this.h)-this.boundY>(Bodies[i].y+Bodies[i].boundY)) && ((this.y+this.h)-this.boundY<((Bodies[i].y+Bodies[i].h)-Bodies[i].boundY))){
					pusher.massMul *= Bodies[i].mass;
					this.collided = Bodies[i];
					this.prevCollided !== Bodies[i] ? pusher.massScale += Bodies[i].mass : null;
					if(Bodies[i].mass === 0){
						pusher.y === (50-(pusher.h/2)) ? UnDoo(v,2) : null;
						this.y = ((Bodies[i].y+Bodies[i].boundY)-(this.h-this.boundY))-.05;
						this.pushingMe !== this ? this.alignD(this.y) : this.ws.top = this.y+.05 + "%";
						pusher !== this ? pusher.Yhooker = true : null;
						return;
					}
					else{		
						Bodies[i].pushingMe = this;
						this.prevCollided = Bodies[i];
						if(pusher.massScale<pusher.mass){
							this.collided.down(true,v,pusher);
						}
						else if(this.collided !== this && pusher.massScale>=pusher.mass){
							pusher.y === 50-(pusher.h/2) ? UnDoo(v,2) : null;
							this.y = ((Bodies[i].y+Bodies[i].boundY)-(this.h-this.boundY))-.05;
							this.pushingMe !== this ? this.alignD(this.y) : this.ws.top = this.y+.05 + "%";
							pusher !== this ? pusher.Yhooker = true : null;
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
	this.ws.top = this.y + "%";
	step ? null : this.mdA = requestAnimationFrame(()=>{this.down()});
}


obj.prototype.right = function(step=false,v=this.speed,pusher=this){
	if(this.Xhooker){
		this.Xhooker = false;
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
	}
	else{
		if((this.x+(this.w/2))<50 || xlim>=WIDTH){
			this.Xmidway = false;
			this.x += v;
		}
		if(xlim>=WIDTH){
			xlim = WIDTH;
		}
		if((this.x+(this.w/2))>=50 && xlim<WIDTH){
			this.Xmidway = true;
			this.x = 50-(this.w/2);
			this.ws.left = this.x + "%";
			xbegin -= v;
			xend -= v;
			xlim += v;
			for(let i = 0; i<Bodies.length;i++){
				if(Bodies[i] !== this){
					Bodies[i].x -= v;
					Bodies[i].ws.left = Bodies[i].x + "%";	
				}
			}
		}
	}	
	if((this.x+this.boundX)>=(this.floor.x+this.floor.w)-this.floor.boundX){
		this.landed = false;
		this.pushingMe.collided = this.pushingMe;
		this.base = ybegin;
		this.floor.onMe = this.floor;
		this.floor = this;
	}
	if(((this.x+this.w)-(this.boundX))>=xend){
		this.x = xend-(this.w-(this.boundX));
		this.pushingMe !== this ? this.alignR(this.x) : this.ws.left = this.x + "%";
		return;
	}
	if((this.x+this.boundX)>=((this.onMe.x+this.onMe.w)-this.onMe.boundX)){
		this.onMe.landed = false;
		this.onMe.base = ybegin;
		this.onMe = this;
	}
	for(let i = 0; i<Bodies.length;i++){
		if(Bodies[i] !== this && Bodies[i] !== this.floor){
			if(((this.x+this.w)-(this.boundX)>(Bodies[i].x+Bodies[i].boundX)) && ((this.x+this.w)-(this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX)){
				if(((this.y+this.h)-this.boundY>(Bodies[i].y+Bodies[i].boundY)) && (this.y+this.boundY)<((Bodies[i].y+Bodies[i].h)-Bodies[i].boundY)){
					pusher.massMul *= Bodies[i].mass;
					this.collided = Bodies[i]
					this.prevCollided !== Bodies[i] ? pusher.massScale += Bodies[i].mass : null;
					if(Bodies[i].mass === 0){
						pusher.x === (50-(pusher.w/2)) ? UnDoo(v,1) : null;
						this.x = (Bodies[i].x+Bodies[i].boundX)-(this.w-this.boundX);
						this.pushingMe !== this ? this.alignR(this.x) : this.ws.left = this.x + "%";
						pusher !== this ? pusher.Xhooker = true : null;
						return;
					}
					else{		
						Bodies[i].pushingMe = this;
						this.prevCollided = Bodies[i];
						if(pusher.massScale<pusher.mass){
							this.onMe === Bodies[i] ? null : this.collided.right(true,v,pusher);
						}
						else if(this.collided !== this && pusher.massScale>=pusher.mass){
							pusher.x === 50-(pusher.w/2) ? UnDoo(v,1) : null;
							this.x = (Bodies[i].x+Bodies[i].boundX)-(this.w-this.boundX);
							this.pushingMe !== this ? this.alignR(this.x) : this.ws.left = this.x + "%";
							pusher !== this ? pusher.Xhooker = true : null;
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
	if(this.Xhooker){
		this.Xhooker = false;
		return;
	}
	if(this.dir === 1){
		preLoop();
		this.dir = 0;
	}
	else{
		this.dir = 0
	}
	!step ? this.pushingMe = this : null;
	this.collided = this;
	if(this.main === false){
		this.x -= v;
	}
	else{
		if(this.Xmidway === true && xlim<=100){
			this.Xmidway = false;
			xlim = 100;
			this.x -= v;
		}
		if(this.x>50-(this.w/2) && xlim>=WIDTH){
			xlim = WIDTH;
			this.x -= v;
		}
		else{
			this.Xmidway = true;
		}
		if(this.Xmidway === true && xlim>100){
			this.x = 50-(this.w/2);
			this.ws.left = this.x + "%";
			xbegin += v;
			xend += v;
			xlim -= v;
			for(let i = 0; i<Bodies.length;i++){
				if(Bodies[i] !== this){
					Bodies[i].x += v;
					Bodies[i].ws.left = Bodies[i].x + "%";
				}
			}
		}
	}
	if((this.x+this.w)-(this.boundX)<=(this.floor.x+this.floor.boundX)){
		this.landed = false;
		this.pushingMe.collided = this.pushingMe;
		this.base = ybegin;
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
		this.onMe.base = ybegin;
		this.onMe = this;
	}
	for(let i = 0; i<Bodies.length;i++){
		if(Bodies[i] !== this && Bodies[i] !== this.floor){
			if(((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX) && ((this.x+this.boundX)>(Bodies[i].x+Bodies[i].boundX))){
				if(((this.y+this.h)-this.boundY>(Bodies[i].y+Bodies[i].boundY)) && (this.y+this.boundY)<(Bodies[i].y+Bodies[i].h-Bodies[i].boundY)){
					this.collided = Bodies[i];		
					this.prevCollided !== Bodies[i] ? pusher.massScale += Bodies[i].mass : null;					
					if(Bodies[i].mass === 0){
						pusher.x === (50-(pusher.w/2)) ? UnDoo(v,0) : null;
						this.x = (Bodies[i].x+Bodies[i].w)-(Bodies[i].boundX+this.boundX);
						this.pushingMe !== this ? this.alignL(this.x) : this.ws.left = this.x + "%";
						pusher !== this ? pusher.Xhooker = true : null;
						return;
					}
					else{
						Bodies[i].pushingMe = this;
						this.prevCollided = Bodies[i];
						if(pusher.massScale<pusher.mass){
							this.onMe === Bodies[i] ? null : this.collided.left(true,v,pusher);
						}
						else if(this.collided !== this && pusher.massScale>=pusher.mass){
							pusher.x === (50-(pusher.w/2)) ? UnDoo(v,0) : null;
							this.x = (Bodies[i].x+Bodies[i].w)-(Bodies[i].boundX+this.boundX);
							this.pushingMe !== this ? this.alignL(this.x) : this.ws.left = this.x + "%";;
							pusher !== this ? pusher.Xhooker = true : null;
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
obj.prototype.butKicKBack = function(){
	if(this.butKicKer !== this){
		this.butKicKer.jcount = this.butKicKer.maxH;
		this.butKicKer.butKicKBack();
	}
}
obj.prototype.alignU = function(y){
	this.y = y;
	this.ws.bottom = (this.y-.05) + "%";
	this.halt(3);
	this.pushingMe !== this ? this.pushingMe.alignU(((this.y+this.h+.05)-(this.boundY+this.pushingMe.boundY))) : this.ws.top = (this.y-.05) + "%";
}
obj.prototype.alignD = function(y){
	this.y = y;
	this.ws.bottom = this.y+.05 + "%";
	this.halt(2);
	this.pushingMe !== this ? this.pushingMe.alignD(((this.y+this.boundY)-(this.pushingMe.h-this.pushingMe.boundY))-.05) : this.ws.top = this.y+.05 + "%";
}
obj.prototype.alignR = function(x){
	this.x = x;
	this.ws.left = this.x + "%";
	this.halt(1);
	this.pushingMe !== this ? this.pushingMe.alignR((this.x+this.boundX)-(this.pushingMe.w-this.pushingMe.boundX)) : this.ws.left = this.x + "%";
}
obj.prototype.alignL = function(x){
	this.x = x;
	this.ws.left = this.x + "%";
	this.halt(0);
	this.pushingMe !== this ? this.pushingMe.alignL((this.x-this.boundX)+(this.w-this.pushingMe.boundX)) : this.ws.left = this.x + "%";
}
window.F9 = function(type="JAM"){
	window.g = 10;
	window.gameType = type;
	window.gravitySwitch = true;
	window.HC = true;
	window.UDB = false;
	window.Bodies = [];
	window.MAIN = undefined;
	window.CAMERA_POINT = 50
	window.ranHue = randomColor();
	window.WIDTH = window.xend = window.xlim = 100;
	window.HEIGHT = window.yend = window.ylim = 100;
	window.xbegin = window.ybegin = 0;
	window.showmass = true;
	PULLL();
}
F9.prototype.useDefaultButtons = function(){
	UDB = true;
	if(gameType === "RPG" || gameType === "rpg"){
		this.disableGravity();
		const u = Button({styleClass: "dir",x: 66,y: 80,w: 50,h: 50,mark: "U"});
		u.event("touchstart",()=>{MAIN.up()});
		u.event("touchend",()=>{MAIN.halt(3)});	
		const d = Button({styleClass: "dir",x: 80,y: 80,w: 50,h: 50,mark: "D"});
		d.event("touchstart",()=>{MAIN.down()});
		d.event("touchend",()=>{MAIN.halt(2)});	
		const r = Button({styleClass: "dir",x: 16,y: 90,w: 50,h: 50,mark: "R"});
		r.event("touchstart",()=>{MAIN.right()});
		r.event("touchend",()=>{MAIN.halt(1)});	
		const l = Button({styleClass: "dir",x: 2,y: 90,w: 50,h: 50,mark: "L"});
		l.event("touchstart",()=>{MAIN.left()});
		l.event("touchend",()=>{MAIN.halt(0)});
	}
	else if(gameType === "PLATFORMER" || gameType === "platformer"){
		const r = Button({styleClass: "dir",x: 16,y: 90,w: 50,h: 50,mark: "R"});
		r.event("touchstart",()=>{MAIN.right()});
		r.event("touchend",()=>{MAIN.halt(1)});	
		const l = Button({styleClass: "dir",x: 2,y: 90,w: 50,h: 50,mark: "L"});
		l.event("touchstart",()=>{MAIN.left()});
		l.event("touchend",()=>{MAIN.halt(0)});
		const j = Button({styleClass: "dir",x: 75,y: 70,w: 50,h: 50,mark: "J"});
		j.event("touchstart",()=>{MAIN.jump()});
	}
	else{
		const u = Button({styleClass: "dir",x: 66,y: 80,w: 50,h: 50,mark: "U"});
		u.event("touchstart",()=>{MAIN.up()});
		u.event("touchend",()=>{MAIN.halt(3)});	
		const d = Button({styleClass: "dir",x: 80,y: 80,w: 50,h: 50,mark: "D"});
		d.event("touchstart",()=>{MAIN.down()});
		d.event("touchend",()=>{MAIN.halt(2)});	
		const r = Button({styleClass: "dir",x: 16,y: 90,w: 50,h: 50,mark: "R"});
		r.event("touchstart",()=>{MAIN.right()});
		r.event("touchend",()=>{MAIN.halt(1)});	
		const l = Button({styleClass: "dir",x: 2,y: 90,w: 50,h: 50,mark: "L"});
		l.event("touchstart",()=>{MAIN.left()});
		l.event("touchend",()=>{MAIN.halt(0)});
		const j = Button({styleClass: "dir",x: 75,y: 70,w: 50,h: 50,mark: "J"});
		j.event("touchstart",()=>{MAIN.jump()});
	}
		
		
}
F9.prototype.headCollision = function(hc=true){
	HC = hc;
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
	}
	else{
		WIDTH = xend = w;
	}
	if(h<100){
		HEIGHT = yend = 100;
	}
	else{
		HEIGHT = yend = h;
	}
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
F9.prototype.bind = function(...bodys){
	bodys.forEach(body=>{
		Bodies.push(body);
		body.space.appendChild(body.tuD);
	});
	UDB ? this.useDefaultButtons() : null;
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
	switch(which){
		case 0:
			xbegin -= v;
			xend -= v;
			xlim += v
			for(let i = 0; i<Bodies.length; i++){
				if(Bodies[i] !== MAIN){
					Bodies[i].x -= v;
					Bodies[i].ws.left = Bodies[i].x + "%";	
				}	
			}
			break;
		case 1:
			xbegin += v;
			xend += v;
			xlim -= v;
			for(let i = 0; i<Bodies.length; i++){
				if(Bodies[i] !== MAIN){
					Bodies[i].x += v;
					Bodies[i].ws.left = Bodies[i].x + "%";
				}			
			}
			break;
		case 2:
			ybegin += v;
			yend += v;
			ylim -= v;
			for(let i = 0; i<Bodies.length; i++){
				if(Bodies[i] !== MAIN){
					Bodies[i].y += v;
					Bodies[i].ws.bottom = Bodies[i].y + "%";
				}			
			}
			break;
		default:
			ybegin -= v;
			yend -= v;
			ylim += v;
			for(let i = 0; i<Bodies.length; i++){
				if(Bodies[i] !== MAIN){
					Bodies[i].y -= v;
					Bodies[i].ws.bottom = Bodies[i].y + "%";
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
const calcWeight = (m) =>{return m*(g/100)}
const calcSpeed = (m) =>{return (g*.5)/(m)}
const sizeW = (w) =>{return (w/window.innerWidth)*100}
const sizeH = (h) =>{return (h/window.innerHeight)*100}
const randomColor = () =>{return "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ","  + Math.floor(Math.random() * 256) + ")"}
const CloneF9Engine = (type) =>{return new F9(type)}
const Obj = (params) => {return new obj(params)}
const Button = (params) => {return new button(params)}