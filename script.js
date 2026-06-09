/* ==========================================
   Mellena Studio Contract System
========================================== */

const contractBox =
document.getElementById("contractBox");

const agreeCheck =
document.getElementById("agreeCheck");

const fullname =
document.getElementById("fullname");

const nickname =
document.getElementById("nickname");

const email =
document.getElementById("email");

const division =
document.getElementById("division");

const seal =
document.getElementById("seal");

const generateSealBtn =
document.getElementById("generateSealBtn");

const openConfirmBtn =
document.getElementById("openConfirmBtn");

const confirmModal =
document.getElementById("confirmModal");

const confirmBtn =
document.getElementById("confirmBtn");

const cancelBtn =
document.getElementById("cancelBtn");

const loadingScreen =
document.getElementById("loadingScreen");

const completeSection =
document.getElementById("completeSection");

const contractNumberText =
document.getElementById("contractNumber");

const signedDateText =
document.getElementById("signedDate");

const pdfBtn =
document.getElementById("pdfBtn");

let currentContractNumber = "";

/* ==========================================
   契約書読了チェック
========================================== */

contractBox.addEventListener(
"scroll",
() => {

const scrollBottom =
contractBox.scrollTop +
contractBox.clientHeight;

if (
scrollBottom >=
contractBox.scrollHeight - 20
) {
agreeCheck.disabled = false;
}

}
);

/* ==========================================
   電子印鑑生成
========================================== */

generateSealBtn.addEventListener(
"click",
() => {

const name =
fullname.value.trim();

if (!name) {
alert("氏名を入力してください");
return;
}

seal.innerText =
name.replace(/\s+/g, "\n");

}
);

/* ==========================================
   同意チェック
========================================== */

agreeCheck.addEventListener(
"change",
() => {

openConfirmBtn.disabled =
!agreeCheck.checked;

}
);

/* ==========================================
   契約番号発行
========================================== */

function generateContractNumber() {

const now =
new Date();

const y =
now.getFullYear();

const m =
String(
now.getMonth() + 1
).padStart(2, "0");

const d =
String(
now.getDate()
).padStart(2, "0");

const rand =
Math.floor(
1000 +
Math.random() * 9000
);

return `IMN-${y}${m}${d}-${rand}`;

}

/* ==========================================
   モーダル表示
========================================== */

openConfirmBtn.addEventListener(
"click",
() => {

if (
!fullname.value ||
!email.value
) {

alert(
"必要項目を入力してください"
);

return;
}

currentContractNumber =
generateContractNumber();

document.getElementById(
"previewContractNumber"
).innerText =
currentContractNumber;

document.getElementById(
"previewName"
).innerText =
fullname.value;

document.getElementById(
"previewEmail"
).innerText =
email.value;

document.getElementById(
"previewDivision"
).innerText =
division.value;

confirmModal.classList.remove(
"hidden"
);

}
);

/* ==========================================
   モーダル閉じる
========================================== */

cancelBtn.addEventListener(
"click",
() => {

confirmModal.classList.add(
"hidden"
);

}
);

/* ==========================================
   契約締結処理
========================================== */

confirmBtn.addEventListener(
"click",
async () => {

confirmModal.classList.add(
"hidden"
);

loadingScreen.classList.remove(
"hidden"
);

await fakeProgress();

loadingScreen.classList.add(
"hidden"
);

completeSection.classList.remove(
"hidden"
);

contractNumberText.innerText =
currentContractNumber;

signedDateText.innerText =
new Date().toLocaleString(
"ja-JP"
);

generateQRCode();

sendEmail();

window.scrollTo({
top:
document.body.scrollHeight,
behavior:"smooth"
});

}
);

/* ==========================================
   演出
========================================== */

async function fakeProgress() {

const loadingText =
document.getElementById(
"loadingText"
);

loadingText.innerText =
"電子署名確認中...";

await wait(1200);

loadingText.innerText =
"契約情報を保存中...";

await wait(1200);

loadingText.innerText =
"契約証明書を発行中...";

await wait(1200);

}

function wait(ms) {

return new Promise(
resolve =>
setTimeout(
resolve,
ms
)
);

}

/* ==========================================
   QRコード
========================================== */

async function generateQRCode() {

const canvas =
document.getElementById(
"qrCanvas"
);

const verifyUrl =
`${location.origin}${location.pathname}?verify=${currentContractNumber}`;

await QRCode.toCanvas(
canvas,
verifyUrl,
{
width:200
}
);

}

/* ==========================================
   PDF生成
========================================== */

pdfBtn.addEventListener(
"click",
async () => {

const {
jsPDF
} = window.jspdf;

const doc =
new jsPDF();

const sealCanvas =
await html2canvas(seal);

const sealImage =
sealCanvas.toDataURL(
"image/png"
);

doc.setFontSize(22);

doc.text(
"Mellena Studio",
20,
20
);

doc.setFontSize(14);

doc.text(
"Nidmegent Esports Contract Certificate",
20,
35
);

doc.text(
`Contract Number: ${currentContractNumber}`,
20,
55
);

doc.text(
`Name: ${fullname.value}`,
20,
70
);

doc.text(
`Nickname: ${nickname.value}`,
20,
85
);

doc.text(
`Email: ${email.value}`,
20,
100
);

doc.text(
`Division: ${division.value}`,
20,
115
);

doc.text(
`Signed: ${new Date().toLocaleString("ja-JP")}`,
20,
130
);

doc.addImage(
sealImage,
"PNG",
140,
45,
40,
40
);

const qrCanvas =
document.getElementById(
"qrCanvas"
);

const qrImage =
qrCanvas.toDataURL(
"image/png"
);

doc.addImage(
qrImage,
"PNG",
140,
100,
40,
40
);

doc.save(
`${currentContractNumber}.pdf`
);

}
);

/* ==========================================
   EmailJS
========================================== */

function sendEmail() {

emailjs.send(

"service_4eo6dni",

"template_g2k97fb",

{

contract_number:
currentContractNumber,

fullname:
fullname.value,

nickname:
nickname.value,

email:
email.value,

division:
division.value,

signed_date:
new Date().toLocaleString(
"ja-JP"
)

}

)

.then(() => {

console.log(
"メール送信成功"
);

})

.catch(error => {

console.error(
"メール送信失敗",
error
);

});

}

/* ==========================================
   Verify Mode
========================================== */

const params =
new URLSearchParams(
location.search
);

const verifyId =
params.get(
"verify"
);

if (verifyId) {

document.body.innerHTML = `

<div style="
max-width:700px;
margin:100px auto;
padding:40px;
background:#111;
border:1px solid #d4af37;
border-radius:20px;
text-align:center;
color:white;
font-family:sans-serif;
">

<h1 style="color:#d4af37;">
契約確認
</h1>

<p>
契約番号
</p>

<h2>
${verifyId}
</h2>

<p style="
color:#2ecc71;
font-size:24px;
">
✓ 有効な契約
</p>

</div>

`;

}
