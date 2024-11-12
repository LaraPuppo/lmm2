let hudShapes = [];
let baseShapes = [];
let draggableShapes = [];
let selectedShape = null;
let state = 0;
let currentLevel = 1;
let mousePressedInRect = false;
let keyPressedInRect = false;

// Variables para los sonidos
let rotateSound;
let snapSound;

function preload() {
  backgroundImg = loadImage('assets/Lenguaje Mul.svg');
  rotateSound = loadSound('assets/girar elementos.mp3');
  snapSound = loadSound('assets/conexion correcta 1.mp3');
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  initHUD();
  loadLevel(currentLevel);
}

function draw() {
  background(backgroundImg);

  if (state === 0) {
    drawState0();
  } else if (state === 1) {
    drawHUD();
    drawBaseShapes();
    drawDraggableShapes();
    checkIfAllSnapped();
  }
}

function drawState0() {
  fill(mousePressedInRect ? 'green' : 'red');
  rect(0, 0, width / 2, height);
  fill(keyPressedInRect ? 'green' : 'red');
  rect(width / 2, 0, width / 2, height);

  if (mousePressedInRect && keyPressedInRect) {
    state = 1;
  }
}

function initHUD() {
  hudShapes = [
    new DraggableShape(60, 60, 'rect', 80),
    new DraggableShape(160, 60, 'circle', 40),
    new DraggableShape(260, 60, 'triangle', 60),
    new DraggableShape(360, 60, 'star', 50),
    new DraggableShape(460, 60, 'ellipse', 80, 40),
    new DraggableShape(560, 60, 'hexagon', 60),
    new DraggableShape(660, 60, 'pentagon', 50),
    new DraggableShape(760, 60, 'octagon', 55),
    new DraggableShape(860, 60, 'diamond', 50)
  ];
}

function loadLevel(level) {
  if (level === 1) {
    baseShapes = [
      new FixedShape(300, height - 150, 'rect', 80),
      new FixedShape(450, height - 150, 'circle', 40),
      new FixedShape(600, height - 150, 'triangle', 60)
    ];
  } else {
    baseShapes = [
      new FixedShape(300, height - 150, 'rect', 80),
      new FixedShape(450, height - 150, 'circle', 40),
      new FixedShape(600, height - 150, 'triangle', 60)
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
      state = 2;
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
    shape.color = color(255, 165, 0); // Restaurar el color naranja
  });
}

function mousePressed() {
  if (state === 0) {
    mousePressedInRect = true;
  } else if (state === 1) {
    hudShapes.forEach(shape => {
      if (shape.isMouseOver()) {
        selectedShape = shape;
        selectedShape.saveOriginalPosition();
      }
    });
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
  if (state === 0) {
    keyPressedInRect = true;
  } else if (selectedShape) {
    if (keyCode === LEFT_ARROW) {
      selectedShape.rotate(-45);
      rotateSound.play(); // Reproducir sonido al girar
    } else if (keyCode === RIGHT_ARROW) {
      selectedShape.rotate(45);
      rotateSound.play(); // Reproducir sonido al girar
    }
  }
}

// Clases para las figuras (FixedShape y DraggableShape) siguen igual...


// Clase para formas fijas
class FixedShape {
  constructor(x, y, type, size, angle = 0) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = size;
    this.angle = angle;
    this.snapped = false;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    noFill();
    stroke(0);
    strokeWeight(2);

    if (this.type === 'rect') {
      rectMode(CENTER);
      rect(0, 0, this.size, this.size);
    } else if (this.type === 'circle') {
      ellipse(0, 0, this.size, this.size);
    } else if (this.type === 'triangle') {
      triangle(
        -this.size / 2, this.size / 2,
        this.size / 2, this.size / 2,
        0, -this.size / 2
      );
    }

    pop();
  }
}

// Clase para formas arrastrables
class DraggableShape {
  constructor(x, y, type, size, angle = 0) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = size;
    this.angle = angle;
    this.snapped = false;
    this.originalX = x;
    this.originalY = y;
    this.color = color(255, 165, 0);
  }

  update() {
    this.display();
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    fill(this.color);
    stroke(0);
    strokeWeight(2);

    if (this.type === 'rect') {
      rectMode(CENTER);
      rect(0, 0, this.size, this.size);
    } else if (this.type === 'circle') {
      ellipse(0, 0, this.size, this.size);
    } else if (this.type === 'triangle') {
      triangle(
        -this.size / 2, this.size / 2,
        this.size / 2, this.size / 2,
        0, -this.size / 2
      );
    }

    pop();
  }

  checkIfCanSnap(targetShapes) {
    this.color = color(255, 165, 0);
    targetShapes.forEach(target => {
      if (
        this.type === target.type &&
        dist(this.x, this.y, target.x, target.y) < 20 &&
        this.angle === target.angle
      ) {
        this.color = color(255, 255, 0);
      }
    });
  }

  checkIfSnapped(targetShapes) {
    targetShapes.forEach(target => {
      if (
        this.type === target.type &&
        dist(this.x, this.y, target.x, target.y) < 20 &&
        this.angle === target.angle
      ) {
        this.snapped = true;
        target.snapped = true;
        this.x = target.x;
        this.y = target.y;
        this.color = color(0, 255, 0);
      }
    });
  }

  restoreOriginalPosition() {
    this.x = this.originalX;
    this.y = this.originalY;
  }

  saveOriginalPosition() {
    this.originalX = this.x;
    this.originalY = this.y;
  }

  rotate(degrees) {
    this.angle += degrees;
    this.angle = this.angle % 360;
  }

  isMouseOver() {
    return (
      mouseX > this.x - this.size / 2 &&
      mouseX < this.x + this.size / 2 &&
      mouseY > this.y - this.size / 2 &&
      mouseY < this.y + this.size / 2
    );
  }
}

function resetSnappedShapes() {
  hudShapes.forEach(shape => {
    shape.snapped = false;
    shape.restoreOriginalPosition();
    shape.color = color(255, 165, 0); // Restaurar el color naranja
  });
}
