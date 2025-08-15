document.body.scrollTop = document.documentElement.scrollTop = 0;
const cards = document.querySelectorAll('.icon');

const modal = document.createElement('div');
modal.classList.add('modal');
modal.innerHTML = `
  <div class="modal-content">
    <span class="modal-close">&times;</span>
    <img src="ex.jpg" alt="Пример" class="modal-image" />
    <p class="modal-text">Пись пись пись.</p>
    <div class="modal-text">ПисьПисьПисьПисьПисьПисьПись</div>
  </div>
`;
document.body.appendChild(modal);

const modalClose = modal.querySelector('.modal-close');
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

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


const style = document.createElement('style');
style.innerHTML = `
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(8px);
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  position: relative;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
}
.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}
.modal-image {
  max-width: 100%;
  border-radius: 8px;
}
.modal-text {
  margin-top: 15px;
  font-size: 16px;
  color: #ffffffff;
}
`;
document.head.appendChild(style);
