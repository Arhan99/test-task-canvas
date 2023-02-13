const canvas = document.getElementById("c1");
var ctx = canvas.getContext("2d");

const pi = Math.PI;

ctx.fillStyle = "#fff";

// рандомное число в интервале
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Circle(x, y, color) {
  this.x = x;
  this.y = y;
  this.radius = 10;
  this.color = color;
}
// количество мячей
let countBalls = randomIntFromInterval(4, 10);
// расстояние между кругами
let space = Math.floor(canvas.width / countBalls);

let circlesArray = [];
// создание круга
function addCircle(x) {
  let y = randomIntFromInterval(0, canvas.height);
  let circle = new Circle(x, y, "white");
  circlesArray.push(circle);
}
// создание графика
function graphicCreator() {
  circlesArray.forEach(({ x, y, color, radius }, index, array) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * pi);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    if (index !== 0) {
      let prevCircle = array[index - 1];
      drawLineFunc(prevCircle.x, prevCircle.y, x, y);
    }
  });
}
// отрисовка линий
function drawLineFunc(x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
// стартовая функция
function onStart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < countBalls; i++) {
    const x = space * i + 20;
    addCircle(x);
  }
  graphicCreator();
}
// шаг
const step = 1;
// массив рандомных значений Y
let randomY = [];
for (let i = 0; i < countBalls + 1; i++) {
  randomY.push(randomIntFromInterval(0, 200));
}

function onClickHandler(isMultiply) {
  let flag = true;

  if (isMultiply) {
    onStart();
    return;
  } else {
    circlesArray = circlesArray.map((circle, index, array) => {
      if (index > 0 && index < array.length - 1 && index % 2 !== 0) {
        let newCircle = new Circle(circle.x, circle.y, circle.color);

        if (circle.x !== array[index + 1].x) {
          newCircle.x += step;
          flag = false;
        }
        if (circle.y !== array[index + 1].y) {
          if (circle.y < array[index + 1].y) newCircle.y += step;
          else newCircle.y -= step;
          flag = false;
        }
        return newCircle;
      } else if (index > 0 && index < array.length - 1 && index % 2 === 0) {
        let newCircle = new Circle(circle.x, circle.y, circle.color);
        if (circle.y > randomY[index]) {
          newCircle.y -= step;
          flag = false;
        }
        if (circle.y < randomY) {
          newCircle.y += step;
          flag = false;
        }
        return newCircle;
      }

      return circle;
    });

    // if (flag) {
    //   circlesArray = circlesArray.filter(
    //     (_, i, arr) => arr.length - 1 === i || !(i % 2)
    //   );
    // }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graphicCreator();
  }

  if (flag) return;
  setTimeout(() => onClickHandler(isMultiply), 1);
}

let isClicked = false;

canvas.onclick = function () {
  isClicked = !isClicked;
  isClicked ? (countBalls = countBalls * 2) : (countBalls = countBalls / 2);
  onClickHandler(false);
};

onStart();
