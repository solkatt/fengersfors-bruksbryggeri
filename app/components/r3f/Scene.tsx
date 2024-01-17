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

extend({ OrbitControls });

const Group = ({
  items,
  rotation,
  rotateL,
  rotateR,
  showRoom,
  position,
}: {
  rotation: { rotation: number; step: number };
  items: { color: string }[];
  rotateL: () => void;
  rotateR: () => void;
  showRoom: boolean;
  position: any;
}) => {
  const groupRef = useRef(null);

  const { rotationD } = useSpring({
    // rotationD: rotation === 1 ? Math.PI / 2 : 0,
    rotationD: rotation.rotation,
    config: {
      mass: 2,
      friction: 50,
      tension: 70,
    },
  });

  // todo
  // calculate bottle position based on number of items
  // map bottles with correct position in a circle

  function getCirclePositions(nrOfItems: number, circleSize: number) {
    const positions = [];
    const adjustment = Math.PI / 2;

    for (let i = 0; i < nrOfItems; i++) {
      const angle = ((2 * Math.PI) / nrOfItems) * i + adjustment;
      const x = circleSize * Math.cos(angle);
      const y = circleSize * Math.sin(angle);
      const angleToFaceCenter = Math.atan2(y, x);

      positions.push({ x, y, angle: angleToFaceCenter });
    }
    return positions;
  }

  const pos = getCirclePositions(items.length, 2);

  console.log("POS;", pos);

  const [springs, api] = useSprings(
    items?.length,
    (i) => {
      // make function for this?
      const isActive = i === rotation.step;

      const defaultPos = [pos[i].x, 0, pos[i].y];
      const defaultRotation = [0, -pos[i].angle, 0]
      
      const heroPos = [pos[i].x, 3, pos[i].y];
      const heroRotation = [0, -pos[i].angle * -Math.PI/2, 0]


      console.log()
      const hidden = isActive ? heroPos : [pos[i].x, 4, pos[i].y];

      const config = isActive
        ? {
            delay: 600,
            config: {
              mass: 2,
              friction: 50,
              tension: 90,
            },
          }
        : {
            delay: isActive ? 700 : i * 300,
            config: {
              mass: 5,
              friction: 120,
              tension: 120,
            },
          };

      console.log({ defaultPos });
      console.log("I::", i);
      return {
        position: showRoom ? hidden : defaultPos,
        rotation: showRoom && isActive ? heroRotation : defaultRotation,
        ...config,
        // from: { position: defaultPos },
        // to: { position: showRoom ? [pos[i].x, 4, pos[i].y] : defaultPos },
      };
    },
    [showRoom]
  );

  // todo
  // draggable={i === rotation.step + 2}
  // the starting bottle should be calululated at step 0
  // so draggable is - i === rotation.step

  // TODO
  // 3d model Bottles
  // Shader backgrounds
  // Transition to bottle page
  // Transition back to carousel
  // too much spin breaks carousel (cat noise crash)
  // custom cursor
  // custom loader
  // animate in carousel and page elements

  // PRODUCT PAGE
  // animate shader poster to be a full cover bg
  // animate non selected bottles upwards in a staggered fashion
  // animate selected bottle to correct hero placement
  // animate in Text and description
  // animate in shader or coloured design elements

  // turn off draggable
  // animate in description and other fun stuff
  //

  return (
    <animated.group ref={groupRef} rotation-y={rotationD} position={position}>
      {/* <group ref={groupRef} rotation-y={springs.rotation.to((rotation) => rotation)} > */}

      {/* <Bottle position={[1, 1, 1]} /> */}
      {/* <mesh position={[0, 0, 0]} scale={0.3}>
                <boxGeometry />
                <meshStandardMaterial color="pink" />
            </mesh> */}

      {/* <Bottle color="red" position={[1, 2, 0]} /> */}

      {springs.map((props, i) => {
        console.log({ i, props });
        return (
          <Bottle
            key={i}
            draggable={i === rotation.step}
            color={items[i].color}
            position={props.position}
            rotation={props.rotation}
            //   position={[pos[i].x, 0, pos[i].y]}
            // rotation={[0, -pos[i].angle, 0]}
            rotateL={rotateL}
            rotateR={rotateR}
          />
        );
      })}

      {/* {items.map((item, i) => (
        <Bottle
          key={i}
          draggable={i === rotation.step}
          color={item.color}
          position={[pos[i].x, 0, pos[i].y]}
          rotation={[0, -pos[i].angle, 0]}
          rotateL={rotateL}
          rotateR={rotateR}
        />
      ))} */}
    </animated.group>
  );
};

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

  const [props, api] = useSpring(
    () => ({
      position: showRoom ? [0, -3, 0] : [0, 0, 0],
      delay: 600,
      config: {
        mass: 2,
        friction: 50,
        tension: 90,
      },
    }),
    [showRoom]
  );

  return (
    // <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1, 5] }}>
    <>
      <Text text={items[rotation.step].text} />
      <button onClick={activate} className='bg-green-200'>
        activate
      </button>
      <Canvas style={{ background: "white" }} shadows>
        {/* <ambientLight intensity={0.2} castShadow /> */}
        {/* @ts-expect-error */}
        <animated.group position={props.position}>
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
          <Group
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
        </animated.group>
      </Canvas>

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

const Text = ({ text }: { text: string }) => {
  return (
    <div className='z-10 absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-20'>
      <h1 className='text-6xl text-orange-300 font-bold'>{text}</h1>
    </div>
  );
};
