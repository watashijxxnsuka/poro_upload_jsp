document.addEventListener('DOMContentLoaded', () => {
    initializeModal(
        'commonModal',
        'closeCommonModalButton',
        '.step-common',
        'zipFileCommon',
        'previewCommon',
        'previewStep3Common',
        'thumbnailFileCommon',
        'thumbnailPreviewCommon',
        'submitCommon',
        'titleCommon',
        'uploadFormCommon',
        [
            { from: 'toStep2Common', to: 1, eventType: 'click' },
            { from: 'toStep3Common', to: 2, eventType: 'click' },
            { from: 'backToStep1Common', to: 0, eventType: 'click' },
            { from: 'backToStep2Common', to: 1, eventType: 'click' }
        ]
    );
});
