// 다크모드 관련 함수
function saveDarkModeState(isDarkMode) {
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

function loadDarkModeState() {
    return localStorage.getItem('darkMode') === 'enabled';
}

function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
        $('body').addClass('dark-mode');
        $('#darkModeToggle').text("").append(`<i class="bi bi-moon-fill"></i><div>화면 모드</div>`);
        $('#mainTopLineBtnSet').children().each(function(){
            if($(this).hasClass("btn-dark")){
                $(this).removeClass("btn-dark");
                $(this).addClass("btn-light");
            }
            if($(this).hasClass("btn-outline-dark")){
                $(this).removeClass("btn-outline-dark");
                $(this).addClass("btn-outline-light");
            }
        });
    } else {
        $('body').removeClass('dark-mode');
        $('#darkModeToggle').text("").append(`<i class="bi bi-brightness-high"></i><div>화면 모드</div>`);
        $('#mainTopLineBtnSet').children().each(function(){
            if($(this).hasClass("btn-light")){
                $(this).removeClass("btn-light");
                $(this).addClass("btn-dark");
            }
            if($(this).hasClass("btn-outline-light")){
                $(this).removeClass("btn-outline-light");
                $(this).addClass("btn-outline-dark");
            }
        });
    }
}
function applyDisplayDarkMode(isDarkMode){
    if(isDarkMode){
        $('#darkModeToggle').parent().children().hover(function(){
            $(this).children().addClass("sidebar-item-dark-mode");
        }, function(){
            $(this).children().removeClass("sidebar-item-dark-mode");
        })
    }
}
