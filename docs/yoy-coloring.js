(function () {
  function parseNumberFromText(text) {
    if (!text) return NaN;
    // Remove commas and pick first -?digits(.digits)
    const cleaned = (text + '').replace(/,/g, '').trim();
    const m = cleaned.match(/-?[\d]+(\.[\d]+)?/);
    return m ? parseFloat(m[0]) : NaN;
  }

  function updateYoyColor() {
    const yoyEl = document.querySelector('[data-out="yoy-val"]') || document.getElementById('out-yoy-val');
    if (!yoyEl) return;
    const n = parseNumberFromText(yoyEl.textContent);
    yoyEl.classList.remove('positive', 'negative');
    if (Number.isFinite(n)) {
      if (n > 0) yoyEl.classList.add('positive');
      else if (n < 0) yoyEl.classList.add('negative');
      // zero or NaN keeps default orange
    }
  }

  // Observe result changes (safe and generic)
  const resultEls = Array.from(document.querySelectorAll('.result-value'));
  if (resultEls.length) {
    const obs = new MutationObserver(() => updateYoyColor());
    resultEls.forEach(el => obs.observe(el, { subtree: true, characterData: true, childList: true }));
  }

  // Also update on input events (in case results update without DOM mutation)
  document.querySelectorAll('[data-in]').forEach(i => {
    i.addEventListener('input', () => setTimeout(updateYoyColor, 120));
    i.addEventListener('blur', () => setTimeout(updateYoyColor, 120));
  });

  // Run once on load
  window.addEventListener('load', updateYoyColor);
  // Expose for manual triggering/debugging:
  window.updateYoyColor = updateYoyColor;
})();
