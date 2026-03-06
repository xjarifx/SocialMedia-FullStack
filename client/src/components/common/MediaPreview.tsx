interface MediaPreviewProps {
  file: File;
  onRemove: () => void;
}

export function MediaPreview({ file, onRemove }: MediaPreviewProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/5 px-3 py-2">
      <p className="truncate text-[12px] text-white/80">{file.name}</p>
      <button
        type="button"
        onClick={onRemove}
        className="ml-3 shrink-0 text-[12px] text-[#1d9bf0] hover:text-[#59b8f5]"
      >
        Remove
      </button>
    </div>
  );
}
