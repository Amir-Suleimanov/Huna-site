(function () {
    var PROGRAM_CONTAINER_SELECTOR = ".programm__grid";
    var STAGE_SELECTOR = ".programm__stage";
    var STAGE_HEADER_SELECTOR = ".programm__stage-compact";
    var isMobileLayout = window.matchMedia("(max-width: 390px)").matches;

    function initProgramAccordion(container) {
        var stages = Array.prototype.slice.call(container.querySelectorAll(STAGE_SELECTOR));
        if (!stages.length) {
            return;
        }

        var transitionTimer = null;
        var TRANSITION_SETTLE_MS = 260;

        stages.forEach(function (stage) {
            var compactMain = stage.querySelector(".programm__duration-main");
            var compactSub = stage.querySelector(".programm__duration-sub");
            var fullMain = stage.querySelector(".programm__duration p");
            var fullSub = stage.querySelector(".programm__duration span");

            if (compactMain && fullMain) {
                fullMain.textContent = compactMain.textContent.trim();
            }
            if (compactSub && fullSub) {
                fullSub.textContent = compactSub.textContent.trim();
            }
        });

        var stageImages = container.querySelectorAll(".programm__stage-full img");
        stageImages.forEach(function (img) {
            img.loading = "eager";
            img.decoding = "async";
            if (!img.complete && typeof img.decode === "function") {
                img.decode().catch(function () {});
            }
        });

        function setActive(index, skipTransition, force) {
            var safeIndex = Math.max(0, Math.min(index, stages.length - 1));
            var currentActive = stages.findIndex(function (stage) {
                return stage.classList.contains("is-active");
            });
            if (currentActive === safeIndex && !force) {
                return;
            }

            stages.forEach(function (_, classIndex) {
                container.classList.remove("is-active-" + classIndex);
            });
            container.classList.add("is-active-" + safeIndex);

            if (!skipTransition) {
                if (transitionTimer) {
                    clearTimeout(transitionTimer);
                }
                container.classList.add("is-transitioning");
            } else {
                container.classList.remove("is-transitioning");
            }

            stages.forEach(function (stage, stageIndex) {
                var isActive = stageIndex === safeIndex;
                stage.classList.toggle("is-active", isActive);
                stage.classList.toggle("programm__stage--active", isActive);
                stage.classList.toggle("programm__stage--deactive", !isActive);
                stage.setAttribute("aria-expanded", String(isActive));
            });

            if (!skipTransition) {
                transitionTimer = setTimeout(function () {
                    container.classList.remove("is-transitioning");
                }, TRANSITION_SETTLE_MS);
            }
        }

        function resetToDefault(skipTransition, force) {
            setActive(0, skipTransition, force);
        }

        stages.forEach(function (stage, index) {
            stage.setAttribute("role", "button");
            stage.setAttribute("tabindex", "0");
            stage.setAttribute("aria-expanded", "false");

            if (isMobileLayout) {
                return;
            }

            var clickTarget = stage.querySelector(STAGE_HEADER_SELECTOR) || stage;
            clickTarget.addEventListener("click", function () {
                setActive(index, false);
            });

            stage.addEventListener("mouseenter", function () {
                setActive(index, false);
            });

            stage.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActive(index, false);
                }
            });
        });

        if (!isMobileLayout) {
            container.addEventListener("mouseleave", function () {
                resetToDefault(false);
            });
        }

        container.classList.add("is-preparing");
        resetToDefault(true, true);
        stages.forEach(function (stage, index) {
            setActive(index, true, true);
            stage.classList.add("is-measuring");
            var full = stage.querySelector(".programm__stage-full");
            if (full) {
                void full.offsetHeight;
            }
            stage.classList.remove("is-measuring");
        });
        resetToDefault(true, true);
        requestAnimationFrame(function () {
            container.classList.remove("is-preparing");
        });
    }

    var containers = document.querySelectorAll(PROGRAM_CONTAINER_SELECTOR);
    containers.forEach(initProgramAccordion);
})();
