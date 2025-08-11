import os

import torch
from diffusers import DiffusionPipeline
import gradio as gr

MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0"

def load_pipeline():
    """Load the Stable Diffusion XL pipeline."""
    device = "cuda" if torch.cuda.is_available() else "cpu"
    torch_dtype = torch.float16 if device == "cuda" else torch.float32
    kwargs = {
        "torch_dtype": torch_dtype,
        "use_safetensors": True,
    }
    if device == "cuda":
        kwargs["variant"] = "fp16"
    token = os.getenv("HF_TOKEN")
    if token:
        kwargs["use_auth_token"] = token
    pipe = DiffusionPipeline.from_pretrained(MODEL_ID, **kwargs)
    pipe.to(device)
    return pipe

PIPELINE = load_pipeline()


def generate(prompt: str):
    """Generate an image from the given prompt."""
    image = PIPELINE(prompt).images[0]
    return image


interface = gr.Interface(
    fn=generate,
    inputs=gr.Textbox(label="Prompt"),
    outputs=gr.Image(label="Generated image"),
    title="Stable Diffusion XL",
    description="Generate images using the Stable Diffusion XL model from Hugging Face.",
)

if __name__ == "__main__":
    interface.launch()
