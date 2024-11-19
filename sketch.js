let hudShapes = [];
let baseShapes = [];
let selectedShape = null;
let currentLevel = 1;

// Variables para las imágenes y sonidos
let backgroundImg, rectImg, circleImg, batteryImg;
let rotateSound, snapSound;

function preload() {
  // Cargar imágenes
  backgroundImg = loadImage('assets/Lenguaje Mul.svg');
  rectImg = loadImage('assets/componentes/img2.png');
  circleImg = loadImage('assets/componentes/img3.png');
  batteryImg = loadImage('assets/componentes/img4.png');

  // Cargar sonidos
  rotateSound = loadSound('assets/sonidos/girar elementos.mp3');
  snapSound = loadSound('assets/sonidos/conexion correcta 1.mp3');
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  initHUD();
  loadLevel(currentLevel);
}

function draw() {
  // Redibuja el fondo en cada fotograma
  imageMode(CORNER);
  image(backgroundImg, 0, 0, width, height);

  // Dibuja las formas fijas
  baseShapes.forEach(shape => shape.display());

  // Dibuja las formas arrastrables
  hudShapes.forEach(shape => shape.update());

  // Verifica si todas las piezas están encastradas
  checkIfAllSnapped();
}



function initHUD() {
  hudShapes = [
    new DraggableShape(60, 60, rectImg, 45),
    new DraggableShape(160, 60, circleImg, 90),
    new DraggableShape(260, 60, batteryImg, 0)
  ];
}

function loadLevel(level) {
  if (level === 1) {
    baseShapes = [
      new FixedShape(300, height - 150, rectImg, 0),
      new FixedShape(450, height - 150, circleImg, 0),
      new FixedShape(600, height - 150, batteryImg, 0)
    ];
  } else if (level === 2) {
    baseShapes = [
      new FixedShape(350, height - 200, rectImg, 0),
      new FixedShape(500, height - 200, circleImg, 0),
      new FixedShape(650, height - 200, batteryImg, 0)
    ];
  } else if (level === 3) {
    baseShapes = [
      new FixedShape(400, height - 250, rectImg, 0),
      new FixedShape(550, height - 250, circleImg, 0),
      new FixedShape(700, height - 250, batteryImg, 0)
    ];
  } else if (level === 4) {
    baseShapes = [
      new FixedShape(350, height - 300, rectImg, 0),
      new FixedShape(500, height - 300, circleImg, 0),
      new FixedShape(650, height - 300, batteryImg, 0)
    ];
  }
}


function drawHUD() {
  fill(200);
  noStroke();
  rect(0, 0, width, 100);
  hudShapes.forEach(shape => shape.display());
}

function drawBaseShapes() {
  baseShapes.forEach(shape => shape.display());
}

function drawDraggableShapes() {
  hudShapes.forEach(shape => {
    shape.update();
  });
}

function checkIfAllSnapped() {
  if (baseShapes.every(shape => shape.snapped)) {
    currentLevel++;
    if (currentLevel > 3) {
      console.log("Juego completado. Todos los niveles terminados.");
      // Aquí puedes hacer algo para mostrar que el juego ha terminado, como un mensaje o reiniciar el juego
    } else {
      console.log(`Nivel ${currentLevel - 1} completado. Cambia al nivel ${currentLevel}.`);
      resetSnappedShapes();
      loadLevel(currentLevel);
    }
  }
}



function resetSnappedShapes() {
  hudShapes.forEach(shape => {
    shape.snapped = false;
    shape.restoreOriginalPosition();
  });
}


function mousePressed() {
  hudShapes.forEach(shape => {
    if (shape.contains(mouseX, mouseY)) {
      selectedShape = shape;
      shape.dragging = true;
      shape.offsetX = shape.x - mouseX;
      shape.offsetY = shape.y - mouseY;
    }
  });
}

function mouseDragged() {
  if (selectedShape && !selectedShape.snapped) {
    selectedShape.x = mouseX;
    selectedShape.y = mouseY;
    selectedShape.checkIfCanSnap(baseShapes);
  }
}

function mouseReleased() {
  if (selectedShape) {
    selectedShape.dragging = false;

    baseShapes.forEach(baseShape => {
      if (baseShape.isSnapped(selectedShape)) {
        // Ajusta la posición del shape draggable al shape fijo
        selectedShape.x = baseShape.x;
        selectedShape.y = baseShape.y;
        snapSound.play();
      }
    });

    selectedShape = null;
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    if (selectedShape) {
      selectedShape.rotate();
    }
  }
}




class DraggableShape {
  constructor(x, y, img, rotation) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.rotation = rotation; // En grados
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  update() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }

    push();
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    imageMode(CENTER);
    image(this.img, 0, 0);
    pop();
  }

  contains(mx, my) {
    const d = dist(mx, my, this.x, this.y);
    return d < 50; // Ajustar según el tamaño de las imágenes
  }

  rotate() {
    this.rotation = (this.rotation + 45) % 360; // Incrementa 45 grados
    rotateSound.play();
  }
}

class FixedShape {
  constructor(x, y, img, rotation) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.rotation = rotation; // En grados
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    imageMode(CENTER);
    image(this.img, 0, 0);
    pop();
  }

  isSnapped(draggable) {
    const distance = dist(this.x, this.y, draggable.x, draggable.y);
    const angleMatch = this.rotation === draggable.rotation;
    return distance < 50 && angleMatch; // Ajustar la distancia según sea necesario
  }
}





