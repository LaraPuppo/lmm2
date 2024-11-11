let hudShapes = [];
let baseShapes = [];
let draggableShapes = [];
let selectedShape = null;
let state = 0;
let mousePressedInRect = false;
let keyPressedInRect = false;

function preload() {
  // Cargar la imagen del fondo
  backgroundImg = loadImage('assets/Lenguaje Mul.svg');
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  loadLevel(1); // Iniciar el primer nivel
}

function draw() {
  background(backgroundImg);

  if (state === 0) {
    drawState0(); // Estado inicial con los rectángulos
  } else if (state === 1) {
    // Mostrar el HUD y el área de juego cuando estamos en el estado 1
    drawHUD();
    drawBaseShapes();
    drawDraggableShapes();
    checkIfAllSnapped();
  }
}

// Dibujar el estado 0 con dos rectángulos rojos
function drawState0() {
  fill(mousePressedInRect ? 'green' : 'red');
  rect(0, 0, width / 2, height);
  fill(keyPressedInRect ? 'green' : 'red');
  rect(width / 2, 0, width / 2, height);

  // Cambiar a estado 1 si ambos rectángulos están verdes
  if (mousePressedInRect && keyPressedInRect) {
    state = 1;
  }
}

// Cargar las figuras en el HUD y las bases donde deben encastrarse
function loadLevel(level) {
  if (level === 1) {
    // Figuras en el HUD (parte superior) que serán arrastrables
    hudShapes = [
      new DraggableShape(60, 60, 'rect', 80),
      new DraggableShape(160, 60, 'circle', 40),
      new DraggableShape(260, 60, 'triangle', 60, 45)
    ];
    // Figuras base (parte inferior) donde deben encastrarse las figuras del HUD
    baseShapes = [
      new FixedShape(300, height - 150, 'rect', 80),
      new FixedShape(450, height - 150, 'circle', 40),
      new FixedShape(600, height - 150, 'triangle', 60)
    ];
  }
}

// Dibujar el HUD en la parte superior de la pantalla
function drawHUD() {
  fill(200);
  noStroke();
  rect(0, 0, width, 100); // Fondo del HUD

  hudShapes.forEach(shape => shape.display()); // Dibujar las figuras del HUD
}

// Dibujar las figuras base donde deben encastrarse las figuras del HUD
function drawBaseShapes() {
  baseShapes.forEach(shape => shape.display());
}

// Dibujar y actualizar las figuras arrastrables desde el HUD
function drawDraggableShapes() {
  hudShapes.forEach(shape => {
    shape.update();
  });
}

// Verificar si todas las figuras están encastradas
function checkIfAllSnapped() {
  if (hudShapes.every(shape => shape.snapped)) {
    state = 2; // Pasar al siguiente nivel o estado cuando todas estén encastradas
    console.log("Nivel completado. Cambia al siguiente nivel.");
  }
}

function mousePressed() {
  if (state === 0) {
    mousePressedInRect = true; // Marcar el rectángulo izquierdo como cumplido
  } else if (state === 1) {
    hudShapes.forEach(shape => {
      if (shape.isMouseOver()) {
        selectedShape = shape;
        selectedShape.saveOriginalPosition(); // Guardar la posición original
      }
    });
  }
}

function mouseDragged() {
  if (selectedShape && !selectedShape.snapped) {
    selectedShape.x = mouseX;
    selectedShape.y = mouseY;

    // Verificar si la figura está dentro del rango para encastrarse
    selectedShape.checkIfCanSnap(baseShapes);

    // Verificar si está sobre una figura incorrecta
    selectedShape.checkIfOnIncorrectShape(baseShapes);
  }
}

function mouseReleased() {
  if (selectedShape && !selectedShape.snapped) {
    // Verificar si la figura está cerca de la base para encastrarla
    selectedShape.checkIfSnapped(baseShapes);
    
    // Restaurar la posición original si no está encastrada
    if (!selectedShape.snapped) {
      selectedShape.restoreOriginalPosition(); 
    }

    selectedShape = null; // Deseleccionar la figura
  }
}

function keyPressed() {
  if (state === 0) {
    keyPressedInRect = true; // Marcar el rectángulo derecho como cumplido
  } else if (selectedShape) {
    if (keyCode === LEFT_ARROW) {
      selectedShape.rotate(-45); // Rotar a la izquierda
    } else if (keyCode === RIGHT_ARROW) {
      selectedShape.rotate(45); // Rotar a la derecha
    }
  }
}


// Clase para formas fijas
class FixedShape {
  constructor(x, y, type, size, angle = 0) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = size;
    this.angle = angle; // Ángulo de la base
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle); // Aplicar la rotación

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
    this.originalY = y; // Guardar la posición original
    this.color = color(255, 165, 0); // Color inicial naranja
  }

  update() {
    this.display();
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle); // Aplicar la rotación

    fill(this.color); // Usar el color actualizado
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
    // Cambiar color a amarillo si la figura está dentro del rango para encastrarse
    this.color = color(255, 165, 0); // Naranja por defecto

    targetShapes.forEach(target => {
      if (
        this.type === target.type &&
        dist(this.x, this.y, target.x, target.y) < 20 &&
        this.angle % 45 === target.angle % 45 // Verificar que las rotaciones coincidan
      ) {
        this.color = color(255, 255, 0); // Amarillo cuando está en el rango de encastre
      }
    });
  }

  checkIfSnapped(targetShapes) {
    targetShapes.forEach(target => {
      // Verificar que la figura esté dentro del rango de la base y que los ángulos coincidan
      if (
        this.type === target.type &&
        dist(this.x, this.y, target.x, target.y) < 20 &&
        this.angle % 45 === target.angle % 45 // Verificar que las rotaciones coincidan
      ) {
        this.snapped = true;
        this.x = target.x;
        this.y = target.y;
        this.color = color(0, 255, 0); // Verde cuando ya está encastrado
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
    this.angle = this.angle % 360; // Asegurar que el ángulo esté entre 0 y 360 grados
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


