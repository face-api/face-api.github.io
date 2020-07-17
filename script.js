Promise.all([
faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
// faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
faceapi.nets.faceExpressionNet.loadFromUri('/models'),
faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(()=>{
loadVideo();
});
function prepareFaceDetector() {
   let base_image = new Image();
   base_image.src = "/startFaceDetect.jpg";
   base_image.onload = function() {
     const useTinyModel = true;
     const fullFaceDescription = faceapi
       .detectSingleFace(base_image, new faceapi.TinyFaceDetectorOptions())
       .run()
       .then(res => {
         console.log("--------> " + JSON.stringify(res));
       });
   };
   loadVideo();
}


function loadVideo(){

// navigator.getUserMedia = navigator.getUserMedia ||
                        //  navigator.webkitGetUserMedia ||
                        //  navigator.mozGetUserMedia;

// if (navigator.getUserMedia) {
   // navigator.getUserMedia({ audio: true, video: { width: 1280, height: 720 } },
      // function(stream) {
         var video = document.getElementById('video').src="test.mp4";
         //  video.srcObject = stream;

         video.onloadedmetadata = function(e) {
           video.play();
           video.playbackRate = 0.1;

         };
      // },
      // function(err) {
         // console.log("The following error occurred: " + err.name);
      // }
   // );
// } else {
//    console.log("getUserMedia not supported");
// }

}

let once = true;

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height}
    faceapi.matchDimensions(canvas,displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new 
            faceapi.TinyFaceDetectorOptions()).
            withFaceExpressions().withAgeAndGender()

        const resizedDetection = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetection)
      //   faceapi.draw.drawFaceLandmarks(canvas, resizedDetection)

        faceapi.draw.drawFaceExpressions(canvas, resizedDetection)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetection)
        resizedDetection.forEach( detection => {
         const box = detection.detection.box
         const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
         drawBox.draw(canvas)
       })

    },100)
   //  if(once === true){
   //  video.pause();
   //  setTimeout(()=>{
   //    video.play();
   //  },4000);
   // once =false
   // } 
});

