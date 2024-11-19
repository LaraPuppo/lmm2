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
  rectImg = loadImage('assets/rect.png');
  circleImg = loadImage('assets/rectangle.png');
  batteryImg = loadImage('assets/bateria.png');

  // Cargar sonidos
  rotateSound = loadSound('assets/girar elementos.mp3');
  snapSound = loadSound('assets/conexion correcta 1.mp3');
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
    new DraggableShape(60, 60, rectImg, 50, 50),
    new DraggableShape(160, 60, circleImg, 50, 50),
    new DraggableShape(260, 60, batteryImg, 50, 50)
  ];
}

function loadLevel(level) {
  // Dependiendo del nivel, se cambian las posiciones o las piezas
  if (level === 1) {
    baseShapes = [
      new FixedShape(300, height - 150, rectImg, 50, 50),
      new FixedShape(450, height - 150, circleImg, 50, 50),
      new FixedShape(600, height - 150, batteryImg, 50, 50)
    ];
  } else if (level === 2) {
    baseShapes = [
      new FixedShape(350, height - 200, rectImg, 50, 50),
      new FixedShape(500, height - 200, circleImg, 50, 50),
      new FixedShape(650, height - 200, batteryImg, 50, 50)
    ];
  } else if (level === 3) {
    baseShapes = [
      new FixedShape(400, height - 250, rectImg, 50, 50),
      new FixedShape(550, height - 250, circleImg, 50, 50),
      new FixedShape(700, height - 250, batteryImg, 50, 50)
    ];
  } else if (level === 4) {
    baseShapes = [
      new FixedShape(350, height - 300, rectImg, 50, 50),
      new FixedShape(500, height - 300, circleImg, 50, 50),
      new FixedShape(650, height - 300, batteryImg, 50, 50)
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
    if (shape.isMouseOver()) {
      selectedShape = shape;
      selectedShape.saveOriginalPosition();
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
  if (selectedShape && !selectedShape.snapped) {
    selectedShape.checkIfSnapped(baseShapes);
    if (selectedShape.snapped) {
      snapSound.play(); // Reproducir sonido al encastrar
    } else {
      selectedShape.restoreOriginalPosition();
    }
    selectedShape = null;
  }
}

function keyPressed() {
  if (selectedShape) {
    if (keyCode === LEFT_ARROW) {
      selectedShape.rotate(-45); // Gira en sentido antihorario
      rotateSound.play();
    } else if (keyCode === RIGHT_ARROW) {
      selectedShape.rotate(45); // Gira en sentido horario
      rotateSound.play();
    }
  }
}


class FixedShape {
  constructor(x, y, img, width, height) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.width = width;
    this.height = height;
    this.snapped = false;
  }

  display() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.width, this.height); // Dibuja la imagen con tamaño ajustado
  }
}

class DraggableShape {
  constructor(x, y, img, width, height) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.width = width;
    this.height = height;
    this.snapped = false;
    this.originalX = x;
    this.originalY = y;
    this.rotation = 0; // Nueva propiedad para la rotación
  }

  update() {
    this.display();
  }

  display() {
    imageMode(CENTER);
    push(); // Guarda el estado de transformación actual
    translate(this.x, this.y); // Mueve el punto de origen al centro de la imagen
    rotate(radians(this.rotation)); // Aplica la rotación
    image(this.img, 0, 0, this.width, this.height); // Dibuja la imagen
    pop(); // Restaura el estado de transformación anterior
  }

  rotate(degrees) {
    this.rotation += degrees;
    // Normalizar la rotación a un rango de 0 a 360 grados
    if (this.rotation >= 360) {
      this.rotation -= 360;
    } else if (this.rotation < 0) {
      this.rotation += 360;
    }
  }
  

  checkIfCanSnap(targetShapes) {
    targetShapes.forEach(target => {
      if (dist(this.x, this.y, target.x, target.y) < 20) {
        // Si está cerca, cambia de color o activa algo visual
      }
    });
  }

  checkIfSnapped(targetShapes) {
    targetShapes.forEach(target => {
      // Solo verifica si la rotación está cerca de 0 grados
      if (dist(this.x, this.y, target.x, target.y) < 20 && abs(this.rotation) < 1) {
        this.snapped = true;
        target.snapped = true;
        this.x = target.x;
        this.y = target.y;
        this.rotation = 0; // Reinicia la rotación al encajar (si es necesario)
      }
    });
  }
  

  restoreOriginalPosition() {
    this.x = this.originalX;
    this.y = this.originalY;
    this.snapped = false;
    this.rotation = 0; // Reinicia la rotación
  }

  saveOriginalPosition() {
    this.originalX = this.x;
    this.originalY = this.y;
  }

  isMouseOver() {
    return (
      mouseX > this.x - this.width / 2 &&
      mouseX < this.x + this.width / 2 &&
      mouseY > this.y - this.height / 2 &&
      mouseY < this.y + this.height / 2
    );
  }
}


