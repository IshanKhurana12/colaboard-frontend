import { useRecoilState } from "recoil";


export const LionImage = () => {
    const [image] = useImage('https://konvajs.org/assets/lion.png');
    return <Image image={image} />;
  };
  