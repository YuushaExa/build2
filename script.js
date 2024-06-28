// script.js

document.addEventListener('DOMContentLoaded', function() {
    const canvas = new fabric.Canvas('canvas');
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight / 2);

    document.getElementById('load-url').addEventListener('click', function() {
        const url = document.getElementById('url-input').value;
        if (url) {
            document.getElementById('web-frame').src = url;
        }
    });

    document.getElementById('create-square').addEventListener('click', function() {
        const square = new fabric.Rect({
            left: 50,
            top: 50,
            width: 100,
            height: 100,
            fill: 'red'
        });

        canvas.add(square);
        canvas.setActiveObject(square);

        createInputField(square);
    });

    function createInputField(target) {
        const inputDiv = document.createElement('div');
        inputDiv.style.position = 'absolute';
        inputDiv.style.left = `${target.left}px`;
        inputDiv.style.top = `${target.top - 30}px`;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter URL';
        inputDiv.appendChild(input);

        const button = document.createElement('button');
        button.innerText = 'OK';
        inputDiv.appendChild(button);

        document.body.appendChild(inputDiv);

        button.addEventListener('click', function() {
            const url = input.value;
            if (url) {
                convertToIframe(target, url);
                document.body.removeChild(inputDiv);
            }
        });

        canvas.on('object:moving', function(e) {
            inputDiv.style.left = `${e.target.left}px`;
            inputDiv.style.top = `${e.target.top - 30}px`;
        });

        canvas.on('object:scaling', function(e) {
            inputDiv.style.left = `${e.target.left}px`;
            inputDiv.style.top = `${e.target.top - 30}px`;
        });
    }

    function convertToIframe(target, url) {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.position = 'absolute';
        iframe.style.left = `${target.left}px`;
        iframe.style.top = `${target.top}px`;
        iframe.style.width = `${target.width * target.scaleX}px`;
        iframe.style.height = `${target.height * target.scaleY}px`;
        iframe.style.border = 'none';

        document.body.appendChild(iframe);

        // Update iframe position and size on object move/scale
        canvas.on('object:moving', function(e) {
            if (e.target === target) {
                iframe.style.left = `${e.target.left}px`;
                iframe.style.top = `${e.target.top}px`;
            }
        });

        canvas.on('object:scaling', function(e) {
            if (e.target === target) {
                iframe.style.width = `${e.target.width * e.target.scaleX}px`;
                iframe.style.height = `${e.target.height * e.target.scaleY}px`;
            }
        });
    }

    // Adding Drag and Drop Functionality
    const iframe = document.getElementById('web-frame');

    iframe.addEventListener('load', function() {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        iframeDoc.addEventListener('dragstart', function(event) {
            if (event.target.tagName === 'IMG' || event.target.tagName === 'DIV') {
                event.dataTransfer.setData('text/html', event.target.outerHTML);
            } else if (event.target.tagName === 'A') {
                event.dataTransfer.setData('text/plain', event.target.href);
            }
        });
    });

    canvas.on('drop', function(event) {
        event.e.preventDefault();
        const data = event.e.dataTransfer.getData('text/html');
        const pointer = canvas.getPointer(event.e);

        if (data) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;

            const img = tempDiv.querySelector('img');
            if (img) {
                fabric.Image.fromURL(img.src, function(oImg) {
                    oImg.set({
                        left: pointer.x,
                        top: pointer.y,
                        scaleX: 0.5,
                        scaleY: 0.5
                    });
                    canvas.add(oImg);
                });
            }

            const textDiv = tempDiv.querySelector('div');
            if (textDiv) {
                const text = new fabric.Text(textDiv.textContent, {
                    left: pointer.x,
                    top: pointer.y,
                    fontSize: 20
                });
                canvas.add(text);
            }
        }
    });

    canvas.on('dragover', function(event) {
        event.e.preventDefault();
    });
});
