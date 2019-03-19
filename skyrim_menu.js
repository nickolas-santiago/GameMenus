"use strict";
var app = app||{};

app.Skyrim_Menu = {
    chosen_item_type: 0,
    can_scroll: true,
    item_list_showing: false,
    current_item_list: [],
    
    chosen_item: 0,
    
    PLAYER: "",
    
    item_information_window_obj: {
        item_description_lines: []
    },
    
    init: function()
    {
        console.log(player);
        this.PLAYER = player;
        this.update();
    },
    renderItemMenu: function()
    {
        this.renderItemTypeList();
    },
    renderItemTypeList()
    {
        var section_width = 150;
        var section_xpos = 10;
        var section_border_width = 2;
        var section_border_buffer = 7;
        var visible_limit = 5;
        var item_type_list = ["FAVORITES", "ALL", ...GAME_ITEM_TYPE_LIST];
        
        if(app.keydown[38] == true)
        {
            if(this.can_scroll == true)
            {
                if(this.item_list_showing == false)
                {
                    if(this.chosen_item_type > 0)
                    {
                        this.chosen_item_type--;
                    }
                }
                else if(this.item_list_showing == true)
                {
                    if(this.chosen_item > 0)
                    {
                        this.chosen_item--;
                        this.renderChosenItemInfoWindow();
                    }
                }
                this.can_scroll = false;
            }
        }
        else if(app.keydown[40] == true)
        {
            if(this.can_scroll == true)
            {
                if(this.item_list_showing == false)
                {
                    if(this.chosen_item_type < (item_type_list.length - 1))
                    {
                        this.chosen_item_type++;
                    }
                }
                else if(this.item_list_showing == true)
                {
                    if(this.chosen_item < (this.current_item_list.length - 1))
                    {
                        this.chosen_item++;
                        this.renderChosenItemInfoWindow();
                    }
                }
                this.can_scroll = false;
            }
        }
        else if(app.keydown[39] == true)
        {
            if((this.can_scroll == true) && (this.item_list_showing == false))
            {
                this.item_list_showing = true;
                this.createItemList(item_type_list);
                this.renderChosenItemInfoWindow();
                this.can_scroll = false;
            }
        }
        else if(app.keydown[37] == true)
        {
            if((this.can_scroll == true) && (this.item_list_showing == true))
            {
                this.item_list_showing = false;
                this.current_item_list = [];
                this.chosen_item = 0;
                this.can_scroll = false;
            }
        }
        else
        {
            this.can_scroll = true;
        }
        
        //---render section wrapper
        canvas_context.fillStyle = "rgba(255,255,255,0.5)";
        canvas_context.fillRect(section_xpos, 0, section_width, canvas.height);
        //---render section wrapper borders
        canvas_context.fillStyle = "rgba(255,255,255,1)";
        canvas_context.fillRect((section_xpos + section_border_buffer), 0, section_border_width, canvas.height);
        canvas_context.fillRect((section_xpos + (section_width - section_border_buffer - section_border_width)), 0, section_border_width, canvas.height);
        //---render section list
        canvas_context.textBaseline = "middle";
        canvas_context.textAlign = "left"; 
        for(var item_type = 0; item_type < item_type_list.length; item_type++)
        {
            if((item_type >= (this.chosen_item_type - visible_limit)) && (item_type <= (this.chosen_item_type + visible_limit)))
            {
                var item_type_xpos = (section_xpos + section_border_buffer + section_border_width + section_border_buffer);
                var item_type_ypos = 0;
                if((item_type == (this.chosen_item_type - visible_limit)) || (item_type == (this.chosen_item_type + visible_limit)))
                {
                    canvas_context.fillStyle = "rgba(255,255,255,0.5)";
                }
                else
                {
                    canvas_context.fillStyle = "rgba(255,255,255,1)";
                }
                if(item_type == this.chosen_item_type)
                {
                    canvas_context.font = "20px Arial";
                    item_type_ypos = (canvas.height/2);
                }
                else
                {
                    canvas_context.font = "15px Arial";
                    item_type_ypos = (canvas.height/2) - (40 * (this.chosen_item_type - item_type));
                }
                canvas_context.fillText(item_type_list[item_type], item_type_xpos, item_type_ypos);
            }
        }
        if(this.item_list_showing == true)
        {
            this.renderItemList();
            this.renderSelectedItemSection();
        }
    },
    
    renderChosenItemInfoWindow: function()
    {
        var info_window_max_width = 200;
        var info_widnow_attr_padding = 40;
        var info_window_total_attr_width = 0;
        this.item_information_window_obj.item_description_lines = [];
        
        //---RENDERING ITEM ATTRIBUTES
        var info_window_attr = [
            {
                item_prop_name: "weapon_base_damage",
                item_attr_name: "DAMAGE "
            },
            {
                item_prop_name: "item_weight",
                item_attr_name: "WEIGHT "
            },
            {
                item_prop_name: "item_value",
                item_attr_name: "VALUE "
            }
        ];
        // (1) check which attributes the chosen item has
        for(var attr = 0; attr < info_window_attr.length; attr++)
        {
            if(this.current_item_list[this.chosen_item][info_window_attr[attr].item_prop_name])
            {
                info_window_attr[attr].item_attr_value = this.current_item_list[this.chosen_item][info_window_attr[attr].item_prop_name];
                info_window_attr[attr].item_attr_name_xpos = info_window_total_attr_width;
                // (2) calculate the width of the attributes
                var attr_name_font = "11px Arial";
                var attr_value_font = "20px Arial";

                canvas_context.save();
                    canvas_context.font = attr_name_font;
                    info_window_total_attr_width += canvas_context.measureText(info_window_attr[attr].item_attr_name).width;
                    info_window_attr[attr].item_attr_value_xpos = info_window_total_attr_width;
                    canvas_context.font = attr_value_font;
                    info_window_total_attr_width += canvas_context.measureText("0000  ").width;
                canvas_context.restore();
            }
            else
            {
                info_window_attr.splice(attr,1);
                attr--;
            }
        }
        this.item_information_window_obj.attr_array = info_window_attr;
        this.item_information_window_obj.info_window_total_attr_width = info_window_total_attr_width;
        
        //---RENDERING ITEM DESCRIPTION
        if(this.current_item_list[this.chosen_item].item_description)
        {
            canvas_context.font = "11px Arial";
            var item_description_split = this.current_item_list[this.chosen_item].item_description.split(" ");
            console.log(item_description_split)
            var current_description_line = "";
            for(var word = 0; word < item_description_split.length; word++)
            {
                if(current_description_line == "")
                {
                    current_description_line += item_description_split[word];
                }
                else
                {
                    if(canvas_context.measureText(current_description_line + " " + item_description_split[word]).width <= info_window_max_width)
                    {
                        current_description_line += (" " + item_description_split[word]);
                    }
                    else
                    {
                        this.item_information_window_obj.item_description_lines.push(current_description_line);
                        current_description_line = "";
                    }
                }
                if(word == (item_description_split.length - 1))
                {
                    this.item_information_window_obj.item_description_lines.push(current_description_line);
                }
            }
        }
    },
    
    renderItemList()
    {
        var section_width = 150;
        var section_xpos = 210;
        var section_border_width = 2;
        var section_border_buffer = 7;
        var visible_limit = 5;
        
        //---render section wrapper
        canvas_context.fillStyle = "rgba(255,255,255,0.5)";
        canvas_context.fillRect(section_xpos, 0, section_width, canvas.height);
        //---render section wrapper borders
        canvas_context.fillStyle = "rgba(255,255,255,1)";
        canvas_context.fillRect((section_xpos + section_border_buffer), 0, section_border_width, canvas.height);
        canvas_context.fillRect((section_xpos + (section_width - section_border_buffer - section_border_width)), 0, section_border_width, canvas.height);
        
        //---render list
        canvas_context.textBaseline = "middle";
        canvas_context.textAlign = "left"; 
        for(var item = 0; item < this.current_item_list.length; item++)
        {
            if((item >= (this.chosen_item - visible_limit)) && (item <= (this.chosen_item + visible_limit)))
            {
                var item_name_xpos = (section_xpos + section_border_buffer + section_border_width + section_border_buffer);
                var item_name_ypos = 0;
                if((item == (this.chosen_item - visible_limit)) || (item == (this.chosen_item + visible_limit)))
                {
                    canvas_context.fillStyle = "rgba(255,255,255,0.5)";
                }
                else
                {
                    canvas_context.fillStyle = "rgba(255,255,255,1)";
                }
                if(item == this.chosen_item)
                {
                    canvas_context.font = "15px Arial";
                    item_name_ypos = (canvas.height/2);
                }
                else
                {
                    canvas_context.font = "13px Arial";
                    item_name_ypos = (canvas.height/2) - (20 * (this.chosen_item - item));
                }
                canvas_context.fillText(this.current_item_list[item].name, item_name_xpos, item_name_ypos);
            }
        }
    },
    
    createItemList: function(item_type_list_)
    {
        var self = this;
        //---take what items are related
        this.current_item_list = this.PLAYER.items.filter(function(item)
        {
            if(self.chosen_item_type == 0)
            {
                if(item.favorite == true)
                {
                    return item;
                }
            }
            else if(self.chosen_item_type == 1)
            {
                return item;
            }
            else
            {
                return item.item_type == item_type_list_[self.chosen_item_type];
            }
        });
        //---put item list in alphabetical order
        this.current_item_list = this.current_item_list.sort(function(a, b)
        {
            if(a.name < b.name)
            {
                return -1;
            }
            else if(a.name > b.name)
            {
                return 1;
            }
            else
            {
                return 0;
            }
        });
    },
    
    renderSelectedItemSection: function()
    {
        //---render selected item info section
        var info_window_width = 230;
        var info_window_height = 170;
        var info_window_r_xpos = (canvas.width - 25);
        var info_window_ypos_top = 100;
        //---render selected item info window
        canvas_context.beginPath();
        canvas_context.moveTo(info_window_r_xpos, info_window_ypos_top);
        canvas_context.lineTo((info_window_r_xpos - info_window_width), info_window_ypos_top);
        canvas_context.lineTo((info_window_r_xpos - info_window_width), (info_window_ypos_top + info_window_height));
        canvas_context.lineTo(info_window_r_xpos, (info_window_ypos_top + info_window_height));
        canvas_context.lineTo(info_window_r_xpos, info_window_ypos_top);
        canvas_context.stroke();
        //---render item name
        canvas_context.textAlign = "center"; 
        canvas_context.fillStyle = "white";
        canvas_context.font = "23px Arial";
        canvas_context.fillText(this.current_item_list[this.chosen_item].name, (info_window_r_xpos - (info_window_width/2)), info_window_ypos_top + 20);

        //---RENDERING ITEM ATTRIBUTES
        for(var attr = 0; attr < this.item_information_window_obj.attr_array.length; attr++)
        {
            var attr_name_xpos = ((info_window_r_xpos - (info_window_width/2)) - (this.item_information_window_obj.info_window_total_attr_width/2)) + this.item_information_window_obj.attr_array[attr].item_attr_name_xpos;
            var attr_value_xpos = ((info_window_r_xpos - (info_window_width/2)) - (this.item_information_window_obj.info_window_total_attr_width/2)) + this.item_information_window_obj.attr_array[attr].item_attr_value_xpos;
            canvas_context.textAlign = "left";
            canvas_context.font = "11px Arial";
            canvas_context.fillText(this.item_information_window_obj.attr_array[attr].item_attr_name, attr_name_xpos, 200);
            canvas_context.font = "20px Arial";
            canvas_context.fillText(this.item_information_window_obj.attr_array[attr].item_attr_value, attr_value_xpos, 200);
        }

        // --- render a description
        if(this.item_information_window_obj.item_description_lines.length > 0)
        {
            canvas_context.font = "11px Arial";
            for(var description_line = 0; description_line < this.item_information_window_obj.item_description_lines.length; description_line++)
            {
                //var attr_name_xpos = ((info_window_r_xpos - (info_window_width/2)) - (this.item_information_window_obj.info_window_total_attr_width/2)) + this.item_information_window_obj.attr_array[attr].item_attr_name_xpos;
                var xposx = ((info_window_r_xpos - (info_window_width/2)) - (canvas_context.measureText(this.item_information_window_obj.item_description_lines[description_line]).width)/2);
                
                canvas_context.fillText(this.item_information_window_obj.item_description_lines[description_line], xposx, 200 + (11 * (description_line + 1)));
            }
        }
    },
    
    update: function()
    {
        this.animationID = requestAnimationFrame(this.update.bind(this));
        canvas_context.fillStyle = "orange";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        this.renderItemMenu();
        /*
        canvas_context.beginPath();
        canvas_context.moveTo(0, canvas.height/2);
        canvas_context.lineTo(canvas.width, canvas.height/2);
        canvas_context.stroke(); 
        */
    }
};