let selectedPlan = null;
let connectedWallet = "";

function selectPlan(name, price, atuBonus) {
  selectedPlan = { name, price, atuBonus };
  document.getElementById("selectedPlan").innerHTML =
    "<strong>" + name + "</strong><br>" +
    "Cijena: €" + price + " mjesečno<br>" +
    "ATU pogodnost nakon potvrde: " + atuBonus + " ATU<br><br>" +
    "Nakon odabira paketa pošaljite upit ili povežite MetaMask.";
}

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask nije pronađen. Instalirajte MetaMask i pokušajte ponovno.");
    return;
  }
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    connectedWallet = accounts[0];
    document.getElementById("walletStatus").innerText = "Povezani wallet: " + connectedWallet;
    const walletInput = document.getElementById("walletInput");
    if (walletInput) walletInput.value = connectedWallet;
  } catch (error) {
    alert("Povezivanje MetaMaska nije uspjelo.");
  }
}

function openEmail() {
  const planText = selectedPlan
    ? selectedPlan.name + " / €" + selectedPlan.price + " / ATU: " + selectedPlan.atuBonus
    : "Nije odabran paket";

  const subject = encodeURIComponent("ALIMDAR članstvo - upit za uplatu");
  const body = encodeURIComponent(
    "Pozdrav,\n\n" +
    "Želim se prijaviti za ALIMDAR članstvo.\n\n" +
    "Odabrani paket: " + planText + "\n" +
    "Wallet adresa: " + (connectedWallet || "nije povezana") + "\n\n" +
    "Molim upute za uplatu i aktivaciju članstva.\n\n" +
    "Hvala."
  );
  window.location.href = "mailto:radmilatorovic@gmail.com?subject=" + subject + "&body=" + body;
}

function sendContactEmail() {
  const name = document.getElementById("name").value || "";
  const email = document.getElementById("email").value || "";
  const wallet = document.getElementById("walletInput").value || "";
  const message = document.getElementById("message").value || "";
  const planText = selectedPlan
    ? selectedPlan.name + " / €" + selectedPlan.price + " / ATU: " + selectedPlan.atuBonus
    : "Nije odabran paket";

  const subject = encodeURIComponent("ALIMDAR web upit");
  const body = encodeURIComponent(
    "Ime: " + name + "\n" +
    "Email: " + email + "\n" +
    "Wallet: " + wallet + "\n" +
    "Odabrani paket: " + planText + "\n\n" +
    "Poruka:\n" + message
  );
  window.location.href = "mailto:radmilatorovic@gmail.com?subject=" + subject + "&body=" + body;
}
