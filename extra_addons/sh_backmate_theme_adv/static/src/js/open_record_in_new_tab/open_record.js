/** @odoo-module **/

import { onMounted } from "@odoo/owl";
import { ListRenderer } from "@web/views/list/list_renderer";
import { patch } from "@web/core/utils/patch";
import { session } from "@web/session";
import { useService } from "@web/core/utils/hooks";
import { ActionMenus } from "@web/search/action_menus/action_menus";

patch(ListRenderer.prototype, {
  /**
   * @override
   */
  setup() {
    this.show_open_record_new_tab_button_listrenderer = session.sh_enable_open_record_in_new_tab;
    this.is_list_view = true;
    var Many2one_protect = this["env"]["config"]["actionType"];
    var view_type = this["props"]["activeActions"]["type"];
    if (view_type != "view" || Many2one_protect == false) {
      this.is_list_view = false;
    }
    onMounted(this.onMounted);
    super.setup();
  },

  onMounted() {

    if (this.show_open_record_new_tab_button_listrenderer) {
      if (this.is_list_view) {
        // Select all rows in the table excluding those with a class
        var trElements = Array.from(document.querySelectorAll(".o_list_table tr:not([class])"));

        // Handle header row
        var header = trElements[0];
        if (header) {
            var tableHeader = document.createElement("th");
            tableHeader.textContent = "Open";
            header.children[0].insertAdjacentElement("afterend", tableHeader);
        }

        // Handle footer row
        var footer = trElements[trElements.length - 1];
        if (footer) {
            var tableFooter = document.createElement("td");
            footer.children[0].insertAdjacentElement("afterend", tableFooter);
        }

        // Find rows with <td> elements having a "colspan" attribute
        var trsWithColspan6 = document.querySelectorAll("tr td[colspan]");
        trsWithColspan6.forEach(function (tdElement) {
            var parentRow = tdElement.parentElement;
            if (parentRow) {
                var extraCell = document.createElement("td");
                parentRow.appendChild(extraCell);
            }
        });

        /*var trElements = $(".o_list_table").find("tr:not([class])")
        var header = trElements.first();
        var table_header = $("<th>Open</th>");
        header.children().eq(0).after(table_header);
        var footer = trElements.last();
        var table_footer = $("<td></td>");
        footer.children().eq(0).after(table_footer);

        var trsWithColspan6 = $("tr:has(td[colspan])");
        if (trsWithColspan6) {
          trsWithColspan6.each(function () {
            $(this).append("<td></td>");
          });
        }*/
      }
    }
  },

  OpenRecord(res_id) {

    var url = window.location.href;
    url = url + "/" + res_id;
    /*let result = latest_url.replace("view_type=list", "view_type=form");*/
    window.open(url, "_blank");
  },

  setDefaultColumnWidths() {
        // Select all rows with a <th> element having the class "o_group_name"

        var trsWithGroupheader = Array.from(document.querySelectorAll("tr:has(th.o_group_name)"));

        if (trsWithGroupheader.length) {
            trsWithGroupheader.forEach(function (row) {
                var hasCustomClass = false;

                // Check if any <td> inside the <tr> contains the custom class
                var tdElements = row.querySelectorAll("td");
                tdElements.forEach(function (td) {
                    if (td.classList.contains("sh_custom_class")) {
                        hasCustomClass = true;
                    }
                });

                // If the custom class is not found, add a new <td> with the custom class
                if (!hasCustomClass) {
                    var customTd = document.createElement("td");
                    customTd.className = "sh_custom_class";
                    // Insert the new <td> after the first child <th> or <td>
                    row.children[0].insertAdjacentElement("afterend", customTd);
                }
            });
        }

    if (this.show_open_record_new_tab_button_listrenderer) {

    // Select all rows containing a <th> with the class "o_group_name"
    var trsWithGroupheader = Array.from(document.querySelectorAll("tr:has(th.o_group_name)"));

    if (trsWithGroupheader.length) {
        trsWithGroupheader.forEach(function (row) {
            var hasCustomClass = false;

            // Check if any <td> inside the <tr> contains the custom class
            var tdElements = row.querySelectorAll("td");
            tdElements.forEach(function (td) {
                if (td.classList.contains("sh_custom_class")) {
                    hasCustomClass = true;
                    return; // Exit the loop if the custom class is found in a <td>
                }
            });

            // If the custom class is not found, add a new <td> with the custom class
            if (!hasCustomClass) {
                var customTd = document.createElement("td");
                customTd.className = "sh_custom_class";
                row.children[0].insertAdjacentElement("afterend", customTd);
            }
        });
    }

    super.setDefaultColumnWidths();
    } else {
        super.setDefaultColumnWidths();
    }



    /*if (this.show_open_record_new_tab_button_listrenderer) {
      var trsWithGroupheader = $("tr:has(th.o_group_name)");
      if (trsWithGroupheader.length) {
        trsWithGroupheader.each(function () {
          var hasCustomClass = false;

          // Check if any <td> inside the <tr> contains the custom class
          $(this)
            .find("td")
            .each(function () {
              if ($(this).hasClass("sh_custom_class")) {
                hasCustomClass = true;
                return false; // Exit the loop if the custom class is found in a <td>
              }
            });

          // If the custom class is not found, add a new <td> with the custom class
          if (!hasCustomClass) {
            // $(this).append("<td class='sh_custom_class'>  with custom class</td>");
            $(this).children().eq(0).after("<td class='sh_custom_class'></td>");
          }
        });
      }
      super.setDefaultColumnWidths();
    } else {
      super.setDefaultColumnWidths();
    }*/
  },
});


// Action Menu

patch(ActionMenus.prototype, {
  /**
   * @override
   */

  setup(){
    this.show_open_record_new_tab_button_action = session.sh_enable_open_record_in_new_tab;
    super.setup();
  },

  onOpenRecord() {
    let record_activeIds = this.props.getActiveIds();
    for (var j in record_activeIds) {
      var url = window.location.href;
      var latest_url = url + "/" + record_activeIds[j];
      /*let result = latest_url.replace("view_type=list", "view_type=form");*/
      window.open(latest_url, "_blank");
    }
  },
});