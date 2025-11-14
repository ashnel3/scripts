#!/usr/bin/env python3

import argparse
import sys

from pathlib import Path
from typing import Optional, Sequence

class SinglelineOptions(argparse.Namespace):
	line: str = "\\r\\n" if sys.platform == "win32" else "\\n"
	path: Path

parser = argparse.ArgumentParser('singleline')
parser.add_argument('path', help='file path', type=Path)
parser.add_argument('-l', '--line', help='newline charater', default=SinglelineOptions.line)

def main(args: Optional[Sequence[str]] = None) -> int:
	options = parser.parse_args(args, namespace=SinglelineOptions)
	try:
		with options.path.open() as f:
			print(options.line.join(line.strip() for line in f))
		return 0
	except Exception as err:
		print(err, file=sys.stderr)
		return 1

if __name__ == '__main__':
	exit(main())
