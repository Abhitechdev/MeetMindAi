// ponytail: pure CSS animation, no framer-motion needed for slow-floating blobs
export default function GradientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)",
          animation: "float-1 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
          animation: "float-2 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full opacity-10 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #7C3AED 0%, #3B82F6 50%, transparent 70%)",
          animation: "float-3 22s ease-in-out infinite",
        }}
      />
    </div>
  );
}
