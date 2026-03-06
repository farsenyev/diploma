import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();
const PORT = 3001;

const INTERACTIVE_SELECTORS = [
    "a",
    "button",
    "input",
    "select",
    "textarea",
    "[tabindex]",
    '[role="button"]',
    '[role="link"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[role="tab"]',
    '[role="menuitem"]'
];

const SCALE_FACTORS = [1.5, 2];

app.use(cors());
app.use(express.json());

app.post("/api/page-snapshot", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL не указан" });
    }

    let browser;

    try {
        browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 30000
        });

        const snapshot = await page.evaluate(
            (selectors, scaleFactors) => {
                const html = document.documentElement.outerHTML;

                const elements = Array.from(
                    document.querySelectorAll(
                        "p, span, h1, h2, h3, h4, h5, h6, a, button"
                    )
                ).map(el => {
                    const style = window.getComputedStyle(el);

                    return {
                        tag: el.tagName,
                        id: el.id || "",
                        className: el.className || "",
                        text: el.innerText?.trim() || "",
                        textColor: style.color,
                        bgColor: style.backgroundColor,
                        fontSize: style.fontSize,
                        fontWeight: style.fontWeight
                    };
                });

                const keyboardElements = Array.from(
                    document.querySelectorAll(selectors.join(","))
                ).map(el => {
                    const style = window.getComputedStyle(el);
                    const tag = el.tagName.toLowerCase();
                    const isNaturallyFocusable = [
                        "a",
                        "button",
                        "input",
                        "select",
                        "textarea"
                    ].includes(tag);

                    return {
                        tag,
                        id: el.id || "",
                        ariaLabel: el.getAttribute("aria-label") || "",
                        tabIndexAttr: el.getAttribute("tabindex"),
                        isNaturallyFocusable,
                        display: style.display,
                        visibility: style.visibility,
                        opacity: style.opacity,
                        outlineStyle: style.outlineStyle,
                        outlineWidth: style.outlineWidth
                    };
                });

                const mediaElements = [
                    ...Array.from(document.querySelectorAll("video")).map(video => {
                        const tracks = Array.from(
                            video.querySelectorAll(
                                'track[kind="subtitles"], track[kind="captions"]'
                            )
                        );

                        return {
                            type: "video",
                            id: video.id || "",
                            hasCaptionsOrSubtitles: tracks.length > 0
                        };
                    }),

                    ...Array.from(document.querySelectorAll("audio")).map(audio => {
                        const nextTag =
                            audio.nextElementSibling?.tagName?.toLowerCase() || "";

                        return {
                            type: "audio",
                            id: audio.id || "",
                            hasAriaDescribedBy: !!audio.getAttribute("aria-describedby"),
                            hasAdjacentDescription: nextTag === "div"
                        };
                    })
                ];

                const scalabilityIssues = [];

                scaleFactors.forEach(scale => {
                    const visibleElements = Array.from(
                        document.body.querySelectorAll("body *")
                    ).filter(el => el.offsetParent !== null);

                    visibleElements.forEach(el => {
                        const originalTransform = el.style.transform;
                        const originalOrigin = el.style.transformOrigin;

                        el.style.transformOrigin = "top left";
                        el.style.transform = `scale(${scale})`;

                        const rect = el.getBoundingClientRect();
                        const parent = el.parentElement;

                        if (parent) {
                            const exceedsWidth = rect.width > parent.clientWidth;
                            const exceedsHeight = rect.height > parent.clientHeight;

                            if (exceedsWidth || exceedsHeight) {
                                scalabilityIssues.push({
                                    tag: el.tagName.toLowerCase(),
                                    id: el.id || "",
                                    scale,
                                    exceedsWidth,
                                    exceedsHeight
                                });
                            }
                        }

                        el.style.transform = originalTransform;
                        el.style.transformOrigin = originalOrigin;
                    });
                });

                return {
                    html,
                    elements,
                    keyboardElements,
                    mediaElements,
                    scalabilityIssues
                };
            },
            INTERACTIVE_SELECTORS,
            SCALE_FACTORS
        );

        res.json(snapshot);
    } catch (err) {
        console.error("page-snapshot error:", err);
        res.status(500).json({
            error: "Не удалось получить snapshot страницы"
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});