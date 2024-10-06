import React, { useState, useEffect } from 'react';

// Component that allows uploading images to IndexeDB
const ImageUploader = () => {
    // State to store uploaded images for future need
    //const [images, setImages] = useState([]);
    // State for status messages
    const [message, setMessage] = useState('');

    // Initializes the IndexedDB database
    useEffect(() => {
        initDB();
    }, []);


    const initDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("ImageDatabase", 1); // Opens or creates a new database

            // Event that fires when the database is created or upgraded
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // If object stores do not exist, create a new one
                if (!db.objectStoreNames.contains("images")) {
                    db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
                }
            };

            // Event that fires when the database opening is successful
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            // Event that fires if the database opening fails
            request.onerror = (event) => {
                console.error("IndexedDB error:", event.target.errorCode);
                reject(event.target.errorCode);
            };
        });
    };

    // Function that handles file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Checks the filetype
        const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validFileTypes.includes(file.type)) {
            alert('Vain JPEG, JPG tai PNG tiedostot hyväksytään.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const db = await initDB();
            const transaction = db.transaction("images", "readwrite");
            const store = transaction.objectStore("images");

            // Creates an object for the uploaded image
            const imageRecord = {
                fileName: file.name,
                imageData: e.target.result, // Stores in base64 format
                date: new Date(),
            };

            store.add(imageRecord); // Adds the image record to the object store

            transaction.oncomplete = () => {
                console.log("Image saved succesfully!");
                setMessage("Image uploaded succesfully!");
            };

            transaction.onerror = (event) => {
                console.error("Error saving image:", event.target.errorCode);
                setMessage("Error uploading image.");
            };
        };
        reader.readAsDataURL(file);
    };

    // Render function for the component
    return (
        <div>
            <h3>Lataa omavalintainen kuva laitteeltasi</h3>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            {message && <p>{message}</p>}
        </div>
    );
};

export default ImageUploader;

