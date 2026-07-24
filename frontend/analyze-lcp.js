const { execSync } = require('child_process');

function analyzeLCP() {
  try {
    const report = require('./lighthouse-report.json');
    const lcpAudit = report.audits['largest-contentful-paint'];
    const lcpElementAudit = report.audits['largest-contentful-paint-element'];
    const lcpBreakdown = report.audits['lcp-breakdown'] || {}; // Might not exist natively in all CLI versions, wait let's look at lcp-element details

    console.log("=== LCP ANALYSIS ===");
    console.log("LCP Value:", lcpAudit.displayValue);

    if (lcpElementAudit && lcpElementAudit.details && lcpElementAudit.details.items.length > 0) {
      const lcpItem = lcpElementAudit.details.items[0];
      console.log("\nLCP Element:");
      console.log("Node:", lcpItem.node.snippet);
      console.log("Type:", lcpItem.node.nodeLabel);
      console.log("Path:", lcpItem.node.path);
    } else {
      console.log("No LCP element found in report.");
    }

    const metrics = report.audits['metrics']?.details?.items?.[0] || {};
    console.log("\nMetrics:");
    console.log("FCP:", report.audits['first-contentful-paint'].displayValue);
    console.log("LCP:", metrics.largestContentfulPaint || lcpAudit.numericValue);
    console.log("TTFB:", report.audits['server-response-time'].displayValue);

    // Let's get the trace data if possible
    const traces = report.audits['network-requests']?.details?.items || [];
    console.log("\nNetwork Requests (Top 5 largest/longest):");
    traces.sort((a, b) => b.endTime - a.endTime).slice(0, 5).forEach(req => {
      console.log(`${req.url} - Duration: ${req.endTime - req.startTime}ms`);
    });

  } catch (err) {
    console.error("Failed to analyze report:", err.message);
  }
}

analyzeLCP();
