/** @odoo-module **/
import { user } from "@web/core/user";
import {Component} from "@odoo/owl";
import { rpc } from "@web/core/network/rpc";
import { session } from "@web/session";
import { useState ,onWillStart} from "@odoo/owl";
import { useService ,useBus} from "@web/core/utils/hooks";


export class ZoomWidget extends Component {
    static template = 'sh_entmate_theme.ZoomWidget';
    setup() {
        super.setup();
        this.orm = useService("orm");
        this.state = useState({sh_enable_zoom : session.sh_enable_zoom, show_zoom_mode : true,show_zoom_functions : false, zoom_value : 100});
        useBus(this.env.bus, 'close_zoom_functions_dropdown', (ev) => this.closeZoomDropdown());

        this.onWillStart();
    }

    async onWillStart(){
        if(session.sh_enable_zoom){

            const data = await this.orm.searchRead("res.users",[['id', '=', user.userId]],["sh_enable_zoom"]);
            console.log(data[0]);

            if (data) {
              if (!data[0].sh_enable_zoom) {
                    this.state.show_zoom_mode = false;
                  }
            }

            // var page = document.querySelector(".o_web_client"); 
            var page = document.querySelector(".o_content"); 
                      
            page?.classList.forEach(function(className) {
                if (className.startsWith('sh_zoom_')) {
                  page.classList.remove(className);
                }
            });

            if (this.state.zoom_value!=100) {
                var zoom_value_class = "sh_zoom_"+this.state.zoom_value;
                page.classList.add(zoom_value_class);
            }

        }

    }

    setResetZoom(){
        this.state.zoom_value = 100;
        this.onWillStart();
    }

    zoomDropdown(ev){
          this.state.show_zoom_functions = !this.state.show_zoom_functions;
    }

    closeZoomDropdown(ev){
        this.state.show_zoom_functions = false;
    }

    setDecZoom(){
        if (this.state.zoom_value>10) {
            this.state.zoom_value = this.state.zoom_value - 10;
        }
        this.onWillStart();

    }

    setIncZoom(){
        
        if (this.state.zoom_value<200) {
            this.state.zoom_value = this.state.zoom_value + 10
        }
        this.onWillStart();
    }

}
    

