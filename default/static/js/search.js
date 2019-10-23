function searchSticky() {
    var searchNavbar = document.getElementById('search-navbar');
    var offset = searchNavbar.offsetTop;

    return {
        onScroll: function () {
            if (window.pageYOffset > 0) {
                searchNavbar.classList.add('navbar-top-fixed');
            } else {
                searchNavbar.classList.remove('navbar-top-fixed');
            }
        }
    }
};

$(document).ready(function () {
    $('#filter-toggle').on('click', function (e) {
        $('#paging').hide();
    });

    $('#screener-toggle').on('click', function (e) {
        $('#paging').show();
    })

    registerScroll(searchSticky().onScroll);

    // Filter Input Trigger
    $(".filter-wrap .filter-input").on("keyup", function (e) {
        var value = $(this).val().toLowerCase();
        $(this).closest(".filter-wrap").find(".filter-text").filter(function () {
            $(this).toggle($(this).attr('filter-text').toLowerCase().indexOf(value) > -1)
        });
    });

    $addAnatherFilter = $('#add-anather-filter');
    $filterArea = $('#filter-area');

    var alertHtml = $('#alert-html').html();
    var alertItemHtml = $('#alert-item-html').html();
    var dropdownCheckboxHtml = $('#dropdown-checkbox-html').html();
    var dropdownCheckboxItemHtml = $('#dropdown-checkbox-item-html').html();
    var rangeHtml = $('#range-html').html();
    var rangeInputHtml = $('#range-input-html').html();
    var rangeInput2Html = $('#range-input2-html').html();
    var selectHtml = $('#select-html').html();
    var selectDateOptionHtml = $('#select-date-option-html').html();
    var selectRatingOptionHtml = $('#select-rating-option-html').html();
    var checkboxDisabledHtml = $('#checkbox-one-html').html();

    $addAnatherFilter
        // Filter Checkbox Trigger
        .find("input[type=checkbox]").on("click", function () {
            var dataTarget = this.getAttribute('data-target');

            if (this.checked) {
                var type = this.getAttribute('data-type');
                if (!dataTarget || !type) {
                    console.error('target or type is undefined');
                    return;
                }

                $target = $('#' + dataTarget.toLowerCase());

                var name = $target.find('.name').text();
                if (!name) {
                    console.error('target: ' + dataTarget + ' - name is empty');
                    return;
                }


                $alertElmnt = $(alertHtml);
                $alertElmnt.attr('alert-id', dataTarget);
                $alertElmnt.find('.alert-subject small').text($target.find('.subject').text());
                $alertContent = $alertElmnt.find('.alert-content');


                // dropdown-checkbox type
                if (type == 'dropdown-checkbox') {
                    $alertContent.append(dropdownCheckboxHtml);
                    $select = $alertContent.find('.select-checkbox');
                    $fakeToggle = $select.find('.fake-toggle');
                    $fakeToggle.find('.text').text(' ' + $target.find('.toggle-text').text());
                    var list = $target.find('.content').text().split(',');
                    if (list.length > 0) {
                        $dropdownBody = $alertContent.find('.select-checkbox .dropdown-body-in');
                        for (var i = 0; i < list.length; i++) {
                            $dropdownBody
                                .append(dropdownCheckboxItemHtml);
                            $dropdownCheckboxItem = $dropdownBody.find('.dropdown-checkbox-item:last');
                            $dropdownCheckboxItem
                                .find('input[type=checkbox]')
                                .prop('name', name)
                                .prop('value', list[i]);
                            $dropdownCheckboxItem
                                .find('label')
                                .text(list[i]);
                            $dropdownCheckboxItem
                                .attr('filter-text', list[i]);
                        }

                        $fakeToggle.on('click', function (e) {
                            e.stopPropagation();
                            $(this).siblings('[data-toggle=dropdown]').trigger('click');
                        });

                        $select.find('.dropdown-menu, .dropdown-menu .dropdown-header .close').on('click', function (e) {
                            e.stopPropagation();
                            if (this.classList.contains('close')) {
                                $('body').click(); // close dropdown modal
                                return true;
                            }
                            else {
                                return false;
                            }
                        });

                        $dropdownMenu = $select.find('.dropdown-menu');

                        $dropdownMenu.find('.filter-wrap .filter-input').on("keyup", function (e) {
                            var value = $(this).val().toLowerCase();
                            $(this).closest(".filter-wrap").find(".filter-text").filter(function () {
                                $(this).toggle($(this).attr('filter-text').toLowerCase().indexOf(value) > -1)
                            });
                        });

                        $dropdownMenu.find('label.checkbox-label').on('click', function (e) {
                            $checkbox = $(this).prev('input[type=checkbox]');
                            $select = $(this).closest('.select-checkbox');
                            $content = $select.find('.dropdown-content');
                            if ($checkbox.is(':checked') === true) {
                                $checkbox.prop('checked', false);
                                var length = $select.find('input[type=checkbox]:checked').length;
                                if (length == 0) {
                                    $select.find('.fake-toggle .text').css('display', 'inline');
                                }
                                $content.find('.alert-item[value-text="' + $checkbox.attr('value') + '"]').remove();
                            } else if ($checkbox.is(':checked') === false) {
                                $checkbox.prop('checked', true);
                                $select.find('.fake-toggle .text').css('display', 'none');
                                $content.append(alertItemHtml);
                                $alertItem = $content.find('.alert-item:last');
                                $alertItem.attr('value-text', $checkbox.attr('value')).find('span').text(this.textContent);

                                $alertItem.find('.close').on('click', function (e) {
                                    var value = $(this).closest('.alert-item').attr('value-text');
                                    $select = $(this).closest('.select-checkbox');
                                    $checkbox = $select.find('input[type=checkbox][value="' + value + '"]');
                                    $checkbox.prop('checked', false);
                                    var length = $select.find('input[type=checkbox]:checked').length;
                                    if (length == 0) {
                                        $select.find('.fake-toggle .text').css('display', 'inline');
                                    }
                                });
                            }
                        });

                        $dropdownHeader = $alertContent.find('.select-checkbox .dropdown-header');
                    }
                    // range type
                } else if (type == 'range') {
                    $alertContent.append(rangeHtml);
                    $range = $alertContent.find('.range');
                    $range.find('input[type=hidden][form-type=range]').attr('name', name);
                    $range.append(rangeInputHtml);

                    $range.find('.range-select select').change(function (e) {
                        $range = $(this).closest('.range');
                        $rangeInput = $range.find('.range-input');
                        $input = $rangeInput.find('input');
                        var length = $input.length;
                        var newLength = 0;
                        var html = null;

                        var val = $(this).val();
                        switch (val) {
                            case '>':
                            case '<':
                            case '=':
                                html = rangeInputHtml;
                                newLength = 1;
                                break;
                            case '><':
                                html = rangeInput2Html;
                                newLength = 2;
                                break;
                            default:
                                console.error('.range-select 의 option 값이 유효하지 않습니다. val: ' + val);
                                break;
                        }

                        if (html) {
                            if (newLength === 0 || length === 0 || newLength !== length) {
                                $rangeInput.remove();
                                $range.append(html);
                                var unit = $range.attr('unit');
                                if (unit) {
                                    $range.find('.range-input input ~ .unit-text').text(unit);
                                }
                            }
                        }

                    });

                    var unit = $target.find('.unit').text();
                    if (unit) {
                        $range.attr('unit', unit);
                        $range.find('.range-input input ~ .unit-text').text(unit);
                    }
                    // select date type
                } else if (type == 'select') {
                    $alertContent.append(selectHtml);
                    $select = $alertContent.find('.select-type > select');
                    $select.attr('name', name);

                    var selectType = this.getAttribute('select-type');

                    switch (selectType) {
                        case 'date':
                            $select.append(selectDateOptionHtml);
                            break;
                        case 'rating':
                            $select.append(selectRatingOptionHtml);
                            break;
                        default:
                            break;
                    }

                } else if (type == 'checkbox-one') {
                    $alertContent
                        .append(checkboxDisabledHtml)
                        .find('input[type=checkbox]')
                        .attr('name', name);
                }

                $alertElmnt.find('> .close').on('click', function (e) {
                    $addAnatherFilter.find('input[type=checkbox][data-target="' + dataTarget + '"').prop('checked', false);
                });
                $filterArea.append($alertElmnt);
            } else {
                $filterArea.find('.alert[alert-id="' + dataTarget + '"] > .close').trigger('click');
            }
        });


});



