const screens=[...document.querySelectorAll(".screen")];
const navButtons=[...document.querySelectorAll(".bottom-nav button")];
let balance=2450.75, points=1250, hidden=false, selectedAmount=1000, selectedMethod="UPI";

const transactions=[
 {icon:"🛍️",title:"Canteen – Main Block",date:"Today, 9:15 AM",amount:-120},
 {icon:"📚",title:"Library",date:"Yesterday, 4:30 PM",amount:-50},
 {icon:"＋",title:"Add Money",date:"15 Jul 2026, 11:20 AM",amount:1000},
 {icon:"📕",title:"Book Store",date:"14 Jul 2026, 3:10 PM",amount:-230},
 {icon:"☕",title:"Campus Café",date:"13 Jul 2026, 10:05 AM",amount:-80},
 {icon:"🖨️",title:"Printing Centre",date:"12 Jul 2026, 2:40 PM",amount:-35}
];

const rewards=[
 {emoji:"💰",name:"₹50 Cashback",cost:750,status:"available"},
 {emoji:"☕",name:"Free Coffee",cost:500,status:"available"},
 {emoji:"🏆",name:"₹100 Cashback",cost:1250,status:"available"},
 {emoji:"🎟️",name:"Event Pass",cost:900,status:"available"},
 {emoji:"🍱",name:"Meal Voucher",cost:600,status:"claimed"}
];

function money(n){return `${n<0?"-":"+ "}₹${Math.abs(n).toLocaleString("en-IN",{minimumFractionDigits:2})}`}
function renderTransactions(target,items){
 target.innerHTML=items.map(t=>`<div class="transaction"><span class="tx-icon">${t.icon}</span><span><b>${t.title}</b><small>${t.date}</small></span><strong class="amount ${t.amount<0?"negative":"positive"}">${money(t.amount)}</strong></div>`).join("");
}
function renderRewards(filter="all"){
 const list=document.getElementById("rewardList");
 const filtered=filter==="all"?rewards:rewards.filter(r=>r.status===filter);
 list.innerHTML=filtered.map((r,i)=>`<div class="reward"><span class="emoji">${r.emoji}</span><span><b>${r.name}</b><small>${r.cost.toLocaleString()} pts</small></span><button class="redeem" data-reward="${rewards.indexOf(r)}" ${r.status==="claimed"?"disabled":""}>${r.status==="claimed"?"Claimed":"Redeem"}</button></div>`).join("");
}
function showPage(id){
 screens.forEach(s=>s.classList.toggle("active",s.id===id));
 navButtons.forEach(b=>b.classList.toggle("active",b.dataset.page===id || (id==="add-money"&&b.dataset.page==="home")));
 document.querySelector(".screen.active").scrollTop=0;
}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function showModal(title,text){document.getElementById("modalTitle").textContent=title;document.getElementById("modalText").textContent=text;document.getElementById("modal").classList.add("show")}
function updateBalance(){document.getElementById("balanceText").textContent=hidden?"₹ ••••••":`₹ ${balance.toLocaleString("en-IN",{minimumFractionDigits:2})}`}

document.addEventListener("click",e=>{
 const page=e.target.closest("[data-page]"); if(page){showPage(page.dataset.page);return}
 const t=e.target.closest("[data-toast]"); if(t){toast(t.dataset.toast);return}
 const amt=e.target.closest("[data-amount]");
 if(amt){document.querySelectorAll("[data-amount]").forEach(x=>x.classList.remove("selected"));amt.classList.add("selected");if(amt.dataset.amount==="other"){document.getElementById("customAmount").focus()}else{selectedAmount=+amt.dataset.amount;document.getElementById("customAmount").value=selectedAmount}return}
 const method=e.target.closest("[data-method]");
 if(method){document.querySelectorAll("[data-method]").forEach(x=>x.classList.remove("selected"));method.classList.add("selected");selectedMethod=method.dataset.method;return}
 const redeem=e.target.closest("[data-reward]");
 if(redeem){const r=rewards[+redeem.dataset.reward];if(points>=r.cost){points-=r.cost;r.status="claimed";document.getElementById("pointsText").textContent=points.toLocaleString();renderRewards(document.querySelector("[data-reward-tab].active").dataset.rewardTab);showModal("Reward redeemed",`${r.name} has been added to your account.`)}else{showModal("Not enough points",`You need ${r.cost-points} more points for this reward.`)}}
});

document.getElementById("toggleBalance").onclick=()=>{hidden=!hidden;updateBalance()};
document.getElementById("customAmount").oninput=e=>selectedAmount=Math.max(0,+e.target.value||0);
document.getElementById("payButton").onclick=()=>{
 if(selectedAmount<1)return showModal("Enter an amount","Choose or enter an amount greater than zero.");
 balance+=selectedAmount;
 transactions.unshift({icon:"＋",title:"Add Money",date:"Just now",amount:selectedAmount});
 updateBalance(); renderTransactions(document.getElementById("recentTransactions"),transactions.slice(0,4)); renderTransactions(document.getElementById("allTransactions"),transactions);
 showModal("Payment successful",`₹${selectedAmount.toLocaleString("en-IN")} was added using ${selectedMethod}.`);
};
document.getElementById("modalClose").onclick=()=>{document.getElementById("modal").classList.remove("show");showPage("home")};
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")e.currentTarget.classList.remove("show")};
document.querySelectorAll("[data-reward-tab]").forEach(btn=>btn.onclick=()=>{document.querySelectorAll("[data-reward-tab]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderRewards(btn.dataset.rewardTab)});
document.getElementById("moreRewards").onclick=()=>{rewards.push({emoji:"🎁",name:"Mystery Reward",cost:400,status:"available"});renderRewards("all");toast("More rewards loaded")};
document.getElementById("darkToggle").onchange=e=>document.body.classList.toggle("dark",e.target.checked);
document.getElementById("notificationToggle").onchange=e=>toast(e.target.checked?"Notifications enabled":"Notifications disabled");
document.getElementById("languageButton").onclick=()=>toast("Language selector opened");

renderTransactions(document.getElementById("recentTransactions"),transactions.slice(0,4));
renderTransactions(document.getElementById("allTransactions"),transactions);
renderRewards();
updateBalance();

setInterval(()=>{const d=new Date();document.getElementById("clock").textContent=d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},1000);
