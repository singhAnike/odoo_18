/** @odoo-module **/


import { ActionDialog } from "@web/webclient/actions/action_dialog";
import { ActionContainer } from '@web/webclient/actions/action_container';
const { Component, tags } = owl;
import { NavBar } from '@web/webclient/navbar/navbar';
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { onMounted, onWillStart, onWillDestroy, xml } from "@odoo/owl";
import { markup } from "@odoo/owl";
const components = { ActionContainer };
import { session } from "@web/session";
import { renderToElement } from "@web/core/utils/render";
import { NavTab } from "./navtab"
import { user } from "@web/core/user";

var display_notice = false;
var font_color = '#ffffff';
var background_color = '#212121';
var font_size = 12;
var font_family = 'Roboto';
var padding = 5;
var content = ''
var is_animation = false;
var direction = 'right';
var simple_text = false;
var is_popup_notification = false;
var close_notification = false;
var notification_template = '';

patch(components.ActionContainer.prototype, {
    setup() {
       super.setup()
       this.orm = useService("orm");
       this.render_action_template()
    },

    async render_notification_template(){
        const output = await this.orm.searchRead(
                        "sh.announcement",
                        [['is_popup_notification', '=', false], ['user_ids.id', 'in', [user.userId]]],
                        ['is_popup_notification', 'font_size', 'font_family', 'padding', 'name', 'description', 'is_animation', 'direction', 'user_ids', 'simple_text', 'background_color', 'font_color', 'description_text']
                        );
        if (output){
            var i;
            for (i = 0; i < output.length; i++) {
                if (output[i]['user_ids'].includes(user.userId)) {
                    display_notice = true;
                    background_color = output[i]['background_color']
                    font_size = output[i]['font_size']
                    font_family = output[i]['font_family']
                    padding = output[i]['padding']
                    font_color = output[i]['font_color']
                    is_animation = output[i]['is_animation']
                    direction = output[i]['direction']
                    simple_text = output[i]['simple_text']
                    is_popup_notification = output[i]['is_popup_notification']
                    if (simple_text) {
                        content = output[i]['description_text'] || ''
                    } else {
                        content = output[i]['description']
                    }
                }
            }
            
            if (display_notice && !is_popup_notification) {
                var style = "position:relative;background:" + background_color + ";color:" + font_color + ";font-size:" + font_size + "px;font-family:" + font_family + ";padding:" + padding + "px;"
                var notification_html =   renderToElement(
                                    'sh_backmate_theme_adv.notification', {
                                    display_notice: display_notice,
                                    background_color: background_color,
                                    font_size: font_size,
                                    font_family: font_family,
                                    padding: padding,
                                    font_color: font_color,
                                    is_animation: is_animation,
                                    direction: direction,
                                    simple_text: simple_text,
                                    is_popup_notification: is_popup_notification,
                                    content: content,
                                    style: style,
                                    close_notification: function (ev){
//                                        document.getElementById("object")?.style.display = "none";
//                                        document.getElementById("object1")?.style.display = "none";
                                        /*$("#object").css("display", "none");
                                        $("#object1").css("display", "none");*/
                                    }
                                });
                document.querySelector(".o_web_client").append(notification_html);
                /*$(".o_web_client").append(notification_html);*/
            }

        }

    },
    async render_action_template(){
        var self = this
        await self.render_notification_template().then(function (data){
            self.info = {};
            self.notification_template = notification_template;
            self.onActionManagerUpdate = ({ detail: info }) => {
                self.info = info;
                self.render();
            };
            self.env.bus.addEventListener("ACTION_MANAGER:UPDATE", self.onActionManagerUpdate);
        });
    },

    close_backmate_theme_layout(){
        // Close Other Pop-up
        this.env.bus.trigger('close_calculator', {});
        this.env.bus.trigger('close_quick_menu', {});
        this.env.bus.trigger('close_recent_record', {});
        this.env.bus.trigger('close_todo_list', {});
        this.env.bus.trigger('close_quick_create', {});
        this.env.bus.trigger('close_bookmark', {});
        this.env.bus.trigger('close_mobile_global_search', {});
        this.env.bus.trigger('close_zoom_functions_dropdown', {});

    },

});

ActionContainer.components = { ActionDialog, NavTab };
ActionContainer.template = xml`
    <t t-name="web.ActionContainer">
      <div class="o_action_manager" t-on-click="close_backmate_theme_layout" >
       <NavTab/>
        <t t-if="info.Component" t-component="info.Component" className="'o_action'" t-props="info.componentProps" t-key="info.id"/>
      </div>
    </t>`;
ActionContainer.props = {};


