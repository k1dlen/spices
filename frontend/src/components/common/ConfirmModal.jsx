import React from "react";

const ConfirmModal = ({ open, title, text, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-bg-base shadow-sm rounded-md p-6 w-auto max-w-lg sm:max-w-xl md:max-w-2xl">
        {title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-text-title mb-4">
            {title}
          </h2>
        )}
        {text && (
          <p className="text-lg sm:text-xl text-text-default mb-6">{text}</p>
        )}
        <div className="flex flex-col sm:flex-row justify-start gap-3">
          <button onClick={onCancel} className="btn btn-secondary">
            Отмена
          </button>
          <button onClick={onConfirm} className="btn btn-primary">
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
