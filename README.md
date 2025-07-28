# streams-benchmark

> A benchmark that compares node streams, web streams, and duplex iterables

This benchmark can be run periodically to see if web streams are catching node streams in terms of performance between difference node versions.

## Usage

```console
% npm start
> stream-benchmark@1.0.0 start
> node index.js

┌─────────┬─────────────────────────────────────────────┬──────┬────────────────────┐
│ (index) │ Name                                        │ Time │ Ops/s              │
├─────────┼─────────────────────────────────────────────┼──────┼────────────────────┤
│ 0       │ 'node streams'                              │ 354  │ 2.824858757062147  │
│ 1       │ 'event target'                              │ 368  │ 2.717391304347826  │
│ 2       │ 'duplex async iterators'                    │ 425  │ 2.3529411764705883 │
│ 3       │ 'node streams as duplex async iterator'     │ 536  │ 1.8656716417910448 │
│ 4       │ 'web streams'                               │ 818  │ 1.2224938875305624 │
│ 5       │ 'web streams as duplex async iterator'      │ 918  │ 1.0893246187363834 │
│ 6       │ 'web byte streams'                          │ 967  │ 1.0341261633919339 │
│ 7       │ 'node streams as web streams'               │ 1024 │ 0.9765625          │
│ 8       │ 'web byte streams as duplex async iterator' │ 1150 │ 0.8695652173913043 │
└─────────┴─────────────────────────────────────────────┴──────┴────────────────────┘
```