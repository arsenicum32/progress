var Progress = (function(){
   function Progress(elementId){
    /*
      User Props
    */
    if(!elementId) throw "не задан id элемента, куда монтировать загрузчик!";

    this.id = elementId;

    this.mode = "normal"
    this.valueMode = false;
    this.value = 0;

    /*
      System Props
    */
    this.size = 100;

    this.sAngle = 0;
    this.eAngle = this.value * 3.6;

    this.anim; // animation state: 0 – stop, 1 - start
    this.hide;

    this.pathId = Math.random().toString(36).substring(2); // random id for Component

    /*
      Монтируем сразу после инициализации
    */
    this._mount()
  }

  /*
    Установить объект в DOM
  */
  Progress.prototype._mount = function(){
    if(document.getElementById(this.id)){
      this.size = document.getElementById(this.id).offsetWidth / 2;

      document.getElementById(this.id).innerHTML =
      `<svg id="main${this.pathId}" width="${this.size*2}" height="${this.size*2}" >
        <defs>
          <mask id="progress${this.pathId}">
            <path id="arc${this.pathId}" fill="white" />
            <circle cx='${this.size}' cy='${this.size}' r='${this.size*.9}' fill='black' />
          </mask>
          <mask id="ci${this.pathId}">
            <circle cx='${this.size}' cy='${this.size}' r='${this.size}' fill='white' />
            <circle cx='${this.size}' cy='${this.size}' r='${this.size*.9}' fill='black' />
          </mask>
        </defs>
        <circle cx='${this.size}' cy='${this.size}' r='${this.size}' fill='#eee' mask='url(#ci${this.pathId})' />
        <circle cx='${this.size}' cy='${this.size}' r='${this.size}' fill='#FFDB4D' mask='url(#progress${this.pathId})' />
      </svg>`;
      console.log("Component mount");
    }else{
      throw `no element with ${this.id} in DOM found!`;
    }
  }
  /*
    Удалить объект из DOM (для события onbeforeunload)
  */
  Progress.prototype._unmount = function(){
    this.tout?clearTimeout(this.tout):null;
    this.inter?clearInterval(this.inter):null;
    document.getElementById(this.id).innerHTML = "";
  }
  /*
    Масштабировать объект
  */
  Progress.prototype._resize = function(size){}

  /*
    установить цикл анимации
  */
  Progress.prototype._animationLoop = function(bool){
    this.anim = bool;
    this.inter ? null :
    this.inter = setInterval(_=>{
      if(this.anim){
        this.sAngle++;
        this.sAngle = this.sAngle % 360;
        this._update(this.sAngle + this.eAngle);
      }else{
        if(this.sAngle == 0){
        }else{
          this.sAngle++;
          this.sAngle = this.sAngle % 360;
          this._update(this.sAngle + this.eAngle);
        }
      }
    });
  }

  Progress.prototype._help = function(d) {
    var rd = ((d||0)-this.size*.9)*Math.PI/180;
    return [ this.size+(this.size*Math.cos(rd)) , this.size+(this.size*Math.sin(rd)) ];
  }
  /*
    Вычислить свойство d для mask svg елемента
  */
  Progress.prototype._countArgument = function(angle){
    var s = this._help(angle),
        e = this._help(this.sAngle);
    return `
        M ${s[0]} ${s[1]} A ${this.size} ${this.size} 0 ${angle-this.sAngle<=180?0:1} 0 ${e[0]} ${e[1]}
        L ${this.size} ${this.size} L ${s[0]} ${s[1]}`;
  }
  /*
    Обновить свойство в DOM
  */
  Progress.prototype._update = function(angle){
    document.getElementById("arc"+this.pathId).setAttribute("d", this._countArgument(angle) );
  }
  /*
    mode: normal, animated, hidden
  */

  Progress.prototype._tween = function(func, s,e, k){
    if(Math.abs(s-e)>1){
      setTimeout(_=>{
         var ns = s + ( e - s) * (k || 0.1);
         func(ns);
         this._tween( func, ns , e , k +.1 );
      }, 10);
    }
  }
  Progress.prototype._hidden  = function(bool){
    this.hide = bool?true:false;
    document.getElementById("main"+this.pathId).setAttribute("opacity", bool?1:0);
  }
  Progress.prototype.setMode = function(mode , value ){
    switch (mode) {
      case "normal":
        this._hidden(1);
        this._animationLoop();
        break;
      case "animated":
        this._animationLoop( value=="no" ? false : true );
        break;
      case "hidden":
        this._hidden(value);
        break;
      default:
        throw "Неверно указан первый аргумент, используйте: normal, animated, hidden"
    }
  }

  /*
    Плавно установить значение progress в определенное положение
  */

  Progress.prototype.setValue = function(value){
    if(value<0||value>100){
      throw "укажите значение от 0 до 100"
    }else{
      this._tween( v=>{
        this.value = v;
        this.eAngle = this.value * 3.6;
        this.tout = this._update(this.sAngle + this.eAngle);
      } , this.value , value )
    }
  }

  /*
    Получить текущее состояние
  */
  Progress.prototype.getStatus = function(arg){
    var arr = {value: Math.floor(this.value) , isAnimate: this.anim, isHidden: this.hide };
    return arg&&arr[arg]?arr[arg]:arr;
  }

  return Progress;

})()
