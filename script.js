const IMAGE_COUNT = 100;
const IMAGE_PREFIX = "ffhq_";
const INPUT_EXTENSION = ".png";
const OUTPUT_EXTENSION = ".jpg";

const imageSelect = document.getElementById("imageSelect");
const predictBtn = document.getElementById("predictBtn");
const resetBtn = document.getElementById("resetBtn");
const statusMessage = document.getElementById("statusMessage");

const inputFrame = document.getElementById("inputFrame");
const outputFrame = document.getElementById("outputFrame");
const inputPreview = document.getElementById("inputPreview");
const outputPreview = document.getElementById("outputPreview");

const buildPath = (folder, fileBase, ext) => `${folder}/${fileBase}${ext}`;
const dataset = Array.from({ length: IMAGE_COUNT }, (_, idx) => `${IMAGE_PREFIX}${idx}`);

const setStatus = (message, tone = "neutral") => {
    statusMessage.textContent = message;
    statusMessage.classList.remove("hidden", "positive", "negative");
    if (tone === "positive") statusMessage.classList.add("positive");
    if (tone === "negative") statusMessage.classList.add("negative");
};

const resetFrames = () => {
    [inputPreview, outputPreview].forEach((img) => {
        img.removeAttribute("src");
    });
    inputFrame.classList.add("empty");
    outputFrame.classList.add("empty");
};

const loadInputImage = (baseName) => {
    const inputSrc = buildPath("image_input", baseName, INPUT_EXTENSION);
    inputPreview.src = inputSrc;
    inputFrame.classList.remove("empty");
};

const loadOutputImage = (baseName) => {
    const outputSrc = buildPath("image_output", baseName, OUTPUT_EXTENSION);
    outputPreview.src = outputSrc;
    outputFrame.classList.remove("empty");
};

const populateSelect = () => {
    const fragment = document.createDocumentFragment();
    dataset.forEach((baseName, i) => {
        const option = document.createElement("option");
        option.value = baseName;
        option.textContent = `Image ${i + 1} — ${baseName}`;
        fragment.appendChild(option);
    });
    imageSelect.appendChild(fragment);
};

predictBtn.addEventListener("click", () => {
    const selected = imageSelect.value;
    if (!selected) {
        setStatus("Pick one of the prepared inputs before predicting.", "negative");
        imageSelect.classList.add("shake");
        setTimeout(() => imageSelect.classList.remove("shake"), 400);
        return;
    }

    loadOutputImage(selected);
    setStatus(`YOLOv8 prediction ready for ${selected}.`, "positive");
});

resetBtn.addEventListener("click", () => {
    imageSelect.selectedIndex = 0;
    resetFrames();
    setStatus("Selections cleared. Choose another image to continue.");
});

imageSelect.addEventListener("change", () => {
    const selected = imageSelect.value;
    if (!selected) return;
    loadInputImage(selected);
    outputFrame.classList.add("empty");
    outputPreview.removeAttribute("src");
    setStatus(`Input ${selected} loaded. Press predict to analyze.`);
});

populateSelect();
setStatus("Select an image to begin.");