function filterInit(filterList) {
    if (filterList && filterList.length > 0 && filterList[0].length > 0) {
        var fl = {};
        for (var i = 0; i < filterList.length; i++) {
            var alert_id = filterList[i].split('=')[0];
            var value = filterList[i].split('=')[1];
            if (!fl[alert_id])
                fl[alert_id] = [];
            fl[alert_id].push(value);
        }

        $addAnatherFilter = $('#add-anather-filter');
        $filterArea = $('#filter-area');
        var keys = Object.keys(fl);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var values = fl[key];

            $checkbox = $addAnatherFilter
                .find('input[data-target="' + key + '"]');
            $checkbox.trigger('click');

            if (values.length > 0) {
                var type = $checkbox.attr('data-type');
                $alertWrap = $filterArea.find('.alert-wrap:last');
                if (type === 'dropdown-checkbox') {
                    $dropdownMenu = $alertWrap
                        .find('.select-checkbox .dropdown-menu');
                    if ($dropdownMenu) {
                        for (var j = 0; j < values.length; j++) {
                            $dropdownMenu.find('input[name="' + key + '"][value="' + values[j] + '"] ~ label').trigger('click');
                        }
                    }
                } else if (type === 'range') {
                    var arr = values[0].split('|');

                    $range = $alertWrap
                        .find('.range');
                    $select = $range
                        .find('.range-select select');

                    if (arr.length === 2 || arr.length === 3) {
                        var operator = arr[0];
                        $select.val(operator).trigger('change');
                    }

                    $rangeInput = $range
                        .find('.range-input');

                    if (arr.length === 2) {
                        var value = arr[1];
                        $rangeInput
                            .find('input[type=number]:eq(0)').val(value);
                    } else if (arr.length === 3) {
                        var value1 = arr[1];
                        var value2 = arr[2];
                        $rangeInput
                            .find('input[type=number]:eq(0)').val(value1);
                        $rangeInput
                            .find('input[type=number]:eq(1)').val(value2);
                    }
                } else if (type === 'select') {
                    $select = $alertWrap.find('.select-type select');
                    $select.find('option[value=' + values[0] + ']').attr('selected', 'selected');
                }
            }
        }
    }
}


