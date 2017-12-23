/*
  Компонента тумблер
*/
function checkComponent(id, mountId){
  this.status = false;
  this.id = id;
  this.mountId = mountId || id;

  this._mount();
}
checkComponent.prototype._render = function(){
  if(this.state){
    document.getElementById(this.id+'Status').style.left = "-21px";
    document.getElementById(this.id+'Status').style.background = "#eee";
    document.getElementById(this.id+'StatusBack').style.background = "lightgreen";
    document.getElementById(this.id+'StatusBack').style.border = "1px solid lightgreen";
  }else{
    document.getElementById(this.id+'Status').style.left = "-37px";
    document.getElementById(this.id+'Status').style.background = "#ccc";
    document.getElementById(this.id+'StatusBack').style.background = "#333";
    document.getElementById(this.id+'StatusBack').style.border = "1px solid #333";
  }
}
checkComponent.prototype._mount = function(){
  document.getElementById(this.mountId).innerHTML = `
    <div id="${this.id}StatusBack" class="field"></div>
    <div id="${this.id}Status" class="buble"></div>
    <span>${ this.id.charAt(0).toUpperCase() + this.id.slice(1) }</span>
  `
}
checkComponent.prototype.setListener = function(func){
  document.getElementById(this.id).addEventListener('click', e=> {
    this.state = !this.state;
    func(e,this.state);
    this._render();
  })
}
checkComponent.prototype.value = function(state){
  return state == undefined ? this.state : this.changeState(state);
}
checkComponent.prototype.changeState = function(state){
  this._render();
}
