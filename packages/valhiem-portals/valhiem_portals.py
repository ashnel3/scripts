#!/usr/bin/env python3

# based on this script from r/valhiem https://www.reddit.com/r/valheim/comments/lixlu7/comment/iibfmuo

import argparse
import mmap
import sys

from pathlib import Path
from typing import Optional, Sequence

class ValhiemPortalsOptions(argparse.Namespace):
    db: Path

parser = argparse.ArgumentParser('valhiem-portals')
parser.add_argument('db', help="valhiem save db path", type=Path)

def get_portals(path: Path):
    with open(path, 'rb') as db:
        mm = mmap.mmap(db.fileno(), 0, access=mmap.ACCESS_READ)
        i, l = 0, set()
        while True:
            i = mm.find(b'\xea\x91|)', i)
            if i == -1:
                break
            l.add(mm[i+5:i+5+mm[i+4]].decode())
            i += 5 + mm[i+4]
        return l

def main(args: Optional[Sequence[str]] = None) -> int:
    opts = parser.parse_args(args, namespace=ValhiemPortalsOptions)
    if not opts.db.exists():
        return parser.error(f"Valhiem save database '{opts.db}' does not exist!")
    try:
        print("\n".join(get_portals(opts.db)))
        return 0
    except Exception as err:
        print(err, file=sys.stderr)
        return 1

if __name__ == "__main__":
    exit(main())
