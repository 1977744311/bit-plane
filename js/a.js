var $body = $(document.body);

var $canvas = $('#game');
var canvas = $canvas.get(0);
var context = canvas.getContext("2d");
//设置宽和高
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//获取画布相关元素
var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;

window.requestAnimFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
window.setTimeout(callback, 1000 / 30);
};

function bindEvent(){
  var self = this;
  $body.on('click','.js-start',function () {
    $body.attr('data-status','start');
    GAME.start();
  });
  $body.on('click','.js-exp',function () {
    $body.attr('data-status','exp');
  });
  $body.on('click','.js-set',function () {
    $body.attr('data-status','setting');
  });
  $body.on('click','.js-y',function () {
    $body.attr('data-status','index');
  });
  $body.on('click','.js-yset',function () {
    $body.attr('data-status','index');
  });
}
//创建一个游戏对象
var GAME = {
  init:function(opts){
    var opts = Object.assign({},opts,CONFIG);
    this.opts = opts;

    //计算飞机初始坐标
    this.planePosX = canvasWidth / 2 - opts.planeSize.width / 2;
    this.planePosY = canvasHeight - opts.planeSize.height - 50;

    //console.log(this.opts);
  },
  start:function(){
    //游戏初始化
    var self = this;
    var opts = this.opts;
    var images = this.images;

    this.enemies = [];
    this.score = 0;

    //随机生成大小敌机
    this.createSmallEnemyInterval = setInterval(function(){
      self.createEnemy('normal');
    },500);
    this.createBigEnemyInterval = setInterval(function(){
      self.createEnemy('big');
    },1500);
    //创建主角
    this.plane = new Plane({
      x:this.planePosX,
      y:this.planePosY,
      width:opts.planeSize.width,
      height:opts.planeSize.height,
      //子弹尺寸速度
      bulletSize:opts.bulletSize,
      bulletSpeed:opts.bulletSpeed,
      //图标相关
      icon:resourceHelper.getImage('bluePlaneIcon'),
      bulletIcon:resourceHelper.getImage('fireIcon'),
      boomIcon:resourceHelper.getImage('enemyBigBoomIcon'),
    });
    this.plane.startShoot();

    //开始更新游戏
    this.update();
  },
  update:function(){
    var self = this;
    var opts = this.opts;
    //清理画布
    this.updateElement();
    context.clearRect(0,0,canvasWidth,canvasHeight);
    //更新飞机，敌人
    if(this.plane.status==='boomed'){
      this.end();
      return;
    }
    //绘制画布
    this.draw();

    requestAnimFrame(function () {
      self.update()
    });
  },
  updateElement:function(){
    var opts = this.opts;
    var enemySize = opts.enemySize;
    var enemies = this.enemies;
    var plane = this.plane;
    var i = enemies.length;

    if(plane.status==='booming'){
      plane.booming();
      return;
    }
    //循环更新怪兽
    while (i--){
      var enemy = enemies[i];
      enemy.down();
      if(enemy.y >= canvasHeight){
        this.enemies.splice(i,1);
      }else{
        if(plane.status==='normal'){
          if(plane.hasCrash(enemy)){
            plane.booming();
          }
        }
        switch(enemy.status) {
            case 'normal':
              if (plane.hasHit(enemy)) {
                enemy.live -= 1;
                if (enemy.live === 0) {
                  enemy.booming();
                }
              }
              break;
            case 'booming':
              enemy.booming();
              break;
            case 'boomed':
              enemies.splice(i, 1);
              break;
          }
      }
    }
  },
  //绑定手指触摸
  bindTouchAction: function () {
    var opts = this.opts;
    var self = this;
    // 飞机极限横坐标、纵坐标
    var planeMinX = 0;
    var planeMinY = 0;
    var planeMaxX = canvasWidth - opts.planeSize.width;
    var planeMaxY = canvasHeight - opts.planeSize.height;
    // 手指初始位置坐标
    var startTouchX;
    var startTouchY;
    // 飞机初始位置
    var startPlaneX;
    var startPlaneY;

    // 首次触屏
    $canvas.on('touchstart', function (e) {
      var plane = self.plane;
      // 记录首次触摸位置
      startTouchX = e.originalEvent.touches[0].clientX;
      startTouchY = e.originalEvent.touches[0].clientY;
      //console.log('touchstart', startTouchX, startTouchY);
      // 记录飞机的初始位置
      startPlaneX = plane.x;
      startPlaneY = plane.y;
      //console.log('e.touches');
    });

    $canvas.on('touchmove', function (e) {
      var newTouchX = e.originalEvent.touches[0].clientX;
      var newTouchY = e.originalEvent.touches[0].clientY;
      // console.log('touchmove', newTouchX, newTouchY);


      var newPlaneX = startPlaneX + newTouchX - startTouchX;
      var newPlaneY = startPlaneY + newTouchY - startTouchY;

      if(newPlaneX < planeMinX){
        newPlaneX = planeMinX;
      }
      if(newPlaneX > planeMaxX){
        newPlaneX = planeMaxX;
      }
      if(newPlaneY < planeMinY){
        newPlaneY = planeMinY;
      }
      if(newPlaneY > planeMaxY){
        newPlaneY = planeMaxY;
      }
      // 更新飞机的位置
      self.plane.setPosition(newPlaneX, newPlaneY);
      // 禁止默认事件，防止滚动屏幕
      e.preventDefault();
    });
  },
  //生成怪兽
  createEnemy:function(enemyType){
    var enemies = this.enemies;
    var opts = this.opts;
    var images = this.images ||{};
    var enemySize = opts.enemySmallSize;
    var enemySpeed = opts.enemySpeed;
    var enemyIcon = resourceHelper.getImage('enemySmallIcon');
    var enemyBoomIcon = resourceHelper.getImage('enemySmallBoomIcon');

    var enemyLive = 1;

    if (enemyType==='big'){
      enemySize = opts.enemyBigSize;
      enemyIcon = resourceHelper.getImage('enemyBigIcon');
      enemyBoomIcon = resourceHelper.getImage('enemyBigBoomIcon');
      enemySpeed = opts.enemySpeed * 0.6;
      enemyLive = 10;
    }
    //综合元素的参数
    var initOpt = {
      x:Math.floor(Math.random() * (canvasWidth - enemySize.width)),
      y:-enemySize.height,
      enemyType:enemyType,
      live:enemyLive,
      width:enemySize.width,
      height:enemySize.height,
      speed:enemySpeed,
      icon:enemyIcon,
      boomIcon:enemyBoomIcon
    }
    if(enemies.length < opts.enemyMaxNum){
      enemies.push(new Enemy(initOpt));
    }
    //console.log(enemies);
  },
  end:function(){
    alert('游戏结束');
    $body.attr('data-status','index');
  },
  draw:function(){
    this.enemies.forEach(function(enemy){
      enemy.draw();
    });
    this.plane.draw();
  }
};
function init() {
  //加载图片资源
  resourceHelper.load(CONFIG.resource,function(resource){
    GAME.init();
    GAME.bindTouchAction();
    bindEvent();
  });

}
init();
