import { Dropdown } from "@web/core/dropdown/dropdown";
import { DropdownGroup } from "@web/core/dropdown/dropdown_group";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";
import { CheckBox } from "@web/core/checkbox/checkbox";
import { registry } from "@web/core/registry";
import { user } from "@web/core/user";
import { session } from "@web/session";
import { useService } from "@web/core/utils/hooks";
import { Component, useState } from "@odoo/owl";
import { imageUrl } from "@web/core/utils/urls";
import { rpc } from "@web/core/network/rpc";
import { useDropdownState } from "@web/core/dropdown/dropdown_hooks";

const userMenuRegistry = registry.category("user_menuitems");

export class ThemeConfigurationTemplate extends Component {
    static template = "ThemeConfigurationTemplate";
    static components = { DropdownGroup, Dropdown, DropdownItem, CheckBox };
    static props = {};

    setup() {
        this.userName = user.name;
        this.dbName = session.db;
        const { partnerId, writeDate } = user;
        this.source = imageUrl("res.partner", partnerId, "avatar_128", { unique: writeDate });
        this.orm = useService("orm");
        this.dropdown = useDropdownState();
        // State to manage dynamic UI updates
        this.state = useState({
            theme_style:'style_1',
            appIconStyle: null,
            isDualTone: false,
            dual_tone_icon_color_1:'#A3A5B7',
            dual_tone_icon_color_2: '#2C3782',
            chatterType: "bottom",
            scrollbar_style: "style_2",
            checkbox_style: "style_2",
            radio_btn_style: "style_2",
            breadcrumb_style: "style_2",
            form_element_style: "style_2",
            horizontal_tab_style: "style_2",
            kanban_box_style: "style_2",
            separator_style: "style_2",
            separator_color: "#111c43",
            button_style: "style_2",
            navbar_style: "collapsed",
            body_background_type: "bg_color",
            body_background_color: "#A3A5B7",
            body_background_img: false,
            body_font_family: false,
            body_google_font_family: false,
            header_background_type: "header_color",
            header_background_color:"#A3A5B7",
            header_font_color:"#A3A5B7",
            primary_color:"#A3A5B7",
            secondary_color:"#A3A5B7",
            sidebar_background_style:"color",
            sidebar_background_color:"#A3A5B7",
            sidebar_font_color:"#A3A5B7",
            sidebar_collapse_style:"expanded",
            predefined_list_view_boolean:true,
            predefined_list_view_style: "style_1",
            list_view_border:"bordered",
            list_view_even_row_color: "#A3A5B7",
            list_view_odd_row_color: "#A3A5B7",
            list_view_is_hover_row: false,
            list_view_hover_bg_color:"#A3A5B7",
            search_style: "collapsed",
            login_page_style:"style_2",
            login_page_style_comp_logo: false,
            login_page_box_color: "#ffffff",
            login_page_background_type:"bg_color",
            login_page_background_color:"#ffffff",
            progress_style:"style_1",
            progress_color:"#A3A5B7",
            progress_height:"20",
            is_sticky_form:false,
            is_sticky_list_inside_form:false,
            is_sticky_list:false,
            is_sticky_pivot:false,
            backend_all_icon_style:'style_2'
        });
        // Fetch theme style via RPC
        this.loadThemeStyle();
    }

