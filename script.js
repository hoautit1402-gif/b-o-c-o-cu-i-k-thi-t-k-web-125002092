
/* Adaptive Quiz System - script.js */
(function () {
    "use strict";

    var THEME_KEY = "aq-theme";
    var HISTORY_KEY = "aq-history";
    var SECONDS_PER_QUESTION = 30;
    var MAX_HISTORY = 8;
    var LEVEL_NAME = {1: "Dễ", 2: "Trung bình", 3: "Khó"};
    var KEYS = ["A", "B", "C", "D"];

    function $(id) {
        return document.getElementById(id);
    }

    // Hàm chuyển đổi các thẻ HTML sang mã hiển thị an toàn
    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function store(key, value) {
        try {
            if (value === undefined) {
                return JSON.parse(localStorage.getItem(key));
            }
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            return null;
        }
        return null;
    }

    /* ---------- 1. GIAO DIỆN ---------- */
    var root = document.documentElement;
    var themeBtn = $("theme-toggle");

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        var dark = theme === "dark";
        themeBtn.setAttribute("aria-pressed", String(dark));
        themeBtn.setAttribute("aria-label", dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối");
        $("theme-icon").textContent = dark ? "☀" : "☾";
        $("theme-label").textContent = dark ? "Chế độ sáng" : "Chế độ tối";
    }

    var savedTheme = store(THEME_KEY);
    if (savedTheme !== "dark" && savedTheme !== "light") {
        savedTheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    applyTheme(savedTheme);

    themeBtn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        store(THEME_KEY, next);
    });

    var nav = $("main-nav");
    var navToggle = $("nav-toggle");

    function setNav(open) {
        nav.classList.toggle("is-open", open);
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    }

    navToggle.addEventListener("click", function () {
        setNav(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
            setNav(false);
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            setNav(false);
        }
    });

    // Đánh dấu mục menu theo vùng đang xem
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a"));
    if ("IntersectionObserver" in window) {
        var watched = ["trang-chu", "chu-de", "lam-bai", "lien-he"];
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (link) {
                        link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
                    });
                }
            });
        }, {rootMargin: "-45% 0px -50% 0px"});
        watched.forEach(function (id) {
            var el = $(id);
            if (el) {
                observer.observe(el);
            }
        });
    }

    /* ---------- 2. BIỂU MẪU ---------- */
    var form = $("quiz-form");

    document.querySelectorAll("[data-topic]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            form.elements.topic.value = btn.getAttribute("data-topic");
            showError("topic", "");
            $("lam-bai").scrollIntoView({behavior: "smooth", block: "start"});
            form.elements.fullname.focus({preventScroll: true});
        });
    });

    function showError(name, message) {
        var input = form.elements[name];
        var out = $("err-" + name);
        if (out) {
            out.textContent = message;
        }
        if (input) {
            input.classList.toggle("is-invalid", message !== "");
            input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
        }
        return message === "";
    }

    function validate() {
        var ok = true;
        var name = form.elements.fullname.value.trim();
        var email = form.elements.email.value.trim();
        var count = Number(form.elements.count.value);
        var topic = form.elements.topic.value;

        ok = showError("fullname", name.length < 2 ? "Vui lòng nhập họ và tên (ít nhất 2 ký tự)." : "") && ok;
        ok = showError("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Email chưa đúng định dạng, ví dụ ban@example.com.") && ok;
        ok = showError("count", Number.isInteger(count) && count >= 5 && count <= 9 ? "" : "Số câu hỏi phải là số nguyên từ 5 đến 9.") && ok;
        ok = showError("topic", topic === "" ? "Vui lòng chọn một chủ đề." : "") && ok;
        return ok;
    }

    function readConfig() {
        return {
            name: form.elements.fullname.value.trim(),
            topic: form.elements.topic.value,
            total: Number(form.elements.count.value),
            start: form.elements.start.value,
            timer: form.elements.timer.checked,
            explain: form.elements.explain.checked,
            save: form.elements.save.checked
        };
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validate()) {
            var firstBad = form.querySelector(".is-invalid");
            if (firstBad) {
                firstBad.focus();
            }
            return;
        }
        startSession(readConfig());
    });

    form.addEventListener("reset", function () {
        ["fullname", "email", "count", "topic"].forEach(function (n) {
            showError(n, "");
        });
    });

    /* ---------- 3. THUẬT TOÁN THÍCH ỨNG ---------- */
    var START_THETA = {auto: 0, easy: -1.2, medium: 0, hard: 1.2};
    var session = null;
    var timerId = null;

    function buildPool(topic) {
        var keys = topic === "mix" ? Object.keys(QUESTION_BANK) : [topic];
        var pool = [];
        keys.forEach(function (key) {
            var seen = {1: 0, 2: 0, 3: 0};
            QUESTION_BANK[key].forEach(function (item) {
                var offset = (seen[item.lv] - 1) * 0.2;
                seen[item.lv] += 1;
                pool.push({
                    topic: key,
                    lv: item.lv,
                    b: (item.lv - 2) * 1.2 + offset,
                    q: item.q,
                    o: item.o,
                    a: item.a,
                    e: item.e
                });
            });
        });
        return pool;
    }

    function shuffle(list) {
        var arr = list.slice();
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
        }
        return arr;
    }

    function pickQuestion() {
        var best = Infinity;
        session.pool.forEach(function (item) {
            best = Math.min(best, Math.abs(item.b - session.theta));
        });
        var near = session.pool.filter(function (item) {
            return Math.abs(item.b - session.theta) <= best + 0.15;
        });
        var chosen = near[Math.floor(Math.random() * near.length)];
        session.pool.splice(session.pool.indexOf(chosen), 1);
        return chosen;
    }

    function updateAbility(question, correct) {
        var p = 1 / (1 + Math.exp(-(session.theta - question.b)));
        var k = Math.max(0.35, 0.9 - 0.08 * session.log.length);
        session.theta += k * ((correct ? 1 : 0) - p);
        session.theta = Math.max(-2.5, Math.min(2.5, session.theta));
    }

    function abilityScore(theta) {
        return Math.max(0, Math.min(100, Math.round(((theta + 2.5) / 5) * 100)));
    }

    function abilityLabel(score) {
        if (score >= 65) {
            return "Nâng cao";
        }
        if (score >= 35) {
            return "Trung bình";
        }
        return "Cơ bản";
    }

    /* ---------- 4. KHU VỰC LÀM BÀI ---------- */
    var viewIdle = $("stage-idle");
    var viewQuiz = $("stage-quiz");
    var viewResult = $("stage-result");
    var historyWrap = $("history-wrap");
    var optionsBox = $("options");
    var feedback = $("feedback");
    var nextBtn = $("btn-next");
    var timerEl = $("timer");

    function showView(name) {
        viewIdle.hidden = name !== "idle";
        viewQuiz.hidden = name !== "quiz";
        viewResult.hidden = name !== "result";
        historyWrap.hidden = name === "quiz";
    }

    function replayAnimation(el, effect) {
        el.classList.remove("animate__animated", effect);
        void el.offsetWidth;
        el.classList.add("animate__animated", effect);
    }

    function startSession(config) {
        stopTimer();
        session = {
            config: config,
            pool: buildPool(config.topic),
            theta: START_THETA[config.start],
            log: [],
            current: null,
            answered: false
        };
        session.total = Math.min(config.total, session.pool.length);
        $("q-progress").max = session.total;
        showView("quiz");
        nextQuestion();
        $("stage").scrollIntoView({behavior: "smooth", block: "start"});
    }

    function nextQuestion() {
        var q = pickQuestion();
        var order = shuffle([0, 1, 2, 3]);
        session.current = {question: q, order: order, correctPos: order.indexOf(q.a)};
        session.answered = false;

        $("q-count").textContent = "Câu " + (session.log.length + 1) + "/" + session.total;
        $("level-badge").textContent = "Mức: " + LEVEL_NAME[q.lv];
        $("q-progress").value = session.log.length;
        $("q-text").innerHTML = escapeHtml(q.q);

        optionsBox.textContent = "";
        order.forEach(function (originalIndex, pos) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "option";
            btn.setAttribute("data-pos", String(pos));

            var key = document.createElement("span");
            key.className = "option-key";
            key.textContent = KEYS[pos];

            var text = document.createElement("span");
            text.className = "option-text";
            text.innerHTML = escapeHtml(q.o[originalIndex]);

            btn.appendChild(key);
            btn.appendChild(text);
            btn.addEventListener("click", function () {
                answer(pos);
            });
            optionsBox.appendChild(btn);
        });

        feedback.textContent = "";
        feedback.className = "feedback";
        nextBtn.disabled = true;
        nextBtn.textContent = session.log.length + 1 === session.total ? "Xem kết quả" : "Câu tiếp theo";

        replayAnimation($("q-text"), "animate__fadeIn");
        replayAnimation(optionsBox, "animate__fadeInUp");

        if (session.config.timer) {
            startTimer();
        } else {
            timerEl.hidden = true;
        }
    }

    function answer(pos) {
        if (session.answered) {
            return;
        }
        session.answered = true;
        stopTimer();

        var cur = session.current;
        var q = cur.question;
        var timedOut = pos === -1;
        var correct = pos === cur.correctPos;

        Array.prototype.forEach.call(optionsBox.children, function (btn, i) {
            btn.disabled = true;
            if (i === cur.correctPos) {
                btn.classList.add("is-correct");
            } else if (i === pos) {
                btn.classList.add("is-wrong");
            } else {
                btn.classList.add("is-dim");
            }
        });

        feedback.textContent = "";
        feedback.className = "feedback " + (correct ? "is-ok" : "is-bad");
        feedback.appendChild(document.createTextNode(correct ? "Chính xác!" : timedOut ? "Hết giờ. Đáp án đúng là " + KEYS[cur.correctPos] + "." : "Chưa đúng. Đáp án đúng là " + KEYS[cur.correctPos] + "."));
        if (session.config.explain) {
            var note = document.createElement("small");
            note.innerHTML = escapeHtml(q.e);
            feedback.appendChild(note);
        }

        updateAbility(q, correct);
        session.log.push({lv: q.lv, correct: correct});
        $("q-progress").value = session.log.length;
        nextBtn.disabled = false;
        nextBtn.focus({preventScroll: true});
    }

    nextBtn.addEventListener("click", function () {
        if (session.log.length >= session.total) {
            finish();
        } else {
            nextQuestion();
        }
    });

    $("btn-quit").addEventListener("click", function () {
        if (window.confirm("Thoát bài làm? Kết quả hiện tại sẽ không được lưu.")) {
            stopTimer();
            session = null;
            showView("idle");
        }
    });

    document.addEventListener("keydown", function (e) {
        if (viewQuiz.hidden || !session || session.answered) {
            return;
        }
        var tag = (e.target && e.target.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
            return;
        }
        var idx = ["1", "2", "3", "4"].indexOf(e.key);
        if (idx > -1) {
            answer(idx);
        }
    });

    /* ---------- 5. BỘ ĐẾM GIỜ ---------- */
    function startTimer() {
        var left = SECONDS_PER_QUESTION;
        timerEl.hidden = false;
        timerEl.classList.remove("is-low");
        timerEl.textContent = left + "s";
        timerId = window.setInterval(function () {
            left -= 1;
            timerEl.textContent = left + "s";
            timerEl.classList.toggle("is-low", left <= 8);
            if (left <= 0) {
                answer(-1);
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerId !== null) {
            window.clearInterval(timerId);
            timerId = null;
        }
    }

    /* ---------- 6. KẾT QUẢ & LỊCH SỬ ---------- */
    function finish() {
        var correctCount = session.log.filter(function (x) {
            return x.correct;
        }).length;
        var score = abilityScore(session.theta);
        var label = abilityLabel(score);
        var name = session.config.name;

        $("res-score").textContent = correctCount + "/" + session.total;
        $("res-ability").textContent = score + "/100";
        $("res-level").textContent = label;

        var badges = {
            "Nâng cao": {src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgcm9sZT0iaW1nIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibSIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZGUwNDciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZDk3NzA2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cG9seWdvbiBwb2ludHM9IjUyLDEwMCA0MCwxNTIgNjIsMTQyIDcyLDE1NiA4NCwxMDQiIGZpbGw9IiNiNDUzMDkiLz4KICA8cG9seWdvbiBwb2ludHM9IjEwOCwxMDAgMTIwLDE1MiA5OCwxNDIgODgsMTU2IDc2LDEwNCIgZmlsbD0iI2I0NTMwOSIgb3BhY2l0eT0iMC44NSIvPgogIDxjaXJjbGUgY3g9IjgwIiBjeT0iNzAiIHI9IjU2IiBmaWxsPSJ1cmwoI20pIi8+CiAgPGNpcmNsZSBjeD0iODAiIGN5PSI7MCIgcj0iNDQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI0IiBvcGFjaXR5PSIwLjY1Ii8+CiAgPHBvbHlnb24gcG9pbnRzPSI4MC4wLDM0LjAgODcuMSw1Mi4zIDEwNi42LDUzLjMgOTEuNCw2NS43IDk2LjUsODQuNyA4MC4wLDc0LjAgNjMuNSw4NC43IDY4LjYsNjUuNyA1My40LDUzLjMgNzIuOSw1Mi4zIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHBvbHlnb24gcG9pbnRzPSI1MC4wLDExMS4wIDUyLjQsMTE2LjggNTguNiwxMTcuMiA1My44LDEyMS4yIDU1LjMsMTI3LjMgNTAuMCwxMjQuMCA0NC43LDEyNy4zIDQ2LjIsMTIxLjIgNDEuNCwxMTcuMiA0Ny42LDExNi44IiBmaWxsPSIjZmZmZmZmIi8+PHBvbHlnb24gcG9pbnRzPSI4MC4wLDExMS4wIDgyLjQsMTE2LjggODguNiwxMTcuMiA4My44LDEyMS4yIDg1LjMsMTI3LjMgODAuMCwxMjQuMCA3NC43LDEyNy4zIDc2LjIsMTIxLjIgNzEuNCwxMTcuMiA3Ny42LDExNi44IiBmaWxsPSIjZmZmZmZmIi8+PHBvbHlnb24gcG9pbnRzPSIxMTAuMCwxMTEuMCAxMTIuNCwxMTYuOCAxMTguNiwxMTcuMiAxMTMuOCwxMjEuMiAxMTUuMywxMjcuMyAxMTAuMCwxMjQuMCAxMDQuNywxMjcuMyAxMDYuMiwxMjEuMiAxMDEuNCwxMTcuMiAxMDcuNiwxMTYuOCIgZmlsbD0iI2ZmZmZmZiIvPgo8L3N2Zz4K", alt: "Huy hiệu ba sao cho xếp loại Nâng cao"},
            "Trung bình": {src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgcm9sZT0iaW1nIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibSIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNlMmU4ZjAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjQ3NDhiIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cG9seWdvbiBwb2ludHM9IjUyLDEwMCA0MCwxNTIgNjIsMTQyIDcyLDE1NiA4NCwxMDQiIGZpbGw9IiM0NzU1NjkiLz4KICA8cG9seWdvbiBwb2ludHM9IjEwOCwxMDAgMTIwLDE1MiA5OCwxNDIgODgsMTU2IDc2LDEwNCIgZmlsbD0iIzQ3NTU2OSIgb3BhY2l0eT0iMC44NSIvPgogIDxjaXJjbGUgY3g9IjgwIiBjeT0iNzAiIHI9IjU2IiBmaWxsPSJ1cmwoI20pIi8+CiAgPGNpcmNsZSBjeD0iODAiIGN5PSI3MCIgcj0iNDQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI4IiBvcGFjaXR5PSIwLjY1Ii8+CiAgPHBvbHlnb24gcG9pbnRzPSI4MC4wLDM0LjAgODcuMSw1Mi4zIDEwNi42LDUzLjMgOTEuNCw2NS43IDk2LjUsODQuNyA4MC4wLDc0LjAgNjMuNSw4NC43IDY4LjYsNjUuNyA1My40LDUzLjMgNzIuOSw1Mi4zIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHBvbHlnb24gcG9pbnRzPSI2NS4wLDExMS4wIDY3LjQsMTE2LjggNzMuNiwxMTcuMiA2OC44LDEyMS4yIDcwLjMsMTI3LjMgNjUuMCwxMjQuMCA1OS43LDEyNy4zIDYxLjIsMTIxLjIgNTYuNCwxMTcuMiA2Mi42LDExNi44IiBmaWxsPSIjZmZmZmZmIi8+PHBvbHlnb24gcG9pbnRzPSI5NS4wLDExMS4wIDk3LjQsMTE2LjggMTAzLjYsMTE3LjIgOTguOCwxMjEuMiAxMDAuMywxMjcuMyA5NS4wLDEyNC4wIDg5LjcsMTI3LjMgOTEuMiwxMjEuMiA4Ni40LDExNy4yIDkyLjYsMTE2LjgiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+Cg==", alt: "Huy hiệu hai sao cho xếp loại Trung bình"},
            "Cơ bản": {src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgcm9sZT0iaW1nIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibSIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNlMGEwNzAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjYTA1NzJhIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cG9seWdvbiBwb2ludHM9IjUyLDEwMCA0MCwxNTIgNjIsMTQyIDcyLDE1NiA4NCwxMDQiIGZpbGw9IiM3YzNmMWQiLz4KICA8cG9seWdvbiBwb2ludHM9IjEwOCwxMDAgMTIwLDE1MiA5OCwxNDIgODgsMTU2IDc2LDEwNCIgZmlsbD0iIzdjM2YxZCIgb3BhY2l0eT0iMC44NSIvPgogIDxjaXJjbGUgY3g9IjgwIiBjeT0iNzAiIHI9IjU2IiBmaWxsPSJ1cmwoI20pIi8+CiAgPGNpcmNsZSBjeD0iODAiIGN5PSI3MCIgcj0iNDQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI0IiBvcGFjaXR5PSIwLjY1Ii8+CiAgPHBvbHlnb24gcG9pbnRzPSI4MC4wLDM0LjAgODcuMSw1Mi4zIDEwNi42LDUzLjMgOTEuNCw2NS43IDk2LjUsODQuNyA4MC4wLDc0LjAgNjMuNSw4NC43IDY4LjYsNjUuNyA1My40LDUzLjMgNzIuOSw1Mi4zIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHBvbHlnb24gcG9pbnRzPSI4MC4wLDExMS4wIDgyLjQsMTE2LjggODguNiwxMTcuMiA4My44LDEyMS4yIDg1LjMsMTI3LjMgODAuMCwxMjQuMCA3NC43LDEyNy4zIDc2LjIsMTIxLjIgNzEuNCwxMTcuMiA3Ny42LDExNi44IiBmaWxsPSIjZmZmZmZmIi8+Cjwvc3ZnPgo=", alt: "Huy hiệu một sao cho xếp loại Cơ bản"}
        };
        var badgeImg = $("res-badge");
        badgeImg.src = badges[label].src;
        badgeImg.alt = badges[label].alt;
        replayAnimation(badgeImg, "animate__bounceIn");

        var messages = {
            "Nâng cao": "bạn trả lời ổn định ở các câu khó. Hãy thử chủ đề khác hoặc bắt đầu ngay ở mức Khó để thử thách hơn.",
            "Trung bình": "nền tảng của bạn khá vững. Ôn lại các câu sai ở mức trung bình rồi thử làm lại để tiến lên mức khó.",
            "Cơ bản": "bạn đang ở giai đoạn xây nền. Hãy luyện thêm các câu cơ bản, hệ thống sẽ tăng độ khó khi bạn sẵn sàng."
        };
        $("res-msg").textContent = "Chào " + name + ", " + messages[label];

        var path = $("path");
        path.textContent = "";
        session.log.forEach(function (item, i) {
            var col = document.createElement("div");
            col.className = "bar-col";
            var bar = document.createElement("div");
            bar.className = "bar lv-" + item.lv + " " + (item.correct ? "ok" : "bad");
            bar.title = "Câu " + (i + 1) + ": mức " + LEVEL_NAME[item.lv] + (item.correct ? ", đúng" : ", sai");
            var lbl = document.createElement("div");
            lbl.className = "bar-label";
            lbl.textContent = String(i + 1);
            col.appendChild(bar);
            col.appendChild(lbl);
            path.appendChild(col);
        });

        if (session.config.save) {
            var list = store(HISTORY_KEY) || [];
            list.unshift({
                topic: session.config.topic,
                score: correctCount,
                total: session.total,
                ability: score,
                label: label,
                time: new Date().toISOString()
            });
            store(HISTORY_KEY, list.slice(0, MAX_HISTORY));
        }

        renderHistory();
        showView("result");
        var heading = viewResult.querySelector("h4");
        heading.setAttribute("tabindex", "-1");
        heading.focus({preventScroll: true});
    }

    function renderHistory() {
        var list = store(HISTORY_KEY) || [];
        var box = $("history-list");
        box.textContent = "";
        $("btn-clear-history").hidden = list.length === 0;

        if (list.length === 0) {
            var empty = document.createElement("li");
            empty.className = "history-empty";
            empty.textContent = "Chưa có lần làm bài nào được lưu.";
            box.appendChild(empty);
            return;
        }

        list.forEach(function (item) {
            var li = document.createElement("li");
            var title = document.createElement("strong");
            title.textContent = item.topic === "mix" ? "Tổng hợp" : TOPICS[item.topic] || item.topic;
            var result = document.createElement("span");
            result.textContent = item.score + "/" + item.total + " đúng · " + item.label + " (" + item.ability + ")";
            var date = document.createElement("span");
            date.className = "h-date";
            date.textContent = new Date(item.time).toLocaleString("vi-VN", {day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"});
            li.appendChild(title);
            li.appendChild(result);
            li.appendChild(date);
            box.appendChild(li);
        });
    }

    $("btn-clear-history").addEventListener("click", function () {
        if (window.confirm("Xóa toàn bộ lịch sử làm bài trên máy này?")) {
            store(HISTORY_KEY, []);
            renderHistory();
        }
    });

    $("btn-again").addEventListener("click", function () {
        startSession(session.config);
    });

    $("btn-back").addEventListener("click", function () {
        session = null;
        showView("idle");
        form.scrollIntoView({behavior: "smooth", block: "start"});
        form.elements.topic.focus({preventScroll: true});
    });

    /* ---------- KHỞI TẠO ---------- */
    renderHistory();
    showView("idle");
})();