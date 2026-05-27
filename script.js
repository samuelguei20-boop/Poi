let currentUser = null;
let currentLang = 'fr';
let userLevel = 1;
let userXP = 0;
let userBCC = 0;
let userReward = 0;
const BCC_RATE = 5;

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splashScreen').classList.remove('active');
    document.getElementById('welcomeScreen').classList.add('active');
  }, 3000);
});

document.getElementById('startBtn').onclick = () => {
  document.getElementById('welcomeScreen').classList.remove('active');
  document.getElementById('langScreen').classList.add('active');
};

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.onclick = () => {
    currentLang = btn.dataset.lang;
    document.documentElement.lang = currentLang;
    document.getElementById('langScreen').classList.remove('active');
    document.getElementById('rgpdScreen').classList.add('active');
  };
});

document.getElementById('acceptRgpd').onclick = () => {
  document.getElementById('rgpdScreen').classList.remove('active');
  document.getElementById('loginScreen').classList.add('active');
};
document.getElementById('declineRgpd').onclick = () => showPopup("Inscription annulée");

document.getElementById('toRegister').onclick = () => {
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('registerScreen').classList.add('active');
};

document.getElementById('regAvatar').onchange = (e) => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById('avatarPreview').src = ev.target.result;
      document.getElementById('avatarPreview').style.display = 'block';
    }
    reader.readAsDataURL(file);
  }
};

document.getElementById('registerBtn').onclick = () => {
  if(document.getElementById('regEmail').value!== document.getElementById('regEmailConfirm').value){
    showPopup("Les emails ne correspondent pas");
    return;
  }
  if(document.getElementById('regPass').value!== document.getElementById('regPassConfirm').value){
    showPopup("Les mots de passe ne correspondent pas");
    return;
  }
  if(!document.getElementById('regLoc').checked){
    showPopup("Localisation obligatoire");
    return;
  }

  const userId = 'BCC' + Math.random().toString(36).substr(2,9).toUpperCase();
  document.getElementById('userId').innerText = userId;
  document.getElementById('regResult').classList.remove('hidden');

  currentUser = {
    id:userId,
    pseudo:document.getElementById('regPseudo').value,
    avatar:document.getElementById('avatarPreview').src,
    verified:false
  };

  setTimeout(() => {
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('headerPseudo').innerText = currentUser.pseudo;
    if(currentUser.avatar){
      document.getElementById('profileAvatar').innerHTML = `<img src="${currentUser.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }
  }, 2000);
};

const pages = {
  home: document.getElementById("homeSection"),
  reward: document.getElementById("rewardSection"),
  mission: document.getElementById("missionSection"),
  settings: document.getElementById("settingsSection")
};
const navButtons = {
  home: document.getElementById("homeBtn"),
  reward: document.getElementById("rewardBtn"),
  mission: document.getElementById("missionBtn"),
  settings: document.getElementById("settingsBtn")
};

function showPage(page){
  Object.values(pages).forEach(section => section.classList.remove("active-page"));
  pages[page].classList.add("active-page");

  Object.values(navButtons).forEach(btn => btn.classList.remove("active-nav"));
  navButtons[page].classList.add("active-nav");

  window.scrollTo({top:0,behavior:"smooth"});
}

navButtons.home.onclick = () => showPage("home");
navButtons.reward.onclick = () => showPage("reward");
navButtons.mission.onclick = () => showPage("mission");
navButtons.settings.onclick = () => showPage("settings");

document.getElementById("centerBtn").onclick = () => {
  document.getElementById('missionModal').classList.remove('hidden');
  document.getElementById('missionPrice').innerText = '100';
  document.getElementById('missionDuration').innerText = '5 min';
};
document.getElementById('startMissionBtn').onclick = () => {
  showPopup("Mission démarrée");
  document.getElementById('missionModal').classList.add('hidden');
};

const popup = document.getElementById("popup");
function showPopup(msg){
  popup.innerText = msg;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 2000);
}

const rankBadge = document.getElementById("rankBadge");
const rankModal = document.getElementById("rankModal");
const closeRank = document.getElementById("closeRank");
rankBadge.addEventListener("click", () => rankModal.classList.remove("hidden"));
closeRank.addEventListener("click", () => rankModal.classList.add("hidden"));

const balanceText = document.getElementById("balanceText");
const cfaText = document.getElementById("cfaText");
const toggleBalance = document.getElementById("toggleBalance");
let visible = true;
toggleBalance.addEventListener("click", () => {
  visible =!visible;
  if(visible){
    balanceText.innerText = userBCC;
    cfaText.innerText = `≈ ${userBCC * BCC_RATE} CFA`;
    toggleBalance.innerHTML = '<i class="fa-regular fa-eye"></i>';
  }else{
    balanceText.innerText = "••••";
    cfaText.innerText = "≈ ••••";
    toggleBalance.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
  }
});

const contactBtn = document.getElementById("contactBtn");
const contactInfo = document.getElementById("contactInfo");
contactBtn.addEventListener("click", () => contactInfo.classList.toggle("show"));

const actionModal = document.getElementById("actionModal");
const actionTitle = document.getElementById("actionTitle");
const actionContent = document.getElementById("actionContent");
const closeAction = document.getElementById("closeAction");
closeAction.addEventListener("click", () => actionModal.classList.add("hidden"));

document.querySelectorAll(".action-btn").forEach(btn => {
  btn.addEventListener("click", (e) => openActionModal(e.currentTarget.dataset.action));
});

function openActionModal(action){
  actionModal.classList.remove("hidden");
  if(action === "send"){
    actionTitle.innerText = "Envoyer BCC";
    actionContent.innerHTML = `<div class="action-form"><label>ID BCC</label><input type="text" placeholder="BCC123456"><label>Montant</label><input type="number" id="sendAmount"><label>Montant reçu</label><input type="text" id="receivedAmount" readonly><p class="fee-text">Frais BCC 1%</p><button id="confirmSend" class="main-btn">Envoyer</button></div>`;
    document.getElementById("sendAmount").addEventListener("input", (e) => {
      let amt = parseFloat(e.target.value) || 0;
      let fee = amt * 0.01;
      document.getElementById("receivedAmount").value = (amt - fee).toFixed(2);
    });
    document.getElementById("confirmSend").addEventListener("click", () => showPopup("Transfert envoyé"));
  }

  if(action === "receive"){
    actionTitle.innerText = "Recevoir BCC";
