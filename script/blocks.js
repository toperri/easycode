registerBlock("startCountdown", "start countdown", function(b) {

}, function(block) {
    return "startCountdown()\n";
}, 90);

registerBlock("endSong", "end song", function(b) {

}, function(block) {
    return "endSong()\n";
}, 10);

Blockly.Blocks["getSongPosition"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("get song position");
        this.setOutput(true, "Number"); // Set it as an output block with a number type
        this.setColour(180);
        this.setTooltip('Returns the current song position');
        this.setHelpUrl('');
    }
};


Blockly.Lua.forBlock["getSongPosition"] = function(block) {
    return ["getSongPosition()", Blockly.Lua.ORDER_ATOMIC]; // Return function result
};

Blockly.Blocks["restartSong"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("restart song (skip transition ?")
            .appendField(new Blockly.FieldCheckbox("TRUE"), "SKIP")
            .appendField(")");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Lua.forBlock["restartSong"] = function(block) {
    return "restartSong(" + block.getFieldValue("SKIP").toLowerCase() + ")\n";
}

Blockly.Blocks["exitSong"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("exit song (skip transition ?")
            .appendField(new Blockly.FieldCheckbox("TRUE"), "SKIP")
            .appendField(")");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Lua.forBlock["exitSong"] = function(block) {
    return "exitSong(" + block.getFieldValue("SKIP").toLowerCase() + ")\n";
}

Blockly.Blocks["loadSong"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("load song ")
            .appendField(new Blockly.FieldTextInput("song"), "SONG")
            .appendField(" with difficulty ")
            .appendField(new Blockly.FieldNumber(1, 0, 2), "DIFFICULTY")
            .appendField(" (0 = easy, 1 = medium, 2 = hard)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Lua.forBlock["loadSong"] = function(block) {
    return "loadSong('" + block.getFieldValue("SONG") + "', " + block.getFieldValue("DIFFICULTY") + ")\n";
}

Blockly.Blocks["loadVideo"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("load video ")
            .appendField(new Blockly.FieldTextInput("video"), "VIDEO")
            .appendField(" (can skip ?")
            .appendField(new Blockly.FieldCheckbox("TRUE"), "SKIP")
            .appendField("; mid song ?")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "MID")
            .appendField("; loop ?")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "LOOP")
            .appendField("; play on load ?")
            .appendField(new Blockly.FieldCheckbox("TRUE"), "PLAY");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(260);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Lua.forBlock["loadVideo"] = function(block) {
    return "loadVideo('" + block.getFieldValue("VIDEO").toLowerCase() + "', " + block.getFieldValue("SKIP").toLowerCase() + ", " + block.getFieldValue("MID").toLowerCase() + ", " + block.getFieldValue("LOOP").toLowerCase() + ", " + block.getFieldValue("PLAY").toLowerCase() + ")\n";
}

Blockly.Blocks["luaCode"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("run LUA code ")
            .appendField(new Blockly.FieldTextInput("print(\"hello!\")"), "CODE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Lua.forBlock["luaCode"] = function(block) {
    return block.getFieldValue("CODE") + "\n";
}

Blockly.Blocks["luaCodeWReturn"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("LUA statement ")
            .appendField(new Blockly.FieldTextInput("return 42"), "CODE");
        this.setOutput(true, null); // Set it as an output block
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Lua.forBlock["luaCodeWReturn"] = function(block) {
    return [block.getFieldValue("CODE"), Blockly.Lua.ORDER_ATOMIC];
};

Blockly.Blocks["makeLuaSprite"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("create sprite with image ")
            .appendField(new Blockly.FieldTextInput("sprite"), "SPRITE")
            .appendField(" at x ")
            .appendField(new Blockly.FieldNumber(0), "X")
            .appendField(" y ")
            .appendField(new Blockly.FieldNumber(0), "Y")
            .appendField(" with tag ")
            .appendField(new Blockly.FieldTextInput("tag"), "TAG");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Lua.forBlock["makeLuaSprite"] = function(block) {
    return "makeSprite(\"" + block.getFieldValue("TAG") + "\", \"" + block.getFieldValue("SPRITE") + "\", " + block.getFieldValue("X") + ", " + block.getFieldValue("Y") + ")\n";
}

Blockly.Blocks["makeGraphic"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("create graphic (color: ")
            .appendField(new Blockly.FieldTextInput("#FFFFFF"), "COLOR")
            .appendField("; width ")
            .appendField(new Blockly.FieldNumber(0), "W")
            .appendField("; height ")
            .appendField(new Blockly.FieldNumber(0), "H")
            .appendField("; tag ")
            .appendField(new Blockly.FieldTextInput("tag"), "TAG")
            .appendField(")");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Lua.forBlock["makeGraphic"] = function(block) {
    return "makeGraphic(\"" + block.getFieldValue("TAG") + "\", " + block.getFieldValue("W") + ", " + block.getFieldValue("H") + ", \"" + block.getFieldValue("COLOR") + "\")\n";
};
