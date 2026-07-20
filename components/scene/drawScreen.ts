import type { CanvasTexture } from "three";
import type { SceneText } from "@/src/data/content";
import type { ScreenState } from "./types";

/* ================================================================
   [3] 画面層: ZaidOSをcanvas 2Dで描く
   S の数値を読んで、毎フレーム描き直すだけ。
   文言はプロトタイプの定数配列から src/data/content.ts(text) へ移した。
   sctx/screenTex/S を束ねた drawScreen 関数を生成して返す。
   ================================================================ */
export function createScreenRenderer(
  sctx: CanvasRenderingContext2D,
  screenTex: CanvasTexture,
  S: ScreenState,
  text: SceneText
) {
  function win95(
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    alpha: number
  ) {
    sctx.globalAlpha = alpha;
    sctx.fillStyle = "#c0c0c0";
    sctx.fillRect(x, y, w, h);
    sctx.strokeStyle = "#fff";
    sctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
    sctx.fillStyle = "#000080";
    sctx.fillRect(x + 3, y + 3, w - 6, 20);
    sctx.fillStyle = "#fff";
    sctx.font = "12px monospace";
    sctx.fillText(title, x + 9, y + 17);
    sctx.fillText("×", x + w - 16, y + 17);
    sctx.globalAlpha = 1;
  }

  return function drawScreen() {
    sctx.globalAlpha = 1;
    sctx.fillStyle = "#000";
    sctx.fillRect(0, 0, 512, 384);

    /* BIOS */
    if (S.boot > 0 && S.desk < 1) {
      sctx.font = "15px monospace";
      text.bootLines.forEach((line, i) => {
        const a = Math.max(0, Math.min(1, S.boot * 5 - i));
        sctx.globalAlpha = a * (1 - S.desk);
        sctx.fillStyle =
          line.includes("OK") || line.includes("FOUND") ? "#58d868" : "#b8b8b8";
        sctx.fillText(line, 30, 60 + i * 34);
      });
      sctx.globalAlpha = 1;
    }

    /* デスクトップ */
    if (S.desk > 0) {
      sctx.globalAlpha = S.desk;
      sctx.fillStyle = "#0e7a6f";
      sctx.fillRect(0, 0, 512, 384);
      sctx.globalAlpha = 1;

      /* アイコン */
      text.desktopIcons.forEach((name, i) => {
        const a = Math.max(0, Math.min(1, S.icons * 3 - i));
        if (a <= 0) return;
        sctx.globalAlpha = a * S.desk;
        const y = 55 + i * 85;
        sctx.fillStyle = i === 0 ? "#ffffff" : "#ffe9a8";
        sctx.fillRect(38, y, 36, 30);
        sctx.strokeStyle = "#111";
        sctx.strokeRect(38, y, 36, 30);
        sctx.fillStyle = "#fff";
        sctx.font = "11px monospace";
        sctx.fillText(name, 30, y + 45);
      });
      sctx.globalAlpha = 1;

      /* メモ帳 */
      if (S.winMe > 0) {
        win95(120, 48, 310, 170, text.memoTitle, S.winMe);
        sctx.font = "15px sans-serif";
        text.memoLines.forEach((line, i) => {
          const a = Math.max(0, Math.min(1, S.meLines * 3 - i));
          sctx.globalAlpha = a * S.winMe;
          sctx.fillStyle = "#111";
          sctx.fillText(line, 138, 100 + i * 34);
        });
        sctx.globalAlpha = 1;
      }

      /* 作品フォルダ */
      if (S.winWorks > 0) {
        win95(140, 195, 330, 140, text.worksTitle, S.winWorks);
        text.files.forEach((name, i) => {
          const a = Math.max(0, Math.min(1, S.files * 4 - i));
          sctx.globalAlpha = a * S.winWorks;
          const x = 160 + i * 78;
          sctx.fillStyle = "#9ecbff";
          sctx.fillRect(x, 232, 34, 28);
          sctx.strokeStyle = "#111";
          sctx.strokeRect(x, 232, 34, 28);
          sctx.fillStyle = "#111";
          sctx.font = "10px monospace";
          sctx.fillText(name, x - 8, 278);
        });
        sctx.globalAlpha = 1;
      }

      /* カーソル(幽霊改め、あなたの手) */
      if (S.curA > 0) {
        sctx.globalAlpha = S.curA;
        sctx.save();
        sctx.translate(S.cx, S.cy);
        sctx.scale(S.click, S.click);
        sctx.fillStyle = "#fff";
        sctx.strokeStyle = "#000";
        sctx.beginPath();
        sctx.moveTo(0, 0);
        sctx.lineTo(0, 17);
        sctx.lineTo(11, 11);
        sctx.closePath();
        sctx.fill();
        sctx.stroke();
        sctx.restore();
        sctx.globalAlpha = 1;
      }
    }

    /* 暗転とお別れ */
    if (S.fade > 0) {
      sctx.globalAlpha = S.fade;
      sctx.fillStyle = "#000";
      sctx.fillRect(0, 0, 512, 384);
      sctx.globalAlpha = 1;
    }
    if (S.bye > 0) {
      win95(126, 135, 260, 105, text.byeTitle, S.bye);
      sctx.globalAlpha = S.bye;
      sctx.fillStyle = "#111";
      sctx.font = "14px sans-serif";
      sctx.fillText(text.byeMessage, 165, 185);
      sctx.font = "12px monospace";
      sctx.fillText(text.byeActions, 158, 215);
      sctx.globalAlpha = 1;
    }

    /* CRTの走査線(テクスチャに焼き込む) */
    sctx.globalAlpha = 0.12;
    sctx.fillStyle = "#000";
    for (let y = 0; y < 384; y += 4) sctx.fillRect(0, y, 512, 1.5);
    sctx.globalAlpha = 1;

    screenTex.needsUpdate = true;
  };
}
