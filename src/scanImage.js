import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';
import preprocessImage from './preProcess';
function ScanImage() {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [showProcessedImg, setShowProcessedImg] = useState(false);
  const [spinner,setSpinner] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
 
  const handleChange = (event) => {
    setShowProcessedImg(true);
    setImage(URL.createObjectURL(event.target.files[0]))
  }

  const handleClick = () => {
    setSpinner(true);
    const canvas = canvasRef.current;
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageRef.current, 0, 0,canvas.width,canvas.height);
    ctx.putImageData(preprocessImage(canvas),0,0);
    const dataUrl = canvas.toDataURL("image/jpeg");
  
    Tesseract.recognize(
      dataUrl,'eng',
      { 
        logger: m => console.log(m) 
      }
    )
    .catch (err => {
      console.error(err);
    })
    .then(result => {
      // Get Confidence score
      let confidence = result.data.confidence
      // Get full output
      let text = result.data.text
      setSpinner(false);
      setText(text);
      // setPin(patterns);
    })
  }

  return (
    <div className="App">
        <h3>Actual image uploaded</h3>
        <img 
           src={image}
           ref={imageRef}
           //className="actualImage"
           />
        {/* {(showProcessedImg) && (
          <> */}
        <h3>Pre-processed Image</h3>
        <canvas ref={canvasRef} ></canvas>
        {/* </>
        )} */}
          <h3>Extracted text</h3>
          {(spinner)?<div className="loader"></div>:<textarea className="finalTextArea" disabled>{text}</textarea>}
        <input type="file" onChange={handleChange} className="fileInput"/>
        <button onClick={handleClick} className="submitText">Convert to text</button>
    </div>
  );
}

export default ScanImage