import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Carwash App</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <link rel="stylesheet" href="/style.css">


      
    </head>
    <body>
      <!-- Scherm 1: Login -->
      <div id="loginScreen" class="screen active">
        <h1>Welkom bij Carwash!</h1>
        <form id="loginForm">
          <input type="text" id="username" placeholder="Voer je naam in" required />
          <button type="submit">Login</button>
        </form>
      </div>

      <!-- Scherm 2: Auto selectie -->
      <div id="carScreen" class="screen">
        <h2>Kies je auto</h2>
        <div id="carList"></div>
        <button id="addCarBtn">Nieuwe auto toevoegen</button>
      </div>

      <!-- Scherm 3: Nieuwe auto -->
      <div id="newCarScreen" class="screen">
        <h2>Nieuwe Auto</h2>
        <form id="newCarForm" class="add-car-form">
          <input type="text" id="brand" placeholder="Merk" required />
          <input type="text" id="model" placeholder="Model" required />
          <input type="text" id="licensePlate" placeholder="Kenteken" required />
          <button type="submit">Toevoegen</button>
        </form>
        <button id="backToCars">Terug naar autos</button>
      </div>

      <script>
        let currentUser = null;

        const loginScreen = document.getElementById('loginScreen');
        const carScreen = document.getElementById('carScreen');
        const newCarScreen = document.getElementById('newCarScreen');
        const carList = document.getElementById('carList');

        // Login
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const username = document.getElementById('username').value;

          const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
          });

          currentUser = await res.json();
          showScreen(carScreen);
          displayCars();
        });

        // Toon autos
        function displayCars() {
          carList.innerHTML = '';
          currentUser.cars.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card';
            card.textContent = car.brand + ' ' + car.model + ' (' + car.licensePlate + ')';
            card.onclick = () => alert('Je hebt gekozen: ' + car.brand + ' ' + car.model);
            carList.appendChild(card);
          });
        }

        // Navigatie: Nieuwe auto scherm
        document.getElementById('addCarBtn').addEventListener('click', () => {
          showScreen(newCarScreen);
        });

        // Terug naar auto selectie
        document.getElementById('backToCars').addEventListener('click', () => {
          showScreen(carScreen);
        });

        // Voeg nieuwe auto toe
        document.getElementById('newCarForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const brand = document.getElementById('brand').value;
          const model = document.getElementById('model').value;
          const licensePlate = document.getElementById('licensePlate').value;

          const res = await fetch('/api/users/' + currentUser._id + '/cars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brand, model, licensePlate })
          });

          const newCar = await res.json();
          currentUser.cars.push(newCar);
          displayCars();

          // Clear form
          document.getElementById('brand').value = '';
          document.getElementById('model').value = '';
          document.getElementById('licensePlate').value = '';

          showScreen(carScreen);
        });

        // Helper: scherm tonen
        function showScreen(screen) {
          loginScreen.classList.remove('active');
          carScreen.classList.remove('active');
          newCarScreen.classList.remove('active');
          screen.classList.add('active');
        }
      </script>
    </body>
    </html>
  `);
});

export default router;
