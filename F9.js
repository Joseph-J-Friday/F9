const log = (msg) =>{return console.log(msg)}
const sW = (n=1)=>{return window.innerWidth*n}
const sH = (n=1)=>{return window.innerHeight*n}
const randomColor = ()=>{return "rgb("+Math.round(Math.random()*256)+","+Math.round(Math.random()*256)+","+Math.round(Math.random()*256)+")"} 
const randInt = (min,max)=>{return Math.floor(Math.random()*(max-min)+min)}
const posX = (x) =>{return (x/100)*window.innerWidth}
const posY = (y) =>{return (y/100)*window.innerHeight}
const F9 = {
	Engine: {
		StartTime: new Date()
	},
	RigidBody: {},
	Tile: {},
	Camera: {},
	Button: {},
	Buttons: [],
	Media: {
		Audios: [],
		Videos: []
	},
	World: {
		Size: {
			WIDTH: sW(),
			HEIGHT: sH()
		},
		Bodies: []
	},
	Quantity: {
		g: 9.82,
	},
	Controls: {
		Jump: "JUMP",
		Left: "LEFT",
		Right: "RIGHT",
		Up: "UP",
		Down: "DOWN",
		CordinateScreenTouch: function(){},
		RelativeScreenTouch: function(){}
	},
	Pocket: {
		RoomForAll: [],
		defaultButtons: [],
		xx: "repeat-x",
		yy: "repeat-y",
		xy: "repeat",
		no: "no-repeat",
		txr: this.no,
		txw: 100,
		txh: undefined,
		userCam: undefined,
		shade: undefined,
		autoB: false,
		autoR: false,
		gravitySwitch: false,
		collisionDetection: false,
		pErmIt: false,
		cR: true,
		geeS: false,
		rst: false,
		cst: false,
		sMech: true,
		tRaSh: []
	},
	Garbage: {},
	Recursion: {},
	Projectile: {}
}
const initF9 = ()=>{
	F9.Media.Audios.forEach(slot=>{
		slot.audio.muted = true;
		slot.audio.play();
		slot.audio.currentTime = "0";
	});
}
window.addEventListener("click",()=>{initF9()});
const prOjEctIlE = function(x,y,h,w,opt){
	this.w = w;
	this.h = h;
	this.angle = 0;
	this.velocity = .5;
	this.finished = false;
	opt.rotationPoint = "left";
	opt.isRigid = false;
	this.range = F9.World.Size.HEIGHT+F9.World.Size.WIDTH;
	this.launchable = true;
	this.core = new obj(x,y,w,h,opt);
	this.dom = document.createElement("div");
	this.moveEvent = new Event("move");
	this.collisionEvent = new CustomEvent("collide",{a:undefined,aa:undefined,b:undefined,c:undefined});
	this.offSideEvent = new CustomEvent("offSide",{side:undefined});
	this.offScreenEvent = new CustomEvent("offScreen",{side:undefined});
	this.disposeEvent = new CustomEvent("dispose",{a:undefined});
	this.finishEvent = new Event("finish");
	let m = opt.mass || 0;
	this.head = new obj(x+w-(h*1.5),y+(h/5),h*2.5,h*2.5,{opacity:0,mass:m});
	this.x = this.head.x;
	this.y = this.head.y;
	this.xorg = this.head.x-this.core.x;
	this.yorg = this.head.y-this.core.y;
	this.head.connect(this.core);
	this.head.on("offScreen",(e)=>{
		this.offScreenEvent.side = e.side;
		this.offScreenEvent.a = {a1:e.a,a2:this.core,a3:this};
		this.dom.dispatchEvent(this.offScreenEvent);
	});
	this.head.on("offSide",(e)=>{
		this.offSideEvent.side = e.side;
		this.dom.dispatchEvent(this.offSideEvent);
	});
	this.head.on("move",()=>{
		this.x = this.head.x;
		this.y = this.head.y;
		this.dom.dispatchEvent(this.moveEvent);
	});
	this.head.on("collide",(e)=>{
		this.collisionEvent.a = {a1:e.a,a2:this.core,a3:this};
		this.collisionEvent.b = e.b;
		this.collisionEvent.c = e.c;
		this.dom.dispatchEvent(this.collisionEvent);
	});
	this.rotate(90);
}
prOjEctIlE.prototype.dieAfter = function(time){this.dieTime = time}
prOjEctIlE.prototype.launch = function(){
	if(this.launchable){
		try{
			this.launchable = false;
			if(this.dieTime) F9.Recursion.Recur(this.dieTime,()=>{F9.Garbage.Collect(this)},"1x");
			let nx = (this.range * Math.cos(this.angle*(Math.PI/180)));
			let ny = (this.range * Math.sin(this.angle*(Math.PI/180)));
			let x = nx+this.x;
			let y = ny+this.y;
			let xv = (Math.abs(nx)/100)*this.velocity;
			let yv = (Math.abs(ny)/100)*this.velocity;
			if(this.x+(this.head.width/2)<x){
				const projectR = ()=>{
					this.head.vRIGHT(true,xv);
					if(this.finished) return;
					if(this.x+(this.head.width/2)<x){requestAnimationFrame(projectR)}
					else if(this.x>x){
						this.x = x;
						this.head.POS_X(x);
					}
				}
				requestAnimationFrame(()=>{projectR()});
			}
			else if(this.x+(this.head.width/2)>x){
				const projectL = ()=>{
					this.head.vLEFT(true,xv);
					if(this.finished) return;
					if(this.x+(this.head.width/2)>x){requestAnimationFrame(projectL)}
					else if(this.x<x){
						this.x = x;
						this.head.POS_X(x);
					}
				}
				requestAnimationFrame(()=>{projectL()});
			}
			if(this.y+(this.head.height/2)<y){
				const projectU = ()=>{
					this.head.vUP(true,yv);
					if(this.finished) return;
					if(this.y+(this.head.height/2)<y){requestAnimationFrame(projectU)}
					else if(this.y>y){
						this.y = y;
						this.head.POS_Y(y);
					}
				}
				requestAnimationFrame(()=>{projectU()});
			}
			else if(this.y+(this.head.height/2)>y){
				const projectD = ()=>{
					this.head.vDOWN(true,yv);
					if(this.finished) return;
					if(this.y+(this.head.height/2)>y){requestAnimationFrame(projectD)}
					else if(this.y<y){
						this.y = y;
						this.head.POS_Y(y);
					}
				}
				requestAnimationFrame(()=>{projectD()});
			}else{}
			return true;
		}catch(err){}
	}else{return false}
}
prOjEctIlE.prototype.omit = function(...bodys){this.head.omit(...bodys)}
prOjEctIlE.prototype.stop = function(){this.finished = true}
prOjEctIlE.prototype.rotate = function(theta){
	let angle = theta*(Math.PI/180);
	let dx = this.xorg*Math.cos(angle)-this.yorg*Math.sin(angle);
	let dy = this.yorg*Math.cos(angle)+this.xorg*Math.sin(angle);
	let nx = dx+this.core.x;
	let ny = dy+this.core.y;
	this.head.POS_X(nx-this.h);
	this.head.POS_Y(ny-this.h);
	this.x = nx;
	this.y = ny;
	this.angle = theta;
	this.core.rotateZ(-theta);
	this.head.rotateZ(-theta);
}
prOjEctIlE.prototype.isConnectedTo = function(body){return body.net.includes(this.head)}
prOjEctIlE.prototype.constrainToWindow = function(bool=true){this.head.constrainToWindow(bool)}
prOjEctIlE.prototype.on = function(ev,ex){this.dom.addEventListener(ev,ex)}
const wcnstr = (side,tar)=>{
	tar.constrainKey = false;
	if(side==="right"){tar.vLEFT(true,(tar.x+tar.width-tar.xcrop)-sW())}
	else if(side==="left"){tar.vRIGHT(true,Math.abs(-tar.x-tar.xcrop))}
	else if(side==="top"){tar.vDOWN(true,(tar.y+tar.height-tar.ycrop)-sH())}
	else{tar.vUP(true,Math.abs(-tar.y-tar.ycrop))}
	tar.constrainKey = true;
}
const rcf = (p,i,a)=>{
	clearTimeout(p.si);
	p.si = setTimeout(()=>{
		requestAnimationFrame(()=>{a(p)});
		p.TO++;
		if(p.TO<p.t && p.redo){requestAnimationFrame(()=>{rcf(p,i,a)})}
		else{
			clearTimeout(p.si);
			p.dom.dispatchEvent(p.finishEvent);
		}
	},i);
}
const ReFreshAll = ()=>{
	F9.Pocket.RoomForAll.forEach(one=>{requestAnimationFrame(()=>{one.refresh()})});
	requestAnimationFrame(()=>{ReFreshAll()});
}
const garbageCollection = (bodys)=>{
	try{
		unbind(bodys);
		nullify(bodys);
		bodys.forEach(body=>{
			if(body.a1){
				unbind([body.a1,body.a2,body.a3]);
				nullify([body.a1,body.a2,body.a3]);
				body.a3.disposeEvent.a = body.a3;
				body.a3.dom.dispatchEvent(body.a3.disposeEvent);
			}
			else{
				body.disposeEvent.a = body;
				body.dom.dispatchEvent(body.disposeEvent);
			}
		});
		F9.Pocket.tRaSh.unshift(...bodys);
	}catch(err){}
}
const recurer = function(i,a,t){
	this.dom = document.createElement("div");
	this.finishEvent = new Event("finish");
	if(t!==Infinity && t[t.length-1]==="x"){this.t = Number(t.substring(0,t.length-1))}
	else if(t!==Infinity && t[t.length-1]!=="x"){throw new Error("Recursion count is invalid.\n")}
	else if(t===Infinity){this.t = t}
	this.TO = 0;
	this.redo = true;
	if(this.TO<this.t) requestAnimationFrame(()=>{rcf(this,i,a)});
	return this;
}
recurer.prototype.on = function(ev,ex){this.dom.addEventListener(ev,ex)}
recurer.prototype.stop = function(){
	this.redo = false;
	clearTimeout(this.si);
}
recurer.prototype.stopAfter = function(tx){
	if(tx[tx.length-1]==="s"){
		let sT = setTimeout(()=>{
			clearTimeout(sT);
			this.stop();
		},Number(tx.substring(0,tx.length-1))*1000);
	}else{throw new Error("Unsupported duration format.")}
	return this;
}
const butn = function(x=0,y=0,w=50,h=50,opt){
	opt = opt || {};
	this.class = opt.styleClass;
	this.x = x;
	this.y = y;
	if(w<=0) w = .1;
	if(h<=0) h = .1;
	this.width = w;
	this.height = h;
	this.texture = opt.texture || undefined;
	this.color = opt.color || undefined;
	this.visibility = opt.visibility || .5;
	this.text = opt.text || "";
	this.textColor = opt.textColor || randomColor();
	this.arc = opt.arc || 0;
	this.wrf = opt.wireframe || false;
	this.tw = opt.textureWrapping || [];
	this.stroke = opt.stroke || 1;
	this.strokeColor = opt.strokeColor===undefined ? randomColor() : opt.strokeColor;
	this.touchEvent = new CustomEvent("touch",{a:undefined});
	this.leaveEvent = new CustomEvent("leave",{a:undefined});
	this.dom = document.createElement("Button");
	this.dom.addEventListener("touchstart",(e)=>{
		this.touchEvent.a = this;
		this.touchEvent.pos = {x:e.touches[0].pageX,y:e.touches[0].pageY};
		this.dom.dispatchEvent(this.touchEvent);
	});
	this.dom.addEventListener("touchend",()=>{this.dom.dispatchEvent(this.leaveEvent)});
	this.dom.innerHTML = this.text;
	this.class !== undefined ? this.dom.classList.add(this.class) : null;
	this.ds = this.dom.style;
	this.ds.position = "fixed";
	this.ds.width = this.width + "px";
	this.ds.height = this.height + "px";
	this.ds.bottom = this.y + "%";
	this.ds.left = this.x + "%";
	this.ds.zIndex = "2";
	this.ds.outline = "none";
	this.ds.color = this.textColor;
	if(!this.wrf){
		this.ds.backgroundImage = "url("+this.texture+".png)";
		if(this.texture===undefined || this.texture==="" || this.texture===" ") this.ds.backgroundColor = this.color;
		if(this.tw[0]===undefined){
			this.ds.backgroundRepeat = F9.Pocket.txr;
			this.ds.backgroundSize = F9.Pocket.txh===undefined ? F9.Pocket.txw+"%" : F9.Pocket.txw+"% "+F9.Pocket.txh+"%";
		}
		else{
			this.ds.backgroundRepeat = this.tw[2];
			this.ds.backgroundSize = this.tw[0]+"% "+this.tw[1]+"%";
		}
	}
	else{this.ds.border = ".5px solid #ffffff"}
	this.ds.opacity = this.visibility;
	this.ds.border = "none";
	this.ds.borderRadius = this.arc+"px";
	document.body.appendChild(this.dom);
	F9.Buttons.push(this);
	F9.Pocket.RoomForAll.push(this);
}
butn.prototype.translate = function(x,y=0){
	this.ds.transform = "translate("+x+"%,"+y+"%)";
	this.x = this.x+((x/100*this.width)/sW()*100);
	this.y = this.y-((y/100*this.height)/sH()*100);
}
butn.prototype.attachControl = function(ct){
	switch(ct){
		case "JUMP":
			this.dom.addEventListener("touchstart",()=>{F9.Pocket.userCam.stalkee!==undefined ? F9.Pocket.userCam.stalkee.vJUMP() : log("F9: .stalk(body) of camera is undefined.\n")});
			break;
		case "UP":
			this.dom.addEventListener("touchstart",()=>{F9.Pocket.userCam.stalkee!==undefined ? F9.Pocket.userCam.stalkee.vUP() : log("F9: .stalk(body) of camera is undefined.\n")});
			this.dom.addEventListener("touchend",()=>{
				if(F9.Pocket.userCam.stalkee!==undefined){
					cancelAnimationFrame(F9.Pocket.userCam.stalkee.aFu);
					F9.Pocket.userCam.stalkee.Ydirection = undefined;
				}
				else{log("F9: .stalk(body) of camera is undefined.\n")}	
			});
			break;
		case "DOWN":
			this.dom.addEventListener("touchstart",()=>{F9.Pocket.userCam.stalkee!==undefined ? F9.Pocket.userCam.stalkee.vDOWN() : log("F9: .stalk(body) of camera is undefined.\n")});
			this.dom.addEventListener("touchend",()=>{
				if(F9.Pocket.userCam.stalkee!==undefined){
					cancelAnimationFrame(F9.Pocket.userCam.stalkee.aFd);
					F9.Pocket.userCam.stalkee.Ydirection = undefined;
				}
				else{log("F9: .stalk(body) of camera is undefined.\n")}
			});
			break;
		case "LEFT":
			this.dom.addEventListener("touchstart",()=>{F9.Pocket.userCam.stalkee!==undefined ? F9.Pocket.userCam.stalkee.vLEFT() : log("F9: .stalk(body) of camera is undefined.\n")});
			this.dom.addEventListener("touchend",()=>{
				if(F9.Pocket.userCam.stalkee!==undefined){
					cancelAnimationFrame(F9.Pocket.userCam.stalkee.aFl);
					F9.Pocket.userCam.stalkee.Xdirection = undefined;
				}
				else{log("F9: .stalk(body) of camera is undefined.\n")}
			});
			break;
		case "RIGHT":
			this.dom.addEventListener("touchstart",()=>{F9.Pocket.userCam.stalkee!==undefined ? F9.Pocket.userCam.stalkee.vRIGHT() : log("F9: .stalk(body) of camera is undefined.\n")});
			this.dom.addEventListener("touchend",()=>{
				if(F9.Pocket.userCam.stalkee!==undefined){
					cancelAnimationFrame(F9.Pocket.userCam.stalkee.aFr);
					F9.Pocket.userCam.stalkee.Xdirection = undefined;	
				}
				else{log("F9: .stalk(body) of camera is undefined.\n")}
			});
			break;
		default:
			throw new Error("Unknown controller type\n");
	}
}
butn.prototype.on = function(ev,ex){this.dom.addEventListener(ev,ex)}
butn.prototype.removeEventListener = function(ev,ex){this.dom.removeEventListener(ev,ex)}
butn.prototype.refresh = function(){
	this.ds.position = "fixed";
	this.ds.width = this.width + "px";
	this.ds.height = this.height + "px";
	this.ds.bottom = this.y + "%";
	this.ds.left = this.x + "%";
	this.ds.outline = "none";
	this.ds.color = this.textColor;
	this.ds.backgroundImage = "URL(" + this.texture + ")";
	this.color === undefined ? this.ds.background = "none" : this.ds.backgroundColor = this.color;
	this.ds.opacity = this.visibility;
	this.ds.borderRadius = this.arc+"px";
	this.ds.border = this.stroke+"px solid "+this.strokeColor;
}
butn.prototype.hide = function(){this.ds.display = "none"}
butn.prototype.show = function(){this.ds.display = ""}
const cameraShaker = (cam,shakeX,shakeY,xe,ye,v)=>{
	F9.Pocket.pErmIt = true;
	if(cam.shakeCount>0){
		let tO0 = setTimeout(()=>{;
			if(shakeX) cam.x -= xe;
			if(shakeY) cam.y -= ye;
			clearTimeout(tO0);
			let tO1 = setTimeout(()=>{
				if(shakeX) cam.x += (xe*2);
				if(shakeY) cam.y += (ye*2);
				clearTimeout(tO1);
				let tO2 = setTimeout(()=>{
					if(shakeX) cam.x -= xe;
					if(shakeY) cam.y -= ye;
					clearTimeout(tO2);
					cam.shakeCount -= 1;
					requestAnimationFrame(()=>{cameraShaker(cam,shakeX,shakeY,xe,ye,v);});
				},v);
			},v);
		},v/2);
	}
	else{return}
	return "F9: CAMERA SHAKEN";
}
const checkCollision = function(key,checker,v=0,mh=0,jv=0,step=false){
	if(key===0){
		F9.World.Bodies.forEach(body=>{
			if(body instanceof obj && body!==checker && !checker.ignore.includes(body) && body!==checker.constrain && body.isRigid && (checker.y+checker.height-checker.ycrop>=body.y+body.ycrop && checker.y+checker.height-checker.ycrop<body.y+body.height-body.ycrop) && (checker.x+checker.width-checker.xcrop>=body.x+body.xcrop && checker.x+checker.xcrop<=body.x+body.width-body.xcrop)){
				checker.collisionEvent.b = body;
				checker.collisionEvent.a = checker;
				if(checker.colliders[1] && body.colliders[3]){
					checker.dom.dispatchEvent(checker.collisionEvent);
					if(!body.preD && !checker.preD){
						if((body.massRef<checker.massRef && !checker.carriage) || body.massRef===0 || body.massRef>=checker.massRef){
							if(F9.Pocket.cR){
								checker.y = body.y+body.ycrop-checker.height+checker.ycrop-.001;
								checker.cht = mh;
								if(checker.butKicKer!==this){
									checker.butKicKer.cht = mh;
									checker.butKicker = checker;
								}else{}
							}else{}
						}
						else if(checker.carriage && body.massRef<checker.massRef){
							if(F9.Pocket.cR){
								checker.y = body.y+body.ycrop-checker.height+checker.ycrop-.001;
								body.butKicKer = checker;
								body.vJUMP(false,true,jv,mh+body.height);
							}else{}
						}else{}
					}
					else{
						body.preD = false;
						checker.preD = false;
					}
				}else{}
				if(!F9.Pocket.autoR) checker.refresh();
			}else{}
		});
	}
	else if(key===1){
		if(checker.y+checker.ycrop<=-(F9.Pocket.userCam.y-sH())){
			
		}
		else{
			F9.World.Bodies.forEach(body=>{
				if(body instanceof obj && body!==checker && !checker.ignore.includes(body) && body!==checker.constrain && body.isRigid && (checker.y+checker.ycrop<=body.y+body.height-body.ycrop && checker.y+checker.ycrop>=body.y+body.ycrop) && (checker.x+checker.width-checker.xcrop>=body.x+body.xcrop && checker.x+checker.xcrop<=body.x+body.width-body.xcrop)){
					checker.collisionEvent.b = body;
					checker.collisionEvent.a = checker;
					if(body.isLanded || body.mass===0){
						if(checker.colliders[3] && body.colliders[1]){
							checker.dom.dispatchEvent(checker.collisionEvent);
							if(!body.preD && !checker.preD){
								if(F9.Pocket.cR){
									checker.isLanded = true;
									checker.isJumping = false;
									checker.isFalling = false;
									checker.mass = checker.massRef;
									checker.Jnn = 0;
									body.onMe.push(checker);
									checker.floor = body;
									checker.baSe = body.y+body.height-body.ycrop;
									checker.y = checker.baSe-checker.ycrop+.001;
									checker.ds.bottom = checker.y + "px";
									if(body.massRef!==0) body.suPPlyLoad(checker);
								}else{}
							}
							else{
								body.preD = false;
								checker.preD = false;
							}
						}else{}
					}
					else if(!body.isLanded && checker.mass>body.mass){
						if(checker.colliders[3] && body.colliders[1]){
							checker.dom.dispatchEvent(checker.collisionEvent);
							if(!body.preD && !checker.preD){
								checker.Jnn = 0;
								if(F9.Pocket.cR){
									checker.baSe = body.y+body.height-body.ycrop;
									checker.y = checker.baSe-checker.ycrop+.001;
									checker.ds.bottom = checker.y + "px";
									body.mass = checker.mass;
								}else{}
							}
							else{
								body.preD = false;
								checker.preD = false;
							}
						}else{}
					}
					else{
								
					}
					if(!F9.Pocket.autoR) checker.refresh();
				}else{}
			});
		}
	}
	else if(key===2 || key===3 || key===4 || key===5){
		let bool = false;
		F9.World.Bodies.forEach(body=>{
			if(body instanceof obj && body!==checker && !checker.ignore.includes(body) && body!==checker.constrain && body.isRigid && checker.y+checker.ycrop<=body.y+body.height-body.ycrop && checker.y+checker.height-checker.ycrop>=body.y+body.ycrop && checker.x+checker.width-checker.xcrop>=body.x+body.xcrop && checker.x+checker.xcrop<=body.x+body.width-body.xcrop){
				checker.collisionEvent.b = body;
				checker.collisionEvent.a = checker;
				switch(key){
					case 2:
						if(checker.colliders[0] && body.colliders[2]){
							checker.dom.dispatchEvent(checker.collisionEvent);
							if(!body.preD && !checker.preD){
								let oldx = checker.x;
								if(F9.Pocket.cR){
									checker.x = body.x+body.width-body.xcrop-checker.xcrop+.001;
									if(body.massRef!==0 && checker.puSher.massSum+body.massRef+body.getLOAd()<checker.puSher.massRef){
										checker.puSher.massSum += body.massRef;
										body.puSher = checker.puSher;
										body.vLEFT(true,v);
									}else{}
									if(F9.Pocket.sMech) checker.x = body.x+body.width-body.xcrop-checker.xcrop+.001;
									let xdf = checker.x-oldx;
									if(checker.net.length) checker.net.forEach(body=>{body.vRIGHT(true,xdf)});
								}else{}
							}
							else{
								body.preD = false;
								checker.preD = false;
							}
							if(!F9.Pocket.autoR) checker.refresh();
						}else{}
						break;
					case 3:
						if(checker.colliders[2] && body.colliders[0]){
							checker.dom.dispatchEvent(checker.collisionEvent);
							if(!body.preD && !checker.preD){
								let oldx = checker.x;
								if(F9.Pocket.cR){
									checker.x = body.x+body.xcrop-checker.width+checker.xcrop-.001;
									if(body.massRef!==0 && checker.puSher.massSum+body.massRef+body.getLOAd()<checker.puSher.massRef){
										checker.puSher.massSum += body.massRef;
										body.puSher = checker.puSher;
										body.vRIGHT(true,v)
									}else{}	
									let xdf = oldx-checker.x;
									if(checker.net.length) checker.net.forEach(body=>{body.vLEFT(true,xdf)});
									if(F9.Pocket.sMech) checker.x = body.x+body.xcrop-checker.width+checker.xcrop-.001;
								}else{}
							}
							else{
								body.preD = false;
								checker.preD = false;
							}
							if(!F9.Pocket.autoR) checker.refresh();
						}else{}
						break;
					case 4:
						if(checker.colliders[1] && body.colliders[3]){
							checker.dom.dispatchEvent(checker.collisionEvent);
							if(!body.preD && !checker.preD){
								let oldy = checker.y;
								if(F9.Pocket.cR){
									checker.y = body.y+body.ycrop-checker.height+checker.ycrop-.001;
									if(body.massRef!==0 && checker.puSher.massSum+body.massRef<checker.puSher.massRef){
										checker.puSher.massSum += body.massRef;
										body.puSher = checker.puSher;
										body.vUP(true,v);
										if(F9.Pocket.sMech) checker.y = body.y+body.ycrop-checker.height+checker.ycrop-.001;
									}else{}
									let ydf = oldy-checker.y;
									if(checker.net.length) checker.net.forEach(body=>{body.vDOWN(true,ydf)});
								}else{}
							}
							else{
								body.preD = false;
								checker.preD = false;
							}
							if(!F9.Pocket.autoR) checker.refresh();
						}else{}
						break;
					default:
						if(checker.colliders[3] && body.colliders[1]){
							checker.dom.dispatchEvent(checker.collisionEvent);
							if(!body.preD && !checker.preD){
								let oldy = checker.y;
								if(F9.Pocket.cR){
									checker.y = body.y+body.height-body.ycrop-checker.ycrop+.001;
									if(body.massRef!==0 && checker.puSher.massSum+body.massRef<checker.puSher.massRef){
										checker.puSher.massSum += body.massRef;
										body.puSher = checker.puSher;
										body.vDOWN(true,v);
										if(F9.Pocket.sMech) checker.y = body.y+body.height-body.ycrop-checker.ycrop+.001;
									}else{}
									let ydf = checker.y-oldy;
									if(checker.net.length) checker.net.forEach(body=>{body.vUP(true,ydf)});
								}else{}
							}
							else{
								body.preD = false;
								checker.preD = false;
							}
							if(!F9.Pocket.autoR) checker.refresh();
						}else{}
				}
				bool = true;
			}
			else{}
		});
		if(!bool) checker.puSher.massSum = 0;
		if(checker.carriage){
			if(key===2 && !bool){
				checker.onMe.forEach(body=>{body.vLEFT(true,v)});
			}
			else if(key===3 && !bool){
				checker.onMe.forEach(body=>{body.vRIGHT(true,v)});
			}
			else{}
		}
		else{}
	}
	else{}
}
const CaMeRa = function(){
	F9.Pocket.userCam = this;
	this.type = 1;
	this.x = this.prevx = sW();
	this.y = this.prevy = sH();
	this.xlp = posX(50);
	this.ylp = posY(50);
	this.xLIM = F9.World.Size.WIDTH;
	this.yLIM = F9.World.Size.HEIGHT;
	this.zoom = this.prevzoom = 100;
	this.shakeCount = 0;
	this.stalkee = undefined;
	this.zoomSpeed = .005;
	this.sz = this.c = undefined;
}
CaMeRa.prototype.setType = function(t){
	switch(t){
		case "FIXED":
			this.type = 1;
			break;
		case "LOCKED-ON":
			this.type = 2;
			break;
		case "PAGER":
			this.type = 3;
			break;
		default:
			throw new Error("Camera type "+t+" is invalid");
	}
}
CaMeRa.prototype.easeZoom = function(perc,initZoom=this.zoom){
	if(perc===this.zoom){return}
	else{
		clearTimeout(this.sz);
		let path = perc-initZoom;
		let portn = 0.01*path;
		this.c = 0;
		this.sz = setTimeout(()=>{
			this.c++;
			clearTimeout(this.sz);
			this.zoom += portn;
			if(this.c<100){requestAnimationFrame(()=>{this.easeZoom(perc,initZoom)})}else{return}
		},this.zoomSpeed*1000);
	}
}
CaMeRa.prototype.position = function(x,y){
	F9.Pocket.pErmIt = true;
	this.x = x; 
	this.y = y;
}
CaMeRa.prototype.lockPoints = function(x=50,y=x){
	this.xlp = posX(x);
	this.ylp = posY(y);
}
CaMeRa.prototype.lookAt = function(body){
	if(body!==undefined){
		let x = body.x+sW(.5)+body.width/2;
		if(x>F9.World.Size.WIDTH){x = F9.World.Size.WIDTH}
		else if(x<sW()){x = sW()+1}else{}
		let y = body.y+sH(.5)+body.height/2;
		if(y>F9.World.Size.HEIGHT){y = F9.World.Size.HEIGHT}
		else if(y<sH()){y = sH()+1}else{}
		this.position(x,y);
	}else{return}
}
CaMeRa.prototype.shake = function(shakeX=true,shakeY=true,xe,ye,times=1,v=10){
	this.shakeCount = times;
	return cameraShaker(this,shakeX,shakeY,xe,ye,v);
}
CaMeRa.prototype.stalk = function(body){
	if(this.stalkee!==undefined) this.stalkee.vSTOP();
	this.stalkee = body;
}
CaMeRa.prototype.isStalking = function(body){if(this.stalkee===body){return true}else{return false}}
const updateCamera = (cam)=>{
	let xincr = cam.x-cam.prevx;
	let yincr = cam.y-cam.prevy;
	if(cam.x!==cam.prevx && cam.x<F9.World.Size.WIDTH+1 && cam.x>sW()){
		F9.World.Bodies.forEach(body=>{
			if(!cam.isStalking(body)){
				body.x -= (xincr-(body.motionSlice/100*xincr));
				body.ds.left = body.x + "px";
			}
			else if(F9.Pocket.pErmIt){
				body.x -= (xincr-(body.motionSlice/100*xincr));
				body.ds.left = body.x + "px";
			}else{}
		});
		cam.prevx = cam.x;
	}
	else if(cam.x===cam.prevx){}
	else{
		cam.x = cam.prevx;
		log("F9: (Warning) Can't place camera beyond map.\n");
	}
	if(cam.y!==cam.prevy && cam.y<F9.World.Size.HEIGHT+1 && cam.y>sH()){
		F9.World.Bodies.forEach(body=>{
			if(!cam.isStalking(body)){
				body.y -= (yincr-(body.motionSlice/100*yincr));
				body.ds.bottom = body.y + "px";
			}
			else if(F9.Pocket.pErmIt){
				body.y -= (yincr-(body.motionSlice/100*yincr));
				body.ds.bottom = body.y + "px";
				F9.Pocket.pErmIt = false;
			}else{}
		});
		cam.prevy = cam.y;
	}
	else if(cam.y===cam.prevy){}
	else{
		cam.y = cam.prevy;
		log("F9: (Warning) Can't place camera beyond map.\n");
	}
	if(cam.zoom!==cam.prevzoom){
		F9.World.Bodies.forEach(body=>{
			body.ds.zoom = cam.zoom+"%";
		});
		cam.prevzoom = cam.zoom;
	}else{}
	requestAnimationFrame(()=>{updateCamera(cam)});
}
const nullify = (bodys)=>{
	bodys.forEach(body=>{
		try{
			if(body instanceof prOjEctIlE){
				body.stop();
				document.body.removeChild(body.head.dom);
				body.head.onMe.forEach(bodi=>{bodi.floor = bodi});
				document.body.removeChild(body.core.dom);
				body.core.onMe.forEach(bodi=>{bodi.floor = bodi});
				body.core = null;
			}
			else{
				document.body.removeChild(body.dom);
				body.onMe.forEach(bodi=>{bodi.floor = bodi});
				body = null;
			}
		}catch(err){}
	});
}
const bind = (bodys)=>{
	bodys.forEach(body=>{
		if(body.length>0){
			body.forEach(b=>{
				F9.World.Bodies.push(body);
				F9.Pocket.RoomForAll.push(body);
				document.body.appendChild(b.dom);	
			});
		}
		else{
			F9.World.Bodies.push(body);
			F9.Pocket.RoomForAll.push(body);
			document.body.appendChild(body.dom);
		}
	});
	return "F9: BINDED";
}
const unbind = (bodys)=>{
	bodys.forEach(body=>{
		if(body instanceof prOjEctIlE){
			F9.World.Bodies = F9.World.Bodies.filter(bodi=>{return bodi!==body.head});
			F9.Pocket.RoomForAll = F9.Pocket.RoomForAll.filter(one=>{return one!==body.head});
			F9.World.Bodies = F9.World.Bodies.filter(bodi=>{return bodi!==body.core});
			F9.Pocket.RoomForAll = F9.Pocket.RoomForAll.filter(one=>{return one!==body.core});
		}
		else{
			F9.World.Bodies = F9.World.Bodies.filter(bodi=>{return bodi!==body});
			F9.Pocket.RoomForAll = F9.Pocket.RoomForAll.filter(one=>{return one!==body});
		}
	});
	return "F9: UNBINDED";
}
const PULLL = (cam)=>{
	if(F9.Pocket.gravitySwitch){F9.World.Bodies.forEach(body=>{if(body instanceof obj && body.mass!==0)	requestAnimationFrame(()=>{body.fall(cam)})})}
	requestAnimationFrame(()=>{PULLL(cam)});
}
const obj = function(x=0,y=0,w=50,h=50,opt){
	this.aFr = this.aFl = this.aFu = this.aFd = this.aFj = undefined;
	if(w<=0) w = .1;
	if(h<=0) h = .1;
	this.motionSlice = opt.motionSlice || 0;
	this.x = -(F9.Pocket.userCam.x-sW())+x;
	this.y = -(F9.Pocket.userCam.y-sH())+y;
	this.width = w;
	this.height = h;
	opt = opt || {};
	opt.crop = opt.crop || [];
	this.c0 = opt.crop[0] || .1;
	this.c1 = opt.crop[1] || .1;
	this.wrf = opt.wireframe || false;
	this.velocity = opt.velocity || 1;
	this.maxHeight = opt.maxHeight || 50;
	this.cht = 0;
	this.jumpSpeed = 5;
	this.Jn = 1;
	this.Jnn = 0;
	this.massSum = 0;
	this.lOAd = 0;
	this.angleX = this.angleY = this.angleZ = 0;
	this.mass = this.massRef = opt.mass || 0;
	this.isLanded = this.massRef===0 ? true : false;
	this.texture = opt.texture || undefined;
	this.tw = opt.textureWrapping || [];
	this.color = opt.color || randomColor();
	this.opacity = opt.opacity===undefined ? 1 : opt.opacity;
	this.xcrop = (this.c0/100)*this.width;
	this.ycrop = (this.c1/100)*this.height;
	this.strokeColor = opt.strokeColor || "white";
	this.arc = opt.arc || 0;
	this.isRigid = opt.isRigid===undefined ? true : opt.isRigid;
	this.shader = opt.shader || F9.Pocket.shade;
	this.collisionEvent = new CustomEvent("collide",{a:undefined,b:undefined});
	this.touchEvent = new CustomEvent("touch",{a:undefined,b:undefined,c:undefined});
	this.leaveEvent = new CustomEvent("leave",{a:undefined,b:undefined,c:undefined});
	this.disposeEvent = new CustomEvent("dispose",{a:undefined});
	this.moveEvent = new Event("move");
	this.offSideEvent = new CustomEvent("offSide",{side:undefined});
	this.offScreenEvent = new CustomEvent("offScreen",{side:undefined,a:undefined});
	this.finishEvent = new Event("finish");
	this.onMe = [];
	this.net = [];
	this.ignore = [];
	this.carriage = false;
	this.isJumping = false;
	this.halterkey = false;
	this.preD = false;
	this.constrainKey = false;
	this.xMidWay = this.yMidWay = false;
	this.Xdirection = this.Ydirection = this.side = undefined;
	this.butKicKer = this;
	this.puSher = this;
	this.floor = this;
	this.colidded = this;
	this.baj = this;
	this.ibb = {
		left: this.x+this.xcrop,
		top: this.y+this.height-this.ycrop,
		right: this.x+this.width-this.xcrop,
		bottom: this.y+this.ycrop
	}
	this.rotationPoint = opt.rotationPoint || "";
	this.colliders = opt.colliders || [true,true,true,true];
	this.dom = document.createElement("div");
	this.dom.addEventListener("touchstart",(e)=>{
		this.touchEvent.a = this;
		this.touchEvent.b = this.floor;
		this.touchEvent.c = [...this.onMe];
		this.touchEvent.pos = {x:e.touches[0].pageX,y:e.touches[0].pageY};
		this.dom.dispatchEvent(this.touchEvent);
	});
	this.dom.addEventListener("touchend",()=>{this.dom.dispatchEvent(this.leaveEvent)});
	this.ds = this.dom.style;
	this.ds.position = "fixed";
	this.ds.left = this.x+"px";
	this.ds.bottom = this.y+"px";
	this.ds.width = this.width+"px";
	this.ds.height = this.height+"px";
	this.ds.transformOrigin = this.rotationPoint;
	if(!this.wrf){
		this.ds.backgroundImage = "url("+this.texture+".png)";
		if(this.texture===undefined || this.texture==="" || this.texture===" ") this.ds.backgroundColor = this.color;
		if(this.tw[0]===undefined){
			this.ds.backgroundRepeat = F9.Pocket.txr;
			this.ds.backgroundSize = F9.Pocket.txh===undefined ? F9.Pocket.txw+"%" : F9.Pocket.txw+"% "+F9.Pocket.txh+"%";
		}
		else{
			this.ds.backgroundRepeat = this.tw[2];
			this.ds.backgroundSize = this.tw[0]+"% "+this.tw[1]+"%";
		}
	}
	else{this.ds.border = ".5px solid #ffffff"}
	this.ds.opacity = this.opacity;
	this.ds.zIndex = "1";
	this.ds.borderRadius = this.arc+"px";
	this.ds.filter = this.shader;
	this.ds.zoom = (F9.Pocket.userCam.zoom || 100) + "%";
	if(F9.Pocket.autoB){
		F9.World.Bodies.push(this);
		F9.Pocket.RoomForAll.push(this);
		document.body.appendChild(this.dom);
	}
}
obj.prototype.omit = function(...bodys){
	bodys.forEach(body=>{
		this.ignore.push(body);
		body.ignore.push(this);
	});
}
obj.prototype.unOmit = function(...bodys){
	bodys.forEach(body=>{
		this.ignore = this.ignore.filter(bodi=>{return bodi!==body});
		body.ignore = body.ignore.filter(bodi=>{return bodi!==this});
	});
}
obj.prototype.center = function(){return {x: this.x+(this.width/2),y: this.y+(this.height/2)}}
obj.prototype.connect = function(...bodys){bodys.forEach(body=>{body instanceof prOjEctIlE ? this.net.push(body.head) : this.net.push(body)})}
obj.prototype.disconnect = function(...bodys){bodys.forEach(body=>{body instanceof prOjEctIlE ? this.net = this.net.filter(bodi=>{return bodi!==body.head}) : this.net = this.net.filter(bodi=>{return bodi!==body})})}
obj.prototype.disconnectAll = function(){this.net = []}
obj.prototype.isConnectedTo = function(body){
	if(body instanceof prOjEctIlE){return this.net.includes(body.head)}
	else{return (this.net.includes(body) || body.net.includes(this))}
}
obj.prototype.rotateX = function(theta){
	this.angleX = theta;
	this.ds.transform = "rotateX("+theta+"deg)";
}
obj.prototype.rotateY = function(theta){
	this.angleY = theta;
	this.ds.transform = "rotateY("+theta+"deg)";
}
obj.prototype.rotateZ = function(theta){
	this.angleZ = theta;
	this.ds.transform = "rotateZ("+theta+"deg)";
}
obj.prototype.preventDefault = function(){this.preD = true}
obj.prototype.POS_X = function(x){this.x = x; this.ds.left = x+"px"}
obj.prototype.POS_Y = function(y){this.y = y; this.ds.bottom = y+"px"}

