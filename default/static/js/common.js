function focusAllSelect(e) {
    e.select();
}

function pixelToNumber(v) {
    return +v.substring(0, v.length - 2);
}


function registerScroll(fn) {
    $(document.body).on('touchmove', _.throttle(fn, 16));
    document.addEventListener("scroll", _.throttle(fn, 16), false);
}


function htmlDecode(input) {
    var e = document.createElement('textarea');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}


function openNav() {
    document.getElementById("sidenav").style.width = "300px";
}

function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}

function sticky() {
    var topFixed = document.getElementById('top-fixed');

    return {
        onScroll: function () {
            if (window.pageYOffset > 0) {
                topFixed.classList.add('top-hide');
            } else {
                topFixed.classList.remove('top-hide');
            }
        }
    }
};

$(document).ready(function () {
    registerScroll(sticky().onScroll);

    $("#search-ticker")
        .on('keyup', _.debounce(function (e) {
            $dropdownMenu = $(this).siblings('.dropdown-menu');
            var v = this.value;

            $dropdownMenu
                .empty()
                .append("<a href='javascript:void(0);' class='dropdown-item dropdown-search-item'><div class='dropdown-search-wait d-flex justify-content-center'><div class='spinner-border text-primary' style='width: 1.3rem; height: 1.3rem;' role='status'><span class='sr-only'>Loading...</span></div></div></a>");


            if (v && v.length > 0) {
                var value = v.toUpperCase();
                $dropdownMenu.show();

                $.ajax({
                    url: "/ajax/search/ticker",
                    data: { text: value },
                    type: "GET",
                    dataType: "json",
                    success: function (json) {
                        $dropdownMenu
                            .empty();

                        if (json && json.length > 0) {

                            for (var i = 0; i < json.length; i++) {
                                var ticker = json[i].ticker;
                                var name = json[i].name;
                                var exchange = json[i].exchange

                                var tickerHtml = '';

                                var tIndex = ticker.indexOf(value.toUpperCase());
                                if (tIndex > -1) {
                                    var matched = "<span class='match-text'>" + ticker.substring(tIndex, tIndex + value.length) + "</span>";
                                    var first = '';
                                    var last = '';

                                    if (tIndex > 0) {
                                        first = "<span>" + ticker.substring(0, tIndex) + "</span>";
                                    }

                                    if (tIndex + value.length < ticker.length) {
                                        last = "<span>" + ticker.substring(tIndex + value.length) + "</span>";
                                    }

                                    tickerHtml = first + matched + last;
                                } else {
                                    tickerHtml = "<span>" + ticker + "</span>"
                                }

                                var nameHtml = '';

                                var nIndex = name.indexOf(value.toUpperCase());
                                if (nIndex > -1) {
                                    var matched = "<span class='match-text'>" + name.substring(nIndex, nIndex + value.length) + "</span>";
                                    var first = '';
                                    var last = '';

                                    if (nIndex > 0) {
                                        first = "<span>" + name.substring(0, nIndex) + "</span>";
                                    }

                                    if (nIndex + value.length < name.length) {
                                        last = "<span>" + name.substring(nIndex + value.length) + "</span>";
                                    }

                                    nameHtml = first + matched + last;
                                } else {
                                    nameHtml = "<span>" + name + "</span>"
                                }


                                var dropdownTicker = "<span class='dropdown-ticker nowrap-ellipsis'>" + tickerHtml + "</span>";
                                var dropdownName = "<span class='dropdown-name nowrap-ellipsis'>" + nameHtml + "</span>";
                                var dropdownExchange = "<span class='dropdown-exchange nowrap-ellipsis'>" + (exchange || '') + "</span>";
                                var href = "/view/stock?ticker=" + ticker;

                                $dropdownMenu
                                    .append("<a href='" + href + "' target=_blank class='dropdown-item dropdown-search-item'></a>")
                                    .find('a.dropdown-item:last-of-type')
                                    .append(dropdownTicker)
                                    .append(dropdownName)
                                    .append(dropdownExchange);
                            }
                        } else {
                            $dropdownMenu
                                .append("<a href='javascript:void(0);' class='dropdown-item dropdown-search-item'><span class='dropdown-search-empty'>No Search Result</span></a>")
                        }
                    },
                    error: function (request, status, error) {
                        $dropdownMenu
                            .empty()
                            .append("<a href='javascript:void(0);' class='dropdown-item dropdown-search-item'><span class='dropdown-search-fail'>Search ticker is failed!</span></a>")
                    }
                });
            } else {
                $dropdownMenu.hide();
            }
        }, 500))
        .on('keydown', function (e) {
            setTimeout(function () {
                e.target.value = e.target.value.toUpperCase();
            }, 1);
        });

    $(document).click(function () {
        $("#search-ticker-dropdown").hide();
    });

    var dropdown = document.getElementsByClassName("dropdown-btn");

    var i;

    for (i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", function() {
            this.classList.toggle("sidenav-active");
            var dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
            } else {
                dropdownContent.style.display = "block";
            }
        });
    }

});

