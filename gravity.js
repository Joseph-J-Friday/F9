"use strict;"
window.g = 9.82;
window.Bodies = [];
window.ranHue = undefined;

var obj = function(params){
	params = params || {};
	this.space = params.space || document.body;
	this.x = params.x || 0;
	this.y = params.y|| 0;
	this.w = sizeW(params.w || 8);
	this.h = sizeH(params.h || 8);
	this.mass = params.mass !== undefined ? params.mass : 10;
	this.mass !== 0 ? this.landed = false : this.landed = true;
	this.inertia = params.inertia || .5;
	this.restitution = params.restitution || 5;
	this.hue = params.hue || ranHue;
	this.texture = params.texture;
	this.force = calcForce(this.mass);
	this.forceReserve = this.force;
	this.stroke = params.stroke !== undefined ? params.stroke : 0;
	this.speed = params.speed || calcSpeed(this.mass);
	this.onMe = this;
	this.floor = this;
	this.id = Math.random()*1000;
	this.base = 100;
	this.collided = this;
	this.pushingMe = this;
	this.walking = false;
	this.tuD = document.createElement("div");
	var ws = this.tuD.style;
	ws.position = "fixed";
	ws.width = this.w + "%";
	ws.height = this.h + "%";
	ws.top = this.y + "%";
	ws.left = this.x + "%";
	if(this.texture !== undefined){
		ws.backgroundImage = "URL(" + this.texture + ")";
		ws.backgroundOrigin = "top"
		ws.backgroundSize = "cover"
	}else{ws.backgroundColor = this.hue;}
	ws.border = this.stroke + "px solid white"
	this.w += sizeW(this.stroke*2);
	this.h += sizeH(this.stroke*2);
	this.space.appendChild(this.tuD);
}

obj.prototype.halt = function(AF){
	AF === 0 ? cancelAnimationFrame(this.mlA) : cancelAnimationFrame(this.mrA);
}
obj.prototype.fall = function(){
	if(this.landed === false){
		this.y += this.force;
	
	for(var i = 0; i<Bodies.length; i++){
	if(this.id!==Bodies[i].id){
	var b1 = this.y+this.h;
	var b2 = Bodies[i].y+Bodies[i].h;
	if((b1>=Bodies[i].y) && (b1<b2) && (this.x<=(Bodies[i].x+Bodies[i].w)) && ((this.x+this.w)>=Bodies[i].x)){
	Bodies[i].mass !== 0 && Bodies[i].landed === false && Bodies[i].mass<this.mass ? Bodies[i].force = this.force+.001 : null;
	Bodies[i].mass !== 0 ? this.base = Bodies[i].base-Bodies[i].h : this.base = Bodies[i].y;
	this.tuD.style.top = this.y + "%";
	this.floor = Bodies[i];
	Bodies[i].onMe = this;
	this.force = this.forceReserve;
	}
	}
	}
	if((this.y+this.h)>=this.base){
	this.landed = true;
	this.force = this.forceReserve;
	this.tuD.style.top = (this.base-this.h) + "%";
	}
	else{
	this.tuD.style.top = this.y + "%";
	}
	}
}

obj.prototype.right = function(step,v){
	this.collided = this;
	this.speed = v || this.speed;
	this.x += this.speed;
	if(this.x>=(this.floor.x+this.floor.w)){
	this.landed = false;
	this.onMe.landed = false;
	this.pushingMe.collided = this.pushingMe;
	this.base = 100;
	this.floor.onMe = this.floor;
	}
	if((this.x+this.w)>=100){
	this.x = (100-this.w);
	this.pushingMe !== this ? this.pushingMe.alignR(this.x-this.w) : null;
	}
	if(this.x>(this.onMe.x+this.onMe.w)){
		this.onMe.landed = false;
		this.onMe.base = 100;
		this.onMe = this;
	}
	for(var i = 0; i<Bodies.length;i++){
	if(this.collided === this && this.id!==Bodies[i].id && Bodies[i].id!==this.floor.id){
	if(((this.x+this.w)>=Bodies[i].x) && ((this.x+this.w)<(Bodies[i].x+Bodies[i].w))){
	if(((this.y+this.h)>(Bodies[i].y)) && ((this.y+this.h)<Bodies[i].y+Bodies[i].h+this.h-.1)){
	if(Bodies[i].mass !== 0){		
	this.collided = Bodies[i];
	
	Bodies[i].pushingMe = this;
	}else{
	this.x = (Bodies[i].x-this.w);
	this.pushingMe !== this ? this.pushingMe.alignR(this.x-this.w) : null;
	}
	}else{}
	}else{}
	}else{}
	
	}
	if(this.collided.mass<this.mass){
	this.collided.right(true,this.speed);
	}else if(this.collided.mass>this.mass){
		this.x = this.collided.x-this.w;
	}
	this.tuD.style.left = this.x + "%";
	this.collided.tuD.style.left = this.collided.x + "%";
	step ? null : this.mrA = requestAnimationFrame(()=>{this.right()});
}