    async loadThemeStyle() {
        try {
            const data = await rpc("/get_theme_style", {});
            const appIconStyle = data.icon_style;
            this.state.appIconStyle = appIconStyle;
            this.state.isDualTone = appIconStyle === "dual_tone";
            this.state.dual_tone_icon_color_1 = data.dual_tone_icon_color_1
            this.state.dual_tone_icon_color_2 = data.dual_tone_icon_color_2
            this.state.chatterType = data.chatter_type;
            this.state.scrollbar_style = data.scrollbar_style;
            this.state.checkbox_style = data.checkbox_style;
            this.state.radio_btn_style = data.radio_btn_style;
            this.state.breadcrumb_style = data.breadcrumb_style;
            this.state.form_element_style = data.form_element_style;
            this.state.horizontal_tab_style = data.horizontal_tab_style;
            this.state.kanban_box_style = data.kanban_box_style;
            this.state.separator_style = data.separator_style;
            this.state.separator_color = data.separator_color;
            this.state.button_style = data.button_style;
            this.state.navbar_style = data.navbar_style;
            this.state.body_background_type = data.body_background_type;
            this.state.body_background_color = data.body_background_color;
            this.state.body_background_img = data.body_background_img;
            this.state.body_font_family = data.body_font_family;
            this.state.body_google_font_family = data.body_google_font_family;
            this.state.is_custom_google_font = data.is_used_google_font;
            this.state.header_background_type = data.header_background_type;
            this.state.header_background_color = data.header_background_color;
            this.state.header_font_color = data.header_font_color;
            this.state.primary_color = data.primary_color,
            this.state.secondary_color = data.secondary_color,
            this.state.sidebar_background_color = data.sidebar_background_color,
            this.state.sidebar_background_style = data.sidebar_background_style,
            this.state.sidebar_font_color = data.sidebar_font_color,
            this.state.sidebar_collapse_style = data.sidebar_collapse_style,
            this.state.predefined_list_view_boolean = data.predefined_list_view_boolean,
            this.state.predefined_list_view_style = data.predefined_list_view_style,
            this.state.list_view_border = data.list_view_border,
            this.state.list_view_even_row_color = data.list_view_even_row_color,
            this.state.list_view_odd_row_color = data.list_view_odd_row_color,
            this.state.list_view_is_hover_row = data.list_view_is_hover_row,
            this.state.list_view_hover_bg_color = data.list_view_hover_bg_color,
            this.state.search_style = data.search_style,
            this.state.login_page_style = data.login_page_style,
            this.state.login_page_style_comp_logo = data.login_page_style_comp_logo,
            this.state.login_page_box_color = data.login_page_box_color,
            this.state.login_page_background_type = data.login_page_background_type,
            this.state.login_page_background_color = data.login_page_background_color,
            this.state.progress_style = data.progress_style,
            this.state.progress_color = data.progress_color,
            this.state.progress_height = data.progress_height,
            this.state.is_sticky_form = data.is_sticky_form,
            this.state.is_sticky_list_inside_form = data.is_sticky_list_inside_form,
            this.state.is_sticky_list = data.is_sticky_list,
            this.state.is_sticky_pivot = data.is_sticky_pivot,
            this.state.theme_style = data.theme_style,
            this.state.backend_all_icon_style = data.backend_all_icon_style,

            this.updateBodyClass();
        } catch (error) {
            console.error("Failed to load theme style:", error);
        }
    }

    _click_discard_color(event){
        document.querySelector('.sh_backmate_theme_config_template').click()
    }

    uploadBackgroundImage(event){
        const input = document.getElementById(event.currentTarget.id);
        const file = event.currentTarget?.files[0];

        if (file) {
            const formData = new FormData();
            formData.append(event.currentTarget.id, file);

            // AJAX request to upload the file
            window.fetch('/api/upload/multi', {
                method: 'POST',
                body: formData,
            });
        }

    }

    onSelectFontIconStyle(event){
        this.state.backend_all_icon_style = event.currentTarget.id;
    }

    onSelectMenuStyle(event){
        this.state.theme_style = event.currentTarget.id;
    }

    onSelectLoginPageStyle(event) {
        this.state.login_page_style = event.currentTarget.id;
    }

    onSelectPreDefinedListviewStyle(event) {
        this.state.predefined_list_view_style = event.currentTarget.id;
    }

    onSelectButtonStyle(event) {
        this.state.button_style = event.currentTarget.id;
    }

    on_change_separator_color(event){
         this.state.separator_color = event.currentTarget.value
    }

    onSelectSeparatorStyle(event) {
        this.state.separator_style = event.currentTarget.id;
    }

    onSelectKanbanBoxStyle(event) {
        this.state.kanban_box_style = event.currentTarget.id;
    }

    onSelectHorizontalTabStyle(event) {
        this.state.horizontal_tab_style = event.currentTarget.id;
    }

    onSelectFormElementStyle(event) {
        this.state.form_element_style = event.currentTarget.id;
    }

    onSelectBreadcrumbStyle(event) {
        this.state.breadcrumb_style = event.currentTarget.id;
    }

    onSelectRadioBtnStyle(event) {
        this.state.radio_btn_style = event.currentTarget.id;
    }

    onSelectCheckboxStyle(event) {
        this.state.checkbox_style = event.currentTarget.id;
    }

    onSelectScrollbarStyle(event) {
        this.state.scrollbar_style = event.currentTarget.id;
    }

    _click_close_setting(){
        document.querySelector('.sh_backmate_theme_config_template').click()
    }

    updateBodyClass() {
        // Remove existing chatter style classes
        document.body.classList.remove("chatter_style_bottom", "chatter_style_sided");

        // Add the selected chatter style class
        const className = this.state.chatterType === "bottom" ? "chatter_style_bottom" : "chatter_style_sided";
        document.body.classList.add(className);
    }

     onChatterTypeChange(event) {
        this.state.chatterType = event.target.value;
        this.updateBodyClass();
    }

    handleIconStyleChange(event) {
        const selectedStyle = event.currentTarget.id;
        this.state.appIconStyle = selectedStyle;
        this.state.isDualTone = selectedStyle === "dual_tone";
    }

    on_change_dual_tone_icon_color_1(ev){
        this.state.dual_tone_icon_color_1 = ev.currentTarget.value
    }

    on_change_dual_tone_icon_color_2(ev){
        this.state.dual_tone_icon_color_2 = ev.currentTarget.value
    }

    getElements() {
        const sortedItems = userMenuRegistry
            .getAll()
            .map((element) => element(this.env))
            .filter((element) => (element.show ? element.show() : true))
            .sort((x, y) => {
                const xSeq = x.sequence ? x.sequence : 100;
                const ySeq = y.sequence ? y.sequence : 100;
                return xSeq - ySeq;
            });
        return sortedItems;
    }

    _click_pre_theme_color_box(ev){

        var pre_color_id = ev.currentTarget.id
        rpc('/update/theme_style_pre_color',{'pre_color_id': pre_color_id}).then(function (data) {
            location.reload();
        });

    }

    _click_sh_theme_design(ev){
            const expandElement = document.querySelector('.sh_expand')
            if(expandElement && expandElement.style.display === 'block'){
                expandElement.style.transition = 'all 0.6s ease'; // Add smooth transition
                expandElement.style.height = '0px';
                 expandElement.classList.toggle('sh_expand')
                 // Simulate slide up
                setTimeout(() => {
                    expandElement.style.display = 'none';
                }, 400); // Wait for transition before hiding

            }

            const collapseElement = ev.currentTarget.parentElement.querySelector('.collapse');

            if (getComputedStyle(collapseElement).display === 'none') {
                collapseElement.style.display = 'block';
                collapseElement.style.overflow = 'hidden';
                collapseElement.style.transition = 'all 0.6s ease'; // Add smooth transition
                collapseElement.style.height = collapseElement.scrollHeight + 'px'; // Simulate slide down
                collapseElement.classList.toggle('sh_expand')
            } else {
                collapseElement.style.transition = 'all 0.6s ease'; // Add smooth transition
                collapseElement.style.height = '0px';
                 collapseElement.classList.toggle('sh_expand')
                 // Simulate slide up
                setTimeout(() => {
                    collapseElement.style.display = 'none';
                }, 400); // Wait for transition before hiding
            }

        }

