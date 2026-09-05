(() => {
	function parseIsoDate(isoDate) {
		const [year, month, day] = isoDate.split("-").map(Number);
		return new Date(year, month - 1, day);
	}

	function completedYearsSince(start, today = new Date()) {
		const years = today.getFullYear() - start.getFullYear();
		const beforeAnniversary =
			today.getMonth() < start.getMonth() ||
			(today.getMonth() === start.getMonth() &&
				today.getDate() < start.getDate());
		return Math.max(years - Number(beforeAnniversary), 0);
	}

	function fillExperienceYears(root) {
		const isoDate = root.dataset.experienceStart;
		if (!isoDate) {
			return;
		}
		const start = parseIsoDate(isoDate);
		if (Number.isNaN(start.getTime())) {
			return;
		}
		const target = root.querySelector("[data-experience-years]") ?? root;
		target.textContent = String(completedYearsSince(start));
	}

	function renderExperienceYears() {
		for (const root of document.querySelectorAll("[data-experience-start]")) {
			fillExperienceYears(root);
		}
	}

	renderExperienceYears();

	const navCollapse = document.getElementById("site-nav-collapse");
	document.querySelectorAll("#site-nav a[href*='#']").forEach((link) => {
		link.addEventListener("click", () => {
			if (navCollapse?.classList.contains("show")) {
				bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
			}
		});
	});

	function enterVideoFullscreen(video) {
		if (typeof video.requestFullscreen === "function") {
			video.requestFullscreen().catch(() => {
				wrapPlayingFallback(video);
			});
			return true;
		}
		if (typeof video.webkitEnterFullscreen !== "function") {
			return false;
		}
		try {
			video.webkitEnterFullscreen();
		} catch {
			return false;
		}
		return true;
	}

	function wrapPlayingFallback(video) {
		const wrap = video.closest("[data-case-video]");
		if (wrap) {
			wrap.classList.add("is-playing");
		}
	}

	function bindCaseVideos() {
		for (const wrap of document.querySelectorAll("[data-case-video]")) {
			const button = wrap.querySelector(".video-poster");
			const video = wrap.querySelector("video");
			if (!button || !video) {
				continue;
			}
			button.addEventListener("click", () => {
				video.play();
				if (!enterVideoFullscreen(video)) {
					wrap.classList.add("is-playing");
				}
			});
			video.addEventListener("fullscreenchange", () => {
				if (!document.fullscreenElement) {
					video.pause();
				}
			});
			video.addEventListener("webkitendfullscreen", () => {
				video.pause();
				wrap.classList.remove("is-playing");
			});
		}
	}

	bindCaseVideos();
	GLightbox({ selector: ".glightbox" });

	const themeToggle = document.getElementById("theme-toggle");
	if (themeToggle) {
		themeToggle.addEventListener("click", () => {
			const next =
				document.documentElement.getAttribute("data-bs-theme") === "dark"
					? "light"
					: "dark";
			document.documentElement.setAttribute("data-bs-theme", next);
			localStorage.setItem("theme", next);
		});
	}

	const filterButtons = document.querySelectorAll(".filter-btn");
	const workItems = document.querySelectorAll(".work-item");
	filterButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const filter = button.getAttribute("data-filter");
			for (const item of filterButtons) {
				item.classList.remove("is-active");
			}
			button.classList.add("is-active");
			workItems.forEach((item) => {
				const categories = item.getAttribute("data-categories");
				const show = filter === "*" || Boolean(categories?.includes(filter));
				item.classList.toggle("d-none", !show);
			});
		});
	});
})();
