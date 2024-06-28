document.addEventListener('DOMContentLoaded', function() {
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

    const canvas = new fabric.Canvas('canvas');
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight - 50);

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
});
