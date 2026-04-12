import { FC, ReactNode } from "react";
import Icon from "./Icon";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

const Modal: FC<ModalProps> = ({ title, onClose, children, wide }) => (
  <div
    className="animate-fade-in"
    style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,.92)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className="animate-scale-in"
      style={{ background: "#080600", border: "1px solid rgba(201,168,76,.22)", borderRadius: 20, width: "100%", maxWidth: wide ? 580 : 490, position: "relative", maxHeight: "92vh", overflowY: "auto" }}
    >
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, fontSize: 17, color: "#F5EDD8" }}>{title}</h3>
          <button className="btn btn-dim" style={{ width: 28, height: 28, padding: 0, borderRadius: 8 }} onClick={onClose}>
            <Icon n="x" sz={13} />
          </button>
        </div>
        {children}
      </div>
    </div>
  </div>
);

export default Modal;
