# Example Logs

Sample output from the lab harness running `quant-multilingual-001`.

## Files

| File | Scale | Lines | Description |
|------|-------|-------|-------------|
| `trace.log` | TRACE | ~35 | Continuous heartbeat, per-language progress |
| `structured.jsonl` | EVENT | ~20 | Machine-readable events, friction, results |

## Log Levels

```
TRACE    → Heartbeat every ~200ms during operations
EVENT    → Significant actions (start, complete, friction, result)
REPORT   → Stage completion summaries
MATRIX   → Results tables (see lab-harness.md for examples)
SUMMARY  → Full experiment report
```

## Friction Events in Sample

1. `rate-limit` at progress=14/200 - auto-resolved with 60s backoff
2. `timeout` at lang=swa - auto-resolved with retry

## Key Results

```
fertility ↔ degradation@W4:  r=0.72, p<0.001  [●] CONFIRMED
complexity ↔ degradation:    r=0.58, p=0.003  [◐] PARTIAL
mediation (sobel):           z=2.34, p=0.019  [●] CONFIRMED
```
