import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Text, Image } from 'react-konva';
import { useSocket } from './SocketContext';
import { useRecoilState } from 'recoil';
import roomatom from '../Recoil/Atoms/Roomid.atom';
import styles from '../Styles/canvas.module.css';
import { authState } from '../Recoil/Atoms/Login.atom';
import useImage from 'use-image';

const Canvas = () => {
  const [tool, setTool] = useState('pen');
  const [auth, setauth] = useRecoilState(authState);
  const [lines, setLines] = useState([]);
  const [previousStateOfLines, setPreviousStateOfLines] = useState([]);
  const [redoLines, setRedoLines] = useState([]);
  const isDrawing = useRef(false);
  const [pointers, setPointers] = useState({});
  const [color, setColor] = useState('#df4b26'); // Color state
  const [brushSize, setBrushSize] = useState(5); // Brush size state
  const { socket } = useSocket();
  const [rt, setrt] = useRecoilState(roomatom);
  const roomId = rt.roomId;

  const stageRef = useRef(null);
  const [image] = useImage(auth.user.avatar);
const [loading,setloading]=useState(false);
  const downloadCanvas = () => {
    const stage = stageRef.current;
 
    if (stage) {
      const dataURL = stage.toDataURL({
        pixelRatio: 3,
        bgcolor: 'white'
      });
     //emit send image
     socket.emit('sendimage',{image:dataURL,userId:auth.user._id});
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'canvas-image.png';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setloading(true);
    }
  };

  useEffect(() => {
    if (socket && roomId) {

      socket.on('deletedsuccess',(success)=>{
        if(success){
          setloading(false);
        }
      })
      socket.on('drawing', (newLine) => {
        setLines((prevLines) => [...prevLines, newLine]);
      });

      socket.on('pointer', ({ pointer, userId }) => {
        setPointers((prevPointers) => ({
          ...prevPointers,
          [userId]: pointer
        }));
      });

      socket.on('undo', (updatedLines) => {
        setLines(updatedLines);
      });

      return () => {
        socket.off('drawing');
        socket.off('pointer');
        socket.off('undo');
        socket.off('deletedsuccess')
      };
    }
  }, [socket, roomId]);

  const handlePointerDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = { tool, points: [pos.x, pos.y], color, strokeWidth: brushSize };
    setLines((prevLines) => [...prevLines, newLine]);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);

    socket.emit('drawing', { roomId, line: lastLine });
    socket.emit('pointer', { roomId, pointer: point });
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const undo = () => {
    if (lines.length > 0) {
      const updatedLines = [...lines];
      const lastLine = updatedLines.pop();

      setPreviousStateOfLines((prev) => [...prev, lastLine]);
      setRedoLines((prev) => [...prev, lastLine]);

      setLines(updatedLines);
      socket.emit('undo', { roomId, updatedLines });
    }
  };

  const redo = () => {
    if (redoLines.length > 0) {
      const updatedRedoLines = [...redoLines];
      const lineToRedo = updatedRedoLines.pop();

      setLines((prev) => [...prev, lineToRedo]);
      setRedoLines(updatedRedoLines);
    }
  };

//dragable text
const state = {
  isDragging: false,
  x: 50,
  y: 50,
};

const [change,setchange]=useState("edit text");

  function changetext(e){
      setchange(e.target.value);
  }


const [inviteuser,setinviteuser]=useState("");
  const invite=()=>{
      socket.emit('invite',{username:String(inviteuser),inviteename:`${auth.user.username}`,roomId})
  }
  return (
  
    <div className={styles.canvasContainer}>
      {loading && (
      <div><h2>please wait while Downloading Current Canvas State....</h2></div>
    )}
      <div className={styles.toolbar}>
      <input onChange={(e)=>setinviteuser(e.target.value)} placeholder='enter user name to invite' value={inviteuser}></input>
      <button onClick={()=>invite(roomId)}>Invite</button>
        <button onClick={downloadCanvas}>Download Canvas</button>
        <label className={styles.colorPickerLabel} htmlFor="colorPicker">Select Color: </label>
        <input
          id="colorPicker"
          className={styles.colorPicker}
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <label className={styles.brushSizeLabel} htmlFor="brushSize">Brush Size: </label>
        <input
          id="brushSize"
          className={styles.brushSize}
          type="range"
          min="1"
          max="20"
          value={brushSize}
         
          onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
        />
        {lines.length > 0 && (
          <button className={styles.undoButton} onClick={undo}>
            Undo
          </button>
        )}
        <select
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          className={styles.toolSelect}
        >
          <option value="pen">Pen</option>
          <option value="eraser">Eraser</option>
        </select>
      </div>
      <Stage
        className={styles.canvasStage}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onMouseDown={handlePointerDown}
        onMousemove={handlePointerMove}
        onMouseup={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <Layer>
       
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color || color}
              strokeWidth={line.strokeWidth || brushSize}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
          {Object.keys(pointers).map((userId) => {
            const pointer = pointers[userId];
            return (
              <Image
                width={30}
                height={30}
                image={image}
                key={userId}
                x={pointer.x}
                y={pointer.y}
                cornerRadius={20}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
