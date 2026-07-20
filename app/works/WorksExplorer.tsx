"use client";

import Image from "next/image";
import { useState } from "react";
import Modal from "@/components/os/Modal";
import { works } from "@/src/data/content";

// public/ 配下は basePath が自動付与されないため手動で連結する
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * sakuhin フォルダの中身。
 * JS実装: 作品のサムネイルアイコンをグリッドで並べ、クリックで Win95風の
 * 詳細ウィンドウ（モーダル）を開く。モーダルは Esc / オーバーレイクリック /
 * ×で閉じる。サムネイル画像は静的HTMLにも出るため画像要件も満たす。
 */
export default function WorksExplorer() {
  // 開いている作品の id（null = 閉じている）
  const [openId, setOpenId] = useState<string | null>(null);
  const openWork = works.items.find((w) => w.id === openId) ?? null;

  return (
    <div className="works-explorer">
      <p className="works-explorer__lead">{works.lead}</p>

      <ul className="works-explorer__grid">
        {works.items.map((item) => (
          <li key={item.id} className="works-explorer__cell">
            <button
              type="button"
              className="works-explorer__icon-button"
              onClick={() => setOpenId(item.id)}
              aria-haspopup="dialog"
            >
              <Image
                className="works-explorer__thumb"
                src={`${basePath}${item.image.src}`}
                alt={item.image.alt}
                width={800}
                height={500}
              />
              <span className="works-explorer__filename">{item.fileName}</span>
            </button>
          </li>
        ))}
      </ul>

      {openWork && (
        <Modal
          title={openWork.title}
          closeLabel={works.closeLabel}
          onClose={() => setOpenId(null)}
        >
          <div className="work-detail">
            <Image
              className="work-detail__image"
              src={`${basePath}${openWork.image.src}`}
              alt={openWork.image.alt}
              width={800}
              height={500}
            />
            <p className="work-detail__description">{openWork.description}</p>
            <ul className="work-detail__meta">
              {openWork.meta.map((line) => (
                <li key={line} className="work-detail__meta-item">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
}
