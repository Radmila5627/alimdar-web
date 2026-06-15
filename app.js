// ALIMDAR Web App configuration
// EDIT THESE VALUES BEFORE DEPLOYMENT IF NEEDED.
const CONFIG = {
  contactEmail: "radmilatorovic@gmail.com",
  // Wallet that receives BNB membership payments.
  // This address is public on-chain even if it is not shown prominently on the page.
  paymentWallet: "0xAAE931b63Be266D44e0Be5d66fedE0c1c3b53379",
  // ATU token contract address on BNB Smart Chain.
  atuContract: "0x73c711b9567049c810Bb65920ED74606BB9Ae697",
  bnbChainId: "0x38",
  bnbUsdcRate: 650
};

let selectedPlan = null;
let connectedWallet = null;
let lastTxHash = "";

function setLang(lang){
  document.querySelectorAll('.lang').forEach(el=>el.classList.remove('active'));
  document.getElementById(lang).classList.add('active');
  document.getElementById('btn-hr').classList.toggle('active',lang==='hr');
  document.getElementById('btn-en').classList.toggle('active',lang==='en');
  document.documentElement.lang=lang;
}

async function connectWallet(){
  if(!window.ethereum){
    alert('MetaMask nije pronađen / MetaMask not found.');
    return;
  }
  try{
    await switchToBNB();
    const accounts=await window.ethereum.request({method:'eth_requestAccounts'});
    connectedWallet=accounts[0];
    setWalletStatus('Povezan wallet: '+connectedWallet, 'Connected wallet: '+connectedWallet);
    fillWalletFields(connectedWallet);
  }catch(e){
    console.error(e);
    alert('Povezivanje nije uspjelo / Connection failed.');
  }
}

async function switchToBNB(){
  try{
    await window.ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:CONFIG.bnbChainId}]});
  }catch(error){
    if(error.code === 4902){
      await window.ethereum.request({
        method:'wallet_addEthereumChain',
        params:[{
          chainId:CONFIG.bnbChainId,
          chainName:'BNB Smart Chain',
          nativeCurrency:{name:'BNB',symbol:'BNB',decimals:18},
          rpcUrls:['https://bsc-dataseed.binance.org/'],
          blockExplorerUrls:['https://bscscan.com/']
        }]
      });
    }else{
      throw error;
    }
  }
}

function setWalletStatus(hr,en){
  const hrEl=document.getElementById('walletStatusHr');
  const enEl=document.getElementById('walletStatusEn');
  if(hrEl) hrEl.textContent=hr;
  if(enEl) enEl.textContent=en;
}

function fillWalletFields(wallet){
  const fields=['memberWallet','memberWalletEn'];
  fields.forEach(id=>{ const el=document.getElementById(id); if(el && !el.value) el.value=wallet; });
}

function selectPlan(name,eur,usdc,atu){
  selectedPlan={name,eur,usdc,atu};
  const hr=`Paket: ${name}<br>EUR: €${eur}<br>USDC obračun: ${usdc} USDC<br>ATU pogodnost: ${atu} ATU<br><br>Nakon potvrđene uplate, ATU se dodjeljuje prema pravilima sustava.`;
  const en=`Plan: ${name}<br>EUR: €${eur}<br>USDC accounting: ${usdc} USDC<br>ATU benefit: ${atu} ATU<br><br>After confirmed payment, ATU is assigned according to system rules.`;
  const hrEl=document.getElementById('selectedPlanHr');
  const enEl=document.getElementById('selectedPlanEn');
  if(hrEl) hrEl.innerHTML=hr;
  if(enEl) enEl.innerHTML=en;
  calculateBNBForSelectedPlan();
}

function updateBnbRate(){
  const input=document.getElementById('bnbRateInput');
  if(input && Number(input.value)>0){
    CONFIG.bnbUsdcRate=Number(input.value);
    calculateBNBForSelectedPlan();
  }
}

