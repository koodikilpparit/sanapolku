""" Script to rename images based on a CSV file mapping words to makers. """

import os
import csv
import tkinter as tk
from tkinter import filedialog

root = tk.Tk()
root.withdraw()  # Hide the root window

# Load the CSV file
csv_file = filedialog.askopenfilename(title="Select data file")
word_to_maker = {}

with open(csv_file, mode='r', encoding='utf-8-sig') as file:  # Use 'utf-8-sig' to handle BOM
    reader = csv.DictReader(file)
    headers = reader.fieldnames
    print(f"CSV Headers: {headers}")  # Debug statement to print headers
    for row in reader:
        word_key = row.get('Word', '').strip()
        maker_key = row.get('Maker', '').strip()
        if word_key and maker_key:
            word_to_maker[word_key] = maker_key
        else:
            print(f"Missing 'Word' or 'Maker' in row: {row}")  # Debug statement for missing keys

# Folder containing the images
image_folder = filedialog.askdirectory(title="Select Folder")

# Function to sanitize filenames
def sanitize_filename(filename):
    return "".join(c for c in filename if c.isalnum() or c in (' ', '_')).rstrip()

# Iterate over the files in the folder
for filename in os.listdir(image_folder):
    if filename.endswith('.png'):
        # Extract the word from the filename
        word = filename.split('_')[0]
        id = filename.split('_')[1]
        
        # Check if the word is in the dictionary
        if word in word_to_maker:
            maker = word_to_maker[word]
            sanitized_maker = sanitize_filename(maker)
            # Create the new filename
            new_filename = f"{word}_{id}_{sanitized_maker}.png"
            # Rename the file
            if filename != new_filename:
                print(f"Renaming {filename} to {new_filename}")
                os.rename(os.path.join(image_folder, filename), os.path.join(image_folder, new_filename))
        else:
            print(f"Not Found '{word}' in dictionary for file {filename}")

print("Renaming completed.")