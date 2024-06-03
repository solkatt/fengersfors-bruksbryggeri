import { useSpring, animated } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { Suspense, useRef } from "react";
import { Mesh } from "three";
import { Model } from "../Model";

const Bottle = ({
  position,
  color,
  rotation,
  rotateL,
  rotateR,
  draggable,
  scale = 1.0,
}: {
  draggable: boolean;
  position: any;
  color: string;
  rotation: any;
  rotateL: () => void;
  rotateR: () => void;
  scale: any;
}) => {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;


  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0],
    rotation: [0, 1.7, 0],
    config: { mass: 1, friction: 40, tension: 800 },
  }));
  // const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

  //       const bind = useDrag(({ down, movement: [mx, my] }) => {
  //     api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down })
  //   })

  const bind: any = useDrag(
    ({ active, movement: [x, y], down, cancel, canceled }) => {
      if (!draggable) return;
      if (active && down && x <= -100) {
        console.log("rotating Left");
        rotateL();
        cancel();
      }

      if (active && down && x >= 100) {
        console.log("rotating Right");
        cancel();
        rotateR();
      }

      api.start({
        config: {
          mass: canceled ? 8 : down ? 2 : 4,
          tension: canceled ? 200 : down ? 1000 : 800,
        },
        position:
          down && active
            ? [0, (-y / aspect) * 0.2, (-x / aspect) * 0.2]
            : [0, 0, 0],
        rotation:
          down && active
            ? [0, (-x / aspect * 0.5) + 1.7, (-x / aspect) * 0.2]
            : [0, 1.7, 0], // y rotation is set to 1.7 to center model rotation
        delay: canceled ? 100 : 0,
      });
    }
  );

  const bottleRef = useRef<Mesh>(null);

  // return (
  //   <animated.group position={position} rotation={rotation}>
  //     <animated.mesh
  //       {...spring}
  //       {...bind()}
  //       scale={scale}
  //       castShadow
  //       style={{ touchAction: "pan-x pan-y" }}
  //       ref={bottleRef}
  //     >
  //       {/* <cylinderGeometry args={[0.5, 0.5, 1]} /> */}
  //       <cylinderGeometry args={[0.13, 0.13, 0.4]} />

  //       <meshPhysicalMaterial attach='material' color={color} />
  //     </animated.mesh>
  //   </animated.group>
  // );

  return (
    <animated.group position={position} rotation={rotation}>
      <Suspense fallback={null}>
        <Model
          {...spring}
          {...bind()}
          castShadow
          style={{ touchAction: "pan-x pan-y" }}
          ref={bottleRef}
          scale={3}
        />
      </Suspense>
    </animated.group>
  );
};

export default Bottle;
