import React, {useState,useEffect,useRef} from 'react';
import MagGradient from './utils/magGradient';
import Seams from './utils/seams';

type ImgProps = {
  src: string;
  width: number;
  height: number;
};

function Img(props: ImgProps) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = props.src;
    img.onload = () => {
      const scale = props.height / img.height;
      setWidth(Math.floor(img.width*scale));
      setHeight(props.height);
      const canvas = canvasRef.current;
      if (canvas == null) return; // current may be null
      const ctx = canvas.getContext("2d");
      if (ctx == null) return; // context may be null
      ctx.drawImage(img, 0, 0, width, height);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let gradient = new MagGradient(imageData);
      let seam = new Seams(gradient.magGradient);
      while(imageData.width > props.width){
        console.log(imageData.width)
        imageData = carveSeamFromImageData(seam.minSeam, imageData);
        gradient = new MagGradient(imageData);
        seam = new Seams(gradient.magGradient);
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    }
  });

  const carveSeamFromImageData = (seam: any, imageData: any) => { 
    let { width, height } = imageData;

    let nextImageData:any = Array.from(imageData.data);

    seam.forEach(pixel => {      
      nextImageData.splice(pixel * 4, 4);
    });

    return new ImageData(Uint8ClampedArray.from(nextImageData), width - 1, height);
  }
  

  if (width === 0){
    return <div>Loading</div>;
  }
  return (
    <canvas ref={canvasRef} width={width} height={height}/>
  );
}

export default Img;
