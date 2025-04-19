document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('uploadBtn');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const captionText = document.getElementById('captionText');
    const loading = document.getElementById('loading');
    const uploadSection = document.querySelector('.upload-section');

    uploadBtn.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', handleImage);
    uploadSection.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadSection.style.borderColor = '#1a73e8';
    });

    uploadSection.addEventListener('dragleave', () => {
        uploadSection.style.borderColor = '#ccc';
    });

    uploadSection.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadSection.style.borderColor = '#ccc';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImage({ target: { files: [file] } });
        }
    });

    function handleImage(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                loading.style.display = 'block';
                captionText.textContent = 'Generating caption...';

                try {
                    const response = await fetch('/generate_caption', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            image: e.target.result
                        })
                    });

                    const data = await response.json();
                    if (data.caption) {
                        captionText.textContent = data.caption;
                    } else {
                        captionText.textContent = 'Error generating caption';
                    }
                } catch (error) {
                    captionText.textContent = 'Error generating caption';
                } finally {
                    loading.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        }
    }
});