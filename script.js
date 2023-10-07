const renk = {
    g: "orangered",
    h: "yellow",
    j: "violet",
    k: "limegreen"
};

const sarkilar = {
    "Base": "_ghj_jhg_ghjjjhg_ghjjjkkjjhgjjhg",
    "Level Up": "_kj__kj__kj__kj___gggh_ggghhj_gggh_ggghkj_gggh_ggghhj_gggh_ggghkj__ggggghghj_ghghk_ghghj_ghghk",
    "Freeplay": ""
};

const sarkiHizlari = {
    "Base": 4,
    "Level Up": 4.5
}

var mevcutSarki = "";

var skor = 0;

window.onload = () => {
    window.synth = new Tone.Sampler({
        urls: {
            A1: "A1.mp3",
            A2: "A2.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/casio/",
        onload: () => {
            sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
        }
    }).toDestination();
}

document.body.addEventListener("keydown" , (event) => {
    if (!["g", "h", "j", "k"].includes(event.key)) return;
    if (!mevcutSarki) {
        var kutu = document.createElement("div");
        kutu.classList.add("kutu");
        kutu.classList.add("yukari");
        document.querySelector(`.notalar .nota.${event.key}`).appendChild(kutu);
    }
    document.querySelector(`.tuslar .kutu.${event.key}`).style.background = renk[event.key];
    window.synth.triggerAttackRelease(`A${(2 + ["g", "h", "j", "k"].indexOf(event.key) + .1).toString()}`, "8n");
    document.querySelectorAll(`.nota.${event.key} .kutu`).forEach(item => {
        if (touches(item, document.querySelector(".tuslar")) && touches(item, document.querySelector(".notalar"))) {
            if (item.classList.contains("yukari")) return;
            item.remove();
            skorDegistir(1);
        }
    });
});

document.body.addEventListener("keyup" , (event) => {
    if (!["g", "h", "j", "k"].includes(event.key)) return;
    document.querySelector(`.tuslar .kutu.${event.key}`).style.background = "none";
});

document.querySelectorAll(".tuslar .kutu").forEach(item => {
    item.addEventListener("mousedown", () => {
        document.querySelector(`.tuslar .kutu.${item.classList[1]}`).style.background = renk[item.classList[1]];
        window.synth.triggerAttackRelease(`C${(2 + ["g", "h", "j", "k"].indexOf(item.classList[1]) + .1).toString()}`, "8n");
        document.querySelectorAll(`.nota.${item.classList[1]} .kutu`).forEach(item => {
            if (touches(item, document.querySelector(".tuslar")) && touches(item, document.querySelector(".notalar"))) {
                if (item.classList.contains("yukari")) return;
                item.remove();
                skorDegistir(1);
            }
        });
    });
});

document.querySelectorAll(".tuslar .kutu").forEach(item => {
    item.addEventListener("mouseup", () => {
        item.style.background = "none";
    });
});

const gonder = (nota) => {
    if (!document.querySelector(`.notalar .nota.${nota}`)) return;
    let parent = document.querySelector(`.notalar .nota.${nota}`);
    let kutu = document.createElement("div");
    kutu.classList.add("kutu");
    parent.appendChild(kutu);
}

const touches = (a, b) => {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();
    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
}

const skorDegistir = (degisim) => {
    skor += degisim;
    document.querySelector(".score span").innerText = skor.toString();
}

setInterval(() => {
    document.querySelectorAll(".nota .kutu").forEach(item => {
        if (!touches(item, document.querySelector(".notalar"))) {
            item.remove();
        }
    });
});

var sarkiSayi = 1;
var hiz = 4;

const bitis = (sarki) => {
    if (!sarki) return;
    setTimeout(() => {
        alert(`Congratulations! Your score is ${parseInt(100 * (skor / sarki.replaceAll("_", "").length)).toString().split(".")[0]}%`);
    }, 10000 / hiz);
};

const notaIlerlet = (sarki) => {
    if (mevcutSarki !== sarki) return;
    if (!sarki.split("")[sarkiSayi]) {
        var test = 1;
        document.querySelectorAll(".notalar .nota .kutu").forEach(item => {
            if (touches(item, document.querySelector(".notalar"))) test = 0;
        });
        if (test) bitis(mevcutSarki);
        return;
    }
    gonder(sarki.split("")[sarkiSayi]);
    sarkiSayi++;
    setTimeout(() => {
        notaIlerlet(sarki);
    }, 1000 / hiz);
}

Object.keys(sarkilar).forEach(item => {
    document.querySelector(".ui .sarkilar").innerHTML += `
        <div class="sarki"><span class="isim">${item}</span> | ${sarkilar[item].replaceAll("_", "").length} notes</div>
    `;
    document.querySelectorAll(".sarkilar .sarki").forEach(childItem => {
        childItem.addEventListener("click", () => {
            document.querySelector(".ui").style.display = "none";
            document.querySelector(".sayac").style.display = "flex";
            mevcutSarki = sarkilar[childItem.querySelector("span.isim").innerText];
            hiz = sarkiHizlari[mevcutSarki] | 3;
            setTimeout(() => {
                document.querySelector(".sayac").innerText = "2";
                setTimeout(() => {
                    document.querySelector(".sayac").innerText = "1";
                    setTimeout(() => {
                        document.querySelector(".sayac").innerText = "0";
                        notaIlerlet(mevcutSarki);
                        setInterval(() => {
                            document.querySelector(".sayac").style.display = "none";
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        });
    });
});

document.querySelector("button.sarkiDegistir").addEventListener("click", () => {
    mevcutSarki = "";
    sarkiSayi = 0;
    document.querySelector(".ui").style.display = "flex";
});