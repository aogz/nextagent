addEventListener("DOMContentLoaded", (event) => {
    document.body.focus();
    setup();
    activateHintMode();

    const handlers = {
        click: (message) => {
            const char = message.tag.toLowerCase();
            const event = new KeyboardEvent("keydown", {
                key: char,
                shiftKey: message.shiftKey,
                ctrlKey: message.ctrlKey,
                altKey: message.altKey,
                metaKey: message.metaKey,
            });
            handleKeydown(event);
        },

        type: (message) => {
            handlers.click({
                tag: message.tag.toLowerCase(),
                shiftKey: message.shiftKey,
                ctrlKey: message.ctrlKey,
                altKey: message.altKey,
                metaKey: message.metaKey,
            });

            window.document.activeElement.value = message.string;
            window.document.activeElement.dispatchEvent(
                new InputEvent("input", { bubbles: true })
            );
            document.body.focus();
        },
        navigate: (message) => {
            window.location.href = message.url;
        },
        scroll: (message) => {
            window.scrollBy(0, message.y);
        },
        wait: (message) => {
            setTimeout(() => {
                activateHintMode();
            }, message.time);
        },
        finish: (message) => {
            surflyExtension.surflySession.apiRequest({cmd: 'send_chat_message', message: `✨ Agent: Finished`});
        },
        ask: (message) => {
            surflyExtension.surflySession.apiRequest({cmd: 'send_chat_message', message: `✨ Agent: Question: ${message.question}`});
        },
        hints: (message) => {
            activateHintMode();
        },
    };

    surflyExtension.runtime.onMessage.addListener((message, sender) => {
        if (message?.command in handlers) {
            try {
                handlers[message.command](message);
            } catch (error) {
                console.error('Error executing command:', error);
            }
        } else {
            console.log("content script: message not found", message);
        }
    });

    surflyExtension.surflySession.apiRequest({cmd: 'send_chat_message', message: `✨ Agent: Hello! Type /help to see available commands.`});
});
