"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Canvas,
  useFrame,
  extend,
  Vector2,
  useThree,
} from "@react-three/fiber";
import OrbitControls from "three/examples/jsm/controls/OrbitControls.js";
import { Mesh, PlaneGeometry, ShaderMaterial, Vector3 } from "three";
import {
  useSpring,
  animated,
  easings,
  SpringValue,
  useTrail,
  useSprings,
} from "@react-spring/three";
import vertexShader from "../../shaders/vertexShader";
import fragmentShader from "../../shaders/fragmentShader";
import { useDrag, useGesture } from "@use-gesture/react";
import Bottle from "./Bottle";
import Poster from "./Poster";
import Plane from "./Plane";
import Carousell from "./Carousell";
import { config } from "process";
import { Environment } from "@react-three/drei";

extend({ OrbitControls });

export default function Scene() {
  // const numberOfObjects = 8;
  // const radianInterval = (2.0 * Math.PI) / numberOfObjects;

  // const [scene, setScene] = useState({
  //     x: Math.cos(radianInterval),
  //     z: Math.sin(radianInterval)
  // })

  const items = [
    { color: "red", text: "0: Electric Eel" },
    { color: "green", text: "1: Flooofy IPA" },
    { color: "yellow", text: "2: Pejl Ejl" },
    { color: "blue", text: "3: Stormy Cloudy Apple " },
    { color: "orange", text: "4: Solskens bira" },
    { color: "orange", text: "5: Talang juice" },
    // { color: 'orange' },
    // { color: 'orange' },
    // { color: 'orange' },
    // { color: 'orange' },
    // { color: 'orange' },
    // { color: 'orange' },
    // { color: 'orange' },
    // { color: 'orange' },
    // { color: 'purple' }
  ];

  const posters = [
    { color: "red" },
    { color: "green" },
    { color: "pink" },
    { color: "blue" },
    { color: "orange" },
    // { color: 'purple' },
  ];

  const NR_OF_ITEMS = items.length ?? 0;

  console.log({ NR_OF_ITEMS });

  const STEP_SIZE = getStepSize(NR_OF_ITEMS);

  // read params and set current rotation
  // useEffect(params) ----- .com/step?4
  // check if step is present in number of items, else set default
  // getStepSize(items) => calc rotation and setRotation({rotation: calcedRotation, step: params.step})

  const [rotation, setRotation] = useState<{ rotation: number; step: number }>({
    rotation: 0,
    step: 0,
  });

  function getStepSize(nrOfItems: number) {
    const degrees = 360 / nrOfItems;
    console.log({ degrees });
    const radians = degrees * (Math.PI / 180);
    console.log({ radians });

    return radians;
  }

  const handleStep = (step: number) => {
    if (step >= NR_OF_ITEMS) return 0;
    if (step <= 0) return NR_OF_ITEMS - 1;
    return step;
  };

  const rotateL = () => {
    setRotation((prev) => ({
      rotation: prev.rotation - STEP_SIZE,
      step: handleStep(prev.step - 1),
    }));
  };

  const rotateR = () => {
    setRotation((prev) => ({
      rotation: prev.rotation + STEP_SIZE,
      step: handleStep(prev.step + 1),
    }));
  };

  const bottleRef = useRef<Mesh>(null);

  // todo:
  // array of items (bottles and posters and text)
  // calculate radial thing(math pi / nr of items ) to get rotational step size

  // function degreesToRadians(degrees: number) {
  //     return degrees * (Math.PI / 180);
  // }

  console.log(getStepSize(4));

  const [showRoom, setShowRoom] = useState<boolean>(false);

  const activate = () => setShowRoom((prev) => !prev);

  const standardR3FCamera = {
    fov: 75,
    near: 0.1,
    far: 1000,
    position: [0, 0, 5],
  };

  return (
    // <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1, 5] }}>
    <>
      <Text text={items[rotation.step].text} />
      <button onClick={activate} className='bg-green-200'>
        activate
      </button>
      <Canvas style={{ background: "white" }} shadows>
        {/* <ambientLight intensity={0.2} castShadow /> */}
        <Environment preset='studio' background={false}/>

        <MockCamera showRoom={showRoom}>
          <directionalLight
            castShadow
            position={[2.5, 8, 5]}
            intensity={1.5}
            shadow-mapSize={2048}
          />
          <pointLight position={[2, 2, 6]} intensity={100} />
          {/* <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} /> */}
          {/* <Group rotation-y={rotation} /> */}
          <Carousell
            position={[0, 0, 2]}
            rotation={rotation}
            showRoom={showRoom}
            items={items}
            rotateL={rotateL}
            rotateR={rotateR}
          />
          {/* poster={posters[rotation.step]} */}
          <Poster
            position={[0, 3.2, 3.4]}
            posters={posters}
            step={rotation.step}
          />
          <Plane
            position={[-0.5, -0.6, 2]}
            rotation-x={-90 * (Math.PI / 180)}
            scale={4}
          />
        </MockCamera>
      </Canvas>

      {/* <Description showRoom={showRoom} /> */}

      <div className='flex gap-4'>
        <h1>{rotation.step}</h1>
        <div
          className='text-xl cursor-pointer active:bg-red-200'
          onClick={rotateL}
        >
          {"<"}
        </div>
        <div
          className='text-xl cursor-pointer active:bg-red-200'
          onClick={rotateR}
        >
          {">"}
        </div>
      </div>
    </>
  );
}