obj.prototype.position = function(x,y){
	this.POS_X(x);
	this.POS_Y(y);
}
obj.prototype.reMOveLoad = function(caller){
	if(this.massRef!==0) this.lOAd -= caller.massRef;
	if(this.floor!==this){this.floor.reMOveLoad(caller)}else{return}
}
obj.prototype.suPPlyLoad = function(supplier){
	if(this.massRef!==0) this.lOAd += supplier.massRef;
	if(this.floor!==this){this.floor.suPPlyLoad(supplier)}else{return} 
}
obj.prototype.getLOAd = function(){if(this.carriage){return this.lOAd}else{return 0}}
obj.prototype.carrier = function(state){
	if(state!==undefined && (state==="ON" || state==="OFF")){if(state==="ON"){this.carriage = true}else{this.carriage = false}}
	else if(state===undefined){throw new Error("Carrier state is undefined\n")}
	else{throw new Error("Unsupported carrier state\n")}
}
obj.prototype.reverse = function(){
	cancelAnimationFrame(this.aFu);
	cancelAnimationFrame(this.aFd);
	cancelAnimationFrame(this.aFl);
	cancelAnimationFrame(this.aFr);
	if(this.Xdirection==="right"){
		this.vLEFT();
	}
	else if(this.Xdirection==="left"){
		this.vRIGHT();
	}else{}
	if(this.Ydirection==="up"){
		this.vDOWN();
	}
	else if(this.Ydirection==="down"){
		this.vUP();
	}else{}
}
obj.prototype.vSTOP = function(){
	this.halterkey = true;
	cancelAnimationFrame(this.aFu);
	cancelAnimationFrame(this.aFd);
	cancelAnimationFrame(this.aFl);
	cancelAnimationFrame(this.aFr);
	this.Xdirection = this.Ydirection = undefined;
}
obj.prototype.setColliders = function(clds){
	clds = clds || {};
	this.colliders[0] = clds.left;
	this.colliders[1] = clds.top;
	this.colliders[2] = clds.right;
	this.colliders[3] = clds.bottom;
}
obj.prototype.constrainToWindow = function(bool=true){
	if(bool && this.isRigid){this.constrainKey = true}
	else{this.constrainKey = false}
}
obj.prototype.checkBound = function(){
	if(this.x+this.xcrop<0){
		this.offSideEvent.side = "left";
		this.dom.dispatchEvent(this.offSideEvent);
	}
	else if(this.x+this.width-this.xcrop>F9.World.Size.WIDTH){
		this.offSideEvent.side = "right";
		this.dom.dispatchEvent(this.offSideEvent);
	}else{}
	if(this.y+this.ycrop<0){
		this.offSideEvent.side = "bottom";
		this.dom.dispatchEvent(this.offSideEvent);
	}
	else if(this.y+this.height-this.ycrop>F9.World.Size.HEIGHT){
		this.offSideEvent.side = "top";
		this.dom.dispatchEvent(this.offSideEvent);
	}else{}
}
obj.prototype.checkOffScreen = function(){
	if(this.x+this.xcrop<0){
		this.offScreenEvent.side = "left";
		this.offScreenEvent.a = this;
		this.dom.dispatchEvent(this.offScreenEvent);
		if(this.constrainKey) wcnstr("left",this);
	}
	else if(this.x+this.width-this.xcrop>sW()){
		this.offScreenEvent.side = "right";
		this.offScreenEvent.a = this;
		this.dom.dispatchEvent(this.offScreenEvent);
		if(this.constrainKey) wcnstr("right",this);
	}else{}
	if(this.y+this.ycrop<0){
		this.offScreenEvent.side = "bottom";
		this.offScreenEvent.a = this;
		this.dom.dispatchEvent(this.offScreenEvent);
		if(this.constrainKey) wcnstr("bottom",this);
	}
	else if(this.y+this.height-this.ycrop>sH()){
		this.offScreenEvent.side = "top";
		this.offScreenEvent.a = this;
		this.dom.dispatchEvent(this.offScreenEvent);
		if(this.constrainKey) wcnstr("top",this);
	}else{}
}
obj.prototype.setLeftCollider = function(bool){bool ? this.colliders[0] = true : this.colliders[0] = false; return this}
obj.prototype.setRightCollider = function(bool){bool ? this.colliders[2] = true : this.colliders[2] = false; return this}
obj.prototype.setTopCollider = function(bool){bool ? this.colliders[1] = true : this.colliders[1] = false; return this}
obj.prototype.setBottomCollider = function(bool){bool ? this.colliders[3] = true : this.colliders[3] = false; return this}
obj.prototype.vLEFT = function(step=false,v=this.velocity){
	cancelAnimationFrame(this.aFr);
	if(this.halterkey){
		this.halterkey = false;
		return;
	}
	else{
		this.Xdirection = this.side = "left";
		if(F9.Pocket.userCam.stalkee===this){
			if(F9.Pocket.userCam.type===1){	
				this.x -= v;
				this.ds.left = this.x + "px";
				if(this.net.length) this.net.forEach(body=>{body.vLEFT(true,v)});
			}
			else{
					
			}
		}
		else{
			this.x -= v;
			this.ds.left = this.x + "px";
			if(this.net.length) this.net.forEach(body=>{body.vLEFT(true,v)});
		}
		this.checkBound();
		this.checkOffScreen();
		this.dom.dispatchEvent(this.moveEvent);
		if(this.x+this.width-this.xcrop<this.floor.x+this.floor.xcrop){
			if(this.floor.onMe.includes(this) && this.floor!==this) this.floor.reMOveLoad(this);
			this.floor.onMe = this.floor.onMe.filter(bodi=>{return bodi!==this});
			if(!this.isJumping) this.floor = this;
		}else{}
		this.onMe.forEach(body=>{
			if(this.x+this.width-this.xcrop<body.x+body.xcrop){
				this.reMOveLoad(body);
				this.onMe = this.onMe.filter(bodi=>{return bodi!==body});
				if(!body.isJumping) body.floor = body;
			}else{}
		});
		if(F9.Pocket.collisionDetection && this.isRigid) checkCollision(2,this,v,0,0,step);
		if(!step) this.aFl = requestAnimationFrame(()=>{this.vLEFT(step,v)});
	}	
}
obj.prototype.vRIGHT = function(step=false,v=this.velocity){
	cancelAnimationFrame(this.aFl);
	if(this.halterkey){
		this.halterkey = false;
		return;
	}
	else{
		this.Xdirection = this.side = "right";
		if(F9.Pocket.userCam.stalkee===this){
			if(F9.Pocket.userCam.type===1){
				this.x += v;
				this.ds.left = this.x + "px";
				if(this.net.length) this.net.forEach(body=>{body.vRIGHT(true,v)});
			}
			else if(F9.Pocket.userCam.type===2){
				if(this.x+this.width/2<F9.Pocket.userCam.xlp && F9.Pocket.userCam.xLIM===F9.World.Size.WIDTH){
					this.xMidWay = false;
					this.x += v;
					this.ds.left = this.x + "px";
				}
				else if(this.x+this.width/2>=F9.Pocket.userCam.xlp && F9.Pocket.userCam.xLIM>sW()){
					this.xMidWay = true;
					this.x = F9.Pocket.userCam.xlp-(this.width/2);
					this.ds.left = this.x + "px";
					F9.Pocket.userCam.x += v;
					F9.Pocket.userCam.xLIM -= v;
				//	log(F9.Pocket.userCam.x)
				}
				else if(this.x+this.width/2>=F9.Pocket.userCam.xlp && F9.Pocket.userCam.xLIM<=sW()){
					this.xMidWay = false;
					F9.Pocket.userCam.xLIM = sW();
					F9.Pocket.userCam.x = F9.World.Size.WIDTH;
					this.x += v;
					this.ds.left = this.x + "px";
				}
			}
			else{}
		}
		else{
			this.x += v;
			this.ds.left = this.x + "px";
			if(this.net.length) this.net.forEach(body=>{body.vRIGHT(true,v)});
		}
		this.checkBound();
		this.checkOffScreen();
		this.dom.dispatchEvent(this.moveEvent);
		if(this.x+this.xcrop>this.floor.x+this.floor.width-this.floor.xcrop){
			if(this.floor.onMe.includes(this) && this.floor!==this) this.floor.reMOveLoad(this);
			this.floor.onMe = this.floor.onMe.filter(bodi=>{return bodi!==this});
			if(!this.isJumping) this.floor = this;
		}else{}
		this.onMe.forEach(body=>{
			if(this.x+this.xcrop>body.x+body.width-body.xcrop){
				this.reMOveLoad(body);
				this.onMe = this.onMe.filter(bodi=>{return bodi!==body});
				if(!body.isJumping) body.floor = body;
			}else{}
		});
		if(F9.Pocket.collisionDetection && this.isRigid) checkCollision(3,this,v,0,0,step);
		if(!step) this.aFr = requestAnimationFrame(()=>{this.vRIGHT(step,v)});
	}
}
obj.prototype.vUP = function(step=false,v=this.velocity){
	cancelAnimationFrame(this.aFd);
	if(this.halterkey){
		this.halterkey = false;
		return;
	}
	else{
		this.Ydirection = "up";
		this.side = "top";
		if(F9.Pocket.userCam.stalkee===this){
			if(F9.Pocket.userCam.type===1){
				this.y += v;
				this.ds.bottom = this.y + "px";
				if(this.net.length) this.net.forEach(body=>{body.vUP(true,v)});
			}
			else{
						
			}
		}
		else{
			this.y += v;
			this.ds.bottom = this.y + "px";
			if(this.net.length) this.net.forEach(body=>{body.vUP(true,v)});
		}
		this.checkBound();
		this.checkOffScreen();
		this.dom.dispatchEvent(this.moveEvent);
		if(F9.Pocket.collisionDetection && this.isRigid) checkCollision(4,this,v,0,0,step);
		if(!step) this.aFu = requestAnimationFrame(()=>{this.vUP(step,v)});
	}
}
obj.prototype.vDOWN = function(step=false,v=this.velocity){
	cancelAnimationFrame(this.aFu);
	if(this.halterkey){
		this.halterkey = false;
		return;
	}
	else{
		this.Ydirection = "down";
		this.side = "bottom";
		if(F9.Pocket.userCam.stalkee===this){
			if(F9.Pocket.userCam.type===1){
				this.y -= v;
				this.ds.bottom = this.y + "px";
				if(this.net.length) this.net.forEach(body=>{body.vDOWN(true,v)});
			}
			else{
								
			}
		}
		else{
			this.y -= v;
			this.ds.bottom = this.y + "px";
			if(this.net.length) this.net.forEach(body=>{body.vDOWN(true,v)});
		}
		this.checkBound();
		this.checkOffScreen();
		this.dom.dispatchEvent(this.moveEvent);
		if(F9.Pocket.collisionDetection && this.isRigid) checkCollision(5,this,v,0,0,step);
		if(!step) this.aFd = requestAnimationFrame(()=>{this.vDOWN(step,v)});
	}
}
obj.prototype.vJUMP = function(returning=false,externalForce=false,jv=this.jumpSpeed,mh=this.maxHeight){
	this.Ydirection = "up";
	this.side = "top";
	if(!returning && this.Jnn<this.Jn){
		cancelAnimationFrame(this.aFj);
		this.isLanded = true;
		this.isJumping = true;
		this.isFalling = false;
		this.floor.onMe = this.floor.onMe.filter(bodi=>{return bodi!==this});
		if(this.floor!==this) this.floor.reMOveLoad(this);
		this.cht = 0;
		this.cht += jv;
		if(!externalForce) this.Jnn++;
		if(F9.Pocket.userCam.stalkee===this){
			if(F9.Pocket.userCam.type===1){	
				this.y += jv;
				this.ds.bottom = this.y + "px";
				if(this.net.length) this.net.forEach(body=>{body.vJUMP(true,true,jv,mh)});
			}
			else{
							
			}
		}
		else{
			this.y += jv;
			this.ds.bottom = this.y + "px";
			if(this.net.length) this.net.forEach(body=>{body.vJUMP(true,true,jv,mh)});
		}
		this.checkBound();
		this.checkOffScreen();
		this.dom.dispatchEvent(this.moveEvent);
		if(F9.Pocket.collisionDetection && this.isRigid) checkCollision(0,this,0,mh,jv);
		this.aFj = requestAnimationFrame(()=>{this.vJUMP(true,externalForce,jv,mh)});
	}
	else if(returning && this.cht<mh){
		this.isLanded = true;
		this.cht += jv;
		if(F9.Pocket.userCam.stalkee===this){
			if(F9.Pocket.userCam.type===1){	
				this.y += jv;
				this.ds.bottom = this.y + "px";
				if(this.net.length) this.net.forEach(body=>{body.vJUMP(true,tru,jv,mh)});
			}
			else{
						
			}
		}
		else{
			this.y += jv;
			this.ds.bottom = this.y + "px";
			if(this.net.length) this.net.forEach(body=>{body.vJUMP(true,tru,jv,mh)});
		}
		this.checkBound();
		this.checkOffScreen();
		this.dom.dispatchEvent(this.moveEvent);
		if(F9.Pocket.collisionDetection && this.isRigid) checkCollision(0,this,0,mh,jv);
		this.aFj = requestAnimationFrame(()=>{this.vJUMP(true,externalForce,jv,mh)});
	}
	else if(this.cht>=mh){this.floor = this}
	else{return}
}
obj.prototype.multiJump = function(n=2){this.Jn = n}
obj.prototype.refresh = function(){
	this.xcrop = (this.c0 || .1)/100*this.width;
	this.ycrop = (this.c1 || .1)/100*this.height;
	this.ds.left = this.x+"px";
	this.ds.bottom = this.y+"px";
	this.ds.width = this.width+"px";
	this.ds.height = this.height+"px";
	if(!this.wrf){
		if(this.texture===undefined || this.texture==="" || this.texture===" ") this.ds.backgroundColor = this.color;
		this.ds.backgroundImage = "url("+this.texture+".png)";
		if(this.tw[0]===undefined){
			this.ds.backgroundRepeat = F9.Pocket.txr;
			this.ds.backgroundSize = F9.Pocket.txh===undefined ? F9.Pocket.txw+"%" : F9.Pocket.txw+"% "+F9.Pocket.txh+"%";
		}
		else{
			this.ds.backgroundRepeat = this.tw[2];
			this.ds.backgroundSize = this.tw[0]+"% "+this.tw[1]+"%";
		}
	}
	else{this.ds.border = ".5px solid #ffffff"}
	this.ds.opacity = this.opacity;
	this.ds.borderRadius = this.arc+"px";
	this.ds.filter = this.shader;
}
obj.prototype.setMass = function(m){this.mass = this.massRef = m}
obj.prototype.collapse = function(){if(this.floor!==this) this.floor = this}
obj.prototype.update = function(){this.refresh();this.collapse()}
obj.prototype.on = function(ev,ex){this.dom.addEventListener(ev,ex)}
obj.prototype.unListen = function(ev,ex){this.dom.removeEventListener(ev,ex)}
obj.prototype.fall = function(){
	if(!this.isLanded){
		this.isFalling = true;
		this.isJumping = false;
		this.Ydirection = "down";
		this.side = "bottom";
		if(F9.Pocket.userCam.stalkee===this && this.isRigid){
			if(F9.Pocket.userCam.type===1){
				this.y -= this.mass*F9.Quantity.g/10;
				this.ds.bottom = this.y + "px";
			}
			else if(F9.Pocket.userCam.type===2){
						
			}
		}
		else{
			if(this.isRigid){
				this.y -= this.mass*F9.Quantity.g/10;
				this.ds.bottom = this.y + "px";
			}else{}
		}
		this.checkBound();
		this.checkOffScreen();
		this.dom.dispatchEvent(this.moveEvent);
		if(F9.Pocket.collisionDetection && this.isRigid) checkCollision(1,this);
	}
	else if(this.isLanded && this.floor===this){
		if(this.onMe.length>0){
			this.onMe.forEach(body=>{body.floor = body});
			this.onMe = [];
		}else{}
		this.isLanded = false;
	}
}
obj.prototype.hide = function(){this.ds.display = "none"}
obj.prototype.show = function(){this.ds.display = "block"}
obj.prototype.translate = function(opt){
	let ease = opt.ease || 5;
	let xcompletn = ycompletn = false;
	if(opt.x<this.x+(this.width/2)){
		const AnimL = () =>{
			if(this.x+(this.width/2)>opt.x){
				this.vLEFT(true,opt.ease);
				this.laf = requestAnimationFrame(()=>{AnimL()});
			}
			else if(this.x+(this.width/2)<opt.x){
				this.POS_X(opt.x-(this.width/2));
				xcompletn = true;
				if(xcompletn && ycompletn) this.dom.dispatchEvent(this.finishEvent);
			}
			else{return}
		}
		AnimL();
	}
	else if(opt.x>this.x+(this.width/2)){
		const AnimR = () =>{
			if(this.x+(this.width/2)<opt.x){
				this.vRIGHT(true,opt.ease);
				this.raf = requestAnimationFrame(()=>{AnimR()});
			}
			else if(this.x+(this.width/2)>opt.x){
				this.POS_X(opt.x-(this.width/2));
				xcompletn = true;
				if(xcompletn && ycompletn) this.dom.dispatchEvent(this.finishEvent);
			}
			else{return}
		}
		AnimR();
	}else{}
	if(opt.y<this.y+(this.height/2)){
		const AnimD = () =>{
			if(this.y+(this.height/2)>sH()-opt.y){
				this.vDOWN(true,opt.ease);
				this.daf = requestAnimationFrame(()=>{AnimD()});
			}
			else if(this.y+(this.height/2)<sH()-opt.y){
				this.POS_Y((sH()-this.y)-(this.height/2));
				ycompletn = true;
				if(xcompletn && ycompletn) this.dom.dispatchEvent(this.finishEvent);
			}
			else{return}
		}
		AnimD();
	}
	else if(opt.y>this.y+(this.height/2)){
		const AnimU = () =>{
			if(this.y+(this.height/2)<opt.y){
				this.vUP(true,opt.ease);
				this.uaf = requestAnimationFrame(()=>{AnimU()});
			}
			else if(this.y+(this.height/2)>opt.y){
				this.POS_Y(opt.y-(this.height/2));
				ycompletn = true;
				if(xcompletn && ycompletn) this.dom.dispatchEvent(this.finishEvent);
			}
			else{return}
		}
		AnimU();
	}else{}	
}
const tile = function(x=0,y=0,w=50,h=50,opt){
	this.x = x;
	this.y = y;
	if(w<=0) w = .1;
	if(h<=0) h = .1;
	this.width = w;
	this.height = h;
	opt = opt || {};
	this.texture = opt.texture;
	this.zIndex = opt.zIndex || 0;
	this.color = opt.color || randomColor();	
	this.opacity = opt.opacity || 1;
	this.shader = opt.shader || F9.Pocket.shade;
	this.isRigid = opt.isRigid || false;
	this.motionSlice = opt.motionSlice || 0;
	this.touchEvent = new CustomEvent("touch",{a:undefined});
	this.disposeEvent = new Event("dispose");
	this.dom = document.createElement("div");
	this.dom.addEventListener("touchstart",(e)=>{
		this.touchEvent.a = this;
		this.touchEvent.pos = {x:e.touches[0].pageX,y:e.touches[0].pageY};
		this.dom.dispatchEvent(this.touchEvent);
	});
	this.ds = this.dom.style;
	this.ds.position = "fixed";
	this.ds.left = this.x+"px";
	this.ds.bottom = this.y+"px";
	this.ds.width = this.width+"px";
	this.ds.height = this.height+"px";
	this.ds.backgroundImage = "url("+this.texture+".png)";
	if(this.texture===undefined || this.texture==="" || this.texture===" ") this.ds.backgroundColor = this.color;
	this.ds.backgroundRepeat = F9.Pocket.txr;
	this.ds.backgroundSize = F9.Pocket.txh===undefined ? F9.Pocket.txw+"%" : F9.Pocket.txw+"% "+F9.Pocket.txh+"%";
	this.ds.opacity = this.opacity;
	this.ds.zIndex = this.zIndex;
	this.ds.filter = this.shader;
	this.ds.zoom = (F9.Pocket.userCam.zoom || 100) + "%";
	if(F9.Pocket.autoB==="ON"){
		F9.World.Bodies.push(this);
		F9.Pocket.RoomForAll.push(this);
		document.body.appendChild(this.dom);
	}
}
tile.prototype.refresh = function(){
	this.ds.position = "fixed";
	this.ds.left = this.x+"px";
	this.ds.bottom = this.y+"px";
	this.ds.width = this.width+"px";
	this.ds.height = this.height+"px";
	this.ds.backgroundColor = this.color;
	this.ds.backgroundImage = "url("+this.texture+".png)";
	this.ds.backgroundRepeat = F9.Pocket.txr;
	this.ds.backgroundSize = F9.Pocket.txh===undefined ? F9.Pocket.txw+"%" : F9.Pocket.txw+"% "+F9.Pocket.txh+"%";
	this.ds.opacity = this.opacity;
	this.ds.filter = this.shader;
}
tile.prototype.on = function(ev,ex){this.dom.addEventListener(ev,ex)}
tile.prototype.removeEventListener = function(ev,ex){this.dom.removeEventListener(ev,ex)}
tile.prototype.hide = function(){this.ds.display = "none"}
tile.prototype.show = function(){this.ds.display = "block"}

