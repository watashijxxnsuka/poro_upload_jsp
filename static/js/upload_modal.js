$(()=>{
    $('#uploadModal').on('hidden.bs.modal', function(){

    });
    $('#uploadModal').on('shown.bs.modal', function(){
        $('#uploadForm').on('submit', function(e) {
            e.preventDefault();
            
            var portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
            var newPortfolio = {};
        
            $.each($('#codeFiles')[0].files, function(i, file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    newPortfolio.name = file.name;
                    newPortfolio.content = e.target.result;
                    newPortfolio.thumbnailImage = '';
                    newPortfolio.portfolioDescription = $('#portfolioDescription').val();
                    newPortfolio.portfolioTags = $('#portfolioTags').val();
        
                    if (i === $('#codeFiles')[0].files.length - 1) {
                        portfolioData.push(newPortfolio);
                        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
                        alert('대기열에 등록되었습니다! 감사합니다.');
                        $('#uploadModal').modal('hide');
                        $('#uploadForm')[0].reset();
                        $('#thumbnailPreview').hide();
                        loadPortfolios();
                    }
                };
                reader.readAsDataURL(file);
            });
        
            var thumbnailReader = new FileReader();
            thumbnailReader.onload = function(e) {
                newPortfolio.thumbnailImage = e.target.result;
            };
            thumbnailReader.readAsDataURL($('#thumbnailImage')[0].files[0]);
        });
    });
})
