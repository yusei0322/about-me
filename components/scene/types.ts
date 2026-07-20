/* ================================================================
   types.ts — 振付層(GSAP)が動かす2つの状態オブジェクトの型。
   プロトタイプの [1] に対応。GSAPはこの数値だけを動かし、
   3D層・画面層は毎フレームこれを読んで描くだけ。役割を完全に分ける。
   ================================================================ */

/** S: 画面(ZaidOS)の状態。0→1 の進行度で各演出を制御する */
export type ScreenState = {
  boot: number; // BIOS行の進行 0→1
  desk: number; // デスクトップのフェードイン
  icons: number; // アイコンの出現
  curA: number; // カーソルの不透明度
  cx: number; // カーソルX(画面キャンバス座標系)
  cy: number; // カーソルY
  click: number; // クリック時の縮み
  winMe: number; // メモ帳ウィンドウ
  meLines: number; // メモ帳本文
  winWorks: number; // 作品フォルダ
  files: number; // フォルダ内のファイル
  fade: number; // 暗転
  bye: number; // お別れダイアログ
  glow: number; // 画面がどれだけ部屋を照らすか
  typing: number; // キーボードが打鍵されるか
  lamp: number; // 電気スタンドの明るさ倍率
};

/** rig: カメラの状態。位置(c*)と注視点(l*) */
export type CameraRig = {
  cx: number;
  cy: number;
  cz: number;
  lx: number;
  ly: number;
  lz: number;
};