const anchor = function(){
	document.addEventListener("selectstart",(e)=>{e.preventDefault()});
	this.type = 2;
}
anchor.prototype.softMechanics = function(state="ON"){
	if(state!=="ON" && state!=="OFF"){
		log("F9: softMechanics state not supported.\n");
		return false;
	}
	else{
		if(state==="ON"){F9.Pocket.sMech = true}
		else{F9.Pocket.sMech = false}
		return true;
	}
}
anchor.prototype.setGravity = function(g){!isNaN(g) ? F9.Quantity.g = g : log("F9: Value of gravity ("+g+") is not supported. Supply a number.");}
anchor.prototype.getDefaultButtons = function(){return F9.Pocket.defaultButtons}
anchor.prototype.defaultControls = function(state="ON"){
	if(state!=="ON" && state!=="OFF"){
		log("F9: defaultControls state not supported.\n");
		return false;
	}
	else{
		if(state==="ON"){
			switch(this.type){
				case 1:
					let b1 = F9.Button.Add(75,15,55,55,{text: "J",textColor: "#555",strokeColor: "#555",arc: 10});
					let b2 = F9.Button.Add(5,5,55,55,{text: "L",textColor: "#555",strokeColor: "#555",arc: 10,});
					let b3 = F9.Button.Add(22,5,55,55,{text: "R",textColor: "#555",strokeColor: "#555",arc: 10,});
					F9.Pocket.defaultButtons = [b1,b2,b3];
					b1.attachControl(F9.Controls.Jump);
					b2.attachControl(F9.Controls.Left);
					b3.attachControl(F9.Controls.Right);
					b1=b2=b3=null;
					break;
				case 2:
					let b4 = F9.Button.Add(62,5,55,55,{text: "U",textColor: "#555",strokeColor: "#555",arc: 10,});
					let b5 = F9.Button.Add(80,5,55,55,{text: "D",textColor: "#555",strokeColor: "#555",arc: 10,});
					let b6 = F9.Button.Add(5,5,55,55,{text: "L",textColor: "#555",strokeColor: "#555",arc: 10,});
					let b7 = F9.Button.Add(23,5,55,55,{text: "R",textColor: "#555",strokeColor: "#555",arc: 10,});
					F9.Pocket.defaultButtons = [b4,b5,b6,b7];
					b4.attachControl(F9.Controls.Up);
					b5.attachControl(F9.Controls.Down);
					b6.attachControl(F9.Controls.Left);
					b7.attachControl(F9.Controls.Right);
					b4=b5=b6=b7=null;
					break;
				case 3:
					let b8 = F9.Button.Add(80,30,55,55,{text: "J",textColor: "#555",strokeColor: "#555",arc: 10,});
					let b9 = F9.Button.Add(62,5,55,55,{text: "U",textColor: "#555",strokeColor: "#555",arc: 10,});
					let b10 = F9.Button.Add(80,5,55,55,{text: "D",textColor: "#555",strokeColor: "#555",arc: 10,});
					let b11 = F9.Button.Add(5,5,55,55,{text: "L",textColor: "#555",strokeColor: "#555",arc: 10,});
					let b12 = F9.Button.Add(23,5,55,55,{text: "R",textColor: "#555",strokeColor: "#555",arc: 10,});
					F9.Pocket.defaultButtons = [b8,b9,b10,b11,b12];
					b8.attachControl(F9.Controls.Jump);
					b9.attachControl(F9.Controls.Up);
					b10.attachControl(F9.Controls.Down);
					b11.attachControl(F9.Controls.Left);
					b12.attachControl(F9.Controls.Right);
					b8=b9=b10=b11=b12=null;
					break;
				default:
					throw new Error("F9: I can't just seem to understand why this error would occur.\n")
			}
			return true;
		}
		else{
			F9.Pocket.defaultButtons = ["F9: NO BUTTON"]
			return true;
		}
	}
}
anchor.prototype.setType = function(t){
	switch(t){
		case "PLATFORMER":
			this.type = 1;
			F9.Pocket.geeS = true;
			break;
		case "RPG":
			this.type = 2;
			F9.Pocket.geeS = false;
			break;
		case "ALL":
			this.type = 3;
			F9.Pocket.geeS = true;
			break;
		default:
			throw new Error("Unsupported engine type.\n");
	}
}
anchor.prototype.collisionDetection = function(state){
	if(state==="ON"){F9.Pocket.collisionDetection = true}
	else if(state==="OFF"){F9.Pocket.collisionDetection = false}
	else{throw new Error("Unsupported collision detection state.\n")}
}
anchor.prototype.collisionResponse = function(state){
	if(state===undefined){console.log("F9: Collision Response state is undefined. \n")}
	else if(state==="ON" || state==="OFF"){state==="ON" ? F9.Pocket.cR = true : F9.Pocket.cR = false}
	else{throw new Error("Unsupported collision response state.\n")}
}
anchor.prototype.gravity = function(state){
	switch(state){
		case "ON":
			if(F9.Pocket.geeS) F9.Pocket.gravitySwitch = true;
			break;
		case "OFF":
			if(!F9.Pocket.geeS) F9.Pocket.gravitySwitch = false;
			break;
		default:
			throw new Error("Illegal gravity state.\n");
	}
}
anchor.prototype.textureWrapping = (opt)=>{
	F9.Pocket.txw = opt.w;
	F9.Pocket.txh = opt.h;
	F9.Pocket.txr = opt.format;
}
anchor.prototype.mapSize = function(w,h=w){
	F9.World.Size.WIDTH = w;
	F9.World.Size.HEIGHT = h;
	if(F9.Pocket.userCam!==undefined){
		F9.Pocket.userCam.xLIM = w;
		F9.Pocket.userCam.yLIM = h;
	}else{}
}
anchor.prototype.background = function(fill){
	let mbg = document.documentElement.style;
	if(fill.endsWith(".png") || fill.endsWith(".jpg") || fill.endsWith(".gif")){
		mbg.background = "url(\""+fill+"\")";
		mbg.backgroundSize = "100% 100%";
		mbg.backgroundRepeat = "no-repeat";
		mbg.minHeight = "100%";
	}
	else{mbg.background = fill}
}
anchor.prototype.autoRefresh = function(state="ON"){
	if(state!=="ON" && state!=="OFF"){
		log("F9: Illegal autoRefresh state "+state+"\n");
		return false;
	}
	else{
		state==="ON" ? F9.Pocket.autoR = true : F9.Pocket.autoR = false;
		log("F9: autoRefresh() is experimental;\nIf collision fails, remove it and refresh manually.\n");
		return true;
	}
}
anchor.prototype.autoBind = function(state="ON"){
	if(state!=="ON" && state!=="OFF"){
		log("F9: Illegal autoBind state "+state+"\n");
		return false;
	}
	else{
		F9.Pocket.autoB = state;
		return true;
	}
}
anchor.prototype.initShader = function(s){F9.Pocket.shade = s}
anchor.prototype.changeShader = function(s){
	F9.World.Bodies.forEach(body=>{
		body.shader = s;
		body.ds.filter = s;
		F9.Pocket.shade = s;
	});
}
anchor.prototype.run = ()=>{
	window.onload = function(){
		if(F9.Pocket.userCam!==undefined){
			log("F9: "+F9.Engine.StartTime+"\n")
			updateCamera(F9.Pocket.userCam);
			if(F9.Pocket.autoR) ReFreshAll();
			PULLL(F9.Pocket.userCam);
		}else{throw new Error("Camera is not mounted.\n")}
	}
}
const createStack = function(cloned=false,t,cord,dim,matrix,margin,opt,original=this){
	if(cord.length === 0) cord = [0,0];
	if(dim.length === 0) dim = [0,0];
	if(matrix.length === 0) matrix = [0,0];
	if(margin.length === 0) margin = [0,0];
	if(cord.length === 1) cord = [cord[0],cord[0]];
	if(dim.length === 1) dim = [dim[0],dim[0]];
	if(matrix.length === 1) matrix = [matrix[0],matrix[0]];
	if(margin.length === 1) margin = [margin[0],margin[0]];
	if(margin[0]===0) margin[0] = .5;
	if(margin[1]===0) margin[1] = .5;
	
	let arr = [];
	let composite = undefined;
	this.opt = opt;
	if(cloned){
		original.clones.push(this);
		this.clones = [];
		this.amid = [];
		this.hollowed = false;
		this.type = t;
		this.row = matrix[0];
		this.col = matrix[1];
		this.xmrg = margin[0];
		this.ymrg = margin[1];
		this.dim0 = dim[0];
		this.dim1 = dim[1];
		this.width = dim[0]+((this.row-1)*this.xmrg);
		this.height = dim[1]+((this.col-1)*this.ymrg);
		let totalBodies = this.tb = matrix[0]*matrix[1];
		if(t === "QUAD"){
			let w = dim[0]/matrix[1];
			let h = dim[1]/matrix[0];
			let c = 0;
			let r = 0;
			let xmargin = 0;
			let ymargin = 0;
			let x,y;
			let pop = (original.clones.length*10)/100;
			if(cord[0]===undefined){
				x = this.x = original.x+(pop*original.width);
			}
			else{
				x = this.x = cord[0];
			}
			if(cord[1]===undefined){
				y = this.y = original.y+(pop*original.height);
			}
			else{
				y = this.y = cord[1];
			}
			for(let i = 0; i<totalBodies; i++){
				if(c === matrix[1]){
					if(cord[0]===undefined){
						x = original.x+(pop*original.width);
					}
					else{
						x = cord[0];
					}
					y += h;
					r++;
					ymargin += margin[1]+.001;
					c = 0;
					xmargin = 0;
					composite = F9.RigidBody.Add(x+xmargin,y+ymargin,w,h,opt);
					
					c++;
					x += w;
					xmargin += margin[0]+.001;
				}
				else{
					composite = F9.RigidBody.Add(x+xmargin,y+ymargin,w,h,opt);
					if(r>0 && r<matrix[0]-1 && c>0 && c<matrix[1]-1) this.amid.push(composite);
					c++;
					x += w;
					xmargin += margin[0]+.001;
				}
				arr.push(composite);
			}	
		}
		this.composites = [...arr];
		if(opt.hollow){
			this.amid.forEach(body=>{F9.Garbage.Collect(body)});
			this.hollowed = true;
		}
	}
	else{
		this.clones = [];
		this.amid = [];
		this.hollowed = false;
		this.type = t;
		this.x = cord[0];
		this.y = cord[1];
		this.row = matrix[0];
		this.col = matrix[1];
		this.xmrg = margin[0];
		this.ymrg = margin[1];
		this.dim0 = dim[0];
		this.dim1 = dim[1];
		this.width = dim[0]+((this.row-1)*this.xmrg);
		this.height = dim[1]+((this.col-1)*this.ymrg);
		let totalBodies = this.tb = matrix[0]*matrix[1];
		if(t === "QUAD"){
			let w = dim[0]/matrix[1];
			let h = dim[1]/matrix[0];
			let c = 0;
			let r = 0;
			let xmargin = 0;
			let ymargin = 0;
			let x = cord[0];
			let y = cord[1];
			for(let i = 0; i<totalBodies; i++){
				if(c === matrix[1]){
					x = cord[0];
					y += h;
					r++;
					ymargin += margin[1]+.001;
					c = 0;
					xmargin = 0;
					composite = F9.RigidBody.Add(x+xmargin,y+ymargin,w,h,opt);
					c++;
					x += w;
					xmargin += margin[0]+.001;
				}
				else{
					composite = F9.RigidBody.Add(x+xmargin,y+ymargin,w,h,opt);
					if(r>0 && r<matrix[0]-1 && c>0 && c<matrix[1]-1) this.amid.push(composite);
					c++;
					x += w;
					xmargin += margin[0]+.001;
				}
				arr.push(composite);
			}	
		}
		this.composites = [...arr];
		if(opt.hollow){
			this.amid.forEach(body=>{F9.Garbage.Collect(body)});
			this.hollowed = true;
		}
	}
}
createStack.prototype.hollow = function(bool=true){
	if(bool && !this.hollowed){
		this.amid.forEach(body=>{F9.Garbage.Collect(body)});
		this.hollowed = true;
	}
	else if(!bool && this.hollowed){
		F9.World.Bind(...this.amid);
		this.hollowed = false;
	}
	return this;
}
createStack.prototype.clone = function(xx,yy){return new createStack(true,this.type,[xx,yy],[this.dim0,this.dim1],[this.row,this.col],[this.xmrg,this.ymrg],this.opt,this)}
createStack.prototype.on = function(ev,ex){this.composites.forEach(body=>{body.on(ev,ex)})}
createStack.prototype.unListen = function(ev,ex){this.composites.forEach(body=>{body.removeEventListener(ev,ex)})}
const RST = function(){
	this.sensitivity = 100;
	this.targets = [];
	this.axis = "xy";
	window.addEventListener("touchstart",(e)=>{
		let km = false
		let posx = e.touches[0].pageX;
		let posy = e.touches[0].pageY;
		F9.Buttons.forEach(btn=>{
			let xw = posX(btn.x)+btn.width;
			let yh = posY(btn.y)+btn.height;
			if(posx>posX(btn.x) && posx<xw && sH()-posy>posY(btn.y) && sH()-posy<yh){return}else{km = true}
		});
		if(F9.Pocket.rst && km){
			this.stXCord = e.touches[0].pageX;
			this.stYCord = e.touches[0].pageY;
		}else{return}
	},true);
	window.addEventListener("touchmove",(e)=>{
		let ko = false;
		let posx1 = e.touches[0].pageX;
		let posy1 = e.touches[0].pageY;
		F9.Buttons.forEach(btn=>{
			let xw1 = posX(btn.x)+btn.width;
			let yh1 = posY(btn.y)+btn.height;
			let xw = posX(btn.x)+btn.width;
			let yh = posY(btn.y)+btn.height;
			if(posx1>posX(btn.x) && posx1<xw1 && sH()-posy1>=posY(btn.y) && sH()-posy1<yh1){return}else{ko = true}
		});
		if(F9.Pocket.rst && ko){
			this.newXCord = e.touches[0].pageX;
			this.newYCord = e.touches[0].pageY;
			this.dspmX = this.newXCord-this.stXCord;
			this.dspmY = this.stYCord-this.newYCord;
			this.stXCord = this.newXCord;
			this.stYCord = this.newYCord;
			if(this.axis==="xy" || this.axis==="yx" || this.axis==="x"){
				if(Math.abs(this.dspmX)===this.dspmX){this.targets.forEach(target=>{target.vRIGHT(true,this.dspmX*this.sensitivity/100)})}
				else{this.targets.forEach(target=>{target.vLEFT(true,-this.dspmX*this.sensitivity/100)})}
			}else{}
			if(this.axis==="xy" || this.axis==="yx" || this.axis==="y"){
				if(Math.abs(this.dspmY)===this.dspmY){this.targets.forEach(target=>{target.vUP(true,this.dspmY*this.sensitivity/100)})}
				else{this.targets.forEach(target=>{target.vDOWN(true,-this.dspmY*this.sensitivity/100)})}
			}else{}
		}else{return}
	},true);
}
RST.prototype.activate = function(){F9.Pocket.rst = true}
RST.prototype.deactivate = function(){F9.Pocket.rst = false}
RST.prototype.target = function(...tar){tar.forEach(t=>{this.targets.push(t)})}
const CST = function(){
	this.sensitivity = 100;
	this.targets = [];
	this.axis = "xy";
	this.ease = 0;
	window.addEventListener("touchstart",(e)=>{
		let km = false
		let posx = e.touches[0].pageX;
		let posy = e.touches[0].pageY;
		F9.Buttons.forEach(btn=>{
			let xw = posX(btn.x)+btn.width;
			let yh = posY(btn.y)+btn.height;
			if(posx>posX(btn.x) && posx<xw && sH()-posy>posY(btn.y) && sH()-posy<yh){return}else{km = true}
		});
		if(F9.Pocket.cst && km){
			cancelAnimationFrame(this.laf);
			cancelAnimationFrame(this.raf);
			cancelAnimationFrame(this.daf);
			cancelAnimationFrame(this.uaf);
			this.stXCord = posx;
			this.stYCord = posy;
			this.targets.forEach(target=>{
				if(this.ease<=0){
					target.position(this.stXCord-(target.width/2),(sH()-this.stYCord)-(target.height/2));
					switch(Math.floor(Math.random()*4)){
						case 0: 
							target.vUP(true,.1);
							target.vDOWN(true,.1);
							break;
						case 1:
							target.vDOWN(true,.1);
							target.vUP(true,.1);
							break;
						case 2:
							target.vLEFT(true,.1);
							target.vRIGHT(true,.1);
							break;
						default:
							target.vRIGHT(true,.1);
							target.vLEFT(true,.1);
					}
				}
				else{
					if((this.axis==="x" || this.axis==="xy" || this.axis==="yx") && this.stXCord<target.x+(target.width/2)){
						const AnimL = () =>{
							if(target.x+(target.width/2)>this.stXCord){
								target.vLEFT(true,this.ease);
								this.laf = requestAnimationFrame(()=>{AnimL()});
							}
							else if(target.x+(target.width/2)<this.stXCord){target.POS_X(this.stXCord-(target.width/2))}
							else{return}
						}
						AnimL();
					}
					else if((this.axis==="x" || this.axis==="xy" || this.axis==="yx") && this.stXCord>target.x+(target.width/2)){
						const AnimR = () =>{
							if(target.x+(target.width/2)<this.stXCord){
								target.vRIGHT(true,this.ease);
								this.raf = requestAnimationFrame(()=>{AnimR()});
							}
							else if(target.x+(target.width/2)>this.stXCord){target.POS_X(this.stXCord-(target.width/2))}
							else{return}
						}
						AnimR();
					}else{}
					if((this.axis==="y" || this.axis==="xy" || this.axis==="yx") && sH()-this.stYCord<target.y+(target.height/2)){
						const AnimD = () =>{
							if(target.y+(target.height/2)>sH()-this.stYCord){
								target.vDOWN(true,this.ease);
								this.daf = requestAnimationFrame(()=>{AnimD()});
							}
							else if(target.y+(target.height/2)<sH()-this.stYCord){target.POS_Y((sH()-this.stYCord)-(target.height/2))}
							else{return}
						}
						AnimD();
					}
					else if((this.axis==="y" || this.axis==="xy" || this.axis==="yx") && sH()-this.stYCord>target.y+(target.height/2)){
						const AnimU = () =>{
							if(target.y+(target.height/2)<sH()-this.stYCord){
								target.vUP(true,this.ease);
								this.uaf = requestAnimationFrame(()=>{AnimU});
							}
							else if(target.y+(target.height/2)>sH()-this.stYCord){target.POS_Y((sH()-this.stYCord)-(target.height/2))}
							else{return}
						}
						AnimU();
					}else{}		
				}
			});
		}else{return}
	},true);
	window.addEventListener("touchmove",(e)=>{
		let ko = false;
		let posx1 = e.touches[0].pageX;
		let posy1 = e.touches[0].pageY;
		F9.Buttons.forEach(btn=>{
			let xw1 = posX(btn.x)+btn.width;
			let yh1 = posY(btn.y)+btn.height;
			let xw = posX(btn.x)+btn.width;
			let yh = posY(btn.y)+btn.height;
			if(posx1>posX(btn.x) && posx1<xw1 && sH()-posy1>=posY(btn.y) && sH()-posy1<yh1){return}else{ko = true}
		});
		if(F9.Pocket.cst && ko){
			this.newXCord = e.touches[0].pageX;
			this.newYCord = e.touches[0].pageY;
			this.dspmX = this.newXCord-this.stXCord;
			this.dspmY = this.stYCord-this.newYCord;
			this.stXCord = this.newXCord;
			this.stYCord = this.newYCord;
			if(this.axis==="xy" || this.axis==="yx" || this.axis==="x"){
				if(Math.abs(this.dspmX)===this.dspmX){this.targets.forEach(target=>{target.vRIGHT(true,this.dspmX*this.sensitivity/100)})}
				else{this.targets.forEach(target=>{target.vLEFT(true,-this.dspmX*this.sensitivity/100)})}
			}else{}
			if(this.axis==="xy" || this.axis==="yx" || this.axis==="y"){
				if(Math.abs(this.dspmY)===this.dspmY){this.targets.forEach(target=>{target.vUP(true,this.dspmY*this.sensitivity/100)})}
				else{this.targets.forEach(target=>{target.vDOWN(true,-this.dspmY*this.sensitivity/100)})}
			}else{}
		}else{return}
	},true);
}
CST.prototype.activate = function(){F9.Pocket.cst = true}
CST.prototype.deactivate = function(){F9.Pocket.cst = false}
CST.prototype.target = function(...tar){tar.forEach(t=>{this.targets.push(t)})}
const VeCToR = function(x=0,y=0){
	this.x = x;
	this.y = y;
	return {x:this.x,y:this.y};
}
const aUdIO = function(src){
	this.audio = new Audio();
	this.audio.src = src;
	this.audio.preload = "auto";
	F9.Media.Audios.push(this);
}
aUdIO.prototype.play = function(){
	this.audio.muted = false;
	this.audio.play();
	this.audio.currentTime = ".01";
	return this;
}
aUdIO.prototype.stop = function(){
	this.audio.pause()
	this.audio.currentTime = ".03";
	return this;
}
aUdIO.prototype.pause = function(){
	this.audio.pause();
	return this;
}
aUdIO.prototype.volume = function(perc){
	this.volume = perc/100;
	this.audio.volume = this.volume;
	return this;
}
F9.Engine.Start = ()=>{return new anchor()}
F9.Button.Add = (x,y,w,h,opt)=>{return new butn(x,y,w,h,opt)}
F9.RigidBody.Add = (x,y,w,h,opt)=>{return new obj(x,y,w,h,opt)}
F9.RigidBody.Stack = (t,cord,dim,matrix,margin,opt)=>{return new createStack(false,t,cord,dim,matrix,margin,opt)}
F9.Tile.Add = (x,y,w,h,opt)=>{return new tile(x,y,w,h,opt)}
F9.World.Bind = (...bodys)=>{if(bodys.length>0) return bind(bodys)}
F9.World.Unbind = (...bodys)=>{if(bodys.length>0) return unbind(bodys)}
F9.Camera.Mount = ()=>{return new CaMeRa()}
F9.Garbage.Collect = (...bodys)=>{if(bodys.length>0 && F9.World.Bodies.length>0) return garbageCollection(bodys)}
F9.Garbage.RecycleBin = ()=>{return F9.Pocket.tRaSh}
F9.Recursion.Recur = function(intv,actn,t=Infinity){if(intv[intv.length-1]==="s"){return new recurer(Number(intv.substring(0,intv.length-1))*1000,actn,t)}else{throw new Error("Recursion interval is invalid.\n")}}
F9.Controls.RelativeScreenTouch = function(){return new RST()}
F9.Controls.CordinateScreenTouch = function(){return new CST()}
F9.Projectile.Add = (x,y,w,h,opt)=>{return new prOjEctIlE(x,y,w,h,opt)}
F9.Vector = (x,y)=>{return new VeCToR(x,y)}
F9.Media.Audio = (src)=>{return new aUdIO(src)}