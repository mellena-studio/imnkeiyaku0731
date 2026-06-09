// EmailJS 初期化
// EmailJS登録後に置き換える

emailjs.init("公開キー");

// 要素取得

const contractBox = document.getElementById("contractBox");
const agreeCheck = document.getElementById("agreeCheck");

const sealBtn = document.getElementById("sealBtn");
const sealName = document.getElementById("sealName");

const contractBtn = document.getElementById("contractBtn");

const completeSection = document.getElementById("completeSection");
const contractNumberText = document.getElementById("contractNumber");

const pdfBtn = document.getElementById("pdfBtn");

// 契約番号保存

let currentContractNumber = "";

// 契約書最下部でチェック有効

contractBox.addEventListener("scroll", () => {

    const reachedBottom =
        contractBox.scrollTop +
        contractBox.clientHeight >=
        contractBox.scrollHeight - 10;

    if (reachedBottom) {
        agreeCheck.disabled = false;
    }

});

// 電子印鑑生成

sealBtn.addEventListener("click", () => {

    const fullname =
        document.getElementById("fullname").value.trim();

    if (!fullname) {
        alert("氏名を入力してください");
        return;
    }

    sealName.innerText =
        fullname.replaceAll(" ", "\n")
                .replaceAll("　", "\n");

});

// 契約締結

contractBtn.addEventListener("click", async () => {

    if (!agreeCheck.checked) {
        alert("契約内容に同意してください");
        return;
    }

    const fullname =
        document.getElementById("fullname").value.trim();

    const nickname =
        document.getElementById("nickname").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const division =
        document.getElementById("division").value;

    if (
        !fullname ||
        !nickname ||
        !email
    ) {
        alert("必要事項を入力してください");
        return;
    }

    // 契約番号生成

    const now = new Date();

    const y = now.getFullYear();

    const m =
        String(now.getMonth() + 1)
        .padStart(2, "0");

    const d =
        String(now.getDate())
        .padStart(2, "0");

    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );

    currentContractNumber =
        `IMN-${y}${m}${d}-${random}`;

    contractNumberText.textContent =
        currentContractNumber;

    completeSection.classList.remove("hidden");

    completeSection.scrollIntoView({
        behavior: "smooth"
    });

    // EmailJS送信

    try {

        await emailjs.send(
            "service_xxxxx"
            "template_xxxxx"
            {

                contract_number:
                    currentContractNumber,

                fullname:
                    fullname,

                nickname:
                    nickname,

                email:
                    email,

                division:
                    division,

                send_date:
                    now.toLocaleString("ja-JP"),

                operator_email:
                    "lgs.esportsgames@gmail.com"

            }
        );

        console.log("メール送信成功");

    } catch (err) {

        console.error(err);

    }

});

// PDF生成

pdfBtn.addEventListener("click", async () => {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const fullname =
        document.getElementById("fullname").value;

    const nickname =
        document.getElementById("nickname").value;

    const email =
        document.getElementById("email").value;

    const division =
        document.getElementById("division").value;

    doc.setFontSize(18);

    doc.text(
        "Mellena Studio Contract",
        20,
        20
    );

    doc.setFontSize(12);

    doc.text(
        `Contract Number: ${currentContractNumber}`,
        20,
        40
    );

    doc.text(
        `Name: ${fullname}`,
        20,
        55
    );

    doc.text(
        `Nickname: ${nickname}`,
        20,
        70
    );

    doc.text(
        `Email: ${email}`,
        20,
        85
    );

    doc.text(
        `Division: ${division}`,
        20,
        100
    );

    doc.text(
        `Date: ${new Date().toLocaleString()}`,
        20,
        115
    );

    doc.text(
        "Nidmegent Esports Agreement",
        20,
        145
    );

    doc.save(
        `${currentContractNumber}.pdf`
    );

});
