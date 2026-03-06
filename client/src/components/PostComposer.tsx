import { useState, useCallback } from "react";
import { postsAPI } from "../services/api";
import { useAuth } from "../context/auth-context";
import {
  Avatar,
  MediaUpload,
  CharacterCounter,
  VisibilityToggle,
  MediaPreview,
  ErrorMessage,
} from "./common";

interface PostComposerProps {
  onPostCreated?: () => void;
  placeholder?: string;
  className?: string;
}

export function PostComposer({
  onPostCreated,
  placeholder = "What's happening?",
  className = "",
}: PostComposerProps) {
  const { user } = useAuth();
  const [composerText, setComposerText] = useState("");
  const [composerVisibility, setComposerVisibility] = useState<
    "PUBLIC" | "PRIVATE"
  >("PUBLIC");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const charLimit = user?.plan === "PRO" ? 100 : 20;
  const charCount = composerText.length;
  const isOverCharLimit = charCount > charLimit;
  const canPost =
    (composerText.trim().length > 0 || Boolean(mediaFile)) &&
    !isPosting &&
    !isOverCharLimit;

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  const handlePost = useCallback(async () => {
    if (!canPost) return;

    try {
      setIsPosting(true);
      setError(null);
      await postsAPI.create(
        composerText.trim(),
        mediaFile,
        composerVisibility,
      );
      setComposerText("");
      setMediaFile(null);
      setComposerVisibility("PUBLIC");
      window.dispatchEvent(new Event("post-created"));
      onPostCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  }, [canPost, composerText, composerVisibility, mediaFile, onPostCreated]);

  const toggleVisibility = useCallback(() => {
    setComposerVisibility((prev) => (prev === "PUBLIC" ? "PRIVATE" : "PUBLIC"));
  }, []);

  return (
    <section className={`border-b border-white/15 px-4 py-3 ${className}`}>
      <div className="flex items-start gap-3">
        <Avatar initials={initials || "U"} size="md" />

        <div className="min-w-0 flex-1">
          <textarea
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            placeholder={placeholder}
            className="h-16 w-full resize-none bg-transparent text-[18px] leading-6 text-white outline-none placeholder:text-white/45"
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#1d9bf0]">
              <MediaUpload onFileSelect={setMediaFile} />
              <VisibilityToggle
                visibility={composerVisibility}
                onToggle={toggleVisibility}
              />
            </div>

            <button
              type="button"
              onClick={handlePost}
              disabled={!canPost}
              className={`rounded-full px-4 py-1.5 text-[15px] font-semibold text-black transition ${
                canPost
                  ? "cursor-pointer bg-white hover:bg-white/85"
                  : "cursor-not-allowed bg-white/55"
              }`}
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>

          {mediaFile && (
            <div className="mt-2">
              <MediaPreview file={mediaFile} onRemove={() => setMediaFile(null)} />
            </div>
          )}

          <CharacterCounter
            current={charCount}
            limit={charLimit}
            className="mt-2"
          />

          {error && <ErrorMessage message={error} className="mt-2" />}
        </div>
      </div>
    </section>
  );
}
