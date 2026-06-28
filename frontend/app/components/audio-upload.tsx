"use client";

import { useCallback, useState, useRef } from "react";
import { motion } from "framer-motion";

interface AudioUploadProps {
  onUpload: (file: File, outputLanguage: string) => void;
  disabled: boolean;
  limitReached?: boolean;
}

const ALLOWED_TYPES = [".mp3", ".wav", ".m4a", ".mp4"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AudioUpload({ onUpload, disabled, limitReached }: AudioUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputLanguage, setOutputLanguage] = useState("English");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_TYPES.includes(ext)) {
      setError(`Unsupported format. Use ${ALLOWED_TYPES.join(", ")}`);
      return false;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File too large. Maximum size is 100MB.");
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) setSelectedFile(file);
    },
    [validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div>
      {/* Drop zone */}
      <motion.div
        id="audio-drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed bg-surface/50 p-12 text-center transition-all duration-300
          ${isDragging
            ? "border-foreground/50 bg-muted/10 shadow-sm"
            : "border-card-border hover:border-foreground/30 hover:bg-muted/5"
          }
          ${disabled ? "opacity-50 pointer-events-none" : ""}
        `}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".mp3,.wav,.m4a,.mp4"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          className="hidden"
          id="audio-file-input"
        />

        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/10"
        >
          <svg className="h-8 w-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </div>

        <p className="text-lg font-semibold text-foreground mb-1">
          {isDragging ? "Drop your audio/video file" : "Upload meeting audio/video"}
        </p>
        <p className="text-sm text-muted">
          Drag & drop or click to browse · MP3, WAV, M4A, MP4 · Max 100MB
        </p>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          className="mt-3 glass-card border-red-500/30 px-4 py-3 text-sm text-red-400"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {/* Selected file + process button */}
      {selectedFile && !error && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between glass-card px-5 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/10"
              >
                <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <div className="relative group ml-4 shrink-0">
              <div className="flex items-center gap-3 mr-4">
                <select
                  value={outputLanguage}
                  onChange={(e) => setOutputLanguage(e.target.value)}
                  className="bg-surface border border-card-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                >
                  <option value="English">English Output</option>
                  <option value="Original Language">Original Language Output</option>
                </select>
              </div>
              <motion.button
                id="process-meeting-btn"
                onClick={() => onUpload(selectedFile, outputLanguage)}
                disabled={disabled || limitReached}
                className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold bg-foreground text-background shadow-sm hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {limitReached && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                Process Meeting
              </motion.button>
              {limitReached && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                  Free plan limit reached
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
