""" This script renames all files in a directory by appending .png to the filename. """

import os
import tkinter as tk
from tkinter import filedialog

# Create a Tkinter root window (it will not be shown)
root = tk.Tk()
root.withdraw()

# Open a file dialog to select the directory
directory = filedialog.askdirectory(title="Select Directory")

# Loop through all files in the directory
for filename in os.listdir(directory):
    # Rename each file by appending .png to the filename
    os.rename(filename, f"{filename}.png")

print("Operation completed.")