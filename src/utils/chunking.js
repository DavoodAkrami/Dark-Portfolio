const DEFAULT_MAX_CHARS = 1000;

const splitIntoSentences = (text) => {
    return text.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).filter(Boolean);
};

export const chunkText = (text, { maxChars = DEFAULT_MAX_CHARS } = {}) => {
    const clean = (text || "").trim();
    if (!clean) return [];
    if (clean.length <= maxChars) return [clean];

    const paragraphs = clean.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const units = [];
    for (const paragraph of paragraphs) {
        if (paragraph.length <= maxChars) {
            units.push(paragraph);
        } else {
            units.push(...splitIntoSentences(paragraph));
        }
    }

    const chunks = [];
    let current = "";
    for (const unit of units) {
        if (unit.length > maxChars) {
            if (current) {
                chunks.push(current);
                current = "";
            }
            for (let i = 0; i < unit.length; i += maxChars) {
                chunks.push(unit.slice(i, i + maxChars).trim());
            }
            continue;
        }
        const candidate = current ? `${current} ${unit}` : unit;
        if (candidate.length > maxChars) {
            if (current) chunks.push(current);
            current = unit;
        } else {
            current = candidate;
        }
    }
    if (current) chunks.push(current);

    return chunks.filter(Boolean);
};