function getBnbAmount(){
  if(!selectedPlan) return null;
  return selectedPlan.usdc / CONFIG.bnbUsdcRate;
}

function calculateBNBForSelectedPlan(){
  if(!selectedPlan){
    alert('Prvo odaberi paket / Choose a plan first.');
    return;
  }
  const bnb=getBnbAmount();
  const msgHr=`${selectedPlan.name}: ${selectedPlan.usdc} USDC ≈ ${bnb.toFixed(6)} BNB. ATU pogodnost: ${selectedPlan.atu} ATU.`;
  const msgEn=`${selectedPlan.name}: ${selectedPlan.usdc} USDC ≈ ${bnb.toFixed(6)} BNB. ATU benefit: ${selectedPlan.atu} ATU.`;
  const hrEl=document.getElementById('bnbCalculationHr');
  const enEl=document.getElementById('bnbCalculationEn');
  if(hrEl) hrEl.textContent=msgHr;
  if(enEl) enEl.textContent=msgEn;
}

async function paySelectedPlanWithBNB(){
  if(!selectedPlan){
    alert('Prvo odaberi paket / Choose a plan first.');
    return;
  }
  if(!window.ethereum){
    alert('MetaMask nije pronađen / MetaMask not found.');
    return;
  }
  try{
    if(!connectedWallet){ await connectWallet(); }
    const bnb=getBnbAmount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to: CONFIG.paymentWallet,
      value: ethers.utils.parseEther(bnb.toFixed(18))
    });
    lastTxHash = tx.hash;
    setTxStatus('Transakcija poslana. TX hash: '+tx.hash, 'Transaction sent. TX hash: '+tx.hash);
    prefillTxMessage(tx.hash);
  }catch(e){
    console.error(e);
    alert('Transakcija nije uspjela ili je odbijena / Transaction failed or was rejected.');
  }
}

function setTxStatus(hr,en){
  const hrEl=document.getElementById('txStatusHr');
  const enEl=document.getElementById('txStatusEn');
  if(hrEl) hrEl.textContent=hr;
  if(enEl) enEl.textContent=en;
}

function prefillTxMessage(hash){
  const text = `TX hash: ${hash}\nOdabrani paket: ${selectedPlan ? selectedPlan.name : ''}\nATU pogodnost: ${selectedPlan ? selectedPlan.atu : ''} ATU`;
  const ids=['memberMessage','memberMessageEn'];
  ids.forEach(id=>{ const el=document.getElementById(id); if(el) el.value=text; });
}

function sendMembershipEmail(event){
  event.preventDefault();
  const activeLang=document.documentElement.lang || 'hr';
  const name=(document.getElementById(activeLang==='en'?'memberNameEn':'memberName')?.value || document.getElementById('memberName')?.value || '').trim();
  const email=(document.getElementById(activeLang==='en'?'memberEmailEn':'memberEmail')?.value || document.getElementById('memberEmail')?.value || '').trim();
  const wallet=(document.getElementById(activeLang==='en'?'memberWalletEn':'memberWallet')?.value || connectedWallet || '').trim();
  const message=(document.getElementById(activeLang==='en'?'memberMessageEn':'memberMessage')?.value || '').trim();
  const subject=encodeURIComponent('ALIMDAR članstvo / membership application');
  const body=encodeURIComponent(
    `Ime / Name: ${name}\nEmail: ${email}\nWallet: ${wallet}\nPaket / Plan: ${selectedPlan ? selectedPlan.name : 'nije odabran'}\nEUR: ${selectedPlan ? selectedPlan.eur : ''}\nUSDC obračun: ${selectedPlan ? selectedPlan.usdc : ''}\nATU pogodnost: ${selectedPlan ? selectedPlan.atu : ''}\nTX hash: ${lastTxHash}\n\nPoruka / Message:\n${message}`
  );
  window.location.href=`mailto:${CONFIG.contactEmail}?subject=${subject}&body=${body}`;
}
