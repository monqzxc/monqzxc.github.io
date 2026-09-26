import { jsPDF } from "jspdf";
import type { CvData, CvEntry } from "./cv-data";

export type TextOp = { kind: "text"; text: string; x: number; y: number; size: number; bold: boolean; color: string; spacing: number };
export type LineOp = { kind: "line"; x: number; y: number; x2: number; y2: number; color: string; width: number };
export type CvPage = (TextOp | LineOp)[];
const W = 595.28, H = 841.89, BOTTOM = 784;
const normalize = (text: string) => text.normalize("NFC").replace(/[\u2010-\u2014\u2212]/g, "-").replace(/\u00a0/g, " ").replace(/[^\S\n]+/g, " ").trim();
let fontPromise: Promise<[string, string]> | undefined;
const toBase64 = (bytes: Uint8Array) => {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(binary);
};
async function fonts(): Promise<[string, string]> {
  if (!fontPromise) fontPromise = Promise.all(["regular", "semibold"].map(async weight => {
    const response = await fetch(`/fonts/cv-dm-sans-${weight}.ttf`);
    if (!response.ok) throw new Error("The CV fonts could not load. Please try again.");
    return toBase64(new Uint8Array(await response.arrayBuffer()));
  })).then(values => values as [string, string]).catch(error => { fontPromise = undefined; throw error; });
  return fontPromise;
}

