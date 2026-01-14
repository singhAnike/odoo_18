/** @odoo-module **/

import { ListController } from "@web/views/list/list_controller";
import { patch } from "@web/core/utils/patch";
import { session } from "@web/session";
import { useService } from "@web/core/utils/hooks";

var show_expand_collapse = false

patch(ListController.prototype, {

    setup(...args) {
        super.setup(...args)
        this.show_expand_collapse = session.sh_enable_expand_collapse
    },


    _onClickRefreshView (ev) {
        this.actionService.switchView('list');
    },

    shExpandGroups () {
        document.querySelectorAll('.o_group_header').forEach(function(header) {
        if (!header.classList.contains('o_group_open')) {
            const groupName = header.querySelector('.o_group_name');
            if (groupName) {
                groupName.click();
            }
            }
        });
    },

    shCollapseGroups () {
        document.querySelectorAll('.o_group_header').forEach(function(header) {
        if (header.classList.contains('o_group_open')) {
            const groupName = header.querySelector('.o_group_name');
            if (groupName) {
                groupName.click();
            }
        }
        });
    },

});

