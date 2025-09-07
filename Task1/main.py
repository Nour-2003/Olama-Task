from openai import OpenAI

# Tell OpenAI client to use Ollama's API
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

# Send a message to the local model (llama3 in this case)
response = client.chat.completions.create(
    model="gemma3:4b",  # Make sure this model is installed with "ollama run llama3"
    messages=[
        {"role": "user", "content": "how are you"}
    ]
)

message_content = response.choices[0].message.content
print(message_content)