function submitFilter(f) {
    $('#real-form').remove();

    var param = {};
    // dropdown checkbox
    $(f).find('[form-type=dropdown-checkbox][name][value]:checked').each(function (index, elmnt) {
        var name = elmnt.getAttribute('name');
        var value = elmnt.getAttribute('value');
        if (!param[name])
            param[name] = value;
        else
            param[name] += ',' + value;
    });

    // range
    $(f).find('[form-type=range][name]').each(function (index, elmnt) {
        var name = elmnt.getAttribute('name');
        var operator = $(this).find('~ .range-select select').val();

        if (!operator) return;
        $rangeInput = $(this).find('~ .range-input');
        var len = $rangeInput.find('input[type=number]').length;
        if (len === 1) {
            var value = $rangeInput.find('input[type=number]').val();
            if (value) value = value.trim();
            if (value && value.length > 0)
                param[name] = operator + '|' + value;
        }
        else if (len === 2) {
            var value1 = $rangeInput.find('input[type=number]:eq(0)').val();
            if (value1) value1 = value1.trim();
            var value2 = $rangeInput.find('input[type=number]:eq(1)').val();
            if (value2) value2 = value2.trim();
            if (value1 && value1.length > 0 && value2 && value2.length > 0)
                param[name] = operator + '|' + value1 + '|' + value2;
        }
    });

    // select
    $(f).find('[form-type=select][name]').each(function (index, elmnt) {
        var name = elmnt.getAttribute('name');
        var value = $(elmnt).find('option:selected').val();
        param[name] = value;
    });

    // checkbox disabled
    $(f).find('input[type=checkbox][form-type=checkbox-one]:checked').each(function (index, elmnt) {
        var name = elmnt.getAttribute('name');
        param[name] = 1;
    });

    $realForm = $('<form></form>')
        .attr('action', f.getAttribute('action'))
        .attr('method', f.getAttribute('method'))
        .attr('accept-charset', f.getAttribute('accept-charset'))
        .attr('id', 'real-form');


    var keys = Object.keys(param);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        $realForm.append('<input type=hidden name="' + key + '" value="' + param[key] + '"/>');
    }

    if (f.view) {
        $realForm.append(f.view);
    }

    if (f.per) {
        $realForm.append(f.per);
    }

    if (f.order) {
        $realForm.append(f.order);
    }

    if (f.dir) {
        $realForm.append(f.dir);
    }

    $('body').append($realForm);
    $realForm.submit();
}



