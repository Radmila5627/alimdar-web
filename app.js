const ATU_CONTRACT = "0x73c711b9567049c810Bb65920ED74606BB9Ae697";
let selectedPlan = null;

function setLang(lang) {
  document.querySelectorAll('.lang').forEach(el => el.classList.remove('active'));
  document.getElementById(lang).classList.add('active');
  document.getElementById('btn-hr').classList.toggle('active', lang === 'hr');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.documentElement.lang = lang;
}

async function connectWallet() {
  if (!window.ethereum) {
    alert('MetaMask nije pronađen. Instalirajte MetaMask i otvorite stranicu ponovno.');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    const short = account.slice(0, 6) + '...' + account.slice(-4);

    const hr = document.getElementById('walletStatusHr');
    const en = document.getElementById('walletStatusEn');
    if (hr) hr.textContent = 'Povezan wallet: ' + short;
    if (en) en.textContent = 'Connected wallet: ' + short;

    await switchToBNB();
  } catch (error) {
    console.error(error);
    alert('Povezivanje nije uspjelo ili je korisnik odbio zahtjev.');
  }
}

async function switchToBNB() {
  const BNB_CHAIN_ID = '0x38';
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BNB_CHAIN_ID }]
    });
  } catch (error) {
    // 4902 means chain not added in MetaMask
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x38',
          chainName: 'BNB Smart Chain',
          nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
          rpcUrls: ['https://bsc-dataseed.binance.org/'],
          blockExplorerUrls: ['https://bscscan.com']
        }]
      });
    }
  }
}

function selectPlan(name, eur, atu) {
  selectedPlan = { name, eur, atu };

  const htmlHr = `
    Paket: <strong>${name}</strong><br>
    Informativna članarina: <strong>€${eur}</strong><br>
    ATU dodjela nakon potvrde: <strong>${atu} ATU</strong><br><br>
    Nakon prijave i potvrđene uplate, članstvo se aktivira, a ATU se dodjeljuje na wallet koji navedete.
  `;

  const hr = document.getElementById('selectedPlanHr');
  const planSelectHr = document.getElementById('planSelectHr');

  if (hr) hr.innerHTML = htmlHr;
  if (planSelectHr) planSelectHr.value = name;
}
