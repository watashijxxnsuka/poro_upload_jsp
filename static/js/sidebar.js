$(()=>{
    $("#sidebar-content-search-btn").on("click", function(e){
        e.preventDefault();
        const searchTap = $(".sidebar-content-search");
        // if(searchTap.css("display") === "none"){
        //     searchTap.show();
        // }else{
        //     searchTap.hide();
        // }
        if(!searchTap.hasClass("active")){
            searchTap.addClass("active");
            $(".sidebar-content").addClass("active");
        }
        else{
            searchTap.removeClass("active");
            $(".sidebar-content").removeClass("active");
        }
    });

    // 지우기 버튼 활성화
    $("#sidebar-search-input").on("focusin", function(){
        this.value = "";
        $('.sidebar-content-search-delete-icon').show();
    });

    // 지우기 버튼 클릭
    $('.sidebar-content-search-delete-icon').on("click", function(){
        $("#sidebar-search-input").val("");
        $('.search-item-profile').html("");
        $(".search-recent-body-list-empty").show();
        $(".sidebar-content-search-delete-icon").hide();
    });

    // 사이드바 검색 이벤트
    $("#sidebar-search-input").on("input", function(){
        if(this.value === ""){
            $('.search-item-profile').html("");
            $(".search-recent-body-list-empty").show();
            return;
        }
        $('.search-recent-body-list-empty').hide();

        $('.search-item-profile').html("");
        // 임시 검색 데이터 추가

        $.ajax({
            url: `/search/search.do?searchKeyword=${$("#sidebar-search-input").val()}`,
            type: 'get',
            data: {},
            success: function(obj){
                console.log(obj);
                for(let i = 0;  i < obj.members.length; ++i){
                    $('.search-item-profile').append(`<div class="search-item d-flex justify-content-start align-items-center">
                        <img src="img/home.png" alt="">
                        <div class="search-item-info d-flex flex-column justify-content-center">
                            <div><p>${obj.members[i].nickname}<i class="bi bi-check-circle-fill"></i></p></div>
                            <div><p>${obj.members[i].email}</p></div>
                        </div>
                    </div>`);
                }
            },
            error : function(err){
                console.log(err);

            }
        })
    });
});