obj.prototype.left = function(step,v){
	this.collided = this;
	this.speed = v || this.speed;
	this.x -= this.speed;
	if((this.x+this.w)<=this.floor.x){
	this.landed = false;
	this.onMe.landed = false;
	this.pushingMe.collided = this.pushingMe;
	this.base = 100;
	this.floor.onMe = this.floor;
	}
	if(this.x<=0){
	this.x = 0;
	this.pushingMe !== this ? this.pushingMe.alignL(this.x+this.w) : null;
	}
	if((this.x+this.w)<this.onMe.x){
	this.onMe.landed = false;
	this.onMe.base = 100;
	this.onMe = this;
	}
	for(var i = 0; i<Bodies.length;i++){
	if(this.id!==Bodies[i].id && Bodies[i].id!==this.floor.id){
	if((this.x<=(Bodies[i].x+Bodies[i].w)) && ((this.x)>Bodies[i].x)){
	if(((this.y+this.h)>(Bodies[i].y)) && ((this.y+this.h)<=Bodies[i].y+Bodies[i].h+this.h-.1)){
	if(Bodies[i].mass !== 0){
	this.collided = Bodies[i];	
	Bodies[i].pushingMe = this;
	}else{
	this.x = (Bodies[i].x+Bodies[i].w);
	this.pushingMe !== this ? this.pushingMe.alignL(this.x+this.w) : null;
	}
	}else{}
	}else{}
	}else{}
	
	}
	if(this.collided.mass<this.mass){
	this.collided.left(true,this.speed);	
	}else if(this.collided.mass>this.mass){
		this.x = this.collided.x+this.collided.w;
	}
	this.tuD.style.left = this.x + "%";
	this.collided.tuD.style.left = this.collided.x + "%";
	step ? null : this.mlA = requestAnimationFrame(()=>{this.left()});
}

obj.prototype.alignL = function(x){
	this.x = x;
	this.tuD.style.left = this.x + "%";
	this.pushingMe !== this ? this.pushingMe.alignR(this.x+this.w) : null;
}
obj.prototype.alignR = function(x){
	this.x = x;
	this.tuD.style.left = this.x + "%";
	this.pushingMe !== this ? this.pushingMe.alignL(this.x-this.w) : null;
}
var F9 = function(){
	pull();
}

F9.prototype.HEIGHT = 100;
F9.prototype.WIDTH = 100;
F9.prototype.bind = function(body){
	if(body.length>0){
		for(var i = 0; i<body.length; i++){
			try{Bodies.push(body[i])}catch(err){}
		}
	}else{Bodies.push(body)}
}

const pull = () =>{
	for(var i = 0; i<Bodies.length; i++){
		try{Bodies[i].mass !== 0 || !Bodies[i].landed ? Bodies[i].fall() : null}catch(err){}
	}
	requestAnimationFrame(pull);
}

const calcForce = (m) =>{return m*(g/100);}
const calcSpeed = (m) =>{return (g*.5)/(m)}
const sizeW = (w) =>{return (w/window.innerWidth)*100}
const sizeH = (h) =>{return (h/window.innerHeight)*100}
const randomColor = () =>{
	var r = 0, g = 0, b = 0;
	r = Math.floor(Math.random() * 256);
	g = Math.floor(Math.random() * 256);
	b = Math.floor(Math.random() * 256);	
	return "rgb(" + r + "," + g + ","  + b + ")";
}
ranHue = randomColor();
