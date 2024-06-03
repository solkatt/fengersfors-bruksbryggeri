import { useSpring, useSprings, animated } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import Bottle from "./Bottle";
import { Environment } from "@react-three/drei";

const Carousell = ({
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
  // setState to different postions based on viewport width
  // debounce viewport change and set width
  // useSprings dependency array

  // -.....----
  const { viewport } = useThree();

  const [test, setTest] = useState(1);

  const isMobile = window.innerWidth < 768;
  const responsiveRatio = viewport.width / 12;

  console.log(isMobile);

  const clickTest = () => {
    setTest((prev) => prev + 0.1);
  };
  // -.....----

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

  const positionMap = {
    mobile: {
      default: {
        position: {},
        rotation: {},
      },
      active: {
        position: {},
        rotation: {},
      },
    },
    desktop: {},
  };

  const [springs, api] = useSprings(
    items?.length,
    (i) => {
      console.log("sptrings");
      // make function for this?
      const isActive = i === rotation.step;

      const defaultPos = [pos[i].x, 0, pos[i].y];
      const defaultRotation = [0, -pos[i].angle, 0];

      // const heroPos = [pos[i].x, 3, pos[i].y];
      const heroPos = isMobile
        ? [pos[i].x, 3, pos[i].y]
        : [pos[i].x, 3, pos[i].y];
      const heroRotation = [0, -pos[i].angle + Math.PI * 2, 0];

      // const hidden = isActive ? heroPos : [pos[i].x, 4, pos[i].y];
      const hidden = isActive ? heroPos : defaultPos;

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
        from: {
          position: [pos[i].x, 4, pos[i].y],
          rotation: defaultRotation,
          scale: 1.0,
        },
        scale: test, // defauot 1.0
        position: showRoom ? hidden : defaultPos,
        rotation: showRoom && isActive ? heroRotation : defaultRotation,
        ...config,
        // from: { position: defaultPos },
        // to: { position: showRoom ? [pos[i].x, 4, pos[i].y] : defaultPos },
      };
    },
    [showRoom, isMobile, test, responsiveRatio]
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
  // turn on rotation of object
  // animate in description and other fun stuff
  //

  return (
      <animated.group rotation-y={rotationD} position={position}>
        {/* <group ref={groupRef} rotation-y={springs.rotation.to((rotation) => rotation)} > */}

        {/* <Bottle position={[1, 1, 1]} /> */}
        <mesh position={[1, 1, 0]} onClick={clickTest} scale={0.1}>
          <boxGeometry />
          <meshStandardMaterial color='pink' />
        </mesh>

        {/* <Bottle color="red" position={[1, 2, 0]} /> */}

        {springs.map((props, i) => {
          console.log({ i, props });
          return (
            <Bottle
              scale={props.scale}
              key={i}
              draggable={!showRoom && i === rotation.step}
              // add rotatable
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
      </animated.group>
  );
};

export default Carousell;
