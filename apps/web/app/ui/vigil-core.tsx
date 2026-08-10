import Image from "next/image";

export function VigilCore({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`cv-vigil-core ${compact ? "cv-vigil-core-compact" : ""}`} aria-hidden="true">
      <div className="cv-vigil-orbit cv-vigil-orbit-outer" />
      <div className="cv-vigil-orbit cv-vigil-orbit-inner" />
      <div className="cv-vigil-halo" />
      <div className="cv-vigil-image-shell">
        <Image
          src="/vigil-core.jpg"
          alt=""
          width={1024}
          height={1024}
          priority
          className="size-full rounded-full object-cover"
          sizes={compact ? "112px" : "(max-width: 767px) 112px, 256px"}
        />
        <span className="cv-vigil-pulse" />
      </div>
    </div>
  );
}
