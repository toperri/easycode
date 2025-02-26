function registerBlock(internalName, displayName, generator, codeMaker, color) {
    Blockly.Blocks[internalName] = {
        init: function() {
            this.appendDummyInput()
                .appendField(displayName);
                generator(this);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(color || 230);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };

    Blockly.Lua.forBlock[internalName] = function(block) {
        return codeMaker(block);
    };
}

let workspace;


(async () => {
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

    const toolbox = await fetch('toolbox.json').then(response => response.json());
    // The toolbox gets passed to the configuration struct during injection.
    workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox});
})();
  

function exportLua() {
    var code = Blockly.Lua.workspaceToCode(workspace);

    if (code.includes('function onBoot()')) {
        code += '\nonBoot()';
        // Call onBoot() if it exists.
    }
    
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'New EasyCode LUA code.lua';
    link.click();
}

let saved = false;

window.onbeforeunload = function() {
    if (!saved) {
        return 'You have unsaved changes!';
    }
}
function saveProject() {

    saved = true;
    const state = Blockly.serialization.workspaces.save(workspace);
    const blob = new Blob([JSON.stringify(state)], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    var aa = prompt('Enter the filename to save:', 'New EasyCode File');
    link.download = ([null, ""].includes(aa) ? 'New EasyCode File' : aa) + '.ezc';
    if (link.download) {
        link.click();
    }
}

function loadProject() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xml';
    input.onchange = () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            Blockly.serialization.workspaces.load(JSON.parse(reader.result), workspace);
        };
        reader.readAsText(file);
    };
    input.click();
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('base.ezc')
        .then(response => response.json())
        .then(xml => {
            Blockly.serialization.workspaces.load((xml), workspace);
        })
        .catch(error => console.error('Error loading base.xml:', error));
});

function help() {
    createWindow('credits/credits.html', 'Help', 800, 600);
}

function createWindow(url, name, width = 400, height = 300) {
    const windowDiv = document.createElement('div');
    windowDiv.style.position = 'absolute';
    windowDiv.style.top = '50px';
    windowDiv.style.left = '50px';
    windowDiv.style.width = width + 'px';
    windowDiv.style.height = height + 'px';
    windowDiv.style.border = '1px solid black';
    windowDiv.style.backgroundColor = 'white';
    windowDiv.style.resize = 'both';
    windowDiv.style.overflow = 'hide';
    windowDiv.style.zIndex = 1000;

    const headerDiv = document.createElement('div');
    headerDiv.style.width = '100%';
    headerDiv.style.height = '30px';
    headerDiv.style.backgroundColor = '#ccc';
    headerDiv.style.cursor = 'move';
    headerDiv.style.display = 'flex';
    headerDiv.style.alignItems = 'center';
    headerDiv.style.justifyContent = 'space-between';
    headerDiv.innerHTML = '<span style="margin-left: 10px">' + name + '</span><button style="margin-right: 10px">X</button>';
    headerDiv.querySelector('button').addEventListener('click', () => {
        document.body.removeChild(windowDiv);
    });
    windowDiv.appendChild(headerDiv);

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = 'calc(100% - 30px)';
    iframe.style.border = 'none';

    windowDiv.appendChild(iframe);
    document.body.appendChild(windowDiv);

    let isDragging = false;
    let offsetX, offsetY;

    headerDiv.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - windowDiv.offsetLeft;
        offsetY = e.clientY - windowDiv.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            windowDiv.style.left = `${e.clientX - offsetX}px`;
            windowDiv.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

function playAudio(url) {
    const audio = new Audio(url);
    audio.play();
}
function file() {
    document.querySelector('.file').style.display = 'block';
    document.querySelector('.menu').style.display = 'none';

    playAudio('snd/confirm.mp3');
}

function back() {
    document.querySelector('.file').style.display = 'none';
    document.querySelector('.menu').style.display = 'block';

    playAudio('snd/back.mp3');
}