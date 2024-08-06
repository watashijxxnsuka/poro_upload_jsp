$(document).ready(function () {

  function showModal(imageUrl) {
      var iframe = $('#imageIframe');

      // 이미지 로드 완료 시 크기 조절
      var img = new Image();
      img.onload = function () {
          var imgWidth = img.width;
          var imgHeight = img.height;

          iframe.css({
              width: imgWidth + 'px',
              height: imgHeight + 'px'
          });

          $('#CompanyPortFolioModal .modal-content').css({
              width: imgWidth + 'px',
              height: imgHeight + 'px'
          });

          $('#CompanyPortFolioModal').modal('show');

          // 이미지가 로드된 후에 iframe의 src 설정
          iframe.attr('src', imageUrl);
      };
      img.src = imageUrl;
  }

  $('.com1').on('click', function () {
      var imageUrl = 'img/웹홈페이지 더미/1.png'; // 이미지 URL 설정
      showModal(imageUrl);
  });

  $('.com2').on('click', function () {
      var imageUrl = 'img/웹홈페이지 더미/2.jpg'; // 이미지 URL 설정
      showModal(imageUrl);
  });

  $('#CompanyPortFolioModal').on('hidden.bs.modal', function () {
      // 모달이 숨겨질 때 iframe의 src를 초기화
      $('#imageIframe').attr('src', '');
  });

});