const Text = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div
      className={`z-10 absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-20 text-6xl ${className}`}
    >
      <h1 className=' text-orange-300 font-bold'>{text}</h1>
    </div>
  );
};

const MockCamera = ({
  showRoom,
  children,
}: {
  showRoom: boolean;
  children: any;
}) => {
  // move group instead of camera

  const { viewport } = useThree();

  const [test, setTest] = useState(1);

  const isMobile = window.innerWidth < 768;
  const responsiveRatio = viewport.width / 12;

  const [props, api] = useSpring(
    () => ({
      // position: showRoom ? [0, -3, 0.5] : [0, 0, 0],
      rotation: showRoom ? [0, 0, 0] : [0, 0, 0], // could be rotation x only  (z/y?)
      from: { position: [0, 0, 0] },
      // to: showRoom
      //   ? [{ position: [0, -3, 0.5] }, { position: [-0.3, -3, 0.5] }]
      //   : { position: [0, 0, 0] },
      // loop: true,
      delay: 600,
      config: {
        mass: 2,
        friction: 50,
        tension: 90,
      },
    }),
    [showRoom]
  );

  const testa = () => {
    api.start({
      to: [
        {
          position: [0, -3, 0.5],
          config: { friction: 50, tension: 90 },
        },
        // { position: [-0.2, -3, 0.5] },
      ],
      delay: 600,
    });
  };

  const testa2 = () => {
    api.start({
      to: [{ position: [0, 0, 0], config: { friction: 50, tension: 90 } }],
      delay: 600,
    });
  };

  useEffect(() => {
    if (showRoom) return testa();
    testa2();
  }, [showRoom]);

  return (
    // @ts-ignore: Spring type is Vector3 Type (Typescript return error on position)
    <animated.group position={props.position} rotation={props.rotation}>
      {children}
    </animated.group>
  );
};

const Description = ({ showRoom }: { showRoom: boolean }) => {
  const showRoomStyle = `z-10 absolute top-1/2 left-1/2  -translate-y-1/2
text-3xl transition-all text-red-200 duration-[3000ms] delay-[3300ms] rounded-xl
 h-1/2 w-96
`;

  const defaultStyle = `z-10 absolute top-1/2 left-[100rem] -translate-y-1/2
text-6xl transition-all text-red-200 duration-[1000ms] h-1/2 w-96`;

  return (
    <>
      <div className='duration-[1000] w-1/2 dela'></div>
      <div className={showRoom ? showRoomStyle : defaultStyle}>
        <div className='w-full h-32 bg-white rounded-xl p-2'>Description</div>
        <div className='flex justify-between mt-8'>
          {["1", "2", "3"].map((item) => (
            <div
              key={item}
              className='bg-white rounded-full h-24 w-24 flex items-center justify-center'
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
