"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Slugs with a jar model in `public/3d`. Everything else keeps the packshot.
 *
 * Listed rather than probed so the check costs nothing: a product with no model
 * never mounts an observer, never resolves a chunk and never asks the network
 * whether a file it does not have exists.
 */
const MODELS: Record<string, string> = {
  bonny: "/3d/bonny.glb",
  jekky: "/3d/jekky.glb",
  rikki: "/3d/rikki.glb",
};

/** A full turn every fourteen seconds — present, but not a fairground ride. */
const SPIN_RATE = (Math.PI * 2) / 14;

interface Product3DProps {
  slug: string;
  alt: string;
  /** Packshot: the poster while the model loads, and the answer if it cannot. */
  fallback: string;
  className?: string;
  sizes?: string;
}

/**
 * The jar, turning — and turnable.
 *
 * It spins on its own, and a visitor can grab it and turn it by hand; letting
 * go coasts the throw down and slides back into the idle spin.
 *
 * Three.js is roughly half a megabyte and the model another three hundred
 * kilobytes, and this sits well down a product page — so neither is fetched
 * until the section is actually approaching the viewport, and the packshot
 * carries the layout in the meantime. A visitor who never scrolls this far pays
 * nothing at all.
 *
 * Everything after that is about not burning a phone battery: the frame loop
 * runs only while the canvas is on screen and the tab is in front, the pixel
 * ratio is capped at 2, and anyone who has asked for reduced motion gets a
 * single still frame instead of a spin. The whole scene — geometry, materials,
 * textures, the WebGL context — is disposed on unmount.
 */
