import React from 'react';

export const AdSlot: React.FC<{ slotId: string }> = ({ slotId }) => (
  <aside
    className="ad-slot-wrapper no-print"
    aria-label="Advertisement"
    data-ad-slot={slotId}
  >
    <span className="ad-slot-label">Advertisement</span>
    <div className="ad-slot-inner">
      {/* Reserved AdSense unit (ca-pub-XXXXXXXXXXXXXXXX) with CLS min-height guardrail */}
      <span>Sponsored Content Area</span>
    </div>
  </aside>
);
