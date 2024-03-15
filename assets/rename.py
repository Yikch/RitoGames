import os

# Ruta de la carpeta principal
ruta_principal = "/home/souls/Yikerv-Studios/assets/sprites/ground/png"

# Recorre todas las subcarpetas
# Recorre todas las subcarpetas
for subdir, dirs, files in os.walk(ruta_principal):
	for folder in dirs:
		# Ruta completa de la subcarpeta
		subdir_path = os.path.join(subdir, folder)
		# Recorre todos los archivos dentro de la subcarpeta
		for filename in sorted(os.listdir(subdir_path)):
			# Verifica si el nombre del archivo sigue el patrón deseado (dos dígitos en la parte final)
			# Extrae el número de archivo actual
			""" try:
				int(filename[:2])
			except:
				print("Saltado:", filename)
				continue"""
			try:
				int(filename[:-4].split('_')[-1])
			except:
				print("Saltado:", filename)
				continue
			print(filename) 
			
			num_archivo = int(filename[:-4].split('_')[-1])
			# Construye el nuevo nombre del archivo con y empezando desde 00
			nuevo_nombre = "{}_{}.png".format(folder, num_archivo - 1)
			# Ruta completa del archivo antiguo y nuevo
			antiguo_path = os.path.join(subdir_path, filename)
			nuevo_path = os.path.join(subdir_path, nuevo_nombre)
			# Renombra el archivo
			os.rename(antiguo_path, nuevo_path)
		print(f"Renombrado:{folder}")