const commentatorColors = {
  CAWylie: "#a1fcdf",
  Rahcmander: "#fcd29f",
  TheJoebro64: "#fcab64",
  "I am RedoStone": "#fcefef",
  Igordebraga: "#ffdc1e",
  Vestrian24Bio: "#fdbbaf",
  "Bucket of sulfuric acid": "#d3b67e",
  Benmite: "#a390e4",
  Shuipzv3: "#74d2e3",
};

const toppingsMap = {
  "List-Class": "sprinkles",
  "B-Class": "chocolate chips",
  Good: "caramel drizzle",
  Featured: "whipped cream",
};

const conesMap = {
  Jan: "waffle",
  Feb: "waffle",
  Mar: "sugar",
  Apr: "sugar",
  May: "cake",
  Jun: "cake",
  Jul: "wafer",
  Aug: "wafer",
  Sept: "waffle",
  Oct: "sugar",
  Nov: "cake",
  Dec: "wafer",
  ul: "wafer",
};

let data = [];
let filters = { size: "any", topping: "any", cone: "any" };
let sizeSelect, toppingSelect, coneSelect;

function preload() {
  data = loadJSON("wikipage.json");
  Static = loadFont("ShortStack-Regular.ttf");
}

function setup() {
  createCanvas(1200, 1000);

  data = data.data.map((item) => ({
    ...item,
    scoopSize: map(item.Views, 15000000, 50000000, 40, 100),
    iceCreamColor: commentatorColors[item.Commentary] || "#FFFFFF",
    topping: toppingsMap[item.Class] || "none",
    coneType: conesMap[item.Peak.split(".")[0]] || "waffle",
  }));

  sizeSelect = createSelect();
  sizeSelect.position(10, 30);
  sizeSelect.option("any");
  sizeSelect.option("small");
  sizeSelect.option("medium");
  sizeSelect.option("large");
  sizeSelect.changed(() => {
    filters.size = sizeSelect.value();
    redraw();
  });
  textSize(12);
  fill(0);
  text("Size:", 10, 20);

  toppingSelect = createSelect();
  toppingSelect.position(150, 30);
  toppingSelect.option("any");
  toppingSelect.option("sprinkles");
  toppingSelect.option("chocolate chips");
  toppingSelect.option("caramel drizzle");
  toppingSelect.option("whipped cream");
  toppingSelect.changed(() => {
    filters.topping = toppingSelect.value();
    redraw();
  });
  text("Topping:", 150, 20);

  coneSelect = createSelect();
  coneSelect.position(300, 30);
  coneSelect.option("any");
  coneSelect.option("waffle");
  coneSelect.option("sugar");
  coneSelect.option("cake");
  coneSelect.option("wafer");
  coneSelect.changed(() => {
    filters.cone = coneSelect.value();
    redraw();
  });
  text("Cone:", 300, 20);

  drawCanvas();
}

function drawCanvas() {
  background(240);
  drawLegend();

  const filteredData = getFilteredData();

  filteredData.forEach((item, i) => {
    const x = 250 + (i % 5) * 200;
    const y = 150 + Math.floor(i / 5) * 300;
    drawIceCreamCone(x, y, item);
  });

  fill(0);
  textSize(12);
  text(
    `Filters: Size=${filters.size}, Topping=${filters.topping}, Cone=${filters.cone}`,
    10,
    height - 10
  );
}

function getFilteredData() {
  return data.filter((item) => {
    const sizeMatch =
      filters.size === "any" ||
      getSizeCategory(item.scoopSize) === filters.size;
    const toppingMatch =
      filters.topping === "any" || item.topping === filters.topping;
    const coneMatch = filters.cone === "any" || item.coneType === filters.cone;
    return sizeMatch && toppingMatch && coneMatch;
  });
}

function getSizeCategory(scoopSize) {
  if (scoopSize < 60) return "small";
  else if (scoopSize < 80) return "medium";
  else return "large";
}

