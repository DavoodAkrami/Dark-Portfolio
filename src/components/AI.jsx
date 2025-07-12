"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AIjson from "@/Data/AI.json";

const OPENAI_ENDPOINT = "https://api.metisai.ir/openai/v1";
const OPENAI_API_KEY = "tpsg-9lTEHMaGpSJgNSPi7Kj8cFfe6VpE2MC";
const EMBED_MODEL = "text-embedding-3-small";
const CHAT_MODEL = "gpt-3.5-turbo";

const fetchEmbedding = async (text) => {
  const res = await fetch(`${OPENAI_ENDPOINT}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: text,
    }),
  });
  const data = await res.json();
  return data.data[0].embedding;
};

const cosineSim = (a, b) => {
  let dot = 0, aMag = 0, bMag = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    aMag += a[i] ** 2;
    bMag += b[i] ** 2;
  }
  return dot / (Math.sqrt(aMag) * Math.sqrt(bMag));
};

const AskAI = ({ layoutId }) => {
  const [ready, setReady] = useState(false);
  const [embeds, setEmbeds] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const buildEmbeds = async () => {
      const items = [
        ...AIjson.personal.map((it) => ({ id: `personal-${it.id}`, text: it.text })),
        ...AIjson["my hard skills"].map((it, idx) => ({
          id: `skill-${idx}`,
          text: `${it.name} skill level is ${it.level}`,
        })),
      ];
      const out = [];
      for (const it of items) {
        if (!it.text.trim()) continue;
        const vec = await fetchEmbedding(it.text);
        out.push({ ...it, vec });
      }
      setEmbeds(out);
      setReady(true);
    };
    buildEmbeds();
  }, []);

  const handleAsk = async () => {
    if (!ready || !question.trim()) return;
    setLoading(true);
    setAnswer("");
    const qVec = await fetchEmbedding(question);
    let best = { sim: -1, text: "" };
    embeds.forEach((item) => {
      const sim = cosineSim(qVec, item.vec);
      if (sim > best.sim) best = { sim, text: item.text };
    });
    setQuestion("");
    const res = await fetch(`${OPENAI_ENDPOINT}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          {
            role: "system",
            content: `Use only the following context to answer the question:\n${best.text}`,
          },
          { role: "user", content: question },
        ],
        max_tokens: 150,
      }),
    });
    const data = await res.json();
    setAnswer(data.choices?.[0]?.message?.content || "An error occurred.");
    setLoading(false);
  };

  return (
    <motion.div
      layoutId={layoutId}
      className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl mx-auto "
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">Ask Your Personal AI</h2>
      {!ready && <p className="text-gray-500">Preparing AI context...</p>}
      {ready && (
        <>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-sm"
            placeholder="Type your question here..."
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Loading..." : "Ask AI"}
          </button>
          {answer && (
            <div className="mt-4 p-4 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-800 whitespace-pre-wrap">
              {answer}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AskAI;
