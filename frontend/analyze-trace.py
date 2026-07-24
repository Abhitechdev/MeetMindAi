import json
import collections

trace_file = "previous-trace.json"

with open(trace_file, "r", encoding="utf-8") as f:
    data = json.load(f)

events = data.get("traceEvents", [])

# Find FCP and LCP events
fcp_ts = None
lcp_ts = None

for e in events:
    if e.get("name") == "firstContentfulPaint":
        fcp_ts = e["ts"]
    elif e.get("name") == "largestContentfulPaint::Candidate":
        lcp_ts = e["ts"]

if not fcp_ts or not lcp_ts:
    print("Could not find FCP or LCP in trace events.")
    exit(1)

print(f"FCP: {fcp_ts}")
print(f"LCP: {lcp_ts}")

# Analyze CPU time between FCP and LCP
# We will look at TopLevel, RunTask, V8.Execute, FunctionCall, EvaluateScript, etc.
cpu_times = collections.defaultdict(float)
self_times = collections.defaultdict(float)

stack = []

for e in sorted(events, key=lambda x: (x.get("ts", 0), x.get("ph"))):
    ts = e.get("ts")
    if ts is None:
        continue
        
    if ts > lcp_ts:
        break
        
    if ts < fcp_ts:
        continue

    # Very simplified trace tree analysis
    name = e.get("name")
    ph = e.get("ph")
    dur = e.get("dur", 0)
    
    if ph == "X":
        # Complete event
        cpu_times[name] += dur
        self_times[name] += dur
        # Deduce from parent self time
        if stack:
            self_times[stack[-1]] -= dur
            
        args = e.get("args", {})
        if "data" in args and "url" in args["data"]:
            url = args["data"]["url"]
            if url:
                cpu_times[url] += dur
                
        # user timing
        if e.get("cat") == "blink.user_timing":
            cpu_times[f"UserTiming: {name}"] += dur

print("=== Top Functions / Components ===")
for k, v in sorted(cpu_times.items(), key=lambda x: x[1], reverse=True)[:30]:
    print(f"{k}: {v / 1000.0:.2f} ms")
