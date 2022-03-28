window.onload = function () {
  setTimeout(function () {
    document.getElementById('tickets-rows').style.display = 'flex';
    document.getElementById('preloader').style.display = 'none';
  }, 500);
}

// Работаем только при поддержке браузером History Api
if (window.history && history.pushState) {
  var JustLoaded = true;

  // Задаём функцию загрузки страницы
  function loadPage(href) {
    // Обёртка всего блока
    var parent = $('#tickets-wrapper');
    // Индикация загрузки контента
    parent.children("#tickets-rows").css({ "display": "none" });
    document.getElementById('preloader').style.display = 'block';
    $(".pagination").css({ "opacity": "0.1" });
    // Если загружается первая страница, то у неё нет параметра ?page=1 -
    // нужно добавить самостоятельно, иначе pdoPage не отзовётся
    if (!href.match(/page=\d+/)) {
      href += href.match(/\?/)
        ? '&page=1'
        : '?page=1';
    }
    // Запрос на сервер по указанной ссылке
    $.get(href, function (response) {
      // Дальше работаем только если пришел нормальный ответ
      if (response && response['total']) {
        // Вставляем контент и пагинацию в заранее подготовленные элементы
        parent.find('#tickets-rows').html(response['output']);
        parent.find('.pagination').html(response['pagination']);
        // Убираем индикацию загрузки
        setTimeout(function () {
          parent.children("#tickets-rows").css({ "display": "flex" });
          document.getElementById('preloader').style.display = 'none';
          $(".pagination").css({ "opacity": "1" });
        }, 500);
        $('html, body').animate({
          scrollTop: parent.position().top + 50 || 0
        }, 0);
        var delimeter = ' / ';
        var title = [];
        var tmp = $('title').text().split(delimeter);
        for (var i = 0; i < tmp.length; i++) {
          if (i === tmp.length - 1 && response.page && response.page > 1) {
            title.push('стр. ' + response.page + ' из ' + response.pages);
          }
          if (!tmp[i].match(/^стр\./)) {
            title.push(tmp[i]);
          }
        }
        $('title').text(title.join(delimeter));
      }
    }, 'json');
  }

  // Вешаем обработчик ссылок в нашей разметке на кнопки пагинации
  $(document).on('click', '#tickets-wrapper .pagination a', function (e) {
    e.preventDefault();
    var href = $(this).prop('href');
    history.pushState({ href: href }, '', href);
    loadPage(href);
    JustLoaded = false;
  });

  // Вешаем обработчик на переключение кнопок браузера взад-вперёд
  $(window).on('popstate', function (e) {
    if (!JustLoaded && e.originalEvent.state && e.originalEvent.state['href']) {
      loadPage(e.originalEvent.state['href']);
    }
    JustLoaded = false;
  });

  // При первой загрузке страницы помещаем в историю текущий адрес
  history.replaceState({ href: window.location.href }, '');
}