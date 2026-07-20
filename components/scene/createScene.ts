import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneText } from "@/src/data/content";
import { createScreenRenderer } from "./drawScreen";
import type { CameraRig, ScreenState } from "./types";

gsap.registerPlugin(ScrollTrigger);

type CreateSceneOptions = {
  /** three.js の描画先 canvas */
  canvas: HTMLCanvasElement;
  /** ScrollTrigger の基準にする背高の要素 */
  trigger: HTMLElement;
  /** 画面に描く文言(content.ts 由来) */
  text: SceneText;
  /** prefers-reduced-motion 相当なら true（呼吸・視差を無効化） */
  reducedMotion: boolean;
};

/** 破棄用ハンドルを返す。呼び出し側はアンマウント時に dispose() を呼ぶ */
export type SceneController = { dispose: () => void };

export function createScene({
  canvas,
  trigger,
  text,
  reducedMotion,
}: CreateSceneOptions): SceneController {
  /* 現代のthreeは物理ベースライティング＆sRGB変換が既定で、r128当時の
     配色から色味がずれる。プロトタイプの見えを保つため色変換を無効化する。 */
  THREE.ColorManagement.enabled = false;

  /* ================================================================
     [1] 画面の状態 S と カメラの状態 rig
     GSAPが動かすのはこの2つのオブジェクトの数値だけ。
     ================================================================ */
  const S: ScreenState = {
    boot: 0,
    desk: 0,
    icons: 0,
    curA: 0,
    cx: 420,
    cy: 300,
    click: 1,
    winMe: 0,
    meLines: 0,
    winWorks: 0,
    files: 0,
    fade: 0,
    bye: 0,
    glow: 0,
    typing: 0,
    lamp: 1,
  };
  const rig: CameraRig = {
    cx: 0.9,
    cy: 1.5,
    cz: 2.6, // カメラ位置(部屋を見回す位置から開始)
    lx: -0.55,
    ly: 1.05,
    lz: 0, // 注視点(最初は電気スタンドの方)
  };

  /* ================================================================
     [2] 3D層: 深夜の部屋を組む
     ================================================================ */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05060a);
  scene.fog = new THREE.Fog(0x05060a, 4, 10);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 50);

  /* ---- 照明: 弱い環境光 + 電気スタンド + 画面の光 ---- */
  scene.add(new THREE.AmbientLight(0x2a3550, 0.5));
  const lampLight = new THREE.PointLight(0xffc07a, 1.0, 5);
  lampLight.position.set(-0.6, 1.25, 0.15);
  scene.add(lampLight);
  /* 画面の光。S.glowで強くなる。 */
  const screenLight = new THREE.PointLight(0x9fe8dc, 0, 3.5);
  screenLight.position.set(0, 1.2, 0.7);
  scene.add(screenLight);

  /* ---- 部屋 ---- */
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x2b2f3c,
    roughness: 1,
  });
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshStandardMaterial({ color: 0x1a1c24, roughness: 1 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat);
  backWall.position.set(0, 2.5, -1.0);
  scene.add(backWall);
  /* 壁のポスター(今は飾りの板) */
  const poster = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x4a5a8a, roughness: 0.9 })
  );
  poster.position.set(-1.1, 1.9, -0.99);
  poster.rotation.z = 0.03;
  scene.add(poster);

  /* ---- 机 ---- */
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x5a4632,
    roughness: 0.85,
  });
  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.06, 0.95),
    woodMat
  );
  deskTop.position.set(0, 0.72, 0);
  scene.add(deskTop);
  (
    [
      [-0.85, -0.4],
      [0.85, -0.4],
      [-0.85, 0.4],
      [0.85, 0.4],
    ] as const
  ).forEach(([x, z]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.7, 0.07), woodMat);
    leg.position.set(x, 0.35, z);
    scene.add(leg);
  });

  /* ---- 古いPC(ベージュの塊感が命) ---- */
  const beige = new THREE.MeshStandardMaterial({
    color: 0xd6cbb4,
    roughness: 0.7,
  });
  const monitor = new THREE.Group();
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 0.55), beige);
  monitor.add(bezel);
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.3), beige);
  neck.position.y = -0.46;
  monitor.add(neck);
  /* 電源LED */
  const led = new THREE.Mesh(
    new THREE.CircleGeometry(0.012, 12),
    new THREE.MeshBasicMaterial({ color: 0x2a1010 })
  );
  led.position.set(0.4, -0.33, 0.276);
  monitor.add(led);
  /* 付箋(黄色) */
  const postit = new THREE.Mesh(
    new THREE.PlaneGeometry(0.09, 0.09),
    new THREE.MeshStandardMaterial({ color: 0xf2e06b, roughness: 1 })
  );
  postit.position.set(-0.44, 0.2, 0.276);
  postit.rotation.z = -0.15;
  monitor.add(postit);
  monitor.position.set(0, 1.24, -0.18);
  scene.add(monitor);

  /* ---- 画面: canvas 2D をテクスチャとして貼る ----
     ここがこのプロトタイプの核。ZaidOSの中身は [3] drawScreen で描く */
  const scr = document.createElement("canvas");
  scr.width = 512;
  scr.height = 384;
  const sctx = scr.getContext("2d");
  if (!sctx) throw new Error("2D context を取得できませんでした");
  const screenTex = new THREE.CanvasTexture(scr);
  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.82, 0.62),
    new THREE.MeshBasicMaterial({ map: screenTex }) // Basic=自発光する画面
  );
  screenMesh.position.set(0, 0.01, 0.281);
  monitor.add(screenMesh);

  /* [3] 画面層の描画関数を生成(S・文言を束ねる) */
  const drawScreen = createScreenRenderer(sctx, screenTex, S, text);

  /* ---- キーボード(打鍵アニメ用にキーを配列で持つ) ---- */
  const kbBase = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.035, 0.26), beige);
  kbBase.position.set(0, 0.77, 0.42);
  kbBase.rotation.x = 0.06;
  scene.add(kbBase);
  const keys: THREE.Mesh[] = [];
  const keyMat = new THREE.MeshStandardMaterial({
    color: 0xbdb29a,
    roughness: 0.6,
  });
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 11; c++) {
      const k = new THREE.Mesh(
        new THREE.BoxGeometry(0.048, 0.02, 0.045),
        keyMat
      );
      k.position.set(-0.3 + c * 0.06, 0.795, 0.335 + r * 0.055);
      k.userData.restY = k.position.y;
      scene.add(k);
      keys.push(k);
    }
  }

  /* ---- コーヒー(途中で視線が向かう先) ---- */
  const mug = new THREE.Group();
  const cup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.05, 0.12, 20),
    new THREE.MeshStandardMaterial({ color: 0xc85a4a, roughness: 0.5 })
  );
  mug.add(cup);
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.035, 0.01, 8, 16),
    cup.material
  );
  handle.position.x = 0.06;
  handle.rotation.y = Math.PI / 2;
  mug.add(handle);
  mug.position.set(0.58, 0.81, 0.32);
  scene.add(mug);
  /* 湯気: 上昇するパーティクル */
  const steamGeo = new THREE.BufferGeometry();
  const steamPos = new Float32Array(30 * 3);
  for (let i = 0; i < 30; i++) {
    steamPos[i * 3] = (Math.random() - 0.5) * 0.04;
    steamPos[i * 3 + 1] = Math.random() * 0.3;
    steamPos[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
  }
  steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPos, 3));
  const steam = new THREE.Points(
    steamGeo,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.012,
      transparent: true,
      opacity: 0.25,
    })
  );
  steam.position.copy(mug.position).y += 0.08;
  scene.add(steam);

  /* ---- 空気中の埃(画面の光に浮かぶと雰囲気が出る) ---- */
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(120 * 3);
  for (let i = 0; i < 120; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 3;
    dustPos[i * 3 + 1] = 0.6 + Math.random() * 1.6;
    dustPos[i * 3 + 2] = -0.5 + Math.random() * 2.5;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      color: 0xaabbcc,
      size: 0.008,
      transparent: true,
      opacity: 0.35,
    })
  );
  scene.add(dust);

  /* ================================================================
     [4] 描画ループ: 数値を読んで反映するだけ
     ================================================================ */
  const clock = new THREE.Clock();
  const mouse = { x: 0, y: 0 };
  /* reduced-motion 時は視差(マウス追従)を切るのでリスナも張らない */
  const onPointerMove = (e: PointerEvent) => {
    mouse.x = e.clientX / window.innerWidth - 0.5;
    mouse.y = e.clientY / window.innerHeight - 0.5;
  };
  if (!reducedMotion) window.addEventListener("pointermove", onPointerMove);

  let rafId = 0;
  function render() {
    const t = clock.getElapsedTime();

    drawScreen();

    /* 照明をSに追従させる */
    screenLight.intensity = S.glow * 1.6;
    lampLight.intensity = S.lamp;
    (led.material as THREE.MeshBasicMaterial).color.setHex(
      S.glow > 0.03 ? 0x46ff6e : 0x2a1010
    );

    /* 打鍵: typing中はランダムなキーが沈み、バネで戻る */
    if (S.typing > 0.5 && Math.random() < 0.25) {
      const k = keys[(Math.random() * keys.length) | 0];
      k.position.y = (k.userData.restY as number) - 0.012;
    }
    keys.forEach((k) => {
      k.position.y += ((k.userData.restY as number) - k.position.y) * 0.25;
    });

    /* 湯気は上昇してループ */
    const sp = steam.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < 30; i++) {
      sp.array[i * 3 + 1] += 0.0012;
      if (sp.array[i * 3 + 1] > 0.3) sp.array[i * 3 + 1] = 0;
    }
    sp.needsUpdate = true;

    /* 埃はゆっくり漂う */
    dust.rotation.y = t * 0.02;

    /* カメラ: rig + 呼吸(上下の微揺れ) + マウス視差
       「本当に人が座っている」感はこの2つの微細な動きで生まれる。
       reduced-motion 時は呼吸(sin)と視差(mouse)を 0 にして、
       スクロール連動(rig)だけを残す。 */
    const breath = reducedMotion ? 0 : Math.sin(t * 1.1) * 0.008;
    const mx = reducedMotion ? 0 : mouse.x;
    const my = reducedMotion ? 0 : mouse.y;
    camera.position.set(rig.cx + mx * 0.04, rig.cy + breath + my * -0.03, rig.cz);
    camera.lookAt(rig.lx + mx * 0.12, rig.ly - my * 0.08, rig.lz);

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(render);
  }
  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();
  render();

  /* ================================================================
     [5] GSAP層: 振付表
     ================================================================ */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
    },
  });
  function click() {
    tl.to(S, { click: 0.7, duration: 0.05 })
      .to(S, { click: 1, duration: 0.05 })
      .to(S, { click: 0.7, duration: 0.05 })
      .to(S, { click: 1, duration: 0.05 });
  }

  /* 1. 部屋を見回す → 視線がモニタに定まる */
  tl.to(rig, { lx: 0, ly: 1.22, lz: -0.1, duration: 1, ease: "power2.inOut" });
  tl.to({}, { duration: 0.3 });

  /* 2. 電源ON。BIOSが流れ、キーボードを叩き、画面が部屋を照らし始める */
  tl.to(S, { glow: 0.35, duration: 0.3 });
  tl.to(S, { boot: 1, typing: 1, duration: 1.2 }, "<");
  tl.to({}, { duration: 0.3 });

  /* 3. 顔を画面に近づける(一人称の「読む姿勢」) */
  tl.to(rig, { cx: 0, cy: 1.3, cz: 1.15, duration: 1.2, ease: "power2.inOut" }, "<");
  tl.to(S, { typing: 0, duration: 0.1 });

  /* 4. デスクトップ起動。部屋がティール色に染まる */
  tl.to(S, { desk: 1, glow: 1, duration: 0.6 });
  tl.to(S, { icons: 1, duration: 0.6 });

  /* 5. jibun.txt を開いて読む */
  tl.to(S, { curA: 1, duration: 0.2 });
  tl.to(S, { cx: 56, cy: 70, duration: 0.7, ease: "power2.inOut" });
  click();
  tl.to(S, { winMe: 1, duration: 0.4 });
  tl.to(S, { meLines: 1, typing: 1, duration: 1.0 });
  tl.to(S, { typing: 0, duration: 0.1 });

  /* 6. コーヒーに目をやる(一人称ならではの「間」) */
  tl.to(rig, { lx: 0.58, ly: 0.9, lz: 0.32, cx: 0.15, duration: 0.8, ease: "power2.inOut" });
  tl.to({}, { duration: 0.4 }); // 一口飲んでいる時間
  tl.to(rig, { lx: 0, ly: 1.22, lz: -0.1, cx: 0, duration: 0.8, ease: "power2.inOut" });

  /* 7. sakuhin フォルダを開く */
  tl.to(S, { cx: 56, cy: 155, duration: 0.7, ease: "power2.inOut" });
  click();
  tl.to(S, { winWorks: 1, duration: 0.4 });
  tl.to(S, { files: 1, duration: 0.8 });
  tl.to({}, { duration: 0.5 });

  /* 8. 夜が終わる。椅子を引いて離れ、スタンドを消し、画面だけが灯る */
  tl.to(S, { fade: 0.75, duration: 0.5 });
  tl.to(S, { bye: 1, duration: 0.4 });
  tl.to(rig, { cx: 0.5, cy: 1.5, cz: 2.4, duration: 1.4, ease: "power2.inOut" }, "<");
  tl.to(S, { lamp: 0.12, glow: 0.5, duration: 1.0 }, "<+=0.3");
  tl.to({}, { duration: 0.4 });

  /* ================================================================
     クリーンアップ: アンマウント時に必ず全リソースを解放する
     (メモリリーク・多重描画・多重ScrollTriggerを防ぐ)
     ================================================================ */
  function dispose() {
    // 1) 描画ループを止める
    cancelAnimationFrame(rafId);

    // 2) イベントリスナを外す
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onPointerMove);

    // 3) GSAP / ScrollTrigger を破棄
    tl.scrollTrigger?.kill();
    tl.kill();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf(S);
    gsap.killTweensOf(rig);

    // 4) geometry / material(+テクスチャ) を dispose
    scene.traverse((obj) => {
      const mesh = obj as Partial<THREE.Mesh> & Partial<THREE.Points>;
      mesh.geometry?.dispose();
      const material = mesh.material;
      if (!material) return;
      const materials = Array.isArray(material) ? material : [material];
      materials.forEach((m) => {
        const mapped = m as THREE.Material & { map?: THREE.Texture | null };
        mapped.map?.dispose();
        m.dispose();
      });
    });

    // 5) 画面テクスチャと renderer を破棄
    screenTex.dispose();
    renderer.dispose();
  }

  return { dispose };
}
