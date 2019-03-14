"use strict";
var app = app||{};

app.Skyrim_Menu = {
    chosen_item_type: 0,
    can_scroll: true,
    item_list_showing: false,
    current_item_list: [],
    
    chosen_item: 0,
    
    PLAYER: "",
    
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