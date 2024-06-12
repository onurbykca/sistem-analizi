let selectedMatches = {};

function calculateBet(matchNumber, outcome, odds) {
  const betKey = `${matchNumber}_${outcome}`;

  if (selectedMatches[betKey]) {
    alert("Bu maça zaten bahis yaptınız!");
    return;
  }

  for (const key in selectedMatches) {
    if (key.startsWith(matchNumber)) {
      delete selectedMatches[key];
    }
  }

  selectedMatches[betKey] = { odds, matchNumber, outcome };
  updateBetSlip();
}

function removeBet(betKey) {
  delete selectedMatches[betKey];
  updateBetSlip();
}

function updateBetSlip() {
  const oyna = document.getElementById('oyna');
  const betSlip = document.getElementById('betSlip');
  const totalOddsElement = document.getElementById('totalOdds');
  const potentialWinningsElement = document.getElementById('potentialWinnings');
  const betAmount = parseFloat(document.getElementById('betAmount').value) || 0;
  let totalOdds = 1.0;

  betSlip.innerHTML = "";

  for (const betKey in selectedMatches) {
    const { odds, matchNumber, outcome } = selectedMatches[betKey];
    totalOdds *= odds;

    const listItem = document.createElement('li');
    listItem.textContent = `Maç ${matchNumber}: ${outcome} - Oran: ${odds}`;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Kaldır';
    removeButton.addEventListener('click', () => removeBet(betKey));

    listItem.appendChild(removeButton);
    betSlip.appendChild(listItem);
  }

  totalOddsElement.textContent = `Toplam Oran: ${totalOdds.toFixed(2)}`;
  potentialWinningsElement.textContent = `Olası Kazanç: ${(betAmount * totalOdds).toFixed(2)} TL`;

  if (totalOdds.toFixed(2) != 1.00) {
    oyna.textContent = 'Bahsi Oyna';
  } else if (totalOdds.toFixed(2) == 1.00) {
    oyna.textContent = 'Bahis yapmadınız';
  }
}

document.getElementById('betAmount').addEventListener('input', updateBetSlip);
document.getElementById('placeBet').addEventListener('click', () => {
  const betAmount = parseFloat(document.getElementById('betAmount').value) || 0;
  const totalOdds = parseFloat(document.getElementById('totalOdds').textContent.split(': ')[1]);
  alert(`Bahis oynandı! Miktar: ${betAmount} TL, Olası Kazanç: ${(betAmount * totalOdds).toFixed(2)} TL`);

 
  selectedMatches = {};
  document.getElementById('betAmount').value = '';
  updateBetSlip();
});


document.querySelectorAll('.event').forEach(event => {
  const oddsText = event.querySelector('p:nth-child(2)').textContent.split(': ')[1].split(', ');
  const matchNumber = event.querySelector('p:nth-child(1)').textContent.split(': ')[1];


  const betOptions = ['Ev Sahibi', 'Beraberlik', 'Deplasman', '0.5 Üst', '1.5 Üst', '2.5 Üst', '0.5 Alt', '1.5 Alt', '2.5 Alt', 'KG Var', 'KG Yok'];

  betOptions.forEach(option => {
    const optionOdds = parseFloat((Math.random() * (3 - 1) + 1).toFixed(2)); 
    const optionButton = document.createElement('button');
    optionButton.textContent = `${option} (${optionOdds})`;
    optionButton.addEventListener('click', () => calculateBet(matchNumber, option, optionOdds));
    event.appendChild(optionButton);
  });
});

updateBetSlip();
