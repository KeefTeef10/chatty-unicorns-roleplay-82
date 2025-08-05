# Building an LLM App in Google Colab with Gemini CLI

This guide shows how to prototype a simple large language model (LLM) application in [Google Colab](https://colab.research.google.com/) using Google's Gemini models via the Gemini CLI.

## 1. Get an API key
1. Visit [Google AI Studio](https://ai.google.dev/).
2. Create or reuse a project and generate a **Gemini API key**.

## 2. Start a new Colab notebook
1. Open [Google Colab](https://colab.research.google.com/) and create a notebook.
2. In the first cell, install the Gemini CLI and Python SDK:
   ```python
   !pip install -q gemini-cli google-generativeai
   ```

## 3. Configure authentication
Store your API key in an environment variable so both the CLI and the SDK can access it:
```python
import os
os.environ["GEMINI_API_KEY"] = "YOUR_API_KEY_HERE"  # replace with your key
```

## 4. Try the Gemini CLI
You can interact with the model directly from the terminal inside Colab:
```python
!python -m gemini_cli "Write a haiku about coding" -t $GEMINI_API_KEY
```
Use `--help` for more options:
```python
!python -m gemini_cli --help | head -n 20
```

## 5. Call Gemini from Python
For more control, use the official Python SDK:
```python
import google.generativeai as genai

# Configure the client
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

# Generate text
response = model.generate_content("Summarize the benefits of notebooks for prototyping.")
print(response.text)
```

## 6. Build your app
With the basics working, you can encapsulate model calls in functions, integrate user input, or expose the model behind a web or CLI interface. Colab's interactive notebooks make it easy to iterate, while the Gemini CLI offers quick one-off prompts for experimentation.

