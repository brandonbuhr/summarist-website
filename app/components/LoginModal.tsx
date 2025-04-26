import { ReactNode } from "react";
import styles from "./LoginModal.module.css";
type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function LoginModal({
  isOpen,
  onClose,
  children,
}: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <button className={styles["modal-close"]} onClick={onClose}>
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
