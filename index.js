window.scrollTo(0, 0);
const cards = document.querySelectorAll('.icon');

cards.forEach(card => {
let rect = card.getBoundingClientRect();
let centerX = rect.left + rect.width / 2;
let centerY = rect.top + rect.height / 2 ;
let threshold = 20;

window.addEventListener("resize", function (event) {
  rect = card.getBoundingClientRect();
  centerX = rect.left + rect.width / 2;
  centerY = rect.top + rect.height / 2;
})

function rotate(cursorPosition, centerPosition, threshold = 20) {
  if (cursorPosition - centerPosition >= 0) {
    return (cursorPosition - centerPosition) >= threshold ? threshold : (cursorPosition - centerPosition);
  } else {
    return (cursorPosition - centerPosition) <= -threshold ? -threshold : (cursorPosition - centerPosition);
  }
}

function brightness(cursorPositionY, centerPositionY, strength = 50) {
  return 1 - rotate(cursorPositionY, centerPositionY)/strength;
}

card.addEventListener("mousemove", function (event) {
  card.style.transform = `perspective(1000px)
  
  rotateY(${rotate(event.x, centerX)}deg)
  rotateX(${-rotate(event.y+window.scrollY, centerY)}deg)
  scale(1.5)`;

  card.style.filter = `brightness(${brightness(event.y/10+window.scrollY/10, centerY/10)})`;
  card.style.boxShadow = `0 0 25px rgba(255, 126, 95, 0.7)`;
})

card.addEventListener("mouseleave", function (event) {
  card.style.transform = `perspective(500px)`;

  card.style.filter = `brightness(1)`;
  card.style.boxShadow = `0 0 0 0 rgba(48, 65, 0, 0.5)`;
})

});

