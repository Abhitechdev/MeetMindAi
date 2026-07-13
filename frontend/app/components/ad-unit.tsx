import React from 'react';

type AdUnitProps = {
  className?: string;
  slotId?: string; // e.g. '1234567890'
};

export default function AdUnit({ className = '', slotId }: AdUnitProps) {
  const isApproved = process.env.NEXT_PUBLIC_ADSENSE_APPROVED === 'true';

  if (!isApproved) {
    return null;
  }

  // A responsive placeholder for Google AdSense. 
  // In production, this would load the adsbygoogle script and ins element.
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXXXXXXXX';
  
  return (
    <div className={`w-full flex justify-center my-8 ${className}`} aria-hidden="true">
      <div className="w-full max-w-[728px] h-[90px] md:h-[250px] bg-surface/50 border border-card-border/50 rounded-lg flex items-center justify-center overflow-hidden relative">
        <span className="text-xs text-muted uppercase tracking-widest font-medium opacity-50">Advertisement {slotId && `(${slotId})`}</span>
        
        {/* AdSense ins element (Placeholder for future implementation) */}
        {/* <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client={adClient}
             data-ad-slot={slotId || "YOUR_ACTUAL_SLOT_ID"}
             data-ad-format="auto"
             data-full-width-responsive="true"></ins> */}
      </div>
    </div>
  );
}
