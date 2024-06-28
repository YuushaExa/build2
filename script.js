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

    const iframe = document.getElementById('web-frame');

    iframe.addEventListener('load', function() {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        iframeDoc.addEventListener('dragstart', function(event) {
            if (event.target.tagName === 'IMG' || event.target.tagName === 'DIV' || event.target.tagName === 'P') {
                const tagName = event.target.tagName.toLowerCase();
                const data = {
                    tag: tagName,
                    content: event.target.outerHTML
                };
                event.dataTransfer.setData('application/json', JSON.stringify(data));
            }
        });
    });

    canvas.on('drop', function(event) {
        event.e.preventDefault();
        const data = event.e.dataTransfer.getData('application/json');
        if (data) {
            const { tag, content } = JSON.parse(data);
            const pointer = canvas.getPointer(event.e);

            if (tag === 'img') {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
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
            } else if (tag === 'div' || tag === 'p') {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                const textContent = tempDiv.textContent || tempDiv.innerText;
                const text = new fabric.Text(textContent, {
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
