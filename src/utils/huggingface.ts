export async function generateHuggingFaceResponse(prompt: string, model = "gpt2"): Promise<string> {
  const apiToken = import.meta.env.VITE_HF_API_KEY;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiToken) {
    headers["Authorization"] = `Bearer ${apiToken}`;
  }

  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) {
    throw new Error(`HuggingFace inference failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) && data.length > 0 ? data[0].generated_text || "" : "";
}
