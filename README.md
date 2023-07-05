# streams-benchmark

> A benchmark that compares node streams, web streams, and duplex iterables

This benchmark can be run periodically to see if web streams are catching node streams in terms of performance between difference node versions.

## Usage

```console
% npm start
┌─────────┬─────────────────────────────────────────────┬──────┬───────┐
│ (index) │                    Name                     │ Time │ Ops/s │
├─────────┼─────────────────────────────────────────────┼──────┼───────┤
│    0    │               'node streams'                │ 500  │  0.5  │
│    1    │          'duplex async iterators'           │ 660  │ 0.66  │
│    2    │   'node streams as duplex async iterator'   │ 744  │ 0.744 │
│    3    │                'web streams'                │ 1713 │ 1.713 │
│    4    │   'web streams as duplex async iterator'    │ 1797 │ 1.797 │
│    5    │             'web byte streams'              │ 1988 │ 1.988 │
│    6    │ 'web byte streams as duplex async iterator' │ 2061 │ 2.061 │
│    7    │        'node streams as web streams'        │ 2151 │ 2.151 │
└─────────┴─────────────────────────────────────────────┴──────┴───────┘
```