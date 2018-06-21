

var CONFIG = {
  planeSize:{
    width:60,
    height:45
  },
  planeType:'bluePlaneIcon',
  bulletSize:{
    width:20,
    height:20
  },
  enemySpeed:2,//默认敌人移动距离
  enemyMaxNum:15,//
  enemySmallSize:{
    width:54,
    height:40
  },
  enemyBigSize:{
    width:130,
    height:100
  },
  bulletSpeed:10,//默认子弹的移动速度
  resource:{
    images:[
      {
        src:'./img/plane_1.png',
        name:'bluePlaneIcon'
      },
      {
        src:'./img/plane_2.png',
        name:'pinkPlaneIcon'
      },
      {
        src:'./img/fire.png',
        name:'fireIcon'
      },
      {
        src:'./img/enemy_big.png',
        name:'enemyBigIcon'
      },
      {
        src:'./img/enemy_small.png',
        name:'enemySmallIcon'
      },
      {
        src:'./img/boom_big.png',
        name:'enemyBigBoomIcon'
      },
      {
        src:'./img/boom_small.png',
        name:'enemySmallBoomIcon'
      }
    ],
    sounds: [
      {
        src: './sound/biubiubiu.mp3',
        name: 'shootSound'
      },
      { src: './sound/music.mp3',
        name: 'gameSound'
      },
      { src: './sound/die.mp3',
        name: 'dieSound'
      },
      { src: './sound/button.mp3',
        name: 'buttonSound'
      },
      { src: './sound/boom.mp3',
        name: 'boomSound'
      },
    ]
  }
};
