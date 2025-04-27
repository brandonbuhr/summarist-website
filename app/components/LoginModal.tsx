import { ReactNode } from "react";
import { IoMdCloseCircle } from "react-icons/io";

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
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          <IoMdCloseCircle />
        </button>
        {children}
      </div>
    </div>
  );
}
