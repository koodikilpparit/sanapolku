import tkinter as tk
from tkinter import filedialog
import os

def select_folder():
    folder_selected = filedialog.askdirectory()
    if folder_selected:
        print_files_in_folder(folder_selected)

def print_files_in_folder(folder_path):
    for filename in os.listdir(folder_path):
        if os.path.isfile(os.path.join(folder_path, filename)):
            name, ext = os.path.splitext(filename)
            print(f"'{name}{ext}',")

if __name__ == "__main__":
    root = tk.Tk()
    root.withdraw()  # Hide the root window
    select_folder()