    async _click_save_color (ev){                                
                                if(this.state.body_font_family == 'custom_google_font'){
                                    this.state.is_custom_google_font = true
                                }
                                else{
                                    this.state.is_custom_google_font = false
                                }
                                var theme_config_template = ev.currentTarget.offsetParent
                                var result = await this.orm.write("sh.back.theme.config.settings", [1], {
                                        'theme_style': this.state.theme_style,
                                        'primary_color': this.state.primary_color,
                                        'scrollbar_style': this.state.scrollbar_style,
                                        'checkbox_style':this.state.checkbox_style,
                                        'radio_btn_style':this.state.radio_btn_style,
                                        'breadcrumb_style': this.state.breadcrumb_style,
                                        'form_element_style': this.state.form_element_style,
                                        'kanban_box_style': this.state.kanban_box_style,
                                        'secondary_color': this.state.secondary_color,
                                        'header_background_color': this.state.header_background_color,
                                        'header_font_color': this.state.header_font_color,
                                        'body_background_color': this.state.body_background_color,
                                        'body_font_family': this.state.body_font_family,
                                        'body_google_font_family': this.state.body_google_font_family,
                                        'is_used_google_font': this.state.is_custom_google_font,
                                        'body_background_type': this.state.body_background_type,
                                        'header_background_type': this.state.header_background_type,
                                        'button_style': this.state.button_style,
                                        'separator_style': this.state.separator_style,
                                        'separator_color': this.state.separator_color,
                                        'icon_style': this.state.appIconStyle,
                                        'dual_tone_icon_color_1': this.state.dual_tone_icon_color_1,
                                        'dual_tone_icon_color_2': this.state.dual_tone_icon_color_2,
                                        'sidebar_font_color': this.state.sidebar_font_color,
                                        'sidebar_background_style': this.state.sidebar_background_style,
                                        'sidebar_background_color': this.state.sidebar_background_color,
                                        'sidebar_collapse_style': this.state.sidebar_collapse_style,
                                        'predefined_list_view_boolean': this.state.predefined_list_view_boolean,
                                        'predefined_list_view_style': this.state.predefined_list_view_style,
                                        'list_view_border': this.state.list_view_border,
                                        'list_view_even_row_color': this.state.list_view_even_row_color,
                                        'list_view_odd_row_color': this.state.list_view_odd_row_color,
                                        'list_view_is_hover_row': this.state.list_view_is_hover_row,
                                        'list_view_hover_bg_color': this.state.list_view_hover_bg_color,
                                        'login_page_style': this.state.login_page_style,
                                        'login_page_style_comp_logo': this.state.login_page_style_comp_logo,
                                        'login_page_background_type': this.state.login_page_background_type,
                                        'login_page_box_color': this.state.login_page_box_color,
                                        'login_page_background_color': this.state.login_page_background_color,
                                        'is_sticky_form': this.state.is_sticky_form,
                                        'is_sticky_list': this.state.is_sticky_list,
                                        'is_sticky_list_inside_form': this.state.is_sticky_list_inside_form,
                                        'is_sticky_pivot': this.state.is_sticky_pivot,
                                        'horizontal_tab_style': this.state.horizontal_tab_style,
                                        'search_style': this.state.search_style,
                                        'navbar_style': this.state.navbar_style,
                                        'progress_style': this.state.progress_style,
                                        'progress_height': this.state.progress_height,
                                        'progress_color': this.state.progress_color,
                                        'backend_all_icon_style': this.state.backend_all_icon_style,
                                        'chatter_type': this.state.chatterType,
                                    });

                                if (result){
                                    location.reload();
                                 }

                             }


    onStateChanged(isopen){
        if(!isopen){
            this.dropdown.open()
        }
    }

}

export const systrayItem = {
    Component: ThemeConfigurationTemplate,
};
registry.category("systray").add("themeconfigtemplate", systrayItem);
