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
    eval(await fetch('script/blocks.js').then(response => response.text()));

    var toolbox = null;
    try {
        toolbox = await fetch('toolbox.json').then(response => response.json());
    }
    catch (e) {
        blurt(
            'Error',
            'Failed to load toolbox',
            'error'
        );
    }
    // The toolbox gets passed to the configuration struct during injection.
    workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox});

    workspace.addChangeListener(function(event) {
        if (event.type === Blockly.Events.BLOCK_CREATE) {
            let block = workspace.getBlockById(event.blockId);
            const undeletables = ['onBoot', 'onUpdate'];
            if (block && block.type === 'procedures_defnoreturn') {
                const funcName = block.getFieldValue('NAME');
                if (undeletables.includes(funcName)) {
                    block.setDeletable(false);
                    block.setColour('#808080');
                }
            }
        }
    });

    fetch('base.ezc')
        .then(response => response.json())
        .then(xml => {
            Blockly.serialization.workspaces.load((xml), workspace);
        })
        .catch(error => console.error('Error loading base.xml:', error));
})();
  

async function exportLua() {
    var filename = await bromptPromise('Enter the filename to save');
    var code = Blockly.Lua.workspaceToCode(workspace);

    if (code.includes('function onBoot()')) {
        code += '\nonBoot()';
        // Call onBoot() if it exists.
    }
    
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename.replace('.lua','') + '.lua';
    link.click();
}

let saved = false;

window.onbeforeunload = function() {
    if (!saved) {
        return 'You have unsaved changes!';
    }
}

function bromptPromise(message) {
    return new Promise((resolve, reject) => {
        brompt(message, resolve);
    });
}
async function saveProject() {

    saved = true;
    const state = Blockly.serialization.workspaces.save(workspace);
    const blob = new Blob([JSON.stringify(state)], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    var aa = await bromptPromise('Enter the filename to save');
    link.download = ([null, ""].includes(aa) ? 'New EasyCode File' : aa) + '.ezc';
    if (link.download) {
        link.click();
    }
}

function loadProject() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ezc';
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

function docs() {
    createWindow('guide/index.html', 'Documentation browser', 800, 600);
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

    return iframe;
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

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.altKey && event.code === 'KeyC') {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.style.position = 'absolute';
        colorPicker.style.left = '-9999px';
        document.body.appendChild(colorPicker);
        colorPicker.click();
        colorPicker.addEventListener('input', () => {
            const color = colorPicker.value;
            navigator.clipboard.writeText(color).then(() => {
                console.log(`Color ${color} copied to clipboard`);
            }).catch(err => {
                console.error('Failed to copy color: ', err);
            });
        });
    }
});

window.blurt = blurt;
window.brompt = brompt;