#!/usr/bin/env python3

import sys
from typing import Optional, Sequence

def main(args: Optional[Sequence[str]] = sys.argv[1:]) -> int:
    '''Alphabetize command-line interface'''
    for arg in sorted(args):
        print(arg)
    return 0

if __name__ == "__main__":
    exit(main())
