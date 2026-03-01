import os
from PIL import Image

def generate_icons():
    # Paths are relative to the root of the project
    os.makedirs('assets', exist_ok=True)
    base_image_path = 'assets/icon128.png'
    
    if not os.path.exists(base_image_path):
        print(f"Error: {base_image_path} not found.")
        return
        
    try:
        with Image.open(base_image_path) as img:
            sizes = [16, 32, 48, 128]
            
            for size in sizes:
                resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
                output_path = f'assets/icon{size}.png'
                resized_img.save(output_path)
                print(f"Generated {output_path}")
                
    except Exception as e:
        print(f"Error generating icons: {e}")

if __name__ == "__main__":
    generate_icons()
