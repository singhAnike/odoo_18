/* @odoo-module */

import { Component, useState, xml } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService, useBus } from "@web/core/utils/hooks";
import { session } from "@web/session";
import { rpc } from "@web/core/network/rpc";
import { renderToFragment } from "@web/core/utils/render";
import { onWillStart, onMounted } from "@odoo/owl";
import { isMobileOS } from "@web/core/browser/feature_detection";
var show_company = false;


export class GlobalSearchSh extends Component {
    static template = "sh_backmate_theme_adv.GlobalSearch";

    setup() {
        super.setup()
        this.orm = useService("orm");
        this.show_company = show_company
        this.sh_enable_gloabl_search_mode = session.sh_enable_gloabl_search_mode
        this.sidebar_collapse_style = ""
        useBus(this.env.bus, 'close_mobile_global_search', (ev) => this.closeMobileGlobalSearch());


        this.state = useState({
            query: "",
            results: [],
            hasResults: false,
            isExpanded: false,
        });

        onMounted(() => {
            /*if ($("input[name='sidebar_collapse_style']:checked").val() == 'collapsed' && $("input[name='search_style']:checked").val() == 'expanded'){
                $(".sh_search").css("left","80px")
            }
            else{
                $(".sh_search").css("left","275px")
            }*/

            const sidebarCollapseInput = document.querySelector("input[name='sidebar_collapse_style']:checked");
            const searchStyleInput = document.querySelector("input[name='search_style']:checked");
            const searchElement = document.querySelector(".sh_search");

            if (sidebarCollapseInput && searchStyleInput && searchElement) {
                if (sidebarCollapseInput.value === 'collapsed' && searchStyleInput.value === 'expanded') {
                    searchElement.style.left = "80px";
                } else {
                    searchElement.style.left = "275px";
                }
            }

        });
    }

    async closeMobileGlobalSearch(){
        // document.querySelector("#topbar_full_search_icon").style.display = "none";
        document.querySelector('.usermenu_search_input')?.style.setProperty("display", "none");
        this.state.query = "";
        this.state.results = [];
        this.state.hasResults = false;
    }


    async _onclick_search_top_bar(event) {
        this.env.bus.trigger('close_quick_create', {});
        this.env.bus.trigger('close_quick_menu', {});
        this.env.bus.trigger('close_calculator', {});
        this.env.bus.trigger('close_todo_list', {});
        this.env.bus.trigger('close_bookmark', {});
        this.env.bus.trigger('close_zoom_functions_dropdown', {});

        const data = await this.orm.searchRead(
            "sh.back.theme.config.settings",
            [['id', '=', 1]],
            ["search_style"]
        );

        if (data && data.length > 0) {
            const searchInput = document.querySelector(".usermenu_search_input");

            if (searchInput) {
                if (!isMobileOS()) {
                    if (data[0]['search_style'] === 'collapsed') {
                        searchInput.style.display = searchInput.style.display === "block" ? "none" : "block";
                        this.state.query = false
                    }
                } else {
                    searchInput.style.display = searchInput.style.display === "block" ? "none" : "block";
                }
            }
        }
    }


    async _searchData() {
        this.env.bus.trigger('close_quick_create', {});
        this.env.bus.trigger('close_quick_menu', {});
        this.env.bus.trigger('close_calculator', {});
        this.env.bus.trigger('close_todo_list', {});
        this.env.bus.trigger('close_bookmark', {});

        const config = await this.orm.searchRead(
            "sh.back.theme.config.settings",
            [['id', '=', 1]],
            ["search_style"]
        );

        const searchStyle = config[0]?.search_style || "collapsed";
        this.state.isExpanded = searchStyle === "expanded";

        const inputSelector = this.state.isExpanded
            ? ".sh_search_input input.usermenu_search_input2"
            : ".sh_search_input input.usermenu_search_input";
        const searchInput = document.querySelector(inputSelector);

        if (!searchInput) return;

        const query = searchInput.value.trim();
        this.state.query = query;

        if (!query) {
            this.state.results = [];
            this.state.hasResults = false;
            return;
        }

        try {
            const data = await rpc("/web/dataset/call_kw/global.search/get_search_result", {
                model: 'global.search',
                method: 'get_search_result',
                args: [[query]],
                kwargs: {},
            });
        // Handle different data structures
        if (Array.isArray(data)) {
            this.state.results = data;
        } else if (typeof data === "object") {
            this.state.results = Object.values(data || {});
        } else {
            console.error("Unexpected data format:", data);
            this.state.results = [];
        }
           this.state.hasResults = this.state.results.length > 0;
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    }
}

registry.category("systray").add("sh_backmate_theme_adv.GlobalSearch", { Component: GlobalSearchSh }, { sequence: 25 });