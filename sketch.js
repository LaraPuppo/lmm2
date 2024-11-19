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
    new DraggableShape(60, 60, rectImg),
    new DraggableShape(160, 60, circleImg),
    new DraggableShape(260, 60, batteryImg)
  ];
}

function loadLevel(level) {
  if (level === 1) {
    baseShapes = [
      new FixedShape(300, height - 150, rectImg),
      new FixedShape(450, height - 150, circleImg),
      new FixedShape(600, height - 150, batteryImg)
    ];
  } else if (level === 2) {
    baseShapes = [
      new FixedShape(350, height - 200, rectImg),
      new FixedShape(500, height - 200, circleImg),
      new FixedShape(650, height - 200, batteryImg)
    ];
  } else if (level === 3) {
    baseShapes = [
      new FixedShape(400, height - 250, rectImg),
      new FixedShape(550, height - 250, circleImg),
      new FixedShape(700, height - 250, batteryImg)
    ];
  } else if (level === 4) {
    baseShapes = [
      new FixedShape(350, height - 300, rectImg),
      new FixedShape(500, height - 300, circleImg),
      new FixedShape(650, height - 300, batteryImg)
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
  for (let shape of hudShapes) {
    if (shape.isMouseOver()) {
      selectedShape = shape;
      shape.dragging = true;
      break;
    }
  }
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
    let snapped = false;

    for (let target of baseShapes) {
      const distance = dist(
        selectedShape.x,
        selectedShape.y,
        target.x,
        target.y
      );

      if (distance < 20) { // Umbral para el encastre
        selectedShape.snapTo(target.x, target.y);
        snapSound.play();
        snapped = true;
        break;
      }
    }

    if (!snapped) {
      // Regresa la forma al HUD si no encastra
      selectedShape.snapTo(60, 60); // Coordenadas iniciales (puedes ajustarlas dinámicamente)
    }

    selectedShape.dragging = false;
    selectedShape = null;
  }
}


function keyPressed() {
  if (selectedShape) {
    if (key === 'R' || key === 'r') {
      selectedShape.rotation += HALF_PI;
      rotateSound.play();
    }
  }
}



class DraggableShape {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.dragging = false;
    this.snapped = false;
    this.rotation = 0; // Ángulo de rotación
  }

  update() {
    if (this.dragging) {
      this.x = mouseX;
      this.y = mouseY;
    }
    this.display();
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    imageMode(CENTER);
    image(this.img, 0, 0);
    pop();
  }

  isMouseOver() {
    const halfWidth = this.img.width / 2;
    const halfHeight = this.img.height / 2;
    return (
      mouseX > this.x - halfWidth &&
      mouseX < this.x + halfWidth &&
      mouseY > this.y - halfHeight &&
      mouseY < this.y + halfHeight
    );
  }

  snapTo(x, y) {
    this.x = x;
    this.y = y;
    this.snapped = true;
  }
}

class FixedShape {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
  }

  display() {
    imageMode(CENTER);
    image(this.img, this.x, this.y);
  }
}

