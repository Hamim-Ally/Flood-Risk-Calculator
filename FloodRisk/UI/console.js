import { Container, Label } from "../../vendor/Sugar/index.js";

class Console extends Container {
    constructor(args = {}) {
        super(args);
        this.class.add('console');

        this.logQueue = [];
        this.isLogging = false;

        const header = new Container({
            class: 'header',
            flex: true,
            flexDirection: 'row',
            justifyContent: 'space-between',
        });

        const title = new Label({
            class: 'title',
            text: 'Console',
        });

        this.main = new Container({
            class: 'main',
            flex: true,
            flexDirection: 'column',
            scrollable: true
        });

        this.main.dom.style.overflowY = 'auto';

        header.append(title);
        this.append(header);
        this.append(this.main);
    }

    // Log methods — store both message & type
    Log(message) {
        this.logQueue.push({ type: 'log', message });
        if (!this.isLogging) {
            this.#processLogQueue();
        }
    }

    Info(message) {
        this.logQueue.push({ type: 'info', message });
        if (!this.isLogging) {
            this.#processLogQueue();
        }
    }

    Debug(message) {
        this.logQueue.push({ type: 'debug', message });
        if (!this.isLogging) {
            this.#processLogQueue();
        }
    }

    Warn(message) {
        this.logQueue.push({ type: 'warn', message });
        if (!this.isLogging) {
            this.#processLogQueue();
        }
    }

    Error(message) {
        this.logQueue.push({ type: 'error', message });
        if (!this.isLogging) {
            this.#processLogQueue();
        }
    }

    clear() {
        this.main.dom.innerHTML = '';
    }

    // Private method: handles log queue with typewriter effect
    #processLogQueue() {
        if (this.logQueue.length === 0) {
            this.isLogging = false;
            return;
        }

        this.isLogging = true;

        const { type, message } = this.logQueue.shift();
        const logbox = new Container({ class: 'logbox', height: 'auto' });
        logbox.class.add(type); // Adds 'log', 'info', 'debug', etc.

        const logtext = new Label({ text: '' });
        logbox.append(logtext);
        this.main.append(logbox);

        let i = 0;
        const typeSpeed = 20; // ms per character

        const typeWriter = setInterval(() => {
            logtext.text += message[i];
            i++;

            // Scroll the inner log container, not the full component
            this.main.dom.scrollTop = this.main.dom.scrollHeight;

            if (i >= message.length) {
                clearInterval(typeWriter);
                setTimeout(() => this.#processLogQueue(), 200); // wait before next log
            }
        }, typeSpeed);
    }
}

export { Console };
