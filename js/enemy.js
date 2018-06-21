//子类  Enemy 射击目标对象
var Enemy = function(opts){
  var opts = opts || {};
  //调用父类方法
  Element.call(this,opts);

  //特有属性状态和图标
  this.status = 'normal';
  this.icon = opts.icon;
  this.live = opts.live;
  this.type = opts.type;

  this.boomIcon = opts.boomIcon;
  this.boomCount = 0;

};
Enemy.prototype = new Element();
//向下移动一个身位
Enemy.prototype.down = function(){
  this.move(0,this.speed);
};
Enemy.prototype.booming = function() {
  // 设置状态为 booming
  this.status = 'booming';
  this.boomCount += 1;
  // 如果已经 booming 了 6次，则设置状态为 boomed
  if (this.boomCount > 6) {
    this.status = 'boomed';
  }
}
Enemy.prototype.draw = function (){
  //context.fillRect(this.x,this.y,this.width,this.height);
  switch (this.status) {
    case 'normal':
      context.drawImage(this.icon,this.x,this.y,this.width,this.height);
      break;
    case 'booming':
      context.drawImage(this.boomIcon,this.x,this.y,this.width,this.height);
      break;

  }
};
