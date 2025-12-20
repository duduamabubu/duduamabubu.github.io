// app.js
(function () {
  const MESES = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  // Index: tarjetas (mes + 1 imagen H# al lado)
  const grid = document.getElementById("gridCitas");
  if (grid) {
    MESES.forEach((mes, i) => {
      const n = i + 1;

      const a = document.createElement("a");
      a.className = "card";
      a.href = `cita.html?m=${n}`;
      a.innerHTML = `
        <div class="monthCardInner">
          <div class="monthName">${mes}</div>
          <span class="cardLogoWrap">
            <img class="cardLogo" src="img/H${n}.png" alt="" />
          </span>
        </div>
      `;
      grid.appendChild(a);
    });
  }

  // Cita
  const tituloMes = document.getElementById("tituloMes");
  const imgPlan = document.getElementById("imgPlan");
  const imgHecho = document.getElementById("imgHecho");
  if (!tituloMes || !imgPlan || !imgHecho) return;

  const params = new URLSearchParams(window.location.search);
  const m = Number(params.get("m")) || 1;
  const n = Math.min(Math.max(m, 1), 12);
  const mesNombre = MESES[n - 1];

  tituloMes.textContent = mesNombre;

  // Fotos (si usas PNG, cambia .jpg por .png)
  imgPlan.src = `img/F${n}.jpg`;
  imgHecho.src = `img/P${n}.jpg`;

  imgPlan.onerror = () => { imgPlan.style.display = "none"; };
  imgHecho.onerror = () => { imgHecho.style.display = "none"; };

  // Contador: 10 del mes (18:00), si ya pasó -> próximo año
  const cdDays = document.getElementById("cdDays");
  const cdHours = document.getElementById("cdHours");
  const cdMins = document.getElementById("cdMins");
  const cdSecs = document.getElementById("cdSecs");

  function setBoxes(dd, hh, mm, ss) {
    cdDays.textContent = String(dd);
    cdHours.textContent = String(hh).padStart(2, "0");
    cdMins.textContent = String(mm).padStart(2, "0");
    cdSecs.textContent = String(ss).padStart(2, "0");
  }

  function getTargetDateForMonth10(monthIndex1to12) {
    const now = new Date();
    const year = now.getFullYear();
    let target = new Date(year, monthIndex1to12 - 1, 10, 18, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target = new Date(year + 1, monthIndex1to12 - 1, 10, 18, 0, 0);
    }
    return target;
  }

  const target = getTargetDateForMonth10(n);

  const tick = () => {
    const now = new Date();
    let diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      setBoxes(0, 0, 0, 0);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const dd = Math.floor(totalSeconds / (60 * 60 * 24));
    const hh = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const mm = Math.floor((totalSeconds % (60 * 60)) / 60);
    const ss = totalSeconds % 60;

    setBoxes(dd, hh, mm, ss);
  };

  tick();
  setInterval(tick, 1000);
})();
