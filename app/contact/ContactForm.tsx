"use client";

import { useState } from "react";
import Modal from "@/components/os/Modal";
import { contact } from "@/src/data/content";

const { fields, validation, dialogs } = contact;

/** メール形式の簡易チェック（空白なし・@・ドメイン . を含む） */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Win95ダイアログ風お問い合わせフォーム。
 * JS実装: 「送信」で入力値をバリデーションし、
 *  - エラーあり → Win95風エラーダイアログに項目を列挙
 *  - エラーなし → 「送信しました」ダイアログ + フォームをリセット
 * 送信機能は持たない（静的サイトのデモ）。
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // 表示中のダイアログ: エラー一覧 or 成功
  const [errors, setErrors] = useState<string[] | null>(null);
  const [success, setSuccess] = useState(false);

  function validate(): string[] {
    const list: string[] = [];
    if (name.trim() === "") list.push(validation.nameRequired);
    if (email.trim() === "") list.push(validation.emailRequired);
    else if (!isValidEmail(email.trim())) list.push(validation.emailInvalid);
    if (body.trim() === "") list.push(validation.bodyRequired);
    return list;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // 静的サイトなので実送信しない
    const found = validate();
    if (found.length > 0) {
      setErrors(found);
      return;
    }
    // 成功: ダイアログ表示 + フォームをリセット
    setSuccess(true);
    setName("");
    setEmail("");
    setSubject("");
    setBody("");
  }

  // どの必須項目がエラーかを個別に判定（aria-invalid 用）
  const submitted = errors !== null;
  const nameInvalid = submitted && name.trim() === "";
  const emailInvalid =
    submitted && (email.trim() === "" || !isValidEmail(email.trim()));
  const bodyInvalid = submitted && body.trim() === "";

  return (
    <div className="contact">
      <p className="contact__lead">{contact.lead}</p>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        {/* 名前（必須） */}
        <div className="contact-form__row">
          <label className="contact-form__label" htmlFor={fields.name.id}>
            {fields.name.label}
            <span className="contact-form__required" aria-hidden="true">
              ＊
            </span>
          </label>
          <input
            id={fields.name.id}
            className="contact-form__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={fields.name.placeholder}
            aria-required="true"
            aria-invalid={nameInvalid}
          />
        </div>

        {/* メール（必須・形式チェック） */}
        <div className="contact-form__row">
          <label className="contact-form__label" htmlFor={fields.email.id}>
            {fields.email.label}
            <span className="contact-form__required" aria-hidden="true">
              ＊
            </span>
          </label>
          <input
            id={fields.email.id}
            className="contact-form__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={fields.email.placeholder}
            aria-required="true"
            aria-invalid={emailInvalid}
          />
        </div>

        {/* 用件（任意・セレクト） */}
        <div className="contact-form__row">
          <label className="contact-form__label" htmlFor={fields.subject.id}>
            {fields.subject.label}
          </label>
          <select
            id={fields.subject.id}
            className="contact-form__input contact-form__select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {fields.subject.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 本文（必須） */}
        <div className="contact-form__row">
          <label className="contact-form__label" htmlFor={fields.body.id}>
            {fields.body.label}
            <span className="contact-form__required" aria-hidden="true">
              ＊
            </span>
          </label>
          <textarea
            id={fields.body.id}
            className="contact-form__input contact-form__textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={fields.body.placeholder}
            rows={6}
            aria-required="true"
            aria-invalid={bodyInvalid}
          />
        </div>

        <p className="contact-form__notice">{contact.notice}</p>

        <div className="contact-form__actions">
          <button type="submit" className="contact-form__submit">
            {contact.submitLabel}
          </button>
        </div>
      </form>

      {/* SNS導線 */}
      <section className="contact-sns" aria-label={contact.snsHeading}>
        <h2 className="contact-sns__heading">{contact.snsHeading}</h2>
        <ul className="contact-sns__list">
          {contact.sns.map((item) => (
            <li key={item.label} className="contact-sns__item">
              <a
                className="contact-sns__link"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-sns__label">{item.label}</span>
                <span className="contact-sns__handle">{item.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* エラーダイアログ */}
      {errors && (
        <Modal
          title={dialogs.errorTitle}
          closeLabel={dialogs.closeLabel}
          onClose={() => setErrors(null)}
        >
          <div className="contact-dialog contact-dialog--error">
            <span className="contact-dialog__icon" aria-hidden="true">
              ✖
            </span>
            <div className="contact-dialog__text">
              <p className="contact-dialog__intro">{dialogs.errorIntro}</p>
              <ul className="contact-dialog__list">
                {errors.map((msg) => (
                  <li key={msg} className="contact-dialog__list-item">
                    {msg}
                  </li>
                ))}
              </ul>
              <div className="contact-dialog__actions">
                <button
                  type="button"
                  className="contact-form__submit"
                  onClick={() => setErrors(null)}
                >
                  {dialogs.closeLabel}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 成功ダイアログ */}
      {success && (
        <Modal
          title={dialogs.successTitle}
          closeLabel={dialogs.closeLabel}
          onClose={() => setSuccess(false)}
        >
          <div className="contact-dialog">
            <span className="contact-dialog__icon" aria-hidden="true">
              ✔
            </span>
            <div className="contact-dialog__text">
              <p className="contact-dialog__message">{dialogs.successMessage}</p>
              <div className="contact-dialog__actions">
                <button
                  type="button"
                  className="contact-form__submit"
                  onClick={() => setSuccess(false)}
                >
                  {dialogs.closeLabel}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
