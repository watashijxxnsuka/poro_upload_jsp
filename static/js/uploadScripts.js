function initializeModal(modalId, closeButtonId, stepsClass, fileInputId, previewIframeId, previewStep3IframeId, thumbnailFileId, thumbnailPreviewId, submitButtonId, titleInputId, formId, stepButtons, isCompany = false) {
    const modal = document.getElementById(modalId);
    const closeModalButton = document.getElementById(closeButtonId);
    const steps = document.querySelectorAll(stepsClass);
    const fileInput = document.getElementById(fileInputId);
    const previewIframe = document.getElementById(previewIframeId);
    const previewStep3Iframe = document.getElementById(previewStep3IframeId);
    const thumbnailFileInput = document.getElementById(thumbnailFileId);
    const thumbnailPreview = document.getElementById(thumbnailPreviewId);
    const submitButton = document.getElementById(submitButtonId);
    const titleInput = document.getElementById(titleInputId);
    const uploadForm = document.getElementById(formId);
    let fileMap = {};

    let currentStep = 0;

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.style.display = index === stepIndex ? 'block' : 'none';
        });
    }


    Array.from(stepButtons).forEach(button => {
        const { from, to, eventType, next } = button;
        const buttonElement = document.getElementById(from);
        if (buttonElement) {
            buttonElement.removeEventListener('click', () => {

            });

            buttonElement.addEventListener(eventType, (event) => {
                event.preventDefault();
                currentStep = to;
                showStep(currentStep);
                if (next) next();
            });
        }
    });

    if (!isCompany && fileInput) {
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && file.name.endsWith('.zip')) {
                const zip = new JSZip();
                zip.loadAsync(file)
                    .then((zipContent) => {
                        fileMap = {};
                        const promises = [];

                        zipContent.forEach((relativePath, zipEntry) => {
                            if (!zipEntry.dir) {
                                promises.push(zipEntry.async('blob').then((content) => {
                                    const url = URL.createObjectURL(content);
                                    fileMap[relativePath] = url;
                                }));
                            }
                        });

                        Promise.all(promises).then(() => {
                            if (fileMap['index.html']) {
                                const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
                                iframeDoc.open();
                                iframeDoc.write('<!DOCTYPE html><html><head><base href="/" /></head><body></body></html>');
                                iframeDoc.close();

                                const base = iframeDoc.createElement('base');
                                base.href = fileMap['index.html'];
                                iframeDoc.head.appendChild(base);

                                Object.keys(fileMap).forEach((path) => {
                                    if (path.endsWith('.css')) {
                                        const link = iframeDoc.createElement('link');
                                        link.rel = 'stylesheet';
                                        link.href = fileMap[path];
                                        iframeDoc.head.appendChild(link);
                                    } else if (path.endsWith('.js')) {
                                        const script = iframeDoc.createElement('script');
                                        script.src = fileMap[path];
                                        iframeDoc.body.appendChild(script);
                                    }
                                });

                                fetch(fileMap['index.html']).then(response => response.text()).then(html => {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(html, 'text/html');
                                    doc.querySelectorAll('img').forEach(img => {
                                        const src = img.getAttribute('src');
                                        if (fileMap[src]) {
                                            img.setAttribute('src', fileMap[src]);
                                        }
                                    });
                                    iframeDoc.body.innerHTML = doc.documentElement.innerHTML;

                                    // step3 iframe 업데이트
                                    const iframeDocStep3 = previewStep3Iframe.contentDocument || previewStep3Iframe.contentWindow.document;
                                    iframeDocStep3.open();
                                    iframeDocStep3.write('<!DOCTYPE html><html><head><base href="/" /></head><body></body></html>');
                                    iframeDocStep3.close();

                                    iframeDocStep3.head.appendChild(base.cloneNode());

                                    Object.keys(fileMap).forEach((path) => {
                                        if (path.endsWith('.css')) {
                                            const link = iframeDocStep3.createElement('link');
                                            link.rel = 'stylesheet';
                                            link.href = fileMap[path];
                                            iframeDocStep3.head.appendChild(link);
                                        } else if (path.endsWith('.js')) {
                                            const script = iframeDocStep3.createElement('script');
                                            script.src = fileMap[path];
                                            iframeDocStep3.body.appendChild(script);
                                        }
                                    });

                                    fetch(fileMap['index.html']).then(response => response.text()).then(html => {
                                        const parser = new DOMParser();
                                        const doc = parser.parseFromString(html, 'text/html');
                                        doc.querySelectorAll('img').forEach(img => {
                                            const src = img.getAttribute('src');
                                            if (fileMap[src]) {
                                                img.setAttribute('src', fileMap[src]);
                                            }
                                        });
                                        iframeDocStep3.body.innerHTML = doc.documentElement.innerHTML;
                                    });
                                });
                            } else {
                                alert('index.html file not found in the zip.');
                            }
                        });
                    })
                    .catch((error) => {
                        console.error('Error reading zip file:', error);
                        alert('Failed to read zip file');
                    });
            } else {
                alert('Please upload a valid zip file.');
            }
        });
    }

    if (thumbnailFileInput) {
        thumbnailFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    thumbnailPreview.src = e.target.result;
                    thumbnailPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (submitButton) {
        submitButton.addEventListener('click', (event) => {
            const title = document.getElementById(titleInputId).value;
            if (!title) {
                event.preventDefault();
                alert('제목을 입력해 주세요.');
            } else {
                uploadForm.submit();
            }
        });
    }

    showStep(currentStep);
}

document.addEventListener('DOMContentLoaded', () => {
    const userType = document.getElementById('user-type').value;
    console.log(userType);
    const openModalButton = document.getElementById('openModal');

    openModalButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (userType === 'common') {
            document.getElementById('commonModal').style.display = 'block';
        } else if (userType === 'company') {
            document.getElementById('companyModal').style.display = 'block';
        }
    });
});
