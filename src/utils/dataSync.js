import crypto from "crypto";
import * as cheerio from "cheerio";
import { index } from "@/configs/pinecone";
import { generateEmbedding } from "@/utils/embedding";
import { chunkText } from "@/utils/chunking";
import Projects from "@/Data/Projects.json";
import Skills from "@/Data/skills";
import Experience from "@/Data/Experience.json";
import ContactInfo from "@/Data/ContactInfo.json";

const MAX_CHUNK_CHARS = 900;
const HEADING_TAGS = ["h1", "h2", "h3"];

const markerId = (source) => `sync:${source}:meta`;
const chunkId = (source, chunkIdx) => `sync:${source}:${chunkIdx}`;

const computeHash = (value) =>
    crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

const SOURCE_CONFIG = {
    projects: {
        cat: "project",
        getHashable: () => Projects,
        getGroups: () =>
            Projects.map((p) => ({
                title: p.title,
                text: `${p.title}. ${p.description} Technologies: ${(p.technologies || []).join(", ")}. Image: ${p.img || "none"}. Live URL: ${p.url || "n/a"}.${p.gitHub ? ` GitHub: ${p.gitHub}` : ""}`,
            })),
    },
    skills: {
        cat: "skill",
        getHashable: () => Skills.map((s) => ({ name: s.name, level: s.level, color: s.color })),
        getGroups: () => {
            const list = Skills.map((s) => `${s.name} (${s.level}%)`).join(", ");
            return [{ title: "Skills", text: `Davood's technical skills and proficiency levels: ${list}.` }];
        },
    },
    experience: {
        cat: "experience",
        getHashable: () => Experience,
        getGroups: () =>
            Experience.map((e) => ({
                title: e.title,
                text: `${e.title} (${e.date}). ${e.description}\n\n${e.full_discription || ""}`,
            })),
    },
};

const buildChunksFromGroups = (groups, extraMetadata = {}) => {
    const chunks = [];
    for (const group of groups) {
        const pieces = chunkText(group.text, { maxChars: MAX_CHUNK_CHARS });
        pieces.forEach((piece, idx) => {
            chunks.push({
                title: group.title,
                text: pieces.length > 1 ? `[${group.title} — part ${idx + 1}]\n${piece}` : piece,
                ...extraMetadata,
            });
        });
    }
    return chunks;
};

const getSyncMarker = async (source) => {
    const id = markerId(source);
    const result = await index.fetch([id]);
    const metadata = result?.records?.[id]?.metadata;
    if (!metadata) return null;
    return {
        contentHash: metadata.contentHash || null,
        chunkCount: Number(metadata.chunkCount) || 0,
        lastSyncedAt: metadata.lastSyncedAt || null,
    };
};

const writeSyncMarker = async (source, { contentHash, chunkCount }) => {
    const values = await generateEmbedding(`sync-marker:${source}`);
    await index.upsert([
        {
            id: markerId(source),
            values,
            metadata: {
                kind: "sync-marker",
                source,
                contentHash: contentHash || "",
                chunkCount,
                lastSyncedAt: new Date().toISOString(),
            },
        },
    ]);
};

const deleteOldChunks = async (source, oldCount) => {
    if (!oldCount) return;
    const ids = Array.from({ length: oldCount }, (_, i) => chunkId(source, i));
    await index.deleteMany(ids);
};

const embedAndUpsertChunks = async (source, cat, chunks) => {
    const now = new Date().toISOString();
    const vectors = [];
    for (let i = 0; i < chunks.length; i++) {
        const { title, text, section } = chunks[i];
        const values = await generateEmbedding(text);
        vectors.push({
            id: chunkId(source, i),
            values,
            metadata: {
                title,
                text,
                cat,
                ...(section ? { section } : {}),
                tags: [source],
                source: source === "resume" ? "resume-sync" : "data-sync",
                dataSource: source,
                chunkIndex: i,
                createdAt: now,
                timestamp: now,
            },
        });
    }
    if (vectors.length) await index.upsert(vectors);
    return vectors.length;
};

export const getSyncStatus = async () => {
    const sources = Object.keys(SOURCE_CONFIG);
    const results = [];
    for (const source of sources) {
        const contentHash = computeHash(SOURCE_CONFIG[source].getHashable());
        const marker = await getSyncMarker(source);
        results.push({
            source,
            hasNewData: !marker || marker.contentHash !== contentHash,
            lastSyncedAt: marker?.lastSyncedAt || null,
        });
    }

    const resumeMarker = await getSyncMarker("resume");
    results.push({
        source: "resume",
        hasNewData: undefined,
        lastSyncedAt: resumeMarker?.lastSyncedAt || null,
    });

    return results;
};

export const runSync = async (source) => {
    const config = SOURCE_CONFIG[source];
    if (!config) throw new Error(`Unknown sync source: ${source}`);

    const contentHash = computeHash(config.getHashable());
    const chunks = buildChunksFromGroups(config.getGroups());

    const marker = await getSyncMarker(source);
    const oldCount = marker?.chunkCount || 0;

    await deleteOldChunks(source, oldCount);
    const added = await embedAndUpsertChunks(source, config.cat, chunks);
    await writeSyncMarker(source, { contentHash, chunkCount: added });

    return { removed: oldCount, added };
};

const fetchResumeSections = async (url) => {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioResumeSync/1.0)" } });
    if (!res.ok) throw new Error(`Failed to fetch resume (status ${res.status})`);
    const html = await res.text();
    const $ = cheerio.load(html);
    $("script, style, nav, noscript, head").remove();

    const sections = [];
    let currentTitle = "Profile";
    let currentText = [];

    const flush = () => {
        const text = currentText.join(" ").replace(/\s+/g, " ").trim();
        if (text) sections.push({ title: currentTitle, text });
        currentText = [];
    };

    const walk = (node) => {
        $(node)
            .contents()
            .each((_, child) => {
                if (child.type === "tag" && HEADING_TAGS.includes(child.name)) {
                    flush();
                    currentTitle = $(child).text().trim() || currentTitle;
                } else if (child.type === "tag") {
                    walk(child);
                } else if (child.type === "text") {
                    const t = $(child).text().trim();
                    if (t) currentText.push(t);
                }
            });
    };

    walk($("body").get(0));
    flush();

    return sections.filter((s) => s.text.length > 0);
};

export const runResumeSync = async () => {
    const contact = ContactInfo[0];
    const url = contact?.resume;
    if (!url) throw new Error("No resume URL configured in ContactInfo.json");

    const sections = await fetchResumeSections(url);
    const groups = sections.map((s) => ({ title: s.title, text: s.text }));
    const chunks = buildChunksFromGroups(groups).map((chunk) => ({
        ...chunk,
        section: chunk.title,
    }));

    const marker = await getSyncMarker("resume");
    const oldCount = marker?.chunkCount || 0;

    await deleteOldChunks("resume", oldCount);
    const added = await embedAndUpsertChunks("resume", "resume", chunks);
    await writeSyncMarker("resume", { contentHash: computeHash({ crawledAt: new Date().toISOString().slice(0, 10) }), chunkCount: added });

    return { removed: oldCount, added };
};
