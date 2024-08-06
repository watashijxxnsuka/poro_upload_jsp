document.addEventListener('DOMContentLoaded', () => {
    initializeModal(
        'companyModal',
        'closeCompanyModalButton',
        '.step-company',
        'imageFileCompany',
        null,
        null,
        'imageFileCompany',
    'imagePreviewCompany',
        'submitCompany',
        'titleCompany',
        'uploadFormCompany',
        [
            { from: 'toStep2Company', to: 1, eventType: 'click', next: () => {
                    const previewStep2 = document.getElementById('imagePreviewCompany');
                    const imgStep2 = document.getElementById('imagePreviewStep2Company');
                    imgStep2.src = previewStep2.src;
                    imgStep2.style.display = 'block';
                }},
            { from: 'toStep3Company', to: 2, eventType: 'click', next: () => {
                    const imgStep3 = document.getElementById('imagePreviewStep3Company');
                    imgStep3.src = document.getElementById('imagePreviewCompany').src;
                    imgStep3.style.display = 'block';
                }},
            { from: 'backToStep1Company', to: 0, eventType: 'click' },
            { from: 'backToStep2Company', to: 1, eventType: 'click' }
        ],
        true,
        true
    );
});
