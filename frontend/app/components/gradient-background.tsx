// ponytail: pure CSS animation, no framer-motion needed for slow-floating blobs
// ponytail: smaller blobs on mobile — less paint area = cheaper GPU compositing
export default function GradientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full opacity-20 blob-1"
        style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-[40%] right-[-10%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full opacity-15 blob-2"
        style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[30%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full opacity-10 blob-3"
        style={{ background: "radial-gradient(circle, #7C3AED 0%, #3B82F6 50%, transparent 70%)" }}
      />
    </div>
  );
}