export function Product3D({ slug, alt, fallback, className, sizes }: Product3DProps) {
  const model = MODELS[slug];
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  /** Set when WebGL or the model is unavailable — the packshot then stays put. */
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!model || failed) return;
    const node = host.current;
    if (!node) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        start().then((fn) => {
          if (disposed) fn?.();
          else cleanup = fn;
        });
      },
      // Start a screen early, so the model is usually there by the time the
      // section is read rather than popping in under the reader's eyes.
      { rootMargin: "600px" },
    );
    observer.observe(node);

    async function start(): Promise<(() => void) | undefined> {
      let THREE: typeof import("three");
      let GLTFLoader: typeof import("three/examples/jsm/loaders/GLTFLoader.js").GLTFLoader;
      let RoomEnvironment: typeof import("three/examples/jsm/environments/RoomEnvironment.js").RoomEnvironment;

      try {
        [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/environments/RoomEnvironment.js"),
        ]);
      } catch {
        setFailed(true);
        return undefined;
      }

      if (disposed || !node) return undefined;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setFailed(true);
        return undefined;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearAlpha(0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

      /*
       * A glTF lit only by lamps reads flat and plasticky — the label has no
       * surroundings to reflect. The generated room costs one render at mount
       * and gives the jar something to sit in.
       */
      const pmrem = new THREE.PMREMGenerator(renderer);
      const environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = environment.texture;

      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(2.5, 3.5, 3);
      const fill = new THREE.DirectionalLight(0xffffff, 0.7);
      fill.position.set(-3, 1, -2);
      scene.add(key, fill, new THREE.AmbientLight(0xffffff, 0.35));

      let gltf: Awaited<ReturnType<GLTFLoaderType["loadAsync"]>>;
      try {
        gltf = await new GLTFLoader().loadAsync(model!);
      } catch {
        renderer.dispose();
        pmrem.dispose();
        environment.texture.dispose();
        setFailed(true);
        return undefined;
      }

      if (disposed) {
        renderer.dispose();
        pmrem.dispose();
        environment.texture.dispose();
        return undefined;
      }

      const jar = gltf.scene;

      // Sit the model on the origin and frame it from its own bounds, so a
      // model exported at any scale or offset still lands centred and filling
      // the same share of the box as the packshot it replaces.
      const box = new THREE.Box3().setFromObject(jar);
      const centre = box.getCenter(new THREE.Vector3());
      jar.position.sub(centre);

      const pivot = new THREE.Group();
      pivot.add(jar);
      scene.add(pivot);

      const radius = box.getSize(new THREE.Vector3()).length() / 2;
      const distance = (radius / Math.sin((camera.fov * Math.PI) / 360)) * 1.06;
      camera.position.set(0, radius * 0.12, distance);
      camera.lookAt(0, 0, 0);

      node.replaceChildren(renderer.domElement);
      setReady(true);

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = node;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      // One frame drawn straight away: the canvas is faded in the moment the
      // model resolves, and without this it fades in empty and stays empty
      // until the first animation frame lands.
      renderer.render(scene, camera);
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(node);

      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let frame = 0;
      let onScreen = true;
      let dragging = false;
      /** Spin left over from a flick, in radians per second. */
      let thrown = 0;
      /** Nod, from vertical dragging. Clamped: the jar has no interesting base. */
      let tilt = 0;
      /** Set by anything that changes the picture outside the spin itself. */
      let dirty = true;
      const clock = new THREE.Clock();

      const loop = () => {
        frame = requestAnimationFrame(loop);
        const delta = clock.getDelta();

        if (!dragging) {
          if (Math.abs(thrown) > 0.02) {
            // Coast, then hand back to the idle spin. Exponential decay so the
            // hand-off has no seam whatever speed it was let go at.
            pivot.rotation.y += thrown * delta;
            thrown *= Math.exp(-3.2 * delta);
            dirty = true;
          } else if (!still) {
            pivot.rotation.y += delta * SPIN_RATE;
            dirty = true;
          }
        }

        if (!dirty) return;
        pivot.rotation.x = tilt;
        renderer.render(scene, camera);
        dirty = false;
      };

      const play = () => {
        if (frame || !onScreen || document.hidden) return;
        clock.getDelta(); // Drop the pause, or the jar jumps on resume.
        frame = requestAnimationFrame(loop);
      };
      const stop = () => {
        cancelAnimationFrame(frame);
        frame = 0;
      };

      /*
       * Drag to turn it.
       *
       * `touch-action: pan-y` is what keeps this usable on a phone: a vertical
       * swipe still scrolls the page past the jar, a horizontal one turns it.
       * Letting go hands the last speed to `thrown`, which coasts down and
       * dissolves back into the idle spin rather than stopping dead.
       */
      const canvas = renderer.domElement;
      canvas.style.touchAction = "pan-y";
      canvas.style.cursor = "grab";

      let lastX = 0;
      let lastY = 0;
      let lastAt = 0;

      const onDown = (event: PointerEvent) => {
        dragging = true;
        thrown = 0;
        lastX = event.clientX;
        lastY = event.clientY;
        lastAt = event.timeStamp;
        canvas.setPointerCapture(event.pointerId);
        canvas.style.cursor = "grabbing";
        play();
      };

      const onMove = (event: PointerEvent) => {
        if (!dragging) return;
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        const dt = Math.max(event.timeStamp - lastAt, 8) / 1000;

        pivot.rotation.y += dx * 0.011;
        tilt = Math.max(-0.42, Math.min(0.42, tilt + dy * 0.006));
        thrown = (dx * 0.011) / dt;

        lastX = event.clientX;
        lastY = event.clientY;
        lastAt = event.timeStamp;
        dirty = true;
      };

      const onUp = (event: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        // A pointer that came to rest before lifting should not fling.
        if (event.timeStamp - lastAt > 120) thrown = 0;
        if (canvas.hasPointerCapture(event.pointerId)) {
          canvas.releasePointerCapture(event.pointerId);
        }
        canvas.style.cursor = "grab";
      };

      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);

      const visibility = new IntersectionObserver(
        (entries) => {
          onScreen = entries.some((entry) => entry.isIntersecting);
          if (onScreen) play();
          else stop();
        },
        { threshold: 0 },
      );
      visibility.observe(node);

      const onTab = () => (document.hidden ? stop() : play());
      document.addEventListener("visibilitychange", onTab);

      /*
       * The loop runs even for a reduced-motion visitor, because they can still
       * drag. It costs nothing while nothing moves: with no spin, no coast and
       * no drag in progress, `dirty` stays false and the callback returns
       * before it reaches the renderer.
       */
      play();

      return () => {
        stop();
        visibility.disconnect();
        document.removeEventListener("visibilitychange", onTab);
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        teardown();
      };

      function teardown() {
        resizeObserver.disconnect();
        scene.traverse((object) => {
          const mesh = object as import("three").Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry?.dispose();
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const material of materials) {
            if (!material) continue;
            for (const value of Object.values(material)) {
              if (value && (value as import("three").Texture).isTexture) {
                (value as import("three").Texture).dispose();
              }
            }
            material.dispose();
          }
        });
        environment.texture.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      }
    }

    return () => {
      disposed = true;
      observer.disconnect();
      cleanup?.();
    };
  }, [model, failed]);

  return (
    <div className={className}>
      {/*
        The packshot is not swapped out, it is faded under the canvas. Removing
        it would leave a hole for as long as the model takes, and it is also the
        whole answer on a device with no WebGL.
      */}
      <Image
        src={fallback}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.14)] transition-opacity duration-500 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />
      {model && !failed ? (
        <div
          ref={host}
          aria-hidden
          className={`absolute inset-0 transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}
    </div>
  );
}

type GLTFLoaderType = import("three/examples/jsm/loaders/GLTFLoader.js").GLTFLoader;
