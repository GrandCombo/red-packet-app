const tg = window.Telegram?.WebApp;
tg?.ready();
const userId = tg?.initDataUnsafe?.user?.id || "123456";
const userName = tg?.initDataUnsafe?.user?.username || "username";
document.getElementById("username").innerText = userName;
document.getElementById("refLink").value = `https://t.me/YourBot?start=${userId}`;

let balance = 0;
let checkinDay = parseInt(localStorage.getItem("checkinDay")) || 1;

function updateBalanceDisplay() {
  document.getElementById("balance").innerText = `${balance} BTTC`;
}
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function copyCode(id) {
  const code = document.getElementById(id).textContent;
  navigator.clipboard.writeText(code).then(() => alert('Copied: ' + code));
}
function copyReferral() {
  const input = document.getElementById('refLink');
  navigator.clipboard.writeText(input.value).then(() => alert('Referral Link Copied!'));
}
function canUseFeature(key) {
  const lastUsed = localStorage.getItem(key);
  if (!lastUsed) return true;
  return (Date.now() - parseInt(lastUsed)) > 86400000;
}
function dailyCheckin() {
  if (!canUseFeature("daily_checkin")) {
    document.getElementById("checkinStatus").innerText = "⏳ Come back after 24 hours!";
    return;
  }
  let reward = checkinDay;
  balance += reward;
  localStorage.setItem("daily_checkin", Date.now());
  updateBalanceDisplay();
  document.getElementById("checkinStatus").innerText = `✅ You earned ${reward} BTTC!`;
  checkinDay++;
  if (checkinDay > 7) checkinDay = 1;
  localStorage.setItem("checkinDay", checkinDay);
}
function spinWheel() {
  if (!canUseFeature("spin_wheel")) {
    document.getElementById("spinStatus").innerText = "⏳ You can spin only once every 24h!";
    return;
  }
  const reward = Math.floor(Math.random() * 5) + 1;
  balance += reward;
  localStorage.setItem("spin_wheel", Date.now());
  updateBalanceDisplay();
  document.getElementById("spinStatus").innerText = `🎉 You won ${reward} BTTC!`;
}
function withdrawBTTC() {
  const amount = balance;
  const address = document.getElementById("walletAddress").value;
  if (amount < 1000) {
    alert("You need at least 1000 BTTC to withdraw.");
    return;
  }
  if (!address) {
    alert("Enter a valid wallet address.");
    return;
  }
  const li = document.createElement("li");
  li.textContent = `${amount} BTTC → ${address}`;
  document.getElementById("withdrawHistory").appendChild(li);
  balance = 0;
  updateBalanceDisplay();
  alert("Withdraw request submitted. Admin will review it.");
}
function verifyJoin() {
  document.getElementById("joinStatus").innerText = "✅ Verified Successfully!";
}