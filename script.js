const c = v => v || "失敗";
const weeks = ['日', '月', '火', '水', '木', '金', '土'];
let day = localStorage.getItem("day") || {};
let goal = Number(localStorage.getItem("goaltime")) || 0;
let time = Number(localStorage.getItem("studytime")) || 0;
let log = localStorage.getItem("log") || {};
if (typeof(day) == "string") day = JSON.parse(day);
if (typeof(log) == "string") log = JSON.parse(log);
for (let i = new Date().getDate()+1; i <= 31; i++) {
    if (log[i]) {
        log = {};
        localStorage.setItem("log", {});
        console.log("先月のデータを消去しました。");
    }
}

function setup() {
    document.getElementById("goal").textContent = goal;
    document.getElementById("siteName").addEventListener("click", () => location.href = "");
    document.getElementById("decision").addEventListener("click", () => {
        let val = Number(document.getElementById("studytime").value);
        if (!val) return alert("学習時間を入力してください。");
        else if (val.length > 4) return alert("学習時間は時間表記で4文字以下にしてください(小数点含む)");
        else if (day[0] == new Date().getDate()) {
            console.log(`今日の学習時間を上書きします。\n${day[1]} ⇒ ${val}`);
            time -= day[1];
        }
        time += val;
        day = [new Date().getDate(), val];
        if (goal <= val) {
            log[new Date().getDate()] = "⭕";
            localStorage.setItem("log", JSON.stringify(log));
            document.getElementById(`calen${new Date().getDate()}`).textContent = "⭕";
        }
        localStorage.setItem("day", JSON.stringify(day));
        localStorage.setItem("studytime", time);
        console.log(`総合時間: ${time}`);
        alert(`今日の学習時間を保存しました。\n総合時間: ${time}h`);
        return true;
    });
    document.getElementById("setting").addEventListener("click", () => {
        document.getElementById("title").textContent = "設定・記録";
        document.getElementById("menu1").style.display = "none";
        document.getElementById("menu2").style.display = window.outerWidth > 512? "flex": "block";
        document.getElementById("info").innerText = `目標時間: ${goal}h\n総合学習時間: ${time}h`;
        return true;
    });
    document.getElementById("goalset").addEventListener("click", () => {
        goal = document.getElementById("goaltime").value || 0;
        if (!goal) return alert("目標時間を入力してください。");
        else if (goal < 0 || goal > 24) return alert("目標時間は24時間以内にしてください");
        document.getElementById("info").innerText = `目標時間: ${goal}h\n総合学習時間: ${time}h`;
        localStorage.setItem("goaltime", goal);
        return true;
    })
    document.getElementById("clear").addEventListener("click", () => {
        let pm = prompt("データの復元はできません。\n削除する場合は「3710」と入力してください。\n");
        if (pm != "3710") return alert("キャンセルしました");
        localStorage.clear();
        location.href = "";
    });
}

window.addEventListener("load", ()=> {
    let calender = document.getElementById("calender");
    let year, month, sday, ldate;
    try {
        let date = new Date();
        year = date.getFullYear();
        month = date.getMonth()+1;
        sday = new Date(year, month-1, 1).getDay();
        ldate = new Date(year, month, 0).getDate();
    } catch(e) {
        alert("日付の失敗しました。\nページを再度読み込んでください。");
        console.log(`🚫エラー | 日付の取得に失敗:\n${e}`);
        return false;
    }
    console.log(`今年: ${c(year)}\n今月: ${c(month)}\n月初: 1 (${c(weeks[sday])})\n月末: ${c(ldate)}${sday != null && ldate? "(" + weeks[(ldate+sday-1)%7] + ")": ""}`);
    try {
        for (let i = 0; i < 7; i++) {
            let th = document.createElement("th");
            th.className = "cell";
            th.textContent = weeks[i];
            calender.appendChild(th);
        }
    } catch(e) {
        alert("HTMLへの書き込みに失敗しました(1)\nページを再度読み込んでください。");
        console.log(`🚫エラー | 曜日の書き込みに失敗:\n${e}`);
        return false;
    }
    try {
        let save = document.createElement("tr");
        for (let i = 1-sday; i <= ldate; i++) {
            let td = document.createElement("td");
            if (i > 0) td.innerHTML = `${(`0${i}`).slice(-2)} - <font id="calen${i}">${log[i]? "⭕": "✖"}</font>`;
            else td.innerHTML = "-";
            save.appendChild(td);
            if (i > 0 && (i+sday)%7 == 0 || i == ldate) {
                calender.appendChild(save);
                save = document.createElement("tr");
            }
        }
    } catch(e) {
        alert("HTMLへの書き込みに失敗しました(2)\nページを再度読み込んでください。");
        console.log(`🚫エラー | 日付の書き込みに失敗:\n${e}`);
        return false;
    }
    return setup();
});