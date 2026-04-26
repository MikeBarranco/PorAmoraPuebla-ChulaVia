import os
from PIL import Image

def procesar_imagenes():
    input_dir = '.'
    output_dir = './listas_para_web'
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Directorio creado: {output_dir}")

    extensiones = ('.jpg', '.jpeg', '.png')
    
    print("Iniciando compresión de imágenes...")
    
    # Recorrer la carpeta actual y subcarpetas (como 'Equipo')
    for root, dirs, files in os.walk(input_dir):
        if 'listas_para_web' in root: continue # No procesar la salida
        
        for file in files:
            if file.lower().endswith(extensiones):
                path_completo = os.path.join(root, file)
                try:
                    img = Image.open(path_completo)
                    img = img.convert('RGB') # Asegurar compatibilidad
                    
                    # Redimensionar (máximo 800px)
                    img.thumbnail((800, 800))
                    
                    # Nombre de salida (quitando espacios y cosas raras)
                    nombre_limpio = file.replace(' ', '_').lower()
                    path_salida = os.path.join(output_dir, f"chula_{nombre_limpio}")
                    
                    # Guardar con compresión fuerte
                    img.save(path_salida, format='JPEG', quality=60, optimize=True)
                    
                    peso_original = os.path.getsize(path_completo) / 1024
                    peso_final = os.path.getsize(path_salida) / 1024
                    
                    print(f"OK {file}: {peso_original:.1f}KB -> {peso_final:.1f}KB")
                except Exception as e:
                    print(f"ERROR con {file}: {e}")

    print("\n¡Listo! Todas las fotos comprimidas están en 'img/listas_para_web'")
    print("Úsalas para subir a los perfiles de transportistas sin saturar la base de datos.")

if __name__ == "__main__":
    procesar_imagenes()
