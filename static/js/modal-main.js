document.addEventListener('DOMContentLoaded', function () {

    let currentPortfolioIndex = null;

    // 업로드 모달에서 썸네일 이미지가 올라갔을때 (change) 실행되는 콜백
    document.getElementById('uploadThumbnailImage').addEventListener('change', function () {
        const reader = new FileReader();
        reader.onload = function (e) {
            const upload_thumbnailPreview = document.getElementById('uploadThumbnailPreview');
            upload_thumbnailPreview.src = e.target.result;
            upload_thumbnailPreview.style.display = 'block';
        };
        reader.readAsDataURL(this.files[0]);
    });

    $('#uploadModal').on('hidden.bs.modal', function () {
        // 폼을 초기화
        $('#uploadForm')[0].reset();
        // 썸네일 미리보기도 초기화
        const thumbnailPreview = document.getElementById('uploadThumbnailPreview');
        thumbnailPreview.src = '';
        thumbnailPreview.style.display = 'none';
    }); 

    // 업로드 버튼 클릭(submit)시 실행되는 콜백
    document.getElementById('uploadForm').addEventListener('submit', function (e) {

        e.preventDefault();

        // 실제 로컬 스토리지 저장 형태는 [{...}, {...}, {...}] 형태
        const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');

        // 포트폴리오 데이터 형식 지정
        // html, css, js, 썸네일 이미지, 소개글, 태그, 댓글
        const newPortfolio = {
            htmlContent: '',
            cssContent: '',
            jsContent: '',
            thumbnailImage: '',
            portfolioDescription: document.getElementById('uploadPortfolioDescription').value,
            portfolioTags: document.getElementById('uploadPortfolioTags').value,
            comments: []
        };

        // FileReader 객체 생성
        const thumbnailReader = new FileReader();

        // thumbnailReader의 onload 이벤트시 콜백함수 선언
        thumbnailReader.onload = function (e) {
            newPortfolio.thumbnailImage = e.target.result;

            const files = document.getElementById('uploadCodeFiles').files;
            const fileReaders = [];

            const htmlFiles = [];
            const cssFiles = [];
            const jsFiles = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.name.endsWith('.html')) {
                    htmlFiles.push(file);
                } else if (file.name.endsWith('.css')) {
                    cssFiles.push(file);
                } else if (file.name.endsWith('.js')) {
                    jsFiles.push(file);
                }
            }

            const orderedFiles = htmlFiles.concat(cssFiles, jsFiles);

            orderedFiles.forEach(function (file) {
                const reader = new FileReader();

                const promise = new Promise(function (resolve, reject) {
                    reader.onload = function (e) {
                        if (file.name.endsWith('.html')) {
                            newPortfolio.htmlContent = e.target.result;
                        } else if (file.name.endsWith('.css')) {
                            newPortfolio.cssContent = e.target.result;
                        } else if (file.name.endsWith('.js')) {
                            newPortfolio.jsContent = e.target.result;
                        }
                        resolve();
                    };

                    reader.onerror = function (e) {
                        reject(e);
                    };
                });

                reader.readAsText(file);
                fileReaders.push(promise);
            });

            Promise.all(fileReaders).then(function () {
                portfolioData.push(newPortfolio);
                localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
                alert('대기열에 등록되었습니다! 감사합니다.');
                $('#uploadModal').modal('hide');
                document.getElementById('uploadForm').reset();
                document.getElementById('uploadThumbnailPreview').style.display = 'none';
                loadPortfolios();
            }).catch(function (error) {
                console.error('파일 읽기 중 오류 발생:', error);
            });
        };

        thumbnailReader.readAsDataURL(document.getElementById('uploadThumbnailImage').files[0]);
    });

    function loadPortfolios() {
        const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
        const portfolioContainer = document.getElementById('portfolioContainer');
        if (portfolioContainer) {
            portfolioContainer.innerHTML = ''; // 기존 항목을 비움
    
            portfolioData.reverse().forEach(function (portfolio, index) {
                const portfolioItem = `
                    <div class="col-md-3" style="position: relative;" >
                        <img src="${portfolio.thumbnailImage}" alt="Portfolio ${index + 1}" class="portfolio-img" data-index="${portfolioData.length - 1 - index}" style="width : 300px; height : 200px;">
                        <div class="hover-content" id="hover-content-${portfolioData.length - 1 - index}" data-index="${portfolioData.length - 1 - index}"></div>
                    </div>
                `;
                portfolioContainer.insertAdjacentHTML('beforeend', portfolioItem);
            });
        }
    }
    
    // 현재 저장되어 있는 모든 포트폴리오 표시
    loadPortfolios();

    // 태그를 #으로 변환하여 표시
    function displayTags(portfolioTags) {
        const tagsArray = portfolioTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const formattedTags = tagsArray.map(tag => `#${tag}`).join(' ');
        return formattedTags;
    }

    portfolioContainer.addEventListener('mouseover', function (e) {
        if (e.target.classList.contains('portfolio-img')) {
            let index = e.target.getAttribute('data-index');
            currentPortfolioIndex = index;
            const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
            const portfolio = portfolioData[index];
            if (portfolio) {
                const hoverContent = document.getElementById(`hover-content-${index}`);
                hoverContent.style.display = 'block';

                const portfolioImg = e.target;
    
                if (hoverContent && !hoverContent.querySelector('iframe')) { // 중복 로드를 방지
                    const iframe = document.createElement('iframe');

                    const htmlContent = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                                ${portfolio.cssContent}
                                /* 내부 HTML에서 스크롤 바 숨기기 */
                                body::-webkit-scrollbar { 
                                    display: none; 
                                }
                                body {
                                    margin: 0;
                                    padding: 0;
                                }
                            </style>
                        </head>
                        <body>
                            ${portfolio.htmlContent}
                            <script>${portfolio.jsContent}</script>
                        </body>
                        </html>
                    `;
                    iframe.srcdoc = htmlContent;
                    iframe.style.border = 'none';
                    iframe.setAttribute('data-index', `${index}`);
                    iframe.setAttribute('class', 'preview');
    
                    // 이미지 크기를 가져와 iframe에 설정
                    const imgRect = portfolioImg.getBoundingClientRect();
                    iframe.width = imgRect.width + 'px';
                    iframe.height = imgRect.height + 'px';
    
                    // Scale을 적용하여 iframe 내용 축소
                    iframe.style.transform = 'scale(0.25)';
                    iframe.style.transformOrigin = '0 0'; // 스케일링 원점을 왼쪽 상단으로 설정
                    iframe.style.width = imgRect.width * 4 + 'px'; // 스케일링에 맞         게 iframe 크기 조정
                    iframe.style.height = imgRect.height * 4 + 'px'; // 스케일링에 맞게 iframe 크기 조정
    
                    hoverContent.style.position = 'absolute';
                    hoverContent.style.top = portfolioImg.offsetTop + 'px';
                    hoverContent.style.left = portfolioImg.offsetLeft + 'px';
                    hoverContent.style.width = imgRect.width + 'px';
                    hoverContent.style.height = imgRect.height + 'px';
                    hoverContent.style.overflow = 'hidden'; // 부모 컨테이너에서 오버플로우 숨기기

                    // hover-content 크기 확대
                    hoverContent.style.transform = 'scale(1.05)';
                    hoverContent.style.transformOrigin = 'center center';
                    hoverContent.style.zIndex = '1050';
                    hoverContent.style.transition = 'transform 0.3s ease-in-out';
                    hoverContent.style.borderRadius = '10px';
                    hoverContent.style.border = '1px, rgba(128, 128, 128, 0.8), solid';

                    // 설명, 태그, 상세보기 버튼을 포함한 div 추가
                    const descriptionDiv = document.createElement('div');
                    descriptionDiv.style.position = 'absolute';
                    descriptionDiv.style.bottom = '0';
                    descriptionDiv.style.width = '100%';
                    descriptionDiv.style.height = '20%';
                    descriptionDiv.style.backgroundColor = 'rgba(128, 128, 128, 0.8)'; // 회색 배경
                    descriptionDiv.style.color = 'white';
                    descriptionDiv.style.padding = '1%';
                    descriptionDiv.style.display = 'flex';
                    descriptionDiv.style.flexDirection = 'column';
                    descriptionDiv.style.justifyContent = 'center';
                    descriptionDiv.classList.add('descriptionDiv');
                    descriptionDiv.setAttribute('data-index', index);

                    const descriptionText = document.createElement('div');
                    descriptionText.innerText = portfolio.portfolioDescription;
                    descriptionText.style.fontSize = '12px';
                    descriptionText.style.marginLeft = '2%';
                    descriptionText.style.display = 'flex';
                    descriptionText.style.flexDirection = 'column';
                    descriptionText.style.justifyContent = 'center';

                    const tagsText = document.createElement('div');
                    tagsText.innerText = displayTags(portfolio.portfolioTags);
                    tagsText.style.fontSize = '12px';
                    tagsText.style.marginLeft = '2%';
                    tagsText.style.display = 'flex';
                    tagsText.style.flexDirection = 'column';
                    tagsText.style.justifyContent = 'center';

                    const detailsButton = document.createElement('div');
                    detailsButton.innerText = 'Full-size';
                    detailsButton.style.fontSize = '12px';
                    detailsButton.style.position = 'absolute';
                    detailsButton.style.right = '5%';
                    detailsButton.style.top = '50%';
                    detailsButton.style.transform = 'translateY(-50%)';
                    detailsButton.style.cursor = 'pointer';
                    detailsButton.setAttribute('data-index', index);

                    detailsButton.addEventListener('click', function (e) {
                        const index = e.target.getAttribute('data-index');

                        const hoverContent = document.getElementById(`hover-content-${index}`);

                        if (hoverContent && hoverContent.innerHTML !== '') {
                            hoverContent.innerHTML = ''; // iframe을 제거하여 내용 초기화
                            hoverContent.style.transform = 'scale(1)';
                            hoverContent.style.display = 'none'; // hoverContent 숨기기
                            const portfolioImg = document.querySelector(`img[data-index="${index}"]`);
                            if (portfolioImg) {
                                portfolioImg.style.display = 'block'; // 이미지를 다시 표시
                            }
                        }

                        const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
                        const portfolio = portfolioData[index];
                        if (portfolio) {
                            currentPortfolioIndex = index;
                            loadIframeContent(portfolio, index);
                        }
                    });

                    descriptionDiv.appendChild(descriptionText);
                    descriptionDiv.appendChild(tagsText);
                    descriptionDiv.appendChild(detailsButton);

                    hoverContent.appendChild(iframe);
                    hoverContent.appendChild(descriptionDiv);
                }
            
            }
        }
    });


    portfolioContainer.addEventListener('mouseout', function (e) {
        console.log("Dsad");

        if(e.target.classList.contains('preview') || e.target.classList.contains('descriptionDiv')){

            const targetElement = e.relatedTarget || e.toElement;

            if (e.target.classList.contains('preview') && targetElement && targetElement.classList.contains('descriptionDiv')) {
                return; 
            } 

            if (e.target.classList.contains('descriptionDiv')  && targetElement && targetElement.closest('.descriptionDiv')) {
                return;
            }

            const index = e.target.getAttribute('data-index');
            const hoverContent = document.getElementById(`hover-content-${index}`);

            if (hoverContent && hoverContent.innerHTML !== '') {
                hoverContent.innerHTML = ''; // iframe을 제거하여 내용 초기화
                hoverContent.style.transform = 'scale(1)';
                hoverContent.style.display = 'none'; // hoverContent 숨기기
            }
        }
    });

    // window.addEventListener('resize', function() {
    //     const iframes = document.querySelectorAll('.hover-content iframe');
    //     iframes.forEach(function(iframe) {
    //         const index = iframe.parentElement.getAttribute('id').split('-')[2];
    //         const portfolioImg = document.querySelector(`img[data-index="${index}"]`);
    //         if (portfolioImg) {
    //             const imgRect = portfolioImg.getBoundingClientRect();
    //             iframe.style.width = imgRect.width * 2 + 'px'; // 스케일링에 맞게 iframe 크기 조정
    //             iframe.style.height = imgRect.height * 2 + 'px'; // 스케일링에 맞게 iframe 크기 조정
    //             iframe.parentElement.style.width = imgRect.width + 'px';
    //             iframe.parentElement.style.height = imgRect.height + 'px';
    //             iframe.parentElement.style.top = portfolioImg.offsetTop + 'px';
    //             iframe.parentElement.style.left = portfolioImg.offsetLeft + 'px';
    //         }
    //     });
    // });


    function loadIframeContent(portfolio, index) {
        const iframe = document.getElementById('modalPortfolioIframe');
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    
        // window.addEventListener('wheel', (event) => {
        //     if (iframeDocument && iframeDocument.documentElement) {
        //         iframeDocument.documentElement.scrollTop += event.deltaY;
        //     }
        // });
    
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${portfolio.cssContent}
                body::-webkit-scrollbar {
                display: none;
                }</style>
            </head>
            <body>
                ${portfolio.htmlContent} 
                 <script type="text/javascript">
                    ${portfolio.jsContent}
                <\/script>
            </body>
            </html>
        `;
    
        // Write the HTML content to the iframe
        iframeDocument.open();
        iframe.srcdoc = htmlContent;
        iframeDocument.close();

        // 댓글창 열때마다 초기화
        const modalCommentMain = document.getElementById('modalCommentMain');
        if (modalCommentMain) {
            modalCommentMain.innerHTML = '';
    
            // 제일 위 댓글은 소개글

            const commentElement = `<div class="modal-comment">
                    <div class="modal-comment-user-logo" style="background-image: url('더미/img/cat1.jpg');"></div>
                    <div class="modal-comment-main">
                        <div class="modal-comment-main-userid"><strong>cat1</strong></div>
                        <div class="modal-comment-main-content">${portfolio.portfolioDescription}</div>
                    </div>
                </div>`;
            document.getElementById('modalCommentMain').insertAdjacentHTML('beforeend', commentElement);

            // 포트폴리오에 저장되어 있는 코멘트를 등록
            for (let i = 0; i < portfolio.comments.length; i++) {
                addComment(portfolio.comments[i]);
            }
        }
    
        // 모달 오버레이 표시
        const modalPortfolioOverlay = document.getElementById('modalPortfolioOverlay');
        if (modalPortfolioOverlay) {
            modalPortfolioOverlay.classList.add('modal-portfolio-overlay-show');
            // 전체화면의 스크롤은 모달이 떠있을 때는 사용 불가
            document.body.style.overflow = 'hidden';
        }
    
        // 댓글 입력 이벤트 핸들러 설정
        const modalCommentInput = document.getElementById('modalCommentInput');
        if (modalCommentInput) {
            modalCommentInput.setAttribute('data-index', index);  // 인덱스 값 설정
            modalCommentInput.addEventListener('keypress', function (e) {
                if (e.key.toLowerCase() === "enter") {
                    e.preventDefault();
                    const comment = this.value.trim();
                    if (comment) {
                        addComment(comment);
                        // 댓글 입력창 비우기
                        this.value = '';
                        // 포트폴리오 데이터에 댓글 추가
                        // 로컬 스토리지의 한계상 하나만 수정이 불가능하고 모든 데이터를 다시 받아와서
                        // 하나만 수정하고 다시 집어넣음
                        // 비동기적인 처리 중 index가 변할 수 있으므로 setAttribute('data-index', index)
                        // 를 통해 강제 동기적 처리
                        const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
                        const currentPortfolio = portfolioData[parseInt(modalCommentInput.getAttribute('data-index'))];
                        if (Array.isArray(currentPortfolio.comments)) {
                            currentPortfolio.comments.push(comment);
                        } else {
                            currentPortfolio.comments = [comment];
                        }
                        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
                    }
                }
            });
        }
    }

       // iframe 외부 스크롤 이벤트 핸들러 설정
       window.addEventListener('wheel', function(event) {
        const iframe = document.getElementById('modalPortfolioIframe');
        if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
            iframeDoc.documentElement.scrollTop += event.deltaY;
        }
        }
    });

    function addComment(comment) {
        // 랜덤한 숫자(2~12) 생성
        const randomNumber = Math.floor(Math.random() * 11) + 2;
        const Id = `${randomNumber}`;
    
        const commentElement = `
            <div class="modal-comment">
                <div class="modal-comment-user-logo" style="background-image: url('더미/img/cat${Id}.jpg');"></div>
                <div class="modal-comment-main">
                    <div class="modal-comment-main-userid"><strong>cat${Id}</strong></div>
                    <div class="modal-comment-main-content">${comment}</div>
                </div>
            </div>
        `;
    
        document.getElementById('modalCommentMain').insertAdjacentHTML('beforeend', commentElement);
    }

    window.addEventListener('click', function(e) {
        console.log('Clicked element:', e.target.id);
    });

    // 모달이 떴을 때 iframe 외부를 클릭하면 닫히는 방식으로 이벤트 핸들러 추가
    document.getElementById('modalPortfolioOverlay').addEventListener('click', function (e) {
        if (e.target.id === 'modalPortfolioOverlayBond' || e.target.id === 'modalPortfolioOverlay') {
            document.getElementById('modalPortfolioOverlay').classList.remove('modal-portfolio-overlay-show');
            document.getElementById('modalCommentSection').classList.remove('modal-comment-section-active');
            document.getElementById('modalPortfolioIframe').classList.remove('modal-portfolio-iframe-faded');
            // 전체화면의 스크롤 복구
            document.body.style.overflow = '';

        }
    });

    // openBtn과 코멘트창이 스크롤시 따라옴
    document.getElementById('modalPortfolioOverlay').addEventListener('scroll', function (e) {
        const scrollTop = this.scrollTop;
        document.getElementById('modalCommentOpenBtnSection').style.top = scrollTop + 'px';
        document.getElementById('modalCommentSection').style.top = scrollTop + 'px';
    });

    // openBtn을 누르면 코멘트창이 나타나고 뒤 배경 불투명도 증가
    document.getElementById('modalCommentOpenBtn').addEventListener('click', function (e) {
        document.getElementById('modalCommentSection').classList.add('modal-comment-section-active');
        document.getElementById('modalPortfolioIframe').classList.add('modal-portfolio-iframe-faded');
    });

    // closeBtn을 누르면 코멘트창이 사라지고 뒤 배경 불투명도 감소
    document.getElementById('modalCommentCloseBtn').addEventListener('click', function (e) {
        document.getElementById('modalCommentSection').classList.remove('modal-comment-section-active');
        document.getElementById('modalPortfolioIframe').classList.remove('modal-portfolio-iframe-faded');
    });

    // 현재의 좋아요 수를 댓글창에 표시
    let currLikeCnt = 180;
    document.getElementById('modalLikeCntText').innerHTML = `<p> 좋아요 ${currLikeCnt}</p>`;

    // 좋아요 하트 클릭시 색이 빨강으로 바뀌고 좋아요 수 증가
    document.querySelector('.modal-like-logo svg').addEventListener('click', function (e) {
        if (this.querySelector('path').classList.toggle('filled')) {
            currLikeCnt++;
            document.getElementById('modalLikeCntText').innerHTML = `<p> 좋아요 ${currLikeCnt}</p>`;
        } else {
            currLikeCnt--;
            document.getElementById('modalLikeCntText').innerHTML = `<p> 좋아요 ${currLikeCnt}</p>`;
        }
    });

    // 댓글 헤더의 옵션버튼 클릭하면 옵션창이 뜸
    document.getElementById('modalCommentHeaderOptionBtn').addEventListener('click', function (e) {
        document.getElementById('modalOptionsOverlay').classList.add('modal-options-active');
    });

    // 옵션창 외부 클릭시 옵션창 닫힘
    document.getElementById('modalOptionsOverlay').addEventListener('click', function (e) {
        if (e.target === document.getElementById('modalOptions'))
            document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
    });

    // 취소 클릭시도 옵션창 닫힘
    document.getElementById('modalOptionsItemCancle').addEventListener('click', function (e) {
        document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
    });

    // 삭제 클릭시 삭제 모달 열림
    document.getElementById('modalOptionsItemDelete').addEventListener('click', function (event) {
        document.getElementById('modalDelete').classList.add('modal-delete-active');
    });

    // 예 클릭시 실제로 삭제되고 모달 전부 꺼짐
    document.getElementById('modalDeleteBtnYes').addEventListener('click', function (event) {
        if (currentPortfolioIndex !== null) {
            const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
            if (portfolioData.length > currentPortfolioIndex) {
                portfolioData.splice(currentPortfolioIndex, 1);
                localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
                alert('포트폴리오가 삭제되었습니다.');

                // 모달 전부 꺼짐
                document.getElementById('modalPortfolioOverlay').classList.remove('modal-portfolio-overlay-show');
                document.getElementById('modalCommentSection').classList.remove('modal-comment-section-active');
                document.getElementById('modalPortfolioIframe').classList.remove('modal-portfolio-iframe-faded');
                document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
                document.getElementById('modalDelete').classList.remove('modal-delete-active');

                // 포트폴리오 목록 업데이트
                loadPortfolios();

                currentPortfolioIndex = null;
            }
        }
    });

    // 아니오 클릭시 옵션창까지 꺼짐
    document.getElementById('modalDeleteBtnNo').addEventListener('click', function (event) {
        document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
        document.getElementById('modalDelete').classList.remove('modal-delete-active');
    });

    // 신고 클릭시 신고하는 이유 물어봄
    document.getElementById('modalOptionsItemReport').addEventListener('click', function (event) {
        window.alert("신고하시는 이유가 무엇인가요?");
    });

    // 수정 클릭시 수정하는 모달 열기
    document.getElementById('modalOptionsItemModify').addEventListener('click', function (event) {
        console.log(currentPortfolioIndex);
        document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
        const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
        const portfolio = portfolioData[currentPortfolioIndex];
        if (portfolio) {
            // 수정 폼에 기존 포트폴리오 데이터 채우기
            console.log(currentPortfolioIndex);
            document.getElementById('modifyPortfolioDescription').value = portfolio.portfolioDescription;
            document.getElementById('modifyPortfolioTags').value = portfolio.portfolioTags;
            const thumbnailPreview = document.getElementById('modifyThumbnailPreview');
            thumbnailPreview.src = portfolio.thumbnailImage;
            thumbnailPreview.style.display = 'block';

            // 수정 모달 열기
            const modifyModal = new bootstrap.Modal(document.getElementById('modifyModal'));
            modifyModal.show();
        }
    });

    // 썸네일 이미지 변경 시 미리보기 업데이트
    document.getElementById('modifyThumbnailImage').addEventListener('change', function () {
        const reader = new FileReader();
        reader.onload = function (e) {
            const thumbnailPreview = document.getElementById('modifyThumbnailPreview');
            thumbnailPreview.src = e.target.result;
            thumbnailPreview.style.display = 'block';
        };
        reader.readAsDataURL(this.files[0]);
    });

    // 수정 폼 제출 시 로컬 스토리지 업데이트
    document.getElementById('modifyForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '[]');
        const portfolio = portfolioData[currentPortfolioIndex];
        if (portfolio) {
            portfolio.portfolioDescription = document.getElementById('modifyPortfolioDescription').value;
            portfolio.portfolioTags = document.getElementById('modifyPortfolioTags').value;

            const files = document.getElementById('modifyCodeFiles').files;
            const fileReaders = [];

            const htmlFiles = [];
            const cssFiles = [];
            const jsFiles = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.name.endsWith('.html')) {
                    htmlFiles.push(file);
                } else if (file.name.endsWith('.css')) {
                    cssFiles.push(file);
                } else if (file.name.endsWith('.js')) {
                    jsFiles.push(file);
                }
            }

            const orderedFiles = htmlFiles.concat(cssFiles, jsFiles);

            orderedFiles.forEach(function (file) {
                const reader = new FileReader();

                const promise = new Promise(function (resolve, reject) {
                    reader.onload = function (e) {
                        if (file.name.endsWith('.html')) {
                            portfolio.htmlContent = e.target.result;
                        } else if (file.name.endsWith('.css')) {
                            portfolio.cssContent = e.target.result;
                        } else if (file.name.endsWith('.js')) {
                            portfolio.jsContent = e.target.result;
                        }
                        resolve();
                    };

                    reader.onerror = function (e) {
                        reject(e);
                    };
                });

                reader.readAsText(file);
                fileReaders.push(promise);
            });

            Promise.all(fileReaders).then(function () {
                if (document.getElementById('modifyThumbnailImage').files[0]) {
                    const thumbnailReader = new FileReader();
                    thumbnailReader.onload = function (e) {
                        portfolio.thumbnailImage = e.target.result;
                        saveUpdatedPortfolioData(portfolioData);
                    };
                    thumbnailReader.readAsDataURL(document.getElementById('modifyThumbnailImage').files[0]);
                } else {
                    saveUpdatedPortfolioData(portfolioData);
                }
            }).catch(function (error) {
                console.error('파일 읽기 중 오류 발생:', error);
            });
        }
    });

    function saveUpdatedPortfolioData(portfolioData) {
        console.log("여");
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        alert('포트폴리오가 수정되었습니다.');
        
        $('#modifyModal').modal('hide');
        document.querySelector('.modal-backdrop').remove();
        document.getElementById('modalPortfolioOverlay').classList.remove('modal-portfolio-overlay-show');
        document.getElementById('modalCommentSection').classList.remove('modal-comment-section-active');
        document.getElementById('modalPortfolioIframe').classList.remove('modal-portfolio-iframe-faded');
        document.getElementById('modalOptionsOverlay').classList.remove('modal-options-active');
        loadPortfolios();
    }
});
