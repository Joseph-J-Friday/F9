"use strict";
let F9 = {
	Engine: {},
	World: {},
	Renderer: {},
	Bodies: {},
	Button: {}
};
const button = function(x,y,w,h,options){
	try{
		options = options || {};
		this.space = options.space || document.body;
		this.class = options.styleClass;
		this.x = x || 0;
		this.y = y || 0;
		this.rawW = w || 20;
		this.rawH = h || 20;
		this.w = this.rawW;
		this.h = this.rawH;
		this.texture = options.texture;
		this.hue = options.hue || undefined;
		this.visibility = options.visibility || .5;
		this.mark = options.mark || "";
		this.dom = document.createElement("Button");
		this.dom.innerHTML = this.mark;
		this.class !== undefined ? this.dom.classList.add(this.class) : null;
		this.ws = this.dom.style;
		this.ws.position = "fixed";
		this.ws.width = this.w + "px";
		this.ws.height = this.h + "px";
		this.ws.bottom = this.y + "%";
		this.ws.left = this.x + "%";
		this.ws.border = "1px solid #555";
		this.ws.outline = "none";
		this.ws.color = "#555";
		this.ws.backgroundImage = "URL(" + this.texture + ")";
		this.hue === undefined ? this.ws.background = "none" : this.ws.backgroundColor = this.hue;
		this.ws.opacity = this.visibility;
		this.space.appendChild(this.dom);
		Buttons.push(this);
	}
	catch(err){
		console.log("Error while parsing object parameters\n\n("+err+")");
	}
}
button.prototype.event = function(e,l){
	this.dom.addEventListener(e,l);
}
const obj = function(x,y,w,h,options){
	try{
		options = options || {};
		this.space = options.space || document.body;
		this.main = options.main !== undefined ? options.main : false;
		this.main ? MAIN = this : null;
		this.rawX = x || 0;
		this.rawY = y || 0;
		this.x = this.rawX;
		this.y = this.yer = this.rawY;
		this.jcount = 0;
		this.maxH = options.maxH || 120;
		this.rawW = w || 10;
		this.rawH = h || 10;
		this.w = this.rawW;
		this.h = this.rawH;
		this.mass = options.mass || 0;
		this.massReserve = this.mass;
		this.mass !== 0 ? this.landed = false : this.landed = true;
		this.inertia = options.inertia || .5;
		this.restitution = options.restitution || 5;
		this.hue = options.hue;
		this.texture = options.texture;
		this.weight = calcWeight(this.mass);
		this.weightReserve = this.weight;
		this.Jspeed = options.JumpSpeed || 10;
		this.stroke = options.stroke || 0;
		this.friction = options.friction!==0 && options.friction!==undefined ? options.friction : 1;
		this.speed = (options.velocity||3)-this.friction;
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
		this.HC = options.baseCollision !== undefined ? options.baseCollision : true;
		this.clear = options.clear !== undefined ? options.clear : true;
		this.showMass = options.showMass === undefined ? false : options.showMass;
		this.XcropRatio = (options.XcropRatio/100) || 0;
		this.YcropRatio = (options.YcropRatio/100) || 0;
		this.boundX = (this.XcropRatio*this.w);
		this.boundY = (this.YcropRatio*this.h);
		this.tuD = document.createElement("div");
		showmass && this.showMass ? this.tuD.innerHTML = this.mass + "kg" : null;
		this.Xhooker = false;
		this.Yhooker = false;
		this.Xmidway = false; 
		this.Ymidway = false;
		this.on_ground = false;
		this.physical = options.physical !== undefined ? options.physical : true;
		this.ws = this.tuD.style;
		this.ws.position = "fixed";
		this.ws.width = this.w + "px";
		this.ws.height = this.h + "px";
		this.ws.bottom = this.y + "px";
		this.ws.left = this.x + "px";
		this.ws.fontSize = "40px";
		this.ws.textAlign = "center";
		this.ws.fontWeight = "bolder";
		this.ws.overflow = "hidden";
		this.ws.display = "block";
		this.roundness = options.roundness || 0;
		this.ws.borderRadius = this.roundness + "%";
		this.ws.backgroundImage = "URL("+this.texture+")";
		this.ws.backgroundOrigin = "top";
		this.ws.backgroundSize = th!==undefined ? tw+"%"+th+"%" : tw+"%";
		this.ws.backgroundRepeat = tr;
		this.texture !== undefined ? null : this.ws.backgroundColor = this.hue;
		this.ws.border = this.stroke + "px solid white"
		this.w += this.stroke*2;
		this.h += this.stroke*2;	
		this.hasMass = this.HasMass();
	}
	catch(err){
		console.log("Error while parsing object parameters\n\n("+err+")");
	}
}
obj.prototype.HasMass = function(){
	if(this.mass === 0 || this.mass === undefined || this.mass === null){
		return false;
	}
	else{
		return true;
	}
}
obj.prototype.targetMainAt = function(newobj){
	this.main = false;
	newobj.main = true;
	MAIN = newobj;
}
obj.prototype.setMass = function(value){
	this.mass = this.massReserve = value;
	this.hasMass = this.HasMass();
	this.weight = this.weightReserve = calcWeight(this.mass);
	this.showMass && showmass ? this.tuD.innerHTML = this.mass + "kg" : null;
	value === 0 ? this.landed = true : this.landed = false;
}
obj.prototype.setRoundness = function(value){
	this.roundness = value;
	this.ws.borderRadius = this.roundness + "px";
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
	if((this.main && JCC<JC) || (!this.main && this.landed)){
		const jmp = () =>{
			if(CT === "locked-on"){
				if(!this.main){
					this.y += this.butKicKer.Jspeed;
					this.yer += this.butKicKer.Jspeed;
					this.ws.bottom = this.y + "px";
				}
				else{
					if(this.y+(this.h/2)<CYLP || ylim>=HEIGHT){
						this.Ymidway = false;
						this.y += this.butKicKer.Jspeed;
						this.ws.bottom = this.y + "px";
					}
					if(ylim>HEIGHT){
						ylim = HEIGHT;
					}
					if(this.y+(this.h/2)>=CYLP && ylim<HEIGHT){
						this.Ymidway = true;
						this.y = CYLP-(this.h/2);
						this.ws.bottom = this.y + "px";
						ylim += this.butKicKer.Jspeed;
						yend -= this.butKicKer.Jspeed;
						ybegin -= this.butKicKer.Jspeed;
						for(let i = 0; i<Bodies.length; i++){
							if(Bodies[i] !== this){
								Bodies[i].y -= this.butKicKer.Jspeed;
								Bodies[i].ws.bottom = Bodies[i].y + "px";
							}
						}
					}
				}
			}
			else if(CT === "fixed"){
				this.y += this.butKicKer.Jspeed;
				this.ws.bottom = this.y + "px";
			}
			
			if((this.y+this.h)-this.boundY >= yend){
				this.jcount = this.maxH;
				if(this.butKicKer !== this){
					this.butKicKer.jcount = this.butKicKer.maxH;
					this.butKicKer = this;
				}
			}
			for(let i = 0; i<Bodies.length; i++){
				if(this !== Bodies[i] && this.physical){
					if(((this.y+this.h+this.Jspeed)-this.boundY>=(Bodies[i].y+Bodies[i].boundY)) && ((this.y+this.boundY)<(Bodies[i].y+Bodies[i].boundY)) && ((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)) && ((this.x+this.w)-(this.boundX)>Bodies[i].x)){
						if(HC && Bodies[i].HC && Bodies[i].landed && Bodies[i].mass<this.mass && Bodies[i].mass!==0){
							Bodies[i].floor = Bodies[i];
							this.onMe = this;
							Bodies[i].butKicKer = this;
							Bodies[i].jump();
						}
						else if(HC && Bodies[i].HC && !Bodies[i].landed && Bodies[i].mass<this.mass){
							Bodies[i].landed = true;
							Bodies[i].floor = Bodies[i];
							this.onMe = this;
							Bodies[i].butKicKer = this;
							Bodies[i].jump();
						}
						if(HC && Bodies[i].HC && (Bodies[i].mass === 0 || Bodies[i].mass>this.mass || Bodies[i].mass === this.mass)){
							cancelAnimationFrame(this.jAnim);
							this.butKicKBack();
						}
						preLoop();
					}
					else{this.ws.bottom = this.y + "px"}
				}
			}
		
			if(this.jcount<this.maxH){
				this.jcount += this.butKicKer.Jspeed;
				this.jAnim = requestAnimationFrame(jmp);
			}
			else if(this.jcount>=this.maxH){
				this.jcount = 0;
				cancelAnimationFrame(this.jAnim);
				this.landed = false;
				return;
			}
		}
		if((this.onMe === this) || (this.onMe !== this && this.mass>this.onMe.mass)){
			this.jcount = 0;
			if(this.main) JCC++; this.landed = true;
			jmp();
		}
		else{return}
	}
}
obj.prototype.fall = function(){
	if(this.landed === false){
		this.onMe.base = ybegin;
		this.onMe.landed = false;
		if(CT === "locked-on"){
			if(!this.main){
				this.y -= this.weight;
				this.yer -= this.weight;
				this.ws.bottom = this.y + "px";
			}
			else{
				if(this.Ymidway && ylim<=SH()){
					this.Ymidway = false;
					ylim = SH();
					this.y -= this.weight;
					this.ws.bottom = this.y + "px";
				}
				if(this.y+(this.h/2)>=CYLP && ylim>=HEIGHT){
					this.Ymidway = false;
					ylim = HEIGHT;
					this.y -= this.weight;
					this.ws.bottom = this.y + "px";
				}
				else{
					this.Ymidway = true;
				}
				if(this.Ymidway && ylim>SH()){
					this.y = CYLP-(this.h/2);
					this.ws.bottom = this.y + "px";
					for(let i = 0; i<Bodies.length; i++){
						if(Bodies[i] !== this && (Bodies[i].y+this.weight) <= Bodies[i].yer){
							iTsaFe = true;
							Bodies[i].y += this.weight;
							Bodies[i].ws.bottom = Bodies[i].y + "px";
						}
						else if(Bodies[i] !== this && (Bodies[i].y+this.weight) >= Bodies[i].yer){
							iTsaFe = false;
							for(let i = 0; i<Bodies.length; i++){
								if(Bodies[i] !== this){
									Bodies[i].y = Bodies[i].yer;
									Bodies[i].ws.bottom = Bodies[i].y + "px";
								}
							}
						}
					}
					if(iTsaFe){
						ylim -= this.weight;
						ybegin += this.weight;
						yend += this.weight;
					}
					else{
						ylim = SH();
						ybegin = ybeginR;
						yend = HEIGHT;
					}
				}
			}
		}
		else if(CT === "fixed"){
			this.y -= this.weight;
			this.ws.bottom = this.y + "px";
		}
		if(this.y+this.boundY<=ybegin){
			if(this.main) JCC = 0;
	 		this.landed = true;
	 		this.y = ybegin-this.boundY;
	 		this.butKicKer.butKicKer = this.butKicKer;
	 		this.butKicKer = this;
	 		this.ws.bottom = this.y + "px";
	 	}
		for(let i = 0; i<Bodies.length; i++){
			if(this !== Bodies[i] && this.physical){
				if((((this.y+this.boundY)<=(Bodies[i].y+Bodies[i].h)-Bodies[i].boundY) && (((this.y+this.h)-this.boundY)>(Bodies[i].y+Bodies[i].boundY)) && ((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX)) && ((this.x+this.w)-(this.boundX)>(Bodies[i].x+Bodies[i].boundX)) && (Bodies[i].mass !== 0 && !Bodies[i].landed && Bodies[i].mass<this.mass)){	
					Bodies[i].weight = this.weight+.01;
				}
				else if((((this.y+this.boundY)<=(Bodies[i].y+Bodies[i].h)-Bodies[i].boundY) && (((this.y+this.h)-this.boundY)>Bodies[i].y+Bodies[i].boundY) && ((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX)) && ((this.x+this.w)-(this.boundX)>(Bodies[i].x+Bodies[i].boundX)) && Bodies[i].landed){
					if(Bodies[i].mass === 0){
						this.Ymidway && this.main ? diff = ((Bodies[i].y+Bodies[i].h)-Bodies[i].boundY) - (this.y+this.boundY) : null;
						this.base = ((Bodies[i].y+Bodies[i].h)-this.boundY);
					}
					else{
						if(Bodies[i].floor === Bodies[i]){
							this.Ymidway && this.main ? diff = ((Bodies[i].y+Bodies[i].h)-Bodies[i].boundY) - (this.y+this.boundY) : null;
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
					this.y = this.yer = this.base;
					this.butKicKer.butKicKer = this.butKicKer;
					this.butKicKer = this;
					this.ws.bottom = this.y + "px";
					if(this.main) JCC = 0;
					preLoop()			
				}
				else{
					this.ws.bottom = this.y + "px";
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
			this.ws.top = this.y + "px";
			ybegin += v;
			yend += v;
			ylim -= v;
			for(let i = 0; i<Bodies.length;i++){
				if(Bodies[i] !== this){
					Bodies[i].y -= v;
					Bodies[i].ws.bottom = Bodies[i].y + "px";
				}
			}
		}
	}
	if((this.y+this.boundY)<=ybegin){
		this.y = ybegin-(this.boundY);
		this.pushingMe !== this ? this.alignU(this.y) : this.ws.top = this.y + "px";
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
						this.pushingMe !== this ? this.alignU(this.y) : this.ws.top = (this.y-.05) + "px";
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
							this.pushingMe !== this ? this.alignU(this.y) : this.ws.top = (this.y-.05) + "px";;
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
	this.ws.bottom = this.y + "px";
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
			this.ws.top = this.y + "px";
			ybegin -= v;
			yend -= v;
			ylim += v;
			for(let i = 0; i<Bodies.length;i++){
				if(Bodies[i] !== this){
					Bodies[i].y -= v;
					Bodies[i].ws.top = Bodies[i].y + "px";	
				}
			}
		}
	}	

	if(((this.y+this.h)-(this.boundY))>=yend){
		this.y = yend-(this.h-this.boundY);
		this.pushingMe !== this ? this.alignD(this.y) : this.ws.top = this.y + "px";
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
						this.pushingMe !== this ? this.alignD(this.y) : this.ws.top = this.y+.05 + "px";
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
							this.pushingMe !== this ? this.alignD(this.y) : this.ws.top = this.y+.05 + "px";
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
	this.ws.top = this.y + "px";
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
	if(CT === "locked-on"){
		if(this.main === false){
			this.x += v;
		}
		else{
			if((this.x+(this.w/2))<CXLP || xlim>=WIDTH){
				this.Xmidway = false;
				this.x += v;
			}
			if(xlim>=WIDTH){
				xlim = WIDTH;
			}
			if((this.x+(this.w/2))>=CXLP && xlim<WIDTH){
				this.Xmidway = true;
				this.x = CXLP-(this.w/2);
				this.ws.left = this.x + "px";
				xbegin -= v;
				xend -= v;
				xlim += v;
				this.x += v;
				for(let i = 0; i<Bodies.length;i++){
					if(Bodies[i] !== this){
						Bodies[i].x -= v;
						Bodies[i].ws.left = Bodies[i].x + "px";	
					}
				}
			}
		}	
	}
	else if(CT === "fixed"){
		this.x += v;
	}
	if((this.x+this.boundX)>=(this.floor.x+this.floor.w)-this.floor.boundX){
		this.pushingMe.collided = this.pushingMe;
		this.base = ybegin;
		this.floor.onMe = this.floor;
		this.floor = this;
		this.landed = false;
	}
	if(((this.x+this.w)-(this.boundX))>=xend){
		this.x = xend-(this.w-(this.boundX));
		this.pushingMe !== this ? this.alignR(this.x) : this.ws.left = this.x + "px";
		return;
	}
	if((this.x+this.boundX)>=((this.onMe.x+this.onMe.w)-this.onMe.boundX)){
		this.onMe.landed = false;
		this.onMe.base = ybegin;
		this.onMe = this;
	}
	for(let i = 0; i<Bodies.length;i++){
		if(Bodies[i] !== this && this.physical && Bodies[i] !== this.floor){
			if(((this.x+this.w)-(this.boundX)>(Bodies[i].x+Bodies[i].boundX)) && ((this.x+this.w)-(this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX)){
				if(((this.y+this.h)-this.boundY>(Bodies[i].y+Bodies[i].boundY)) && (this.y+this.boundY)<((Bodies[i].y+Bodies[i].h)-Bodies[i].boundY)){
					pusher.massMul *= Bodies[i].mass;
					this.collided = Bodies[i]
					this.prevCollided !== Bodies[i] ? pusher.massScale += Bodies[i].mass : null;
					if(Bodies[i].mass === 0){
						pusher.x === (CXLP-(pusher.w/2)) ? UnDoo(v,1) : null;
						this.x = (Bodies[i].x+Bodies[i].boundX)-(this.w-this.boundX);
						this.pushingMe !== this ? this.alignR(this.x) : this.ws.left = this.x + "px";
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
							pusher.x === CXLP-(pusher.w/2) ? UnDoo(v,1) : null;
							this.x = (Bodies[i].x+Bodies[i].boundX)-(this.w-this.boundX);
							this.pushingMe !== this ? this.alignR(this.x) : this.ws.left = this.x + "px";
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
	this.ws.left = this.x + "px";
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
	if(CT === "locked-on"){
		if(this.main === false){
			this.x -= v;
		}
		else{
			if(this.Xmidway === true && xlim<=SW()){
				this.Xmidway = false;
				xlim = SW();
				this.x -= v;
			}
			if(this.x>CXLP-(this.w/2) && xlim>=WIDTH){
				xlim = WIDTH;
				this.x -= v;
			}
			else{
				this.Xmidway = true;
			}
			if(this.Xmidway === true && xlim>SW()){
				this.x = CXLP-(this.w/2);
				this.ws.left = this.x + "px";
				xbegin += v;
				xend += v;
				xlim -= v;
				for(let i = 0; i<Bodies.length;i++){
					if(Bodies[i] !== this){
						Bodies[i].x += v;
						Bodies[i].ws.left = Bodies[i].x + "px";
					}
				}
			}
		}
	}
	else if(CT === "fixed"){
		this.x -= v;
	}
	if((this.x+this.w)-(this.boundX)<=(this.floor.x+this.floor.boundX)){
		this.pushingMe.collided = this.pushingMe;
		this.base = ybegin;
		this.floor.onMe = this.floor;
		this.floor = this;
		this.landed = false;
	}
	if((this.x+this.boundX)<=xbegin){
		this.x = xbegin-(this.boundX);
		this.pushingMe !== this ? this.alignL(this.x) : this.ws.left = this.x + "px";;
		return;
	}
	if((this.x+this.w)-this.boundX<=(this.onMe.x+this.onMe.boundX)){
		this.onMe.landed = false;
		this.onMe.base = ybegin;
		this.onMe = this;
	}
	for(let i = 0; i<Bodies.length;i++){
		if(Bodies[i] !== this && this.physical && Bodies[i] !== this.floor){
			if(((this.x+this.boundX)<(Bodies[i].x+Bodies[i].w)-Bodies[i].boundX) && ((this.x+this.boundX)>(Bodies[i].x+Bodies[i].boundX))){
				if(((this.y+this.h)-this.boundY>(Bodies[i].y+Bodies[i].boundY)) && (this.y+this.boundY)<(Bodies[i].y+Bodies[i].h-Bodies[i].boundY)){
					this.collided = Bodies[i];		
					this.prevCollided !== Bodies[i] ? pusher.massScale += Bodies[i].mass : null;					
					if(Bodies[i].mass === 0){
						pusher.x === (CXLP-(pusher.w/2)) ? UnDoo(v,0) : null;
						this.x = (Bodies[i].x+Bodies[i].w)-(Bodies[i].boundX+this.boundX);
						this.pushingMe !== this ? this.alignL(this.x) : this.ws.left = this.x + "px";
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
							pusher.x === (CXLP-(pusher.w/2)) ? UnDoo(v,0) : null;
							this.x = (Bodies[i].x+Bodies[i].w)-(Bodies[i].boundX+this.boundX);
							this.pushingMe !== this ? this.alignL(this.x) : this.ws.left = this.x + "px";;
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
	this.ws.left = this.x + "px";
	step ? null : this.mlA = requestAnimationFrame(()=>{this.left()});
}
obj.prototype.butKicKBack = function(){
	if(this.butKicKer !== this){
		this.butKicKer.jcount = this.butKicKer.maxH;
		this.butKicKer.butKicKBack();
	}
	else{
		this.jcount = this.maxH;
	}
}
obj.prototype.alignU = function(y){
	this.y = y;
	this.ws.bottom = (this.y-.05) + "px";
	this.halt(3);
	this.pushingMe !== this ? this.pushingMe.alignU(((this.y+this.h+.05)-(this.boundY+this.pushingMe.boundY))) : this.ws.top = (this.y-.05) + "px";
}
obj.prototype.alignD = function(y){
	this.y = y;
	this.ws.bottom = this.y+.05 + "px";
	this.halt(2);
	this.pushingMe !== this ? this.pushingMe.alignD(((this.y+this.boundY)-(this.pushingMe.h-this.pushingMe.boundY))-.05) : this.ws.top = this.y+.05 + "px";
}
obj.prototype.alignR = function(x){
	this.x = x;
	this.ws.left = this.x + "px";
	this.halt(1);
	this.pushingMe !== this ? this.pushingMe.alignR((this.x+this.boundX)-(this.pushingMe.w-this.pushingMe.boundX)) : this.ws.left = this.x + "px";
}
obj.prototype.alignL = function(x){
	this.x = x;
	this.ws.left = this.x + "px";
	this.halt(0);
	this.pushingMe !== this ? this.pushingMe.alignL((this.x-this.boundX)+(this.w-this.pushingMe.boundX)) : this.ws.left = this.x + "px";
}
const CaMeRa = function(CAMERA_TYPE, CAMERA_X_LOCK_POINT=50, CAMERA_Y_LOCK_POINT=50){
	CT  = CAMERA_TYPE;
	CXLP = posX(CAMERA_X_LOCK_POINT);
	CYLP = posY(CAMERA_Y_LOCK_POINT);
	window.CADJM = true;
	window.DS = false;
	this.x = 0;
	this.y = 0
	this.prevx = 0;
	this.prevy = 0;
}
CaMeRa.prototype.update = function(){
	this.xdiff = this.x-this.prevx;
	if(this.x!==this.prevx && this.x+SW()<WIDTH && this.x-SW()>-WIDTH){
		for(let i = 0; i<Bodies.length; i++){
			Bodies[i].x -= this.xdiff;
			CXLP -= this.xdiff;
			Bodies[i].ws.left = Bodies[i].x + "px";
		}
		this.prevx = this.x;
	}
	else{
		this.x = this.prevx;
	}
	this.ydiff = this.y-this.prevy;
	if(this.y!==this.prevy && this.y+SH()<HEIGHT && this.y-SH()>-HEIGHT){
		for(let i = 0; i<Bodies.length; i++){
			Bodies[i].y -= this.ydiff;
			CYLP -= this.ydiff;
			Bodies[i].ws.bottom = Bodies[i].y + "px";
		}
		this.prevy = this.y;
	}
	else{
		this.y = this.prevy;
	}
}
CaMeRa.prototype.longDropEnabled = function(r=true){
	DS = r;
}
const Anchor = function(){
	window.g = 9.82;
	window.gameType = "";
	window.gravitySwitch = true;
	window.HC = true;
	window.UDB = false;
	window.iTsaFe = false;
	window.Bodies = [];
	window.Buttons = [];
	window.MAIN = undefined;
	window.CT = undefined;
	window.CXLP = undefined;
	window.CYLP = undefined;
	window.xx = "repeat-x";
	window.yy = "repeat-y";
	window.xy = "repeat";
	window.no = "no-repeat";
	window.tw = 100;
	window.th = 100;
	window.tr = no;
	window.ranHue = randomColor();
	window.WIDTH = window.xend = window.xlim = SW();
	window.HEIGHT = window.yend = window.ylim = SH();
	window.xbeginR = window.xbegin = 0;
	window.ybeginR = window.ybegin = 0;
	window.showmass = true;
	window.diff = 0;
	window.JC = 1;
	window.JCC = 0;
}
Anchor.prototype.multiJump = function(n){
	if(n<2 || n===undefined){
		JC = 2;
	}
	else{
		JC = n;
	}
}
Anchor.prototype.type = function(type){
	gameType = type;
};
Anchor.prototype.textureWrapping = function(options){
	options = options || {};
	tw = options.w;
	th = options.h;
	tr = options.repeat;
}
Anchor.prototype.useDefaultButtons = function(){
	UDB = true;
	if(gameType.toLowerCase() === "rpg"){
		this.disableGravity();
		const u = F9.Button.Create(66,20,50,50,{styleClass: "dir",mark: "U"});
		u.event("touchstart",()=>{MAIN.up()});
		u.event("touchend",()=>{MAIN.halt(3)});	
		const d = F9.Button.Create(80,20,50,50,{styleClass: "dir",mark: "D"});
		d.event("touchstart",()=>{MAIN.down()});
		d.event("touchend",()=>{MAIN.halt(2)});	
		const r = F9.Button.Create(16,10,50,50,{styleClass: "dir",mark: "R"});
		r.event("touchstart",()=>{MAIN.right()});
		r.event("touchend",()=>{MAIN.halt(1)});	
		const l = F9.Button.Create(2,10,50,50,{styleClass: "dir",mark: "L"});
		l.event("touchstart",()=>{MAIN.left()});
		l.event("touchend",()=>{MAIN.halt(0)});
	}
	else if(gameType.toLowerCase() === "platformer"){
		const r = F9.Button.Create(16,10,50,50,{styleClass: "dir",mark: "R"});
		r.event("touchstart",()=>{MAIN.right()});
		r.event("touchend",()=>{MAIN.halt(1)});	
		const l = F9.Button.Create(2,10,50,50,{styleClass: "dir",mark: "L"});
		l.event("touchstart",()=>{MAIN.left()});
		l.event("touchend",()=>{MAIN.halt(0)});
		const j = F9.Button.Create(75,30,50,50,{styleClass: "dir",mark: "J"});
		j.event("touchstart",()=>{MAIN.jump()});
	}
	else{
		const u = F9.Button.Create(66,20,50,50,{styleClass: "dir",mark: "U"});
		u.event("touchstart",()=>{MAIN.up()});
		u.event("touchend",()=>{MAIN.halt(3)});	
		const d = F9.Button.Create(80,20,50,50,{styleClass: "dir",mark: "D"});
		d.event("touchstart",()=>{MAIN.down()});
		d.event("touchend",()=>{MAIN.halt(2)});	
		const r = F9.Button.Create(16,10,50,50,{styleClass: "dir",mark: "R"});
		r.event("touchstart",()=>{MAIN.right()});
		r.event("touchend",()=>{MAIN.halt(1)});	
		const l = F9.Button.Create(2,10,50,50,{styleClass: "dir",mark: "L"});
		l.event("touchstart",()=>{MAIN.left()});
		l.event("touchend",()=>{MAIN.halt(0)});
		const j = F9.Button.Create(75,30,50,50,{styleClass: "dir",mark: "J"});
		j.event("touchstart",()=>{MAIN.jump()});
	}
		
		
}
Anchor.prototype.headCollision = function(hc=true){
	HC = hc;
}
Anchor.prototype.enableGravity = function(){
	gravitySwitch = true;
}
Anchor.prototype.disableGravity = function(){
	gravitySwitch = false;
}
Anchor.prototype.mapSize = function(w,h){
	if(w<SW()){
		WIDTH = xend = SW();
	}
	else{
		WIDTH = xend = w;
	}
	if(h<SH()){
		HEIGHT = yend = SH();
	}
	else{
		HEIGHT = yend = h;
	}
}
Anchor.prototype.hideMass = function(req=true){
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
const UnDoo = (v,which) =>{
	switch(which){
		case 0:
			xbegin -= v;
			xend -= v;
			xlim += v
			for(let i = 0; i<Bodies.length; i++){
				if(Bodies[i] !== MAIN){
					Bodies[i].x -= v;
					Bodies[i].ws.left = Bodies[i].x + "px";	
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
					Bodies[i].ws.left = Bodies[i].x + "px";
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
					Bodies[i].ws.bottom = Bodies[i].y + "px";
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
					Bodies[i].ws.bottom = Bodies[i].y + "px";
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
const calcWeight = (m) =>{return m*(g/50)}
const posX = (x) =>{return (x/100)*window.innerWidth}
const posY = (y) =>{return (y/100)*window.innerHeight}
const randomColor = () =>{return "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ","  + Math.floor(Math.random() * 256) + ")"}
const SW = (n=1) =>{return window.innerWidth*n}
const SH = (n=1) =>{return window.innerHeight*n}
const stalk = function(){
	if(MAIN.y+(MAIN.h/2)>CYLP && CT === "locked-on"){
		ylim = HEIGHT;
		ybegin = SH()-HEIGHT;
		yend = -HEIGHT;
		for(let i = 0; i<Bodies.length; i++){
			if(Bodies[i]!==MAIN){
				Bodies[i].y -= HEIGHT-SH();
				Bodies[i].ws.bottom = Bodies[i].y + "px";
			}
		}
	}
}
const resize = (p) =>{
	for(let i = 0; i<Bodies.length;i++){
		let wp = (p/100)*Bodies[i].w;
		let hp = (p/100)*Bodies[i].h;
		let yp = Bodies[i].y+(Bodies[i].h-hp);
		Bodies[i].w = wp;
		Bodies[i].h = hp;
		Bodies[i].y = yp;
		Bodies[i].ws.width = wp + "px";
		Bodies[i].ws.height = hp + "px";
		Bodies[i].ws.bottom = yp + "px";
	}
}
const createStack = function(engine,t,cord,dim,matrix,margin,options){
	this.clone_num = 0;
	cord.length === 0 ? cord = [0,0] : null;
	dim.length === 0 ? dim = [0,0] : null;
	matrix.length === 0 ? matrix = [0,0] : null;
	margin.length === 0 ? margin = [0,0] : null;
	cord.length === 1 ? cord = [cord[0],cord[0]] : null;
	dim.length === 1 ? dim = [dim[0],dim[0]] : null;
	matrix.length === 1 ? matrix = [matrix[0],matrix[0]] : null;
	margin.length === 1 ? margin = [margin[0],margin[0]] : null;
	this.t = t;
	this.x = cord[0];
	this.y = cord[1];
	this.w = dim[0];
	this.h = dim[1];
	this.row = matrix[0];
	this.col = matrix[1];
	this.xmrg = margin[0];
	this.ymrg = margin[1];
	this.options = options;
	let arr = [];
	let totalBodies = this.tb = matrix[0]*matrix[1];
	let composite = undefined;
	if(t === "QUAD"){
		let w = dim[0]/matrix[1];
		let h = dim[1]/matrix[0];
		let c = 0;
		let xmargin = 0;
		let ymargin = 0;
		let x = cord[0];
		let y = cord[1];
		for(let i = 0; i<totalBodies; i++){
			if(c === matrix[1]){
				x = cord[0];
				y += h;
				ymargin += margin[1]
				c = 0;
				xmargin = 0;
				composite = F9.Bodies.Create(x+xmargin,y+ymargin,w,h,options);
				c +=1;
				x += w;
				xmargin += margin[0];
			}
			else{
				composite = F9.Bodies.Create(x+xmargin,y+ymargin,w,h,options);
				c +=1;
				x += w;
				xmargin += margin[0];
			}
			F9.World.Bind(engine,composite);
			arr.push(composite);
		}	
	}
	this.composites = [...arr];
}
createStack.prototype.clone = function(xx,yy){
	this.clone_num += 1;
	let arr = [];
	let composite = undefined;
	if(this.t === "QUAD"){
		let w = this.w/this.col;
		let h = this.h/this.row;
		let c = 0;
		let xmargin = 0;
		let ymargin = 0;
		let x,y;
		let pop = (this.clone_num*10)/100
		if(xx===undefined){
			x = this.x+(pop*this.w);
		}
		else{
			x = xx;
		}
		if(yy===undefined){
			y = this.y+(pop*this.h);
		}
		else{
			y = yy;
		}
		for(let i = 0; i<this.tb; i++){
			if(c === this.col){
				if(xx===undefined){
					x = this.x+(pop*this.w);
				}
				else{
					x = xx;
				}
				y += h;
				ymargin += this.ymrg;
				c = 0;
				xmargin = 0;
				composite = F9.Bodies.Create(x+xmargin,y+ymargin,w,h,this.options);
				c +=1;
				x += w;
				xmargin += this.xmrg;
			}
			else{
				composite = F9.Bodies.Create(x+xmargin,y+ymargin,w,h,this.options);
				c +=1;
				x += w;
				xmargin += this.xmrg;
			}
			F9.World.Bind(engine,composite);
			arr.push(composite);
		}	
	}
	return this;
}
F9.Engine.Start = function(){
	return new Anchor();
}
F9.Engine.Camera = function(ct,cxp,cyp){
	return new CaMeRa(ct,cxp,cyp);
}
F9.Bodies.Create = function(x,y,w,h,options){
	return new obj(x,y,w,h,options)
}
F9.Bodies.Stack = function(engine,t,cord,dim,matrix,margin,options){
	return new createStack(engine,t,cord,dim,matrix,margin,options);
}
F9.Button.Create = function(x,y,w,h,options){
	return new button(x,y,w,h,options)
}
F9.World.Bind = function(engine,...bodys){
	bodys.forEach(body=>{
		try{
			Bodies.push(body);
			body.space.appendChild(body.tuD);
			DS && body.main ? stalk() : null;
		}	
		catch(err){
			console.log("Unable to bind "+body+" => Invalid object.");
		}
	});
	UDB ? engine.useDefaultButtons() : null;
}
F9.World.Scale = function(p){
	resize(p);
}
F9.Renderer.Run = function(camera){
	camera.update();
	requestAnimationFrame(()=>{F9.Renderer.Run(camera)});
}
F9.Engine.Run = function(){
	if(gravitySwitch){
		for(let i = 0; i<Bodies.length; i++){
			if(!Bodies[i].landed){
				Bodies[i].fall();
			}
		}
	}
	requestAnimationFrame(()=>{F9.Engine.Run()});
}