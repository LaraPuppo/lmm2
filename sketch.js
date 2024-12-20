const canvasWidth = 1300;
const canvasHeight = (canvasWidth / 16) * 9; // Relación 16:9
let hudShapes = [];
let baseShapes = [];
let selectedShape = null;
let currentLevel = 0; 
let currentPage = 0; 
const itemsPerPage = 5;
let rotateSound, snapSound, errorSound;
let hudImages = [];
let fondoWidth = 2300;  // Tamaño original
let fondoHeight = (fondoWidth / 16) * 9; // Calcula el alto respetando la relación 16:9
let fondoScale = 1; // Escala en el Nivel 2
let targetWidth = 5600; // Ancho objetivo en el Nivel 2
let targetHeight = (targetWidth / 16) * 9; // Alto objetivo en el Nivel 2
let img1Opacity = 255; // Opacidad inicial para Img1


function preload() {
  // Fondo
  fondo = loadImage('assets/fondos/fondo.svg');
  fondo1 = loadImage('assets/fondos/fondo1.svg');
  fondo2 = loadImage('assets/fondos/fondo2.svg');
  fondo3 = loadImage('assets/fondos/fondo3.svg');

  // Componentes
  Img2 = loadImage('assets/componentes/img2.png');
  Img3 = loadImage('assets/componentes/img3.png');
  Img4 = loadImage('assets/componentes/img4.png');
  Img5 = loadImage('assets/componentes/img5.png');
  Img6 = loadImage('assets/componentes/img6.png');
  Img7 = loadImage('assets/componentes/img7.png');
  Img8 = loadImage('assets/componentes/img8.png');
  Img9 = loadImage('assets/componentes/img9.png');
  Img10 = loadImage('assets/componentes/img10.png');
  Img11 = loadImage('assets/componentes/img11.png');
  Img12 = loadImage('assets/componentes/img12.png');
  Img13 = loadImage('assets/componentes/img13.png');
  Img14 = loadImage('assets/componentes/img14.png');
  Img15 = loadImage('assets/componentes/img15.png');
  Img16 = loadImage('assets/componentes/img16.png');

  hudImages = [
    loadImage('assets/hud/hud1.png'), // Imagen para página 0
    loadImage('assets/hud/hud2.png'), // Imagen para página 1
    loadImage('assets/hud/hud3.png'), // Imagen para página 2
  ];

  // Sonidos
  rotateSound = loadSound('assets/sonidos/girar elementos.mp3');
  snapSound = loadSound('assets/sonidos/conexion correcta 1.mp3');
  errorSound = loadSound('assets/sonidos/cortocircuitofuerte.mp3');
  fondoSound = loadSound('assets/sonidos/fondo.mp3');

  // Videos
  inicio = createVideo(['assets/videos/inicio.mp4']);
  final = createVideo(['assets/videos/final.mp4']);
  video = createVideo(['assets/videos/video.mp4']);
  inicio.hide(); 
  final.hide();
  video.hide(); 
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  initHUD();
  loadLevel(currentLevel);
  fondoSound.loop();
}

function draw() {
 if (currentLevel === 0) {
   drawLevels();
 } else if (currentLevel === 1) {
   drawLevels();
 }  else if (currentLevel === 2) {
   drawLevels();
 }else if (currentLevel === 3) {
   drawLevels();
 } else if (currentLevel === 4) {
   drawLevels();
  } else if (currentLevel === 5) {
   drawLevels();
  } else if (currentLevel === 6){
   drawLevels();
  }
}

function initHUD() {
  hudShapes = [
    new DraggableShape(153, 65, Img2, 180, 1.2, 1.2),
    new DraggableShape(300, 65, Img10, 180),
    new DraggableShape(420, 65, Img14, 135),
    new DraggableShape(570, 65, Img13, 90),
    new DraggableShape(700, 65, Img6, 225),
    new DraggableShape(153, 65, Img7, 315),
    new DraggableShape(290, 65, Img8, 90),
    new DraggableShape(420, 65, Img9, 45),
    new DraggableShape(520, 65, Img5, 270),
    new DraggableShape(670, 65, Img11, 180),
    new DraggableShape(153, 65, Img12, 180),
    new DraggableShape(260, 65, Img3, 180),
    new DraggableShape(420, 65, Img4, 180),
    new DraggableShape(575, 65, Img15, 225),
    new DraggableShape(700, 65, Img16, 135),
  ];
}

function loadLevel(level) {
  if (level === 1) {
    baseShapes = [
      new FixedShape(313, 238, Img2, 0, 3.15, 3.15),
      new FixedShape(945, 130, Img3, 0, 3.15,3.15),
      new FixedShape(512, 554,Img4, 0, 3.15,3.15),
      new FixedShape(1125, 444, Img5, 0, 3.15,3.15),
    ];
  } else if (level === 2) {
    baseShapes = [
      new FixedShape( 1049,102, Img6,0, 1.8,1.8),
      new FixedShape(931, 451, Img7,0, 1.8,1.8),
      new FixedShape(1159, 560, Img13,0, 1.8,1.8),
      new FixedShape(523, 612, Img8,0, 1.8,1.8),
      new FixedShape(67, 598, Img9,0, 1.8,1.8),
    ];
  } else if (level === 3) {
    baseShapes = [
      new FixedShape(199, 643, Img10, 0,1.2,1.2),
      new FixedShape(479, 544, Img11, 0,1.2,1.2),
      new FixedShape(554, 641, Img12, 0,1.2,1.2),
      new FixedShape(881, 197, Img14, 0,1.2,1.2),
      new FixedShape(1114, 37, Img15, 0,1.2,1.2),
      new FixedShape(1178, 292, Img16, 0,1.2,1.2),
    ];
  }
}

function drawHUD() {
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  imageMode(CORNER);
  // Dibujar la imagen del HUD correspondiente a la página actual
  if (currentPage >= 0 && currentPage < hudImages.length) {
   // image(hudImages[currentPage], 0, 0, 80, 80); // Ajusta el tamaño si es necesario
  }
  // Reducir la opacidad de Img1 en el nivel 4
  if (currentLevel === 4) {
    img1Opacity = lerp(img1Opacity, 0, 0.09); // Gradualmente hacia 0
  }

  tint(255, img1Opacity); // Aplicar opacidad a Img1
  image(hudImages[currentPage], 20, 20,800,100); // Dibujar Img1
  tint(255, 255); // Resetear tint para no afectar otras imágenes

  hudShapes.slice(startIndex, endIndex).forEach((shape, index) => {
    if (shape.originalX == null || shape.originalY == null) {
      shape.originalX = shape.x;
      shape.originalY = shape.y;
    }
    shape.update();
  });

  baseShapes.forEach(shape => shape.display());
  checkIfAllSnapped();
}


function drawLevels() {
  imageMode(CORNER);
  if (currentLevel === 0) {
    inicio.play();  // Reproduce el video en loop
    inicio.speed(1); // Ajusta la velocidad si lo deseas (1 es la velocidad normal)
    // Dibuja el video en el canvas
    image(inicio, 0, 0, canvasWidth, canvasHeight);
  } else if (currentLevel === 1) {
    final.stop();
    const targetScale = 2.6; // Escala objetivo para el nivel 1
    const growthRate = 0.05; // Velocidad de crecimiento por fotograma

    if (fondoScale < targetScale) {
      fondoScale = min(fondoScale + growthRate, targetScale);
    }

    const scaledWidth = fondoWidth * fondoScale;
    const scaledHeight = fondoHeight * fondoScale;

    image(fondo, 0, 0, scaledWidth, scaledHeight);
    drawHUD();
  } else if (currentLevel === 2) {
    const targetScale = 1.5; // Escala objetivo para el nivel 2
    const shrinkRate = 0.05; // Velocidad de reducción por fotograma

    if (fondoScale > targetScale) {
        fondoScale = max(fondoScale - shrinkRate, targetScale); // Reducir la escala gradualmente
    }

    const scaledWidth = fondoWidth * fondoScale;  // Calcula el ancho de la imagen escalada
    const scaledHeight = fondoHeight * fondoScale; // Calcula el alto de la imagen escalada

    image(fondo1, 0, 0, scaledWidth, scaledHeight);
    drawHUD();
  } else if (currentLevel === 3) {
  const targetScale = 1; // Escala objetivo para el nivel 2
  const shrinkRate = 0.05; // Velocidad de reducción por fotograma

  if (fondoScale > targetScale) {
      fondoScale = max(fondoScale - shrinkRate, targetScale); // Reducir la escala gradualmente
  }

  const scaledWidth = fondoWidth * fondoScale;  // Calcula el ancho de la imagen escalada
  const scaledHeight = fondoHeight * fondoScale; // Calcula el alto de la imagen escalada

  image(fondo2, 0, 0, scaledWidth, scaledHeight);
  drawHUD();
  } else if (currentLevel === 4) {
    const targetScale = 0.6; // Escala objetivo para que se vea toda la imagen
    const shrinkRate = 0.009; // Velocidad de reducción
    
    // Calcular el factor de escala en función de las dimensiones del lienzo
    const scaleX = width / fondoWidth;   // Escala en base al ancho del lienzo
    const scaleY = height / fondoHeight; // Escala en base al alto del lienzo
    
    // El factor de escala final es el mínimo entre el ancho y el alto
    const maxScale = Math.min(scaleX, scaleY);
    
    // Reducir la escala progresivamente hasta alcanzar el valor máximo de escala
    if (fondoScale > maxScale) {
      fondoScale -= shrinkRate;
    } else {
      fondoScale = maxScale; // Asegurarse de no pasar del objetivo
    }
    
    // Calcular dimensiones escaladas
    const scaledWidth = fondoWidth * fondoScale;
    const scaledHeight = fondoHeight * fondoScale;
  
    // Dibujar la imagen desde (0, 0) con las nuevas dimensiones escaladas
    image(fondo3, 0, 0, scaledWidth, scaledHeight);
    drawHUD();
  
    // Verificar si se alcanzó el nivel de zoom final y hacer la transición al nivel 5
    if (fondoScale <= maxScale) {
        currentLevel = 5; // Cambiar al siguiente nivel
        transitionToNextLevel(); // Llamar a la función para cambiar de nivel
    }
}
 else if (currentLevel === 5) {
    video.play();  // Reproduce el video en loop
    video.speed(1); // Ajusta la velocidad si lo deseas (1 es la velocidad normal)
    // Dibuja el video en el canvas
    image(video, 0, 0, canvasWidth, canvasHeight);
} else if (currentLevel === 6){
  const targetScale = 12; // Escala objetivo para el zoom in
    const growthRate = 0.10; // Velocidad de crecimiento por fotograma

    if (fondoScale < targetScale) {
        fondoScale = min(fondoScale + growthRate, targetScale);
    }

    const scaledWidth = fondoWidth * fondoScale;   // Ancho escalado
    const scaledHeight = fondoHeight * fondoScale; // Alto escalado

    // Calcular desplazamiento para centrar la imagen escalada
    const offsetX = (width - scaledWidth) / 2;   // Centrar en X
    const offsetY = (height - scaledHeight) / 2; // Centrar en Y

    // Calcular el nivel de opacidad basado en la escala
    const maxTint = 255; // Nivel máximo de oscurecimiento
    const fadeProgress = map(fondoScale, 1, targetScale, 0, maxTint); // Progreso del tint

    // Asegurarse de que el valor esté entre 0 y maxTint
    const tintValue = constrain(fadeProgress, 0, maxTint);

    // Aplicar tint con opacidad progresiva
    tint(255 - tintValue); // Tinte hacia negro

    // Dibujar la imagen escalada
    image(fondo3, offsetX, offsetY, scaledWidth, scaledHeight);

    // Si llega al targetScale, pantalla completamente negra
    if (fondoScale >= targetScale) {
        noTint(); // Quitar tint
        background(0); // Pantalla completamente negra

        final.play();  // Reproduce el video en loop
        final.speed(1); // Ajusta la velocidad si lo deseas (1 es la velocidad normal)
        // Dibuja el video en el canvas
        image(final, 0, 0, canvasWidth, canvasHeight);
    }
}
}


function checkIfAllSnapped() {
  if (baseShapes.every(shape => shape.snapped)) {
    // Solo avanzar al siguiente nivel si Img1 ha desaparecido
    if (currentLevel === 4 && img1Opacity > 0) {
      return; // No avanzar mientras Img1 sigue visible
    }
    currentLevel++;
    transitionToNextLevel();
  }
}
  

function resetSnappedShapes() {
  hudShapes.forEach(shape => {
    shape.snapped = false;
    shape.restoreOriginalPosition();
  });
}

function transitionToNextLevel() {
  console.log(`Transición al nivel: ${currentLevel}`);
  spriteIndex = 0;  // Reinicia el índice de los sprites
  spriteDirection = 1;  // Asegúrate de que la dirección sea positiva

  if (currentLevel === 1) {
    fondoScale = 1; // Reinicia la escala del fondo
  }

  hudShapes = hudShapes.filter(shape => !baseShapes.some(base => base.isSnapped(shape)));
  baseShapes = [];
  loadLevel(currentLevel); // Carga el nuevo nivel
}


