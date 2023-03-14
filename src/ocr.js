import { useState, useEffect,useRef} from "react";
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import Webcam from "react-webcam";
export default function OCR() {
    const [capturedImage, setCapturedImage] = useState(null);
    const [imageCaptured, setImageCaptured] = useState(false);
    const [textCaptured, setTextCaptured] = useState('');
    const webcamRef = useRef(null);
    // const worker = createWorker({
    //     logger: m => console.log(m)
    //   });
    useEffect(() => {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            webcamRef.current.srcObject = stream;
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);
    // function getTextFromImage(imageSrc){
    //     Tesseract.recognize(imageSrc, {
    //         lang: 'eng',
    //         tessedit_pageseg_mode: 'auto'
    //       })
    //       .then(result => {
    //         setTextCaptured(result.text);
    //         console.log(result.text);
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    // };
    async function captureImage() {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setImageCaptured(true);
        //getTextFromImage(imageSrc);
        Tesseract.recognize(
            imageSrc,
            'eng',
            { logger: m => console.log(m) }
          ).then(({ data: { text } }) => {
            console.log(text);
          })
      };
    return (
        <>
        <Webcam audio={false} ref={webcamRef} />
        <button onClick={captureImage}>Capture Image</button>
        {imageCaptured && (
          <img src={capturedImage}/>
        )}
         {textCaptured && (
          <div>{textCaptured}</div>
        )}
      </>
    );
  }