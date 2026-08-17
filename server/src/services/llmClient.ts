import { OpenAI } from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function extractNotesFromText(text: string) {
  const model = process.env.OPENAI_LLM_MODEL || "openai/gpt-oss-120b";
  const prompt = `Aşağıdaki parfüm açıklamasından sadece JSON formatında "top", "middle", "base" dizilerini çıkart. Örnek format:\n{"top":["..."], "middle":["..."], "base":["..."]}\n\nMetin:\n"""${text}"""\n`;
  const resp = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400,
    temperature: 0
  });
  const content = resp.choices?.[0]?.message?.content ?? "";
  try {
    // Basit parse: modelin JSON döndüreceğini varsay
    const jsonStart = content.indexOf("{");
    const json = jsonStart >= 0 ? content.slice(jsonStart) : content;
    return JSON.parse(json);
  } catch (e) {
    // fallback: minimal regex/heuristic parse not implemented here
    throw new Error("LLM parse failed: " + (e as Error).message + " | raw:" + content);
  }
}
