from flask import Flask, render_template, request, jsonify
import torch
from PIL import Image
from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer
import base64
import io

app = Flask(__name__)

# Load the models
model = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
feature_extractor = ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate_caption', methods=['POST'])
def generate_caption():
    try:
        image_data = request.json['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        pixel_values = feature_extractor(image, return_tensors="pt").pixel_values.to(device)
        
        with torch.no_grad():
            output_ids = model.generate(pixel_values, max_length=50, num_beams=4)
        
        caption = tokenizer.decode(output_ids[0], skip_special_tokens=True)
        return jsonify({'caption': caption})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)