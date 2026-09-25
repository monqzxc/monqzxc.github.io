// Keep the original standalone introduction unless a preview mode is requested.
(function () {
  const mode = new URLSearchParams(window.location.search).get("preview");
  if (mode === "thumbnail" || mode === "embed") {
    document.documentElement.dataset.preview = mode;
  }

  function setStepCount() {
    const count = window.WALKTHROUGH?.steps?.length;
    if (count) document.documentElement.style.setProperty("--walkthrough-steps", String(count));
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setStepCount, { once: true });
  } else {
    setStepCount();
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && window.parent !== window) {
      window.parent.postMessage({ type: "project-preview:close" }, window.location.origin);
    }
  });
})();