function drawLegend() {
  push();
  fill(255, 230);
  stroke(0);
  rect(10, 70, 200, Object.keys(commentatorColors).length * 20 + 40);

  fill(0);
  textSize(14);
  text("Commentator Colors:", 20, 85);

  Object.entries(commentatorColors).forEach(([name, color], i) => {
    fill(color);
    rect(20, 105 + i * 20, 15, 15);
    fill(0);
    text(name, 40, 105 + i * 20 + 12);
  });
  pop();
}

function drawIceCreamCone(x, y, item) {
  textFont(Static);
  push();
  translate(x + 50, y + 50);

  fill(item.iceCreamColor);
  stroke(0);
  push()
  noStroke()
  ellipse(0, -item.scoopSize/2, item.scoopSize, item.scoopSize);
  pop()
  
  const coneColors = {
    waffle: "#f4a460",
    sugar: "#f5deb3",
    cake: "#d2b48c",
    wafer: "#e6d5b8",
  };

  fill(coneColors[item.coneType]);
  if (item.coneType === "wafer") {
    rectMode(CENTER);
    rect(0, 60 - 20, item.scoopSize * 0.7, 120, 5);
    rect(0, 60 - 70, item.scoopSize * 0.9, 20, 5);
  } else {
    beginShape();
    vertex(-item.scoopSize * 0.4 - 5, 0 - 20);
    vertex(0, 120);
    vertex(item.scoopSize * 0.4 + 5, 0 - 20);
    endShape(CLOSE);
  }

  drawTopping(0, -item.scoopSize / 2, item.scoopSize, item.topping);

  fill(0);
  textSize(12);
  textAlign(CENTER);
  text(item.Name, 0, 150);
  text(`${item.Views.toLocaleString()} views`, 0, 165);

  if (
    dist(mouseX, mouseY, x, y - item.scoopSize / 2) <
    item.scoopSize / 2 + 20
  ) {
    info(item);
  }
  pop();
}

function drawTopping(x, y, size, type) {
  push();
  translate(x, y);

  const toppings = {
    sprinkles: {
      color: [255, 0, 0],
      count: 30,
      draw: (x, y) => rect(x, y, 2, 6),
    },
    "chocolate chips": {
      color: [101, 67, 33],
      count: 15,
      draw: (x, y) => ellipse(x, y, 6, 4),
    },
    "caramel drizzle": {
      color: [210, 130, 50],
      draw: () => {
        noFill();
        strokeWeight(2);
        beginShape();
        for (let x = -size / 3; x <= size / 3; x += 5) {
          vertex(x, sin(x * 0.2) * 5 - size / 4);
        }
        endShape();
      },
    },
    "whipped cream": {
      color: [255],
      draw: () => {
        noStroke();
        for (let angle = 0 + PI + PI / 4; angle < TWO_PI; angle += PI / 4) {
          ellipse(
            cos(angle) * size * 0.35,
            sin(angle) * size * 0.35 - size * 0.1,
            15,
            20
          );
        }
      },
    },
  };

  if (!toppings[type]) return;

  const topping = toppings[type];
  if (topping.color) fill(...topping.color);

  if (topping.count) {
    for (let i = 0; i < topping.count; i++) {
      const angle = random(TWO_PI);
      const r = random(size * 0.3, size * 0.45);
      if (sin(angle) * r < 0) {
        topping.draw(cos(angle) * r, sin(angle) * r);
      }
    }
  } else {
    topping.draw();
  }

  pop();
}

function info(item) {
  strokeWeight(0.1);
  push();
  const w = 200,
    h = 100;
  let y = -item.scoopSize - h - 20;
  if (y < 20) y = 150;

  fill(255, 230);
  stroke(0);
  rect(-w / 2, y, w, h, 5);

  fill(0);
  textSize(10);
  textAlign(LEFT);
  text(
    `Name: ${item.Name}
Views: ${item.Views.toLocaleString()}
Commentary: ${item.Commentary}
Class: ${item.Class}
Peak: ${item.Peak}`,
    -w / 2 + 10,
    y + 10,
    w - 20
  );
  pop();
}

function draw() {}
