/** @odoo-module **/
import { MenuItem, NavBar } from '@web/webclient/navbar/navbar';
import { patch } from "@web/core/utils/patch";
import { ErrorHandler, NotUpdatable } from "@web/core/utils/components";


var theme_style = 'default';

import { isMobileOS } from "@web/core/browser/feature_detection";
import { session } from "@web/session";
import { useService, useBus } from "@web/core/utils/hooks";
import { rpc } from "@web/core/network/rpc";
import { onMounted, useState, onWillStart } from "@odoo/owl";
import { renderToFragment } from "@web/core/utils/render";

var icon_style = 'standard';
var sidebar_collapse_style = '';
var search_style = '';
var enable_multi_tab = false

patch(NavBar.prototype, {

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    async setup() {
            super.setup()
            this.orm = useService("orm");

            enable_multi_tab = session.sh_enable_multi_tab
            this.ui = useState(useService("ui"));
            onWillStart(async () => {
               await this.searchTheme()
            });

            onMounted(async () => {
                if (enable_multi_tab){
                   this.addmultitabtags()
                }
            });
        },

    async searchTheme() {
        const data = await this.orm.searchRead(
                        "sh.back.theme.config.settings",
                        [['id', '=', 1]],
                        ['icon_style','sidebar_collapse_style','search_style','theme_style']
                        );
        if (data) {
                var i;
                for (i = 0; i < data.length; i++) {

                    if (data[i]['icon_style']) {
                        icon_style = data[i]['icon_style'];
                    }
                    if (data[i]['sidebar_collapse_style']) {
                        sidebar_collapse_style = data[i]['sidebar_collapse_style'];
                    }
                    if (data[i]['search_style']) {
                        search_style = data[i]['search_style'];
                    }
                    if (data[i]['theme_style']) {
                        theme_style = data[i]['theme_style'];
                    }
                }
            }
    },

    currentMenuAppSections(app_id) {
        return this.menuService.getMenuAsTree(app_id).childrenTree || [];
    },

    onMouseenter_o_app2(ev){
        /*$(ev.target.parentElement).find('ul.show_ul').css("transition", "all 0.6s ease 0s;");
        $(ev.target.parentElement).find('ul.show_ul').slideDown("slow");*/
    },

    onMouseenter_sh_backmate_theme_appmenu_div(ev) {
        const jsBarToggleBtn = document.getElementById('js_bar_toggle_btn_mobile');

        const oActionManager = document.querySelector('.o_action_manager');
        const oMenuSystray = document.querySelector('.o_menu_systray');
        const topbar = document.querySelector('.o_menu_brand');
        const o_main_navbar = document.querySelector('.o_main_navbar');
        const debugDropdown = document.querySelector('.o_main_navbar ul.o_menu_systray .o_debug_manager .dropdown-menu.show');
        const mailSystrayDropdown = document.querySelector('.o_mail_systray_dropdown');
        const switchCompanyMenu = document.querySelector('.o_switch_company_menu .dropdown-menu');
        const shSearchContainer = document.querySelector('.sh_search_container');
        const object1 = document.getElementById('object1');
        const multiTabSection = document.querySelector('.multi_tab_section');

        if (document.querySelector('.o_web_client')?.classList.contains('o_rtl')) {
            if (oActionManager) oActionManager.style.setProperty("margin-right", "260px", "important");
            // if (oMenuSystray) oMenuSystray.style.setProperty("width", "260px", "important");
            if (topbar) topbar.style.setProperty("margin-right", "280px", "important");
            if (debugDropdown) debugDropdown.style.setProperty("right", "260px", "important");
            if (mailSystrayDropdown) mailSystrayDropdown.style.setProperty("right", "260px", "important");
            if (switchCompanyMenu) switchCompanyMenu.style.setProperty("right", "260px", "important");

            if (typeof sidebar_collapse_style !== 'undefined' && sidebar_collapse_style !== 'expanded' &&
                typeof search_style !== 'undefined' && search_style !== 'collapsed') {
                // if (shSearchContainer) shSearchContainer.style.setProperty("margin-right", "190px", "important");
                if (object1) object1.style.setProperty("padding-right", "0px", "important");
                if (multiTabSection) multiTabSection.style.setProperty("margin-right", "260px", "important");
            }
        } else {
            if (typeof sidebar_collapse_style !== 'undefined' && sidebar_collapse_style !== 'expanded') {
                if (multiTabSection) multiTabSection.style.setProperty("margin-left", "260px", "important");
                if (topbar) topbar.style.setProperty("margin-left", "280px", "important");
                if (oActionManager) oActionManager.style.setProperty("margin-left", "260px", "important");

                //  if (oMenuSystray) oMenuSystray.style.setProperty("width", "260px", "important");
                if (debugDropdown) debugDropdown.style.setProperty("left", "260px", "important");
                if (mailSystrayDropdown) mailSystrayDropdown.style.setProperty("left", "260px", "important");
                if (switchCompanyMenu) switchCompanyMenu.style.setProperty("left", "260px", "important");
            }


            if (typeof sidebar_collapse_style !== 'undefined' && sidebar_collapse_style !== 'expanded' &&
                typeof search_style !== 'undefined' && search_style !== 'collapsed') {
                // if (shSearchContainer) shSearchContainer.style.setProperty("margin-left", "190px", "important");
                if (object1) object1.style.setProperty("padding-left", "0px", "important");
            }
        }
    },


    onMouseleave_sh_backmate_theme_appmenu_div(ev) {
        const webClient = document.querySelector('.o_web_client');

        const jsBarToggleBtn = document.getElementById('js_bar_toggle_btn_mobile');
        const topbar = document.querySelector('.o_menu_brand');
        if(sidebar_collapse_style !== 'expanded'){
            if (webClient && !webClient.classList.contains('o_rtl')) {
  
                if (topbar) topbar.style.setProperty("margin-left", "100px", "important");
            }
        }
        if (webClient && webClient.classList.contains('o_rtl')) {
            if(sidebar_collapse_style !== 'expanded'){
                if (topbar) topbar.style.setProperty("margin-right", "100px", "important");
            }
            
//            if (jsBarToggleBtn && window.getComputedStyle(jsBarToggleBtn).top === '0px') {
                if (typeof sidebar_collapse_style !== 'undefined' && sidebar_collapse_style !== 'expanded') {
                    document.querySelector('.o_action_manager')?.style.setProperty("margin-right", "68px", "important");
                    const dropdownParent = ev.target.querySelector('.o_app2.sh_dropdown.active');
                    if (dropdownParent) {
                        const showUl = dropdownParent.closest('.sh_dropdown_div')?.querySelector('ul.show_ul');
                        if (showUl) {
                            showUl.style.display = "none"; // Simulating slideUp
                            showUl.style.transition = "all 0.6s ease 0s";
                        }
                    }
                    document.getElementById('object1')?.style.setProperty("padding-right", "0px", "important");
                    // document.querySelector('.multi_tab_section')?.style.setProperty("margin-right", "80px", "important");
                    // document.querySelector('.o_action_manager')?.style.setProperty("margin-right", "68px", "important");
                }

//                document.querySelector('.o_action_manager')?.style.setProperty("margin-right", "68px", "important");
                document.querySelector('.sh_search_container')?.style.setProperty("margin-right", "0px", "important");
                // document.querySelector('.o_menu_systray')?.style.setProperty("width", "68px", "important");

                // document.querySelector('.o_main_navbar ul.o_menu_systray .o_debug_manager .dropdown-menu.show')?.style.setProperty("right", "68px", "important");
                document.querySelector('.o_mail_systray_dropdown')?.style.setProperty("right", "68px", "important");
                document.querySelector('.o_switch_company_menu .dropdown-menu')?.style.setProperty("right", "68px", "important");
//            }
        } else {
            if (typeof sidebar_collapse_style !== 'undefined' && sidebar_collapse_style !== 'expanded') {
                const dropdownParent = ev.target.querySelector('.o_app2.sh_dropdown.active');
                if (dropdownParent) {
                    const showUl = dropdownParent.closest('.sh_dropdown_div')?.querySelector('ul.show_ul');
                    if (showUl) {
                        showUl.style.display = "none"; // Simulating slideUp
                        showUl.style.transition = "all 0.6s ease 0s";
                    }
                }
                document.getElementById('object1')?.style.setProperty("padding-left", "0px", "important");
                document.querySelector('.multi_tab_section')?.style.setProperty("margin-left", "80px", "important");
                document.querySelector('.o_action_manager')?.style.setProperty("margin-left", "68px", "important");
                document.querySelector('.sh_search_container')?.style.setProperty("margin-left", "0px", "important");
                // document.querySelector('.o_menu_systray')?.style.setProperty("width", "68px", "important");

                document.querySelector('.o_main_navbar ul.o_menu_systray .o_debug_manager .dropdown-menu.show')?.style.setProperty("left", "68px", "important");
                document.querySelector('.o_mail_systray_dropdown')?.style.setProperty("left", "68px", "important");
                document.querySelector('.o_switch_company_menu .dropdown-menu')?.style.setProperty("left", "68px", "important");
            }
        }

         var subMenu = document.querySelector('.show_ul')         
         if (subMenu && subMenu.classList.contains('show_ul')) {
                    subMenu.classList.add('hidden'); // Add the 'hidden' class for the slide-up effect
                    setTimeout(function () {
                        subMenu.style.display = 'none'; // Ensure it's fully hidden
                        subMenu.classList.remove('hidden');
                    }, 600);
         }

         if (subMenu && subMenu.classList.contains('dropdown-menu')) {
             subMenu.classList.toggle('show_ul'); // Toggle the 'show_ul' class
         }

         document.querySelector('.sh_dropdown_toggle.active')?.classList.toggle('active')

    },


    _click_o_app(ev){
       /* $(".sh_backmate_theme_appmenu_div").toggleClass("sidebar_toggle");
        $(".blur_div").toggleClass("blur_toggle");
        $('.o_menu_systray').css("opacity", '1');*/

        /*todo later*/
        /*$(this).parents('.sh_dropdown_div').find('.sh_dropdown').removeClass('sh_dropdown');
		$(this).parents('.sh_dropdown_div').find('.show_ul').css("display", "none");*/
    },

    _click_toggle_bar(ev){
        if(ev.currentTarget.classList.contains('fa-bars')){
            ev.currentTarget.classList.toggle('fa-times')
            ev.currentTarget.classList.remove('fa-bars')
        }
        else{
            ev.currentTarget.classList.toggle('fa-bars')
            ev.currentTarget.classList.remove('fa-times')}
    },

    _click_js_bar_toggle_btn_mobile(ev){
        
        const sidebar = document.querySelector(".sh_backmate_theme_appmenu_div");
        const blurDiv = document.querySelector(".blur_div");
        const menuSystray = document.querySelector(".o_menu_systray");
        const actionManager = document.querySelector(".o_action_manager");
        const toggleBarIcon = document.getElementById("toggle_bar");
        const dropdownMenu = document.querySelector("ul.dropdown-menu.dropdown-menu-right");

        // Toggle sidebar and blur effect
        sidebar.classList.toggle("sidebar_toggle");
        blurDiv.classList.toggle("blur_toggle");

        // Set menu systray opacity
        menuSystray.style.opacity = "1";

        if (!sidebar.classList.contains("sidebar_toggle")) {
            // Sidebar is closed
            actionManager.style.marginLeft = "0px";
            menuSystray.style.width = "0px";
            menuSystray.style.opacity = "0";
            if (dropdownMenu) {
                dropdownMenu.style.display = "none";
                dropdownMenu.classList.remove("show_ul");
            }
            const dropdownSpan = document.querySelectorAll("span.sh_dropdown");
            dropdownSpan.forEach(span => span.classList.remove("sh_dropdown"));
            toggleBarIcon.classList.add("fa-bars");
            toggleBarIcon.classList.remove("fa-times");
            document.getElementById("js_bar_toggle_btn_mobile").style.display = "none";
        } else {
            // Sidebar is open
            /*actionManager.style.marginLeft = "310px";*/
            menuSystray.style.width = "100%";
            menuSystray.style.opacity = "1";
            toggleBarIcon.classList.remove("fa-bars");
            toggleBarIcon.classList.add("fa-times");
        }


        /*$(".sh_backmate_theme_appmenu_div").toggleClass("sidebar_toggle");
        $(".blur_div").toggleClass("blur_toggle");
        $('.o_menu_systray').css("opacity", '1');

        if ($('.sidebar_toggle').css("max-width") != '100%') {
              $('.o_action_manager').css("margin-left" , '0px');
              $('.o_menu_systray').css("width", '0px');
             $('.o_menu_systray').css("opacity", '0');
             $('ul.dropdown-menu.dropdown-menu-right').css("display", 'none');
             $('ul.dropdown-menu.dropdown-menu-right').removeClass('show_ul');
             $('span.sh_dropdown').removeClass('sh_dropdown');
             $("#toggle_bar").addClass('fa-bars');
             $("#toggle_bar").removeClass('fa-times');
             $("#js_bar_toggle_btn_mobile").css("display","none");

        } else {
            $('.o_action_manager').css("margin-left" , '310px');
            $('.o_menu_systray').css("width", '100%');
            $('.o_menu_systray').css("opacity", '1');
            $("#toggle_bar").removeClass('fa-bars');
            $("#toggle_bar").addClass('fa-times');
        }*/

    },

    _click_blur_div(ev){
        const barToggleBtnMobile = document.getElementById('js_bar_toggle_btn_mobile');
        const blurDiv = document.querySelector('.blur_div');
        const appMenuDiv = document.querySelector('.sh_backmate_theme_appmenu_div');
        const menuSystray = document.querySelector('.o_menu_systray');

        if (barToggleBtnMobile && getComputedStyle(barToggleBtnMobile).top !== '0px') {
            if (blurDiv && !blurDiv.classList.contains('blur_toggle')) {
                appMenuDiv?.classList.toggle('sidebar_toggle');
                blurDiv?.classList.toggle('blur_toggle');
                if (menuSystray) {
                    menuSystray.style.opacity = '1';
                }

                const toggleBarIcon = document.getElementById("toggle_bar");
                toggleBarIcon.classList.add("fa-bars");
                toggleBarIcon.classList.remove("fa-times");
            }
        }
    },

        _click_hide_top_bar(ev) {
            let navbar = document.querySelector('.o_main_navbar');
            if (navbar) {
                // navbar.style.width = "0px";
                navbar.style.height = "0px";
                navbar.style.minHeight = "0px";
                navbar.style.display = "revert";
            }

            let menuSystray = document.querySelector('.o_menu_systray');
            if (menuSystray) menuSystray.setAttribute( 'style', 'display: none !important' );

            let header = document.querySelector('body > header');
            if (header) {
                header.style.height = "auto";
                header.style.transition = "all .3s ease-out";
            }

            let searchContainer = document.querySelector('.sh_search_container');
            if (searchContainer) searchContainer.style.display = "none";

            let showTopBar = document.getElementById("show_top_bar");
            if (showTopBar) showTopBar.style.display = "block";

            let hideTopBar = document.getElementById("hide_top_bar");
            if (hideTopBar) hideTopBar.style.display = "none";
    },

    _click_show_top_bar(ev) {
        let navbar = document.querySelector('.o_main_navbar');
        if (navbar) {
            // navbar.style.width = "100%";
            navbar.style.height = "4rem";
            navbar.style.minHeight = "4rem";
            navbar.style.display = "flex";
            navbar.style.transition = "all .4s";
        }

        let menuSystray = document.querySelector('.o_menu_systray');
        if (menuSystray) menuSystray.style.display = "inline-flex";

        let searchContainer = document.querySelector('.sh_search_container');
        if (searchContainer) searchContainer.style.display = "block";

        let header = document.querySelector('body > header');
        if (header) header.style.height = "auto";

        let hideTopBar = document.getElementById("hide_top_bar");
        if (hideTopBar) hideTopBar.style.display = "block";

        let showTopBar = document.getElementById("show_top_bar");
        if (showTopBar) showTopBar.style.display = "none";
    },

    get_current_company(){
        let current_company_id;
        if (session?.user_context?.allowed_company_ids) {
            current_company_id = session.user_context.allowed_company_ids[0];
        } else {
            current_company_id = session.user_companies ?
                session.user_companies.current_company :
                false;
        }
        return current_company_id;
    },

    getIconStyle() {
        return icon_style;
    },

    onNavBarDropdownItemSelection(menu) {
       /* $(".sh_backmate_theme_appmenu_div").toggleClass("sidebar_toggle");
        $(".blur_div").toggleClass("blur_toggle");
        $('.o_menu_systray').css("opacity", '1');*/

        if (enable_multi_tab){
            if(window.event.shiftKey){
                this._createMultiTab(menu)
            }
        }

        if(this.websiteCustomMenus){
            const websiteMenu = this.websiteCustomMenus.get(menu.xmlid);
            if (websiteMenu) {
                return this.websiteCustomMenus.open(menu);
            }
        }

        if (menu) {
            this.menuService.selectMenu(menu);
        }
    },

    onNavBarDropdownMenuSelection(ev,menu) {
       /* $(".sh_backmate_theme_appmenu_div").toggleClass("sidebar_toggle");
        $(".blur_div").toggleClass("blur_toggle");
        $('.o_menu_systray').css("opacity", '1');*/
        

        if (enable_multi_tab){
            if(window.event.shiftKey){
                this._createMultiTab(menu)
            }
        }

        if(this.websiteCustomMenus){
            const websiteMenu = this.websiteCustomMenus.get(menu.xmlid);
            if (websiteMenu) {
                return this.websiteCustomMenus.open(menu);
            }
        }

        if (menu) {
            this.menuService.selectMenu(menu);
        }

        // Capture the event explicitly from window.event
        const event = window.event;

        // Safety check for event and currentTarget
        if (event && event.currentTarget) {
            // Find the <span> tag inside the DropdownItem
            const dropdownItem = event.currentTarget; // The entire <a> tag
            const spanElement = dropdownItem.querySelector("span"); // Get the <span> inside

            if (spanElement) {
                this.OnClickDropdown({ currentTarget: spanElement });
            }
        }

        /*var $subMenu = $(ev.currentTarget).next('.dropdown-menu');
		$subMenu.toggleClass('show_ul')*/
    },

    _createMultiTab: function (ev) {
            var tab_name = ev.name
            /*var url = '#menu_id='+ev.id + '&action='+ ev.actionID*/
            var url = '/odoo/action-'+ ev.actionID
            var actionId = ev.actionID
            var menuId = ev.id
            var menu_xmlid = ev.xmlid
            var self = this
            localStorage.setItem('LastCreatedTab',actionId)

            rpc('/add/mutli/tab', {
                    'name':tab_name,
                    'url':url,
                    'actionId':actionId,
                    'menuId':menuId,
                    'menu_xmlid':menu_xmlid,
                }).then((rec) => {
                    self.addmultitabtags(ev)
                });
         },

    addmultitabtags: async function (ev) {
            var self = this
            var rec = await rpc('/get/mutli/tab', {});
            if (rec){
                    /*if (theme_style == 'theme_style'){ debugge document.querySelector('body > header')?.style.height = "48px"; }*/
                    const multiTabSection = document.querySelector('.multi_tab_section');
                    // Clear the multi_tab_section content
                    if (multiTabSection) {
                        multiTabSection.innerHTML = '';

                        // Iterate over the `rec` object or array
                        rec.forEach(value => {
                            const tabTag = `
                                <div class="d-flex justify-content-between multi_tab_div align-items-center">
                                    <a href="${value.url}" class="flex-fill" data-xml-id="${value.menu_xmlid}" data-menu="${value.menuId}"
                                        data-action-id="${value.actionId}" multi_tab_id="${value.id}" multi_tab_name="${value.name}">
                                        <span>${value.name}</span>
                                    </a>
                                    <span class="remove_tab ml-4">X</span>
                                </div>`;
                            multiTabSection.insertAdjacentHTML('beforeend', tabTag);
                        });
                    }

                    /*$('.multi_tab_section').empty()
                    $.each(rec, function( key, value ) {
                        var tab_tag = '<div class="d-flex justify-content-between multi_tab_div align-items-center"><a href="'+ value.url +'"'+' class="flex-fill" data-xml-id="'+ value.menu_xmlid +'" data-menu="'+ value.menuId +'" data-action-id="'+ value.actionId +'" multi_tab_id="'+value.id+'" multi_tab_name="'+value.name+'"><span>'+value.name+'</span></a><span class="remove_tab ml-4">X</span></div>'
                        $('.multi_tab_section').append(tab_tag)
                    })*/

                    var ShstoredActionId = sessionStorage.getItem("sh_current_action_id");
                    var ShstoredAction = sessionStorage.getItem("sh_current_action");
                    if (ShstoredActionId){
                        var TabDiv = document.querySelector('.multi_tab_section .multi_tab_div');
                        var ActiveMenu = TabDiv.find('a[data-action-id="'+ ShstoredActionId +'"]');
                        ActiveMenu.parent().addClass('tab_active')
                    }

                    if (ev) {
                        var actionId = ev.actionID
                        var menu_xmlid = ev.xmlid
                        if(localStorage.getItem('LastCreatedTab')){
                            var target = '.multi_tab_section .multi_tab_div a[data-action-id="'+ localStorage.getItem('LastCreatedTab') +'"]'
                            document.querySelector(target)?.parentElement.classList.add('tab_active')
                            localStorage.removeItem('LastCreatedTab')
                        } else {
                            var target = '.multi_tab_section .multi_tab_div a[data-xml-id="'+ menu_xmlid +'"]'
                            document.querySelector(target)?.parentElement.classList.add('tab_active')
                        }
                    }
                    document.body.classList.add("multi_tab_enabled");

                } else {
                    document.body.classList.remove("multi_tab_enabled");
                }
            /*$('.multi_tab_section .remove_tab').on('click', function (ev) {
                        self._RemoveTab(ev)
                    });
            $('.multi_tab_section .multi_tab_div a').on('click', function (ev) {
                        self._TabClicked(ev)
                    });*/
            document.querySelectorAll('.multi_tab_section .remove_tab').forEach(element => {
                element.addEventListener('click', ev => {
                    self._RemoveTab(ev);
                });
            });

            document.querySelectorAll('.multi_tab_section .multi_tab_div a').forEach(element => {
                element.addEventListener('click', ev => {
                    self._TabClicked(ev);
                });
            });

         },

    _RemoveTab: function (ev) {
            var self = this
            var multi_tab_id = ev.target.closest('.multi_tab_div')?.querySelector('a')?.getAttribute('multi_tab_id');
            rpc('/remove/multi/tab', {
                'multi_tab_id':multi_tab_id,
            }).then(function(rec) {
                if (rec){
                    if(rec['removeTab']){
                        /*$(ev.target).parent().remove()
                        var FirstTab = $('.multi_tab_section').find('.multi_tab_div:first-child')*/
                        ev.target.closest('.multi_tab_div')?.remove();
                        var FirstTab = document.querySelector('.multi_tab_section .multi_tab_div');
                        if(FirstTab?.length){
                            FirstTab.querySelector('a')?.click();
                            FirstTab.classList.add('tab_active');
                            /*$(FirstTab).find('a')[0].click()
                            $(FirstTab).addClass('tab_active')*/
                        }
                    }
                    if(rec['multi_tab_count'] == 0){
                        document.body.classList.remove("multi_tab_enabled");
                    }
                }
            });
         },
    _TabClicked: function (ev){
     localStorage.setItem("TabClick", true);
     localStorage.setItem("TabClickTilteUpdate", true);
     if (ev.target.dataset.actionId) {
        document.querySelector('.multi_tab_section .tab_active')?.classList.remove('tab_active');
        ev.target.closest('.multi_tab_div')?.classList.add('tab_active');
        console.log('ev.target.closest(".multi_tab_div")', ev.target.closest('.multi_tab_div'));
    }
    else {
        if (ev.currentTarget.dataset.actionId) {
            document.querySelector('.multi_tab_section .tab_active')?.classList.remove('tab_active');
            ev.currentTarget.closest('.multi_tab_div')?.classList.add('tab_active');
            console.log('ev.currentTarget.closest(".multi_tab_div")', ev.currentTarget.closest('.multi_tab_div'));
        }
    }


     /*if($(ev.target).data('action-id')){
        $('.multi_tab_section').find('.tab_active').removeClass('tab_active');
        $(ev.target).parent().addClass('tab_active')
        console.log('$(ev.target).parent()',$(ev.target).parent())
     }
     else{
        if($(ev.currentTarget).data('action-id')){
            $('.multi_tab_section').find('.tab_active').removeClass('tab_active');
            $(ev.currentTarget).parent().addClass('tab_active')
            console.log('$(ev.target).parent()',$(ev.target).parent())
        }
     }*/
    },

    onNavBarDropdownItemClick(ev) {
        if(ev.shiftKey){
            localStorage.setItem("sh_add_tab",1)
        }else{
            localStorage.setItem("sh_add_tab",0)
        }
    },

    getAppClassName(app){
        var app_name = app.xmlid
        return app_name.replaceAll('.', '_')
    },

    getXmlID(app_id) {
        return this.menuService.getMenuAsTree(app_id).xmlid;
    },

   async OnClickDropdown(ev){
        console.log('=== OnClickDropdown called ===');
        console.log('Event object:', ev);
        
        let flag = false;
        let a = await this.orm.searchRead(
                    "sh.back.theme.config.settings",
                    [['id', '=', 1]],
                    ['theme_style']
                    );
        if(a.length > 0){
           if(a[0].theme_style == 'style_2'){
                flag = true;
                console.log('Theme style is style_2, flag set to true');
            }
        }
        console.log('Theme flag:', flag);
        
        if(!flag){
            this.env.bus.trigger('close_calculator', {});
            this.env.bus.trigger('close_quick_menu', {});
            this.env.bus.trigger('close_recent_record', {});
            this.env.bus.trigger('close_todo_list', {});
            this.env.bus.trigger('close_quick_create', {});
            this.env.bus.trigger('close_bookmark', {});
            this.env.bus.trigger('close_mobile_global_search', {});
            this.env.bus.trigger('close_zoom_functions_dropdown', {});

            // Get the target element - try multiple ways
            console.log('Attempting to get target element...');
            let targetElement = null;
            
            if(ev && ev.currentTarget){
                targetElement = ev.currentTarget;
                console.log('✓ Got target from ev.currentTarget:', targetElement);
            } else if(ev && ev.target){
                targetElement = ev.target;
                console.log('✓ Got target from ev.target:', targetElement);
                // If target is the inner span, get the parent element
                if(targetElement.classList && targetElement.classList.contains('fa')){
                    targetElement = targetElement.parentElement;
                    console.log('✓ Target was icon, moved to parent:', targetElement);
                }
            } else if(ev && ev.detail && ev.detail.originalEvent && ev.detail.originalEvent.target){
                targetElement = ev.detail.originalEvent.target;
                console.log('✓ Got target from ev.detail.originalEvent.target:', targetElement);
            }
            
            // If we still don't have a target, log for debugging but continue with basic operations
            if(!targetElement){
                console.warn('✗ No target element found!');
                console.log('Event structure:', {
                    hasEv: !!ev,
                    hasCurrentTarget: !!(ev && ev.currentTarget),
                    hasTarget: !!(ev && ev.target),
                    hasDetail: !!(ev && ev.detail)
                });
                // Still try to close any open dropdowns
                const openDropdown = document.querySelector('.dropdown-menu.show_ul');
                if(openDropdown){
                    console.log('Closing open dropdown as fallback');
                    openDropdown.classList.remove('show_ul');
                    openDropdown.style.display = 'none';
                }
                return;
            }
            
            console.log('Target element classes:', targetElement.classList);
            console.log('Target element tag:', targetElement.tagName);
            
            if(targetElement && targetElement.classList){
                console.log('Processing dropdown for target element');
                
                if(!targetElement.classList.contains('o_menu_header_lvl_3')){
                    console.log('Target is NOT o_menu_header_lvl_3');
                        if(targetElement.parentElement && targetElement.parentElement.parentElement){
                            console.log('Has parent elements, toggling active states');
                            const activeToggle = document.querySelector("span.sh_dropdown_toggle.active");
                            if(activeToggle && activeToggle != targetElement.parentElement.parentElement){
                                console.log('Removing active from:', activeToggle);
                                activeToggle.classList.toggle('active')
                            }
                            console.log('Toggling active on:', targetElement.parentElement.parentElement);
                            targetElement.parentElement.parentElement.classList.toggle('active')
                        } else {
                            console.log('Missing parent elements');
                        }
                } else {
                    console.log('Target IS o_menu_header_lvl_3');
                }

                if(targetElement.parentElement && targetElement.parentElement.parentElement){
                    var subMenu = targetElement.parentElement.parentElement.nextElementSibling || targetElement.parentElement.parentElement;
                    console.log('SubMenu element:', subMenu);
                    console.log('SubMenu classes:', subMenu.classList);

                    if(targetElement.classList.contains('o_menu_header_lvl_3')){
                        console.log('Handling lvl_3 menu dropdown');
                        if(targetElement.nextSibling && targetElement.nextSibling.classList){
                            console.log('NextSibling found:', targetElement.nextSibling);
                            if(!targetElement.nextSibling.classList.contains('show_ul')){
                                    console.log('Showing submenu');
                                    targetElement.nextSibling.classList.toggle('show_ul')
                                    targetElement.nextSibling.style.display = 'block'
                                }
                            else{
                                    console.log('Hiding submenu');
                                    targetElement.nextSibling.classList.toggle('show_ul')
                                    targetElement.nextSibling.style.display = 'none'
                            }
                        } else {
                            console.log('No nextSibling or classList found');
                        }

                    }

                    else{
                        console.log('Handling non-lvl_3 menu dropdown');
                        if (subMenu && subMenu.classList && !subMenu.classList.contains('show_ul')) {
                            console.log('SubMenu does NOT have show_ul, will show it');
                            if (subMenu.classList.contains('dropdown-menu-right')) {
                                console.log('SubMenu has dropdown-menu-right class');
                                subMenu.style.display = 'block'; // Make the element visible
                                subMenu.style.transition = 'all 0.6s ease'; // Smooth transition for the slide-down effect
                            }

                            var showElements = document.querySelectorAll('.show_ul')
                            console.log('Closing other open menus, found:', showElements.length);
                            showElements.forEach(function (el) {
                                // Apply the slide-up effect
                                el.style.transition = 'max-height 0.6s ease'; // Smooth transition
                                /*el.style.maxHeight = '0'; // Collapse height to simulate slide-up*/
                                el.style.overflow = 'hidden'; // Ensure content doesn't overflow during animation

                                // Completely hide the element after the transition
                                setTimeout(function () {
                                    el.style.display = 'none'; // Ensure it's hidden
                                    el.classList.remove('show_ul'); // Remove the class
                                }, 600); // Matches the 600ms duration
                            });
                        }

                        if (subMenu && subMenu.classList && subMenu.classList.contains('show_ul')) {
                            console.log('SubMenu HAS show_ul, will hide it');
                            subMenu.classList.add('hidden'); // Add the 'hidden' class for the slide-up effect
                            setTimeout(function () {
                                subMenu.style.display = 'none'; // Ensure it's fully hidden
                                subMenu.classList.remove('hidden');
                            }, 600);
                        }

                    }

                    var subMenuDropdown = targetElement.parentElement.parentElement.nextElementSibling; // Get the next sibling element
                    console.log('Final subMenuDropdown check:', subMenuDropdown);
                    if (subMenuDropdown && subMenuDropdown.classList && subMenuDropdown.classList.contains('dropdown-menu')) {
                        console.log('✓ Toggling show_ul on subMenuDropdown');
                        subMenuDropdown.classList.toggle('show_ul'); // Toggle the 'show_ul' class
                    } else {
                        console.log('✗ SubMenuDropdown not valid or not a dropdown-menu');
                    }
                } else {
                    console.log('✗ Missing parent elements for subMenu');
                }
            } else {
                console.log('✗ Target element missing or no classList');
            }
            console.log('=== OnClickDropdown finished ===');
        }
    },
    toggleMenu(){
        const menu = document.querySelector("#sh_home_menu");
        const overlay = document.querySelector("#sh_menu_overlay");
        if (!menu || !overlay) return;

        if (menu.classList.contains("show")) {
            const focusedApp = menu.querySelector(".o_app.focus");
            const searchInput = menu.querySelector(".sh-search");
            const searchBlock = menu.querySelector(".sh_search_results")
            menu.classList.remove("show");
            overlay.classList.add("o_hidden");
            setTimeout(() => {
                if (focusedApp) {
                    focusedApp.classList.remove("focus");
                }
                if(searchInput){
                    searchInput.value = "";
                }
                if(searchBlock){
                    searchBlock.style.display = "none"
                }
                menu.classList.add("o_hidden");
            }, 400);
        } else {
            overlay.classList.remove("o_hidden");
            menu.classList.remove("o_hidden");
            setTimeout(() => {
                menu.classList.add("show");
            }, 10);
        }
    },
    onAppClick() {
        // Close drawer when an app is clicked
        const menu = document.querySelector("#sh_home_menu");
        const overlay = document.querySelector("#sh_menu_overlay");

        menu?.classList.remove("show");
        overlay?.classList.add("o_hidden");

        setTimeout(() => {
            const focusedApp = menu.querySelector(".o_app.focus");
            const searchInput = menu.querySelector(".sh-search");
            const searchBlock = menu.querySelector(".sh_search_results")
            if (focusedApp) {
                focusedApp.classList.remove("focus");
            }
            if(searchInput){
                searchInput.value = "";
            }
            if(searchBlock){
                searchBlock.style.display = "none"
            }
            menu?.classList.add("o_hidden");
        }, 400);
    },
    async render_quick_menulist_no_menu(){
        var final_quick_menu_list_html = renderToFragment(
                    'quick.menulist', {
                     no_menu: 1
                    });
                   document.querySelector(".sh_search_results").style.display = "none";
        },
    async onSearchInput(ev) {
        var query = ev.target.value.toLowerCase();
            var self = this;
            var menus = await rpc("/web/dataset/call_kw/global.search/get_search_result", {
                    model: 'global.search',
                    method: 'get_search_result',
                    args: [[query]],
                    kwargs: {},
                });
           if (Object.keys(menus).length > 0 && query) {
            var quick_menu_list_html = await renderToFragment(
                'quick.menulist', {
                    quick_menulist_actions: Object.values(menus),
                    remove_quick_menu: function (ev) {
                        self.remove_quick_menu(ev)
                    },
                }
            );
            document.querySelector(".sh_search_results").style.display = "block";
            document.querySelector(".sh_search_results").innerHTML = "";
            document.querySelector(".sh_search_results").appendChild(quick_menu_list_html);
        } else {
            self.render_quick_menulist_no_menu();
        }
    },

   currentMenuAppSections(app_id) {

        return (
            (this.menuService.getMenuAsTree(app_id).childrenTree) ||
            []
        );
    },

   getThemeStyle(ev) {

        return theme_style;
    },

   isMobile(ev) {
        return isMobileOS
    },

   click_secondary_submenu(ev) {
        /*if (isMobileOS) {
            $(".sh_sub_menu_div").addClass("o_hidden");
        }

        $(".o_menu_sections").removeClass("show")*/
    },

   click_close_submenu(ev) {
        /*$(".sh_sub_menu_div").addClass("o_hidden");
        $(".o_menu_sections").removeClass("show")*/
    },

   click_mobile_toggle(ev) {
        /*$(".sh_sub_menu_div").removeClass("o_hidden");*/

    },
});