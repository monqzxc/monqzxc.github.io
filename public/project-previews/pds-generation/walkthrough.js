// Shared stepper for every walkthrough page.
// A page defines window.WALKTHROUGH = { name, steps: [{ t, d, url, html }] }
// and includes <div id="walkthrough"></div>, then loads this file.
(function () {
  const W = window.WALKTHROUGH;
  const root = document.getElementById("walkthrough");
  if (!W || !root) return;

  root.innerHTML = `
  <section class="stage">
    <div>
      <ol class="steps" data-el="steps"></ol>
      <div class="meter" aria-hidden="true"><i data-el="meter"></i></div>
      <div class="meter-label" data-el="label"></div>
    </div>
    <div class="window">
      <div class="chrome"><div class="dots"><i></i><i></i><i></i></div><div class="url" data-el="url"></div></div>
      <div class="screen" data-el="screen"></div>
      <div class="controls">
        <button class="btn" data-el="back" type="button">Back</button>
        <button class="btn primary" data-el="next" type="button">Next step</button>
      </div>
    </div>
  </section>`;

  const el = name => root.querySelector(`[data-el="${name}"]`);
  const steps = W.steps;
  let step = 0;

  function render() {
    const last = step === steps.length - 1;
    el("steps").innerHTML = steps.map((x, i) => {
      const done = i < step || (last && i === step);
      return `<li><button type="button" class="step ${done ? "done" : ""} ${i === step ? "current" : ""}" data-i="${i}" ${i === step ? 'aria-current="step"' : ""}>
        <span class="n">${done ? "✓" : i + 1}</span><span><span class="t">${x.t}</span><br><span class="d">${x.d}</span></span></button></li>`;
    }).join("");
    el("meter").style.width = ((step + 1) / steps.length * 100) + "%";
    el("label").textContent = last ? `${W.name} · complete` : `Step ${step + 1} of ${steps.length}`;
    el("url").textContent = "hr-suite.example/" + steps[step].url;
    const sc = el("screen");
    sc.innerHTML = steps[step].html;
    sc.style.animation = "none"; void sc.offsetWidth; sc.style.animation = "";
    el("back").disabled = step === 0;
    el("next").textContent = last ? "Start over" : "Next step";
  }

  el("steps").addEventListener("click", e => {
    const b = e.target.closest(".step");
    if (b) { step = +b.dataset.i; render(); }
  });
  el("next").addEventListener("click", () => { step = step < steps.length - 1 ? step + 1 : 0; render(); });
  el("back").addEventListener("click", () => { if (step > 0) { step--; render(); } });

  render();
})();
