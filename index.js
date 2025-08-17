document.body.scrollTop = document.documentElement.scrollTop = 0;
const cards = document.querySelectorAll('.icon');

cards.forEach(card => {
  let rect = card.getBoundingClientRect();
  let centerX = rect.left + rect.width / 2;
  let centerY = rect.top + rect.height / 2;
  let threshold = 20;

  window.addEventListener("resize", function () {
    rect = card.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
  });

  function rotate(cursorPosition, centerPosition, threshold = 20) {
    if (cursorPosition - centerPosition >= 0) {
      return (cursorPosition - centerPosition) >= threshold ? threshold : (cursorPosition - centerPosition);
    } else {
      return (cursorPosition - centerPosition) <= -threshold ? -threshold : (cursorPosition - centerPosition);
    }
  }

  function brightness(cursorPositionY, centerPositionY, strength = 50) {
    return 1 - rotate(cursorPositionY, centerPositionY) / strength;
  }

  card.addEventListener("mousemove", function (event) {
    const rotY = rotate(event.x, centerX);
    const rotX = -rotate(event.y + window.scrollY, centerY);

    card.style.transform = `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.5)`;
    card.style.filter = `brightness(${brightness(event.y / 10 + window.scrollY / 10, centerY / 10)})`;
    card.style.boxShadow = `0 0 25px rgba(95, 188, 255, 0.7)`;

    let offsetX = rotY * 2;
    let offsetY = rotX * 2;
    card.style.setProperty('--gloss-x', `${50 + offsetX}%`);
    card.style.setProperty('--gloss-y', `${50 + offsetY}%`);
  });

  card.addEventListener("mouseleave", function () {
    card.style.transform = `perspective(500px)`;
    card.style.filter = `brightness(1)`;
    card.style.boxShadow = `0 0 0 0 rgba(48, 65, 0, 0.5)`;
    card.style.setProperty('--gloss-x', `0%`);
    card.style.setProperty('--gloss-y', `0%`);
  });

  card.addEventListener("click", function () {
    modal.style.display = 'flex';
  });
});

let deb = document.getElementById('debug');
intervalId = window.setInterval(function () { deb.innerHTML = window.scrollY; }, 1000);