function paging(page) {
    var url = window.location.href;
    var path = window.location.pathname;
    var param = null;
    if (url.indexOf('?') > -1)
        param = url.substring(url.indexOf('?') + 1, url.length);

    var paramString = null;
    if (param && param.indexOf('page=') > -1) {
        paramString = param.replace(/page=[^&]*/i, 'page=' + (page));
    }
    else {
        if (param)
            paramString = param + '&page=' + page;
        else
            paramString = 'page=' + page;
    }

    var newHref = path + '?' + paramString;
    location.href = newHref;
}



function view(v) {
    var url = window.location.href;
    var path = window.location.pathname;
    var param = null;
    if (url.indexOf('?') > -1)
        param = url.substring(url.indexOf('?') + 1, url.length);

    if (param)
        param = param.trim();

    var paramString = '';
    if (param) {
        param = param.replace(/order=[^&]*/i, '');
        param = param.replace(/dir=[^&]*/i, '');
        if (param.indexOf('view=') > -1) {
            paramString = param.replace(/view=[^&]*/i, 'view=' + (v));
        }
        else {
            if (param)
                paramString = param + '&view=' + v;
            else
                paramString = 'view=' + v;
        }
    } else {
        paramString = 'view=' + v;
    }

    if (paramString && paramString.charAt(paramString.length - 1) === '&') {
        paramString = paramString.slice(0, -2);
    }

    var newHref = path + '?' + paramString;
    location.href = newHref;
}

function per(p) {
    var url = window.location.href;
    var path = window.location.pathname;
    var param = null;

    if (url.indexOf('?') > -1)
        param = url.substring(url.indexOf('?') + 1, url.length);

    if (param)
        param = param.trim();

    var paramString = '';
    if (param && param.indexOf('per=') > -1) {
        paramString = param.replace(/per=[^&]*/i, 'per=' + (p));
    }
    else {
        if (param)
            paramString = param + '&per=' + p;
        else
            paramString = 'per=' + p;
    }

    var newHref = path + '?' + paramString;
    location.href = newHref;
}

function order(v) {
    var url = window.location.href;
    var path = window.location.pathname;
    var param = null;

    if (url.indexOf('?') > -1)
        param = url.substring(url.indexOf('?') + 1, url.length);

    if (param)
        param = param.trim();

    var isSameOrder = false;
    var paramString = null;
    if (param && param.indexOf('order=') > -1) {
        var paramOrigin = param.match(/order=[^&]*/i);
        var origin = paramOrigin && paramOrigin[0].substring(6) || null
        if (origin) {
            isSameOrder = v === origin;
        }
        paramString = param.replace(/order=[^&]*/i, 'order=' + (v));
    }
    else {
        if (param)
            paramString = param + '&order=' + v;
        else
            paramString = 'order=' + v;
    }


    if (!paramString) paramString = param;

    if (isSameOrder) {

        if (paramString && paramString.indexOf('dir=') > -1) {
            var direction = paramString.match(/dir=[^&]*/i);
            var originDirection = direction && direction[0].substring(4) || null;
            var d = '';

            if (originDirection) {
                d = originDirection !== 'desc' ? 'desc' : 'asc';
            }

            paramString = paramString.replace(/dir=[^&]*/i, 'dir=' + (d));
        }
        else {
            if (paramString)
                paramString = paramString + '&dir=desc';
            else
                paramString = 'dir=desc';
        }

    } else {

        if (paramString && paramString.indexOf('dir=') > -1) {
            paramString = paramString.replace(/dir=[^&]*/i, 'dir=asc');
        } else {
            if (paramString)
                paramString = paramString + '&dir=asc';
            else
                paramString = 'dir=asc';
        }

    }

    var newHref = path + '?' + paramString;
    location.href = newHref;
}


