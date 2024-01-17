import { useEffect, useMemo, useRef } from "react";
import fragmentShader from "../../shaders/fragmentShader";
import vertexShader from "../../shaders/vertexShader";
import { Mesh, Vector2, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";

const Poster = ({ posters, step, ...props }: any) => {
  // https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/

  // TODO:
  // create a few simple shaders
  // create a object in blender with morph keys / states
  // for example 1. circle, 2 octagon 3.square (or more complicated tree, lightning bolt,

  // next step
  // use gesture

  // nexter step
  // if spam rotate btns, bottles will break or fly away

  const meshRef = useRef<Mesh>(null!);

  const uniforms = useMemo(
    () => ({
      u_test: {
        value: new Vector3(0.0),
      },
      u_resolution: {
        value: new Vector2(window.innerWidth, window.innerHeight),
      },
      u_time: { value: 0.0 },
    }),
    []
  );

  const colorMap = {
    0: new Vector3(1.0, 0.0, 0.0),
    1: new Vector3(0.0, 1.0, 0.0),
    2: new Vector3(0.0, 0.0, 1.0),
    3: new Vector3(1.0, 1.0, 0.0),
    4: new Vector3(0.0, 1.0, 1.0),
    5: new Vector3(1.0, 0.0, 1.0),
  };

  useEffect(() => {
    console.log("step in useffect", step);
    //@ts-ignore
    meshRef.current.material.uniforms.u_test.value = colorMap[step];
    //@ts-ignore
    // meshRef.current.rotation.z += 0.2;
  }, [step]);

  const { size, clock } = useThree();

  useFrame(() => {
    // Update the u_time uniform with the current time
    if (meshRef.current) {
      //@ts-ignore
      meshRef.current.material.uniforms.u_time.value = clock.elapsedTime;
    }
  });

  // useFrame((state) => {
  //     const { clock } = state;
  //     console.log(step % 2 ? 1.0 : 0.0)
  //     //@ts-ignore
  //     meshRef.current.material.uniforms.u_test.value = new Vector3(step);
  // });

  return (
    <mesh {...props} ref={meshRef}>
      <planeGeometry args={[3, 3, 1]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
      {/* <meshStandardMaterial color={posters[step].color} /> */}
    </mesh>
  );
};

export default Poster;