/** One layout drives both the selectable-text PDF and its on-screen SVG proof. */
export async function createCvDocument(data: CvData, suppliedFonts?: [string, string]) {
  const fontData = suppliedFonts ?? await fonts();
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true, putOnlyUsedFonts: true });
  doc.addFileToVFS("CV-Regular.ttf", fontData[0]); doc.addFont("CV-Regular.ttf", "CV", "normal");
  doc.addFileToVFS("CV-Semibold.ttf", fontData[1]); doc.addFont("CV-Semibold.ttf", "CV", "bold");
  // Prevent a downloaded PDF from silently losing characters missing in the embedded font.
  doc.setFont("CV", "normal");
  const cmap = (doc.getFont().metadata as { cmap?: { unicode?: { codeMap?: Record<number, number> } } }).cmap?.unicode?.codeMap;
  if (cmap) {
    const missing = [...new Set([...normalize(JSON.stringify(data)).replace(/[\r\n\t]/g, "")].filter(c => !cmap[c.codePointAt(0)!]))];
    if (missing.length) throw new Error(`This template cannot render these characters yet: ${missing.slice(0, 8).join(" ")}. Please replace them to export.`);
  }
  const pages: CvPage[] = [[]];
  const width = (text: string, size: number, bold = false, spacing = 0) => {
    doc.setFont("CV", bold ? "bold" : "normal"); doc.setFontSize(size);
    return doc.getTextWidth(text) + Math.max(0, [...text].length - 1) * spacing;
  };
  const wrap = (raw: string, max: number, size: number, bold = false, spacing = 0) => {
    const result: string[] = [];
    for (const paragraph of normalize(raw).split("\n")) {
      if (!paragraph) { result.push(""); continue; }
      let line = "";
      for (const word of paragraph.split(/\s+/)) {
        if (line && width(`${line} ${word}`, size, bold, spacing) <= max) { line += ` ${word}`; continue; }
        if (line) { result.push(line); line = ""; }
        for (const char of word) {
          if (line && width(line + char, size, bold, spacing) > max) { result.push(line); line = ""; }
          line += char;
        }
      }
      if (line) result.push(line);
    }
    return result;
  };
  const line = (page: number, x: number, y: number, x2: number, y2: number, color = "#d1ced3", weight = 0.5) => pages[page].push({ kind: "line", x, y, x2, y2, color, width: weight });
  const text = (page: number, value: string, x: number, y: number, size: number, bold = false, color = "#36343b", spacing = 0) => pages[page].push({ kind: "text", text: value, x, y, size, bold, color, spacing });
  const nameLines = wrap((data.name.trim() || "Your name").toUpperCase(), W - 84, 26, false, 1.4);
  let headerY = 60;
  nameLines.forEach(value => { text(0, value, (W - width(value, 26, false, 1.4)) / 2, headerY, 26, false, "#25232a", 1.4); headerY += 32; });
  const roleLines = wrap((data.role.trim() || "Your professional title").toUpperCase(), W - 100, 10.2, false, 2);
  roleLines.forEach(value => { text(0, value, (W - width(value, 10.2, false, 2)) / 2, headerY + 1, 10.2, false, "#5c5861", 2); headerY += 15; });
  const startY = headerY + 37;
  line(0, 42, headerY + 15, W - 42, headerY + 15, "#99949f", 0.65);
  line(0, 215, startY - 8, 215, BOTTOM);
  const addPage = (index: number) => {
    if (index > 23) throw new Error("This CV is longer than 24 pages. Please shorten your entries.");
    while (pages.length <= index) {
      const p = pages.length; pages.push([]);
      text(p, data.name.trim() || "Your name", 42, 44, 12, true);
      text(p, "CURRICULUM VITAE", 42, 61, 8.5, false, "#716b78", 1);
      line(p, 42, 76, W - 42, 76); line(p, 215, 92, 215, BOTTOM);
    }
  };
  function column(x: number, max: number) {
    let page = 0, y = startY;
    const ensure = (height: number) => {
      if (y + height > BOTTOM) { page++; addPage(page); y = 100; }
    };
    const paragraph = (value: string, size = 9.4, bold = false, color = "#36343b", gap = 4, indent = 0) => {
      if (!value.trim()) return;
      const rows = wrap(value, max - indent, size, bold), leading = size * 1.38;
      if (rows.length * leading < 140) ensure(rows.length * leading + gap);
      rows.forEach(row => { ensure(leading); if (row) text(page, row, x + indent, y, size, bold, color); y += leading; });
      y += gap;
    };
    const heading = (label: string) => {
      ensure(63); text(page, label.toUpperCase(), x, y, 10, true, "#29262f", 1.2); y += 8;
      line(page, x, y, x + max, y); y += 17;
    };
    const entries = (label: string, values: CvEntry[], compact = false) => {
      const populated = values.filter(v => Object.values(v).some(value => value.trim()));
      if (!populated.length) return;
      heading(label);
      populated.forEach(entry => {
        const title = compact && entry.period && label !== "Professional development" ? `${entry.title} (${entry.period})` : entry.title;
        const estimated = wrap(title, max, 9.4, true).length * 13 + wrap(entry.organization, max, 9.1).length * 13 + (compact ? 0 : 15) + 10;
        ensure(Math.min(estimated, 120));
        paragraph(title, 9.4, true, "#2f2c35", 2);
        paragraph(label === "Professional development" ? [entry.organization, entry.period].filter(Boolean).join(" | ") : entry.organization, 9.1, false, "#49434f", 1);
        if (!compact) paragraph(entry.period, 8.8, false, "#706a75", 4);
        if (entry.details) entry.details.split("\n").filter(row => row.trim()).forEach(row => paragraph(`• ${row.replace(/^[•\-]\s*/, "")}`, 9.2, false, "#49434f", 2));
        y += compact ? 3 : 9;
      });
      y += 6;
    };
    return { paragraph, heading, entries, space: (n: number) => { y += n; } };
  }
  const left = column(42, 155), right = column(237, 316);
  const contact = [data.email, data.phone, data.location, data.website].filter(v => v.trim());
  if (contact.length) { left.heading("Contact"); contact.forEach(value => left.paragraph(value, 9.2, false, "#49434f", 5)); left.space(14); }
  left.entries("Education", data.education);
  if (data.skills.trim()) { left.heading("Skills"); left.paragraph(data.skills, 9.4, false, "#49434f", 18); }
  left.entries("Recognition", data.awards, true);
  if (data.interests.trim()) { left.heading("Interests"); left.paragraph(data.interests, 9.2); }
  if (data.summary.trim()) { right.heading("Profile"); right.paragraph(data.summary, 9.6, false, "#49434f", 17); }
  right.entries("Experience", data.experience);
  if (data.eligibility.trim()) { right.heading("Eligibility"); right.paragraph(data.eligibility, 9.2, false, "#49434f", 14); }
  right.entries("Professional development", data.training, true);
  pages.forEach((ops, index) => {
    text(index, `${index + 1} / ${pages.length}`, W - 63, H - 24, 8, false, "#817a87");
    if (index) doc.addPage();
    ops.forEach(op => {
      if (op.kind === "line") { doc.setDrawColor(op.color); doc.setLineWidth(op.width); doc.line(op.x, op.y, op.x2, op.y2); }
      else { doc.setFont("CV", op.bold ? "bold" : "normal"); doc.setFontSize(op.size); doc.setTextColor(op.color); doc.setCharSpace(op.spacing); doc.text(op.text, op.x, op.y); }
    });
  });
  doc.setProperties({ title: `${data.name.trim() || "My"} - CV`, subject: data.role, author: data.name, creator: "Mon CV Studio" });
  const filename = `${data.name.trim().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-") || "My"}-CV.pdf`;
  return { doc, pages, filename, width: W, height: H };
}
