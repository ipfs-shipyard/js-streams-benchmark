# streams-benchmark

> A benchmark that compares node streams, web streams, and duplex iterables

This benchmark can be run periodically to see if web streams are catching node streams in terms of performance between difference node versions.

## Usage

```console
% npm start
> stream-benchmark@1.0.0 start
> node index.js

┌─────────┬─────────────────────────────────────────────┬──────┬───────┐
│ (index) │ Name                                        │ Time │ Ops/s │
├─────────┼─────────────────────────────────────────────┼──────┼───────┤
│ 0       │ 'node streams'                              │ 360  │ 0.36  │
│ 1       │ 'event target'                              │ 371  │ 0.371 │
│ 2       │ 'duplex async iterators'                    │ 494  │ 0.494 │
│ 3       │ 'node streams as duplex async iterator'     │ 684  │ 0.684 │
│ 4       │ 'web streams'                               │ 1092 │ 1.092 │
│ 5       │ 'web streams as duplex async iterator'      │ 1162 │ 1.162 │
│ 6       │ 'web byte streams'                          │ 1246 │ 1.246 │
│ 7       │ 'node streams as web streams'               │ 1278 │ 1.278 │
│ 8       │ 'web byte streams as duplex async iterator' │ 1521 │ 1.521 │
└─────────┴─────────────────────────────────────────────┴──────┴───────┘
```