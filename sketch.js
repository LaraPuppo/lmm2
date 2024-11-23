let hudShapes = [];
let baseShapes = [];
let selectedShape = null;
let currentLevel = 0; 
let currentPage = 0; 
const itemsPerPage = 5;
let rotateSound, snapSound, errorSound;

let fondoWidth = 2300;  // Tamaño original
let fondoHeight = (fondoWidth / 16) * 9; // Calcula el alto respetando la relación 16:9
let fondoScale = 1; // Escala en el Nivel 2
let targetWidth = 5600; // Ancho objetivo en el Nivel 2
let targetHeight = (targetWidth / 16) * 9; // Alto objetivo en el Nivel 2


function preload() {
  // Fondo
  fondo = loadImage('assets/fondo.svg');
  fondo1 = loadImage('assets/fondo1.jpg');
  fondo2 = loadImage('assets/fondo2.jpg');
  fondo3 = loadImage('assets/fondo3.jpg');

  // Componentes
  Img1 = loadImage('assets/componentes/img1.png');
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

  // Sonidos
  rotateSound = loadSound('assets/sonidos/girar elementos.mp3');
  snapSound = loadSound('assets/sonidos/conexion correcta 1.mp3');
  errorSound = loadSound('assets/sonidos/cortocircuitofuerte.mp3');
}

function setup() {
  let canvasWidth = 1300;
  let canvasHeight = (canvasWidth / 16) * 9;;

  
  createCanvas(canvasWidth, canvasHeight);
  initHUD();
  loadLevel(currentLevel);
}


function draw() {
  console.log(currentLevel);
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
   }
}

function initHUD() {
  hudShapes = [
    new DraggableShape(120, 60, Img2, 0, 1.2, 1.2),
    new DraggableShape(250, 60, Img3, 0),
    new DraggableShape(390, 60, Img4, 0),
    new DraggableShape(550, 60, Img5, 0),
    new DraggableShape(650, 60, Img6, 0),
    new DraggableShape(120, 60, Img7, 0),
    new DraggableShape(250, 60, Img8, 0),
    new DraggableShape(390, 60, Img9, 0),
    new DraggableShape(550, 60, Img10, 0),
    new DraggableShape(650, 60, Img11, 0),
    new DraggableShape(120, 60, Img12, 0),
    new DraggableShape(250, 60, Img13, 0),
    new DraggableShape(390, 60, Img14, 0),
    new DraggableShape(550, 60, Img15, 0),
    new DraggableShape(650, 60, Img16, 0),
  ];
}

function loadLevel(level) {
  if (level === 1) {
    baseShapes = [
      new FixedShape(330, 230, Img2, 0, 3.3, 3.1),
      new FixedShape(450, height - 150, Img3, 0),
      new FixedShape(600, height - 150, Img4, 0),
      new FixedShape(750, height - 150, Img5, 0),
    ];
  } else if (level === 2) {
    baseShapes = [
      new FixedShape(350, height - 200, Img6, 0),
      new FixedShape(500, height - 200, Img7, 0),
      new FixedShape(650, height - 200, Img8, 0),
      new FixedShape(800, height - 200, Img9, 0),
      new FixedShape(350, height - 400, Img10, 0),
      new FixedShape(500, height - 400, Img11, 0),
    ];
  } else if (level === 3) {
    baseShapes = [
      new FixedShape(650, height - 200, Img12, 0),
      new FixedShape(800, height - 200, Img13, 0),
      new FixedShape(350, height - 200, Img14, 0),
      new FixedShape(500, height - 200, Img15, 0),
      new FixedShape(650, height - 400, Img16, 0),
    ];
  }
}


function drawHUD() {
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  imageMode(CORNER);
  image(Img1, 20, 20);
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
    // Pantalla de inicio
    background(200);
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(50);
    text('Presiona el mouse para comenzar', width / 2, height / 2);
  } else if (currentLevel === 1) {
    const targetScale = 2.6; // Escala objetivo para el nivel 1
    const growthRate = 0.01; // Velocidad de crecimiento por fotograma

    if (fondoScale < targetScale) {
      fondoScale = min(fondoScale + growthRate, targetScale);
    }

    const scaledWidth = fondoWidth * fondoScale;
    const scaledHeight = fondoHeight * fondoScale;

    image(fondo, 0, 0, scaledWidth, scaledHeight);
    drawHUD();
  } else if (currentLevel === 2) {
    const targetScale = 1.5; // Escala objetivo para el nivel 2
    const shrinkRate = 0.01; // Velocidad de reducción por fotograma

    if (fondoScale > targetScale) {
        fondoScale = max(fondoScale - shrinkRate, targetScale); // Reducir la escala gradualmente
    }

    const scaledWidth = fondoWidth * fondoScale;  // Calcula el ancho de la imagen escalada
    const scaledHeight = fondoHeight * fondoScale; // Calcula el alto de la imagen escalada

    image(fondo, 0, 0, scaledWidth, scaledHeight);
    drawHUD();
}
 else if (currentLevel === 3) {
  const targetScale = 1; // Escala objetivo para el nivel 2
  const shrinkRate = 0.01; // Velocidad de reducción por fotograma

  if (fondoScale > targetScale) {
      fondoScale = max(fondoScale - shrinkRate, targetScale); // Reducir la escala gradualmente
  }

  const scaledWidth = fondoWidth * fondoScale;  // Calcula el ancho de la imagen escalada
  const scaledHeight = fondoHeight * fondoScale; // Calcula el alto de la imagen escalada

  image(fondo, 0, 0, scaledWidth, scaledHeight);
  drawHUD();
  } else if (currentLevel === 4) {
    const targetScale = 0.6; // Escala objetivo para que se vea toda la imagen
    const shrinkRate = 0.01; // Velocidad de reducción
    
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
    image(fondo, 0, 0, scaledWidth, scaledHeight);
  }
}  
  


  function checkIfAllSnapped() {
    if (baseShapes.every(shape => shape.snapped)) {
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
  if (currentLevel === 1) {
    fondoScale = 1; // Reiniciamos la escala del fondo
  }


  // Filtrar las piezas del HUD que se han encastrado
  hudShapes = hudShapes.filter(shape => !baseShapes.some(base => base.isSnapped(shape)));
  
  // Limpiar las piezas del nivel anterior y cargar las del siguiente nivel
  baseShapes = [];
  loadLevel(currentLevel);
}


  

function mousePressed() {
  if (currentLevel === 0) {
    currentLevel =1; 
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

    if (selectedShape && !selectedShape.snapped) {
      selectedShape.restoreOriginalPosition(); // Si no está encastrada, vuelve a la posición original
    }
  }
}

function mouseDragged() {
  if (selectedShape && !selectedShape.snapped) {
    selectedShape.x = mouseX;
    selectedShape.y = mouseY;
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
        baseShape.snapped = true;  // Marcar la forma fija como encastrada
        baseShape.opacity = 255;   // Asegurar opacidad total
        snapSound.play();
        snapped = true;
      }
    });

    // Si no encastra, regresa a su posición original
    if (!snapped) {
      selectedShape.restoreOriginalPosition(); // Volver a la posición original
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
    // Solo restaurar si no está encastrada
    if (!this.snapped) {
      this.x = this.originalX;
      this.y = this.originalY;
      this.rotation = this.originalRotation; // Restaurar rotación inicial
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
    this.opacity = 100;
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


