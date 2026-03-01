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
            sizes = [16, 32, 48, 128, 300]
            
            for size in sizes:
                resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
                output_path = f'assets/icon{size}.png'
                resized_img.save(output_path)
                print(f"Generated {output_path}")

            # Generate Edge Promoted Tile (440x280)
            # Create a 440x280 background (e.g., transparent or a brand color)
            # Here we create a transparent background and center the 128x128 icon on it.
            tile = Image.new('RGBA', (440, 280), (255, 255, 255, 0))
            icon128 = img.resize((128, 128), Image.Resampling.LANCZOS)
            
            # center position
            x = (440 - 128) // 2
            y = (280 - 128) // 2
            tile.paste(icon128, (x, y))
            
            tile_path = 'assets/edge_promotional_tile_440x280.png'
            tile.save(tile_path)
            print(f"Generated {tile_path}")

    except Exception as e:
        print(f"Error generating icons: {e}")

if __name__ == "__main__":
    generate_icons()
