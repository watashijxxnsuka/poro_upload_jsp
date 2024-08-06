
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="javatime" uri="http://sargue.net/jsptags/time" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Main Page</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/add-main.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/darkmode.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/modal-main.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/sidebar.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js"></script>
    <style>
        .content {
            padding: 20px;
            margin-left: 20vw;
            margin-right: 5vw;
            height: 100vh;

        }

        .base-sector-personal,
        .base-sector-company {
            margin: 5vh auto;
        }


        .base-sector-personal-title,
        .base-sector-company-title {
            margin: 0 5px 10px;
            min-width: 200px;
        }

        .sector-content-item {
            margin-bottom: 10px;
        }

        .content-img-thumbnail {
            width: 100%;
            height: 25vh;
            object-fit: cover;
        }

        .card-content-item {
            transition: transform 0.3s;
        }

        .card-content-item:hover {
            transform: scale(1.1);
            z-index: 50;
        }

        .base-header button {
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        .base-header img {
            width: 30px;
            height: auto;
        }

        .base-header button div {
            display: inline-block;
            margin-left: 10px;
        }

        .notification-dropdown {
            transition: background-color 0.3s, border-color 0.3s;
        }
    </style>
</head>
<body>
    <input type="hidden" id="user-type" value="common">
    <div class="sidebar">
        <div class="sidebar-content d-flex flex-column">
            <div class="sidebar-icon">
                <div class="sidebar-icon-text">Poro</div>
            </div>
            <div class="sidebar-list">
                <a href="main.html" class="active nav-link" data-page="main.html">
                    <i class="bi bi-house-door"></i>
                    <div>홈</div>
                </a>
                <a href="" class="nav-link" data-page="search.html" id="sidebar-content-search-btn">
                    <i class="bi bi-search"></i>
                    <div>검색</div>
                </a>
                <a href="userfeeds.html" class="nav-link" data-page="userfeeds.html">
                    <i class="bi bi-person-circle"></i>
                    <div>내 프로필</div>
                </a>
                <a href="mini_project.html" class="nav-link" data-page="mini_project.html">
                    <i class="bi bi-card-list"></i>
                    <div>개인 포트폴리오</div>
                </a>
                <a href="mini_project(company).html" class="nav-link" data-page="mini_project(company).html">
                    <i class="bi bi-building"></i>
                    <div>기업 채용</div>
                </a>
                <a class="nav-link" id="openModal">
                    <i class="bi bi-upload"></i>
                    <div>업로드</div>
                </a>
                <a class="nav-link btn-secondary alarm-dropdown" data-bs-toggle="dropdown" id="notificationIcon">
                    <i class="bi bi-bell"></i>
                    <div>알림</div>
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item notification-item" href="#">
                        <div>알람1</div>
                    </a></li>
                    <li><a class="dropdown-item notification-item" href="#">
                        <div>알람2</div>
                    </a></li>
                    <li><a class="dropdown-item notification-item" href="#">
                        <div>알람3</div>
                    </a></li>
                </ul>
                <a href="#" id="darkModeToggle">
                    <i class="bi bi-brightness-low"></i>
                    <div>화면 모드</div>
                </a>
                <a href="setting.html" class="nav-link" data-page="setting.html">
                    <i class="bi bi-gear"></i>
                    <div>설정</div>
                </a>
            </div>
            <div class="sidebar-list-etc">
                <a href="#" class="nav-link" data-page="setting.html">
                    <i class="bi bi-list"></i>
                    <div>더보기</div>
                </a>
            </div>
        </div>
        <div class="sidebar-content-search">
            <div class="sidebar-content-search-top d-flex flex-column justify-content-center">
                <div class="sidebar-content-search-title h2">검색</div>

            </div>
            <div class="sidebar-content-search-body">
                <div class="sidebar-content-searchbar-area sidebar-content-body-outline">
                    <form class="d-flex justify-content-center" action="#" method="post">
                        <div class="form-control sidebar-content-search-bar d-flex align-items-center">
                            <div class="sidebar-content-search-bar-icon"><i class="bi bi-search"></i></div>
                            <input type="text" placeholder="검색" id="sidebar-search-input" class="no-border-input sidebar-search-input"
                            name="searchKeyword">
                            <div class="sidebar-content-search-delete-icon"><i class="bi bi-x-circle"></i></div>
                        </div>
                    </form>
                </div>
                <div class="search-recent-body">
                    <div class="search-item-profile d-flex flex-column justify-content-start">


                    </div>
                    <div class="search-recent-body-list-empty">
                        <div class="search-recent-body-list-title d-flex align-items-center">
                            <span class="h5">최근 검색 항목</span>
                        </div>
                        <div class="search-recent-body-list d-flex justify-content-center align-items-center">
                            <span class="search-recent-body-list-empty-text">최근 검색 내역 없음</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div id="commonModal" class="modal" style="display:none;">
        <div class="modal-content">
            <span class="close-button" id="closeCommonModalButton">&times;</span>
            <form id="uploadFormCommon" enctype="multipart/form-data" action="${pageContext.request.contextPath}/upload" method="post">
                <div id="step1Common" class="step-common">
                    <div class="content-center">
                        <h2>Step 1: 포트폴리오 Zip 파일로 올려주세요.</h2>
                        <h3>주의사항</h3>
                        <p>
                            1. 파일은 항상 zip 확장자로 압축 후 올려주세요. <br>
                            2. 미리보기로 보여줄 페이지는 index.html 파일입니다. (업로드 전에 확인 부탁드립니다.) <br>
                            3. 썸네일을 같이 올려주세요. 업로드하지 않으면 기본이미지로 적용됩니다. <br>
                            4. 태그는 띄어쓰기로 구분합니다. 주의바랍니다.
                        </p>
                        <input type="file" id="zipFileCommon" name="zipFile" accept=".zip">
                    </div>
                    <button type="button" id="toStep2Common" class="modal-button center-button">다음</button>
                </div>
                <div id="step2Common" class="step-common" style="display:none;">
                    <h2>Step 2: index.html 프리뷰 / 썸네일 추가(선택)</h2>
                    <div class="step2-content">
                        <iframe id="previewCommon" style="width:100%; height:400px;"></iframe>
                        <div class="thumbnail-preview">
                            <input type="file" id="thumbnailFileCommon" name="thumbnailFile" accept="image/*">
                            <img id="thumbnailPreviewCommon" src="#" alt="Thumbnail Preview" style="display: none;"/>
                        </div>
                    </div>
                    <button type="button" id="backToStep1Common" class="modal-button center-button">이전</button>
                    <button type="button" id="toStep3Common" class="modal-button center-button">다음</button>
                </div>
                <div id="step3Common" class="step-common" style="display:none;">
                    <h2>Step 3: 설명, 태그 추가</h2><br>
                    <div class="step3-content">
                        <iframe id="previewStep3Common" style="width:100%; height:400px;"></iframe>
                        <div class="description-tags">
                            <h3 style="margin-left: 20px;">설명</h3>
                            <textarea id="descriptionCommon" name="description" placeholder="Enter description" class="modal-textarea"></textarea>
                            <h3 style="margin-left: 20px;">태그</h3>
                            <textarea id="tagsCommon" name="tags" placeholder="Enter tags" class="modal-textarea"></textarea>
                        </div>
                    </div>
                    <button type="button" id="backToStep2Common" class="modal-button center-button">이전</button>
                    <button type="submit" id="submitCommon" class="modal-button center-button">업로드</button>
                </div>
            </form>
        </div>
    </div>

    <div id="companyModal" class="modal" style="display:none;">
        <div class="modal-content">
            <span class="close-button" id="closeCompanyModalButton">&times;</span>
            <form id="uploadFormCompany" method="post" enctype="multipart/form-data" action="/cupload">
                <div id="step1Company" class="step-company">
                    <div class="content-center">
                        <h2>Step 1: 기업(공고) 소개 사진 파일을 올려주세요.</h2>
                        <input type="file" id="imageFileCompany" name="imageFile" accept="image/*">
                        <img id="imagePreviewCompany" src="#" alt="Image Preview" style="display: none; width: 100%;"/>
                    </div>
                    <button id="toStep2Company" type="button" class="modal-button center-button">다음</button>
                </div>
                <div id="step2Company" class="step-company" style="display:none;">
                    <h2>Step 2: 세부사항 추가</h2><br>
                    <div class="step2-content">
                        <img id="imagePreviewStep2Company" src="#" alt="Image Preview" style="width: 50%;"/>
                        <div class="description-tags">
                            <h3>제목</h3>
                            <textarea id="titleCompany" name="title" placeholder="Enter title" class="modal-textarea"></textarea>
                            <h3>공고 마감 날짜</h3>
                            <input type="date" id="ddayCompany" name="dday" class="modal-input">
                        </div>
                    </div>
                    <button id="backToStep1Company" type="button" class="modal-button center-button">이전</button>
                    <button id="toStep3Company" type="button" class="modal-button center-button">다음</button>
                </div>
                <div id="step3Company" class="step-company" style="display:none;">
                    <h2>Step 3: 세부사항 추가</h2><br>
                    <div class="step3-content">
                        <img id="imagePreviewStep3Company" src="#" alt="Image Preview" style="width: 50%;"/>
                        <div class="additional-info">
                            <h3>근무 위치</h3>
                            <input type="text" id="locationCompany" name="location" placeholder="Enter location" class="modal-input">
                            <h3>경력</h3>
                            <textarea id="experienceCompany" name="experience" placeholder="Enter experience" class="modal-textarea"></textarea>
                            <h3>학력</h3>
                            <textarea id="educationCompany" name="education" placeholder="Enter education" class="modal-textarea"></textarea>
                        </div>
                    </div>
                    <button id="backToStep2Company" type="button" class="modal-button center-button">이전</button>
                    <button id="submitCompany" type="submit" class="modal-button center-button">업로드</button>
                </div>
            </form>
        </div>
    </div>


    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
            crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
            crossorigin="anonymous"></script>
    <script src="${pageContext.request.contextPath}/static/js/jquery-3.7.1.min.js"></script>
    <script src="${pageContext.request.contextPath}/static/js/uploadScripts.js"></script>
    <script src="${pageContext.request.contextPath}/static/js/commonScripts.js"></script>
    <script src="${pageContext.request.contextPath}/static/js/companyScripts.js"></script>

    <script src="${pageContext.request.contextPath}/static/js/sidebar.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            function slideOutCurrentStep(currentStep, direction) {
                if (direction === 'left') {
                    currentStep.classList.add('slide-out-left');
                } else {
                    currentStep.classList.add('slide-out-right');
                }
            }

            function slideInNextStep(nextStep, direction) {
                if (direction === 'left') {
                    nextStep.classList.add('slide-in-left');
                } else {
                    nextStep.classList.add('slide-in-right');
                }
                nextStep.style.display = 'block';
            }

            document.querySelectorAll('.modal-button').forEach(function (button) {
                button.addEventListener('click', function () {
                    var currentStep = this.closest('.step-common');
                    var nextStep;

                    if (this.id.includes('toStep2')) {
                        nextStep = currentStep.nextElementSibling;
                        slideOutCurrentStep(currentStep, 'left');
                        setTimeout(function () {
                            currentStep.style.display = 'none';
                            slideInNextStep(nextStep, 'right');
                        }, 500);
                    } else if (this.id.includes('toStep3')) {
                        nextStep = currentStep.nextElementSibling;
                        slideOutCurrentStep(currentStep, 'left');
                        setTimeout(function () {
                            currentStep.style.display = 'none';
                            slideInNextStep(nextStep, 'right');
                        }, 500);
                    } else if (this.id.includes('backToStep1')) {
                        nextStep = currentStep.previousElementSibling;
                        slideOutCurrentStep(currentStep, 'right');
                        setTimeout(function () {
                            currentStep.style.display = 'none';
                            slideInNextStep(nextStep, 'left');
                        }, 500);
                    } else if (this.id.includes('backToStep2')) {
                        nextStep = currentStep.previousElementSibling;
                        slideOutCurrentStep(currentStep, 'right');
                        setTimeout(function () {
                            currentStep.style.display = 'none';
                            slideInNextStep(nextStep, 'left');
                        }, 500);
                    }
                });
            });
        });


    </script>
</body>
</html>
