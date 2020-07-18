Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    // faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(() => {
    loadFace();
});

function loadFace() {
    var photo = document.getElementById('photo')
    var url = prompt('Paste photo url');
    photo.setAttribute('src', url);

    if (!photo.complete) {
        alert('Photo origin site is blocking access, please try different photo.')
    }
}

let once = true;
photo.addEventListener('load', function () {
    findFace()

});
function findFace() {
    const canvas = faceapi.createCanvasFromMedia(photo)
    document.body.append(canvas);
    const displaySize = { width: photo.width, height: photo.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(photo, new
            faceapi.TinyFaceDetectorOptions()).
            withFaceExpressions().withAgeAndGender()

        const resizedDetection = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetection)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetection)

        faceapi.draw.drawFaceExpressions(canvas, resizedDetection)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetection)
        resizedDetection.forEach(detection => {
            const box = detection.detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
            drawBox.draw(canvas)
        })

    }, 50)

}