function mousePressed() {
  if (currentLevel === 0) {
    currentLevel = 1; 
    transitionToNextLevel();
  } else if (currentLevel === 5) {
    currentLevel = 6; 
    transitionToNextLevel();
  } 

  if (currentLevel === 1 || currentLevel === 2 || currentLevel === 3) {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    hudShapes.slice(startIndex, endIndex).forEach(shape => {
      if (shape.contains(mouseX, mouseY) && !shape.snapped) { // Solo seleccionar si no está encastrada
        selectedShape = shape;
        shape.dragging = true;
        shape.offsetX = shape.x - mouseX;
        shape.offsetY = shape.y - mouseY;
      }
    });
  }  

    if (selectedShape && !selectedShape.snapped) {
      selectedShape.restoreOriginalPosition(); // Si no está encastrada, vuelve a la posición original
    }
  }


  function mouseDragged() {
    if (selectedShape && !selectedShape.snapped) {
      // Cambia el tamaño de la figura arrastrada al tamaño de las figuras fijas
      const fixedShape = baseShapes[0]; // Tomar cualquier figura fija como referencia
      if (fixedShape) {
        selectedShape.scaleX = fixedShape.scaleX;
        selectedShape.scaleY = fixedShape.scaleY;
      }
      selectedShape.x = mouseX + selectedShape.offsetX;
      selectedShape.y = mouseY + selectedShape.offsetY;
    }
  }
  
  

  function mouseReleased() {
    if (selectedShape) {
      selectedShape.dragging = false;
      let snapped = false;
  
      // Verificar si encastra en alguna posición fija
      baseShapes.forEach(baseShape => {
        if (baseShape.isSnapped(selectedShape)) {
          selectedShape.x = baseShape.x;
          selectedShape.y = baseShape.y;
          baseShape.snapped = true;  // Marcar la figura fija como encastrada
          baseShape.opacity = 255;   // Opacidad máxima
          selectedShape.snapped = true; // Marcar también la figura arrastrable
          snapSound.play();
          snapped = true;
        }
      });
  
      // Si no encastra, regresa al tamaño y posición originales
      if (!snapped) {
        selectedShape.restoreOriginalPosition();
        selectedShape.scaleX = 1.2; // Escala original del HUD
        selectedShape.scaleY = 1.2; // Escala original del HUD
       // errorSound.play();
      }
  
      // Reiniciar selección
      selectedShape = null;
    }
  }
  
  
  
function keyPressed() {
  if (selectedShape) {
    // Si hay una forma seleccionada, rotarla
    if (key === 'A' || key === 'a') {
      // Rotar -45 grados
      selectedShape.rotation = (selectedShape.rotation - 45 + 360) % 360;
      rotateSound.play();
    } else if (key === 'D' || key === 'd') {
      // Rotar +45 grados
      selectedShape.rotation = (selectedShape.rotation + 45) % 360;
      rotateSound.play();
    }
  } else {
    // Si no hay una forma seleccionada, cambiar de página en el HUD
    if (key === 'A' || key === 'a') {
      if (currentPage > 0) {
        currentPage--;
      }
    } else if (key === 'D' || key === 'd') {
      if ((currentPage + 1) * itemsPerPage < hudShapes.length) {
        currentPage++;
      }
    }
  }
}


class DraggableShape {
  constructor(x, y, img, rotation, scaleX = 1, scaleY = 1) {
    this.originalX = x;           // Posición original en el HUD
    this.originalY = y;           // Posición original en el HUD
    this.originalRotation = rotation; // Rotación inicial en el HUD
    this.x = x;                   // Posición actual
    this.y = y;                   // Posición actual
    this.img = img;               // Imagen asociada
    this.rotation = rotation;     // Rotación actual
    this.dragging = false;        // Si está siendo arrastrada
    this.offsetX = 0;             // Offset del mouse
    this.offsetY = 0;             // Offset del mouse
    this.snapped = false;         // Si la forma está encastrada
    this.scaleX = scaleX;         // Escala horizontal
    this.scaleY = scaleY;         // Escala vertical
  }

  restoreOriginalPosition() {
    if (!this.snapped) { // No restaurar si está encastrada
      this.x = this.originalX;
      this.y = this.originalY;
      this.rotation = this.originalRotation;
      this.scaleX = 1.2; // Escala original del HUD
      this.scaleY = 1.2; // Escala original del HUD
    }
  }
  
  

  update() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    scale(this.scaleX, this.scaleY); // Aplicar escala
    imageMode(CENTER);
    image(this.img, 0, 0);
    pop();
  }

  contains(mx, my) {
    const scaledWidth = this.img.width * this.scaleX;
    const scaledHeight = this.img.height * this.scaleY;

    return (
      mx > this.x - scaledWidth / 2 &&
      mx < this.x + scaledWidth / 2 &&
      my > this.y - scaledHeight / 2 &&
      my < this.y + scaledHeight / 2
    );
  }
}


class FixedShape {
  constructor(x, y, img, rotation, scaleX = 1, scaleY = 1) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.rotation = rotation;
    this.opacity = 0;
    this.snapped = false;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    scale(this.scaleX, this.scaleY); // Aplica la escala
    imageMode(CENTER);
    tint(255, this.opacity);
    image(this.img, 0, 0);
    pop();
  }

  isSnapped(draggable) {
    const distance = dist(this.x, this.y, draggable.x, draggable.y);
    const angleMatch = this.rotation === draggable.rotation;
    const imgMatch = this.img === draggable.img;
    return distance < 50 && angleMatch && imgMatch;
  }
}


