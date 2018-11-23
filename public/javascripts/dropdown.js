let is_dropdown_open = false;
$(document).ready(function () {
    const $dropdown_title = $(".dropdown-title");
    const $dropdown_title_text = $('.dropdown-title>.title-text');
    const $submenu = $(".submenu");
    const $dropdown_item = $('.dropdown-item');
    const $title_icon = $('.title-icon');

    $dropdown_title.click(function () {
        is_dropdown_open ? close() : open();
    });

    //Mouse click on item
    $dropdown_item.mouseup(function () {
        close();
        const sort_criteria = this.text;
        $dropdown_title_text.text('Sorted by ' + sort_criteria);
        Components.MODEL_RANKING_VIS.sortRanking(sort_criteria)
    });

    function open() {
        $submenu.show();
        $title_icon.html('<i class="fas fa-angle-up"></i>');
        is_dropdown_open = true;
    }

    function close() {
        $submenu.hide();
        $title_icon.html('<i class="fas fa-angle-down"></i>');
        is_dropdown_open = false;
    }
});