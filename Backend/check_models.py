import google.generativeai as genai
import os
import json

genai.configure(api_key='AIzaSyCt4aum9BaPxl5KzGhB-aNKQ3HlQ8ncINk')

models = []
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            models.append(m.name)
    with open('models.txt', 'w') as f:
        json.dump(models, f)
except Exception as e:
    with open('models.txt', 'w') as f:
        f.write(str(e))
