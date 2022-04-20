var PLAY=1;
var END =0;
var score;
var gameState = PLAY;
var jumpSound, checkPointSound, dieSound;
var trex, trex_running, trex_collided;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstaclesGroup;
var ground, invisibleGround, groundImage, cloudImage, cloudsGroup ;
var gameOverImg, restartImg;
var gameOver, restart;

function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png"); 
  groundImage=loadImage("ground2.png");
  cloudImage=loadImage("cloud.png");
  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
  
  obstacle1=loadImage("obstacle1.png");
   obstacle2=loadImage("obstacle2.png");
   obstacle3=loadImage("obstacle3.png");
   obstacle4=loadImage("obstacle4.png");
   obstacle5=loadImage("obstacle5.png");
   obstacle6=loadImage("obstacle6.png");
  
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkPointSound=loadSound("checkPoint.mp3")
  

  
}

function setup(){
  createCanvas(600,200);
  
  
  //Crear el sprite del trex
  trex_collided = loadAnimation("trex_collided.png");
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  edges = createEdgeSprites();
  
  //añadir escala y posicion del trex
  trex.scale=0.5;
  trex.x=50;
  
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale=0.5;
  restart.scale=0.5;
  
  //Crear el sprite del suelo 
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  ground.velocityX=-4;
  
 
  
  //Crear un sprite de suelo invisible 
  invisibleGround = createSprite (200,190,400,10);
  invisibleGround.visible= false;
  

  //-Crear obstaculos y grupos de nubes 
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log(" Hello "+ 5 );
  score=0;
  
  trex.changeAnimation("collided", trex_collided);
  
  //Establece un ciclo de vida a los objetos 
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);
  
  trex.setCollider("rectangle",0,0,trex.with,trex.weigth);
  trex.debug=true;
  
}



function draw(){
  background(170);
  
  
 
  console.log("this is", gameState);
  
  if (gameState==PLAY){
     gameOver.visible=false;
    restart.visible=false;
       //mueve el suelo 
  ground.velocityX=-(4 + 3 *score/100);
    
     score=score+Math.round(getFrameRate()/60);
    
      //Manda a llamar los nubes
  spawnClouds();
  
    if(score>0 && score%100==0){
      checkPointSound.play();
    }
    
  //Aparece obstaculos en el suelo
  spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      //trex.velocityY=-12;
      //jumpSound.play();
      gameState=END;
      dieSound.play();
    }
    
      }
  else if(gameState==END){
    gameOver.visible=true;
    restart.visible=true;
    
    if(mousePressedOver(restart)){
      reset();
    }
    
    //detiene el suelo
     //mueve el suelo 
    ground.velocityX=0;
    trex.velocityY=0;
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

          }
  
  text("Puntuacion: "+score,500,50);
 
  
  ground.velocityX=-2;
  //Usa la consola para enviar mensajes
  //console.log(trex.y);
  
  if(ground.x<0){
    ground.x=200;
  }
  
  if(keyDown("Space") && trex.y>100){
    trex.velocityY=-10;
    jumpSound.play();
  }
  
  trex.velocityY=trex.velocityY+0.8;  
  
  //Evita que el trex se caiga
  trex.collide([invisibleGround]);
  
  if(mousePressedOver(restart)){
    console.log("Reinicia el juego");
    reset();
  }
  
  drawSprites();

}

function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  score=0;
}

function  spawnObstacles(){
  if(frameCount%60==0){
    var obstacle=createSprite(600,165,10,40);
    obstacle.velocityX=-(6+score/100);
    
    //Generar obs al azar
     var rand=Math.round(random(1,6));
    
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
      break;
      case 2: obstacle.addImage(obstacle2);
        break;
         case 3: obstacle.addImage(obstacle3);
        break;
         case 4: obstacle.addImage(obstacle4);
        break;
         case 5: obstacle.addImage(obstacle5);
        break;
         case 6: obstacle.addImage(obstacle6);
        break;
        default:break;
             }
    //Asigna escala y ciclo de vida de los obstaculos 
    obstacle.scale=0.5;
    obstacle.lifetime=300;
    
    //añade cada obstaculo al grupo 
    obstaclesGroup.add(obstacle);
    
  }
}


function spawnClouds(){
  if(frameCount%60==0){
    cloud=createSprite(600,100,40,10);
    cloud.addImage(cloudImage);
    cloud.y=Math.round(random(10,60));
    cloud.scale=0.4;
    cloud.velocityX=-3;
    
    //Asignar un ciclo punto de vida
    cloud.lifetime=200;
    
 //Ajustar la profundidad 
    cloud.depth=trex.depth;
    trex.depth=trex.depth +1;
    
    //Añade cada nube al grupo
    cloudsGroup.add(cloud);
  }
  
}