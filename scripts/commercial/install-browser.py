"""Install the fixed Chrome for Testing engine; keep downloads outside the repo."""
import base64
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import platform
import stat
import sys
import tempfile
import time
import urllib.request
import zipfile

CONFIG = json.loads(Path(__file__).with_name("browser-version.json").read_text())
VERSION = CONFIG["version"]
PLATFORMS = {("Darwin", "arm64"): "mac-arm64", ("Darwin", "x86_64"): "mac-x64", ("Linux", "x86_64"): "linux64", ("Windows", "AMD64"): "win64"}
TARGET = PLATFORMS.get((platform.system(), platform.machine()))
if TARGET is None:
    raise SystemExit("No pinned Chrome for Testing build for this platform")
CACHE = (Path.home() / "Library/Caches" if sys.platform == "darwin" else Path(os.environ.get("XDG_CACHE_HOME") or Path.home() / ".cache")) / "skymythos-browser"
DESTINATION = CACHE / VERSION / TARGET
BINARY = Path(f"chrome-headless-shell-{TARGET}") / ("chrome-headless-shell.exe" if TARGET == "win64" else "chrome-headless-shell")
URL = f"https://storage.googleapis.com/chrome-for-testing-public/{VERSION}/{TARGET}/chrome-headless-shell-{TARGET}.zip"
MAX_ARCHIVE = 400 * 1024 * 1024
MAX_EXTRACTED = 800 * 1024 * 1024


def unpack_browser(archive, destination):
    """Validate archive paths, links and expanded size before extracting any entry."""
    with zipfile.ZipFile(archive) as bundle:
        entries = bundle.infolist()
        if len(entries) > 2000 or sum(entry.file_size for entry in entries) > MAX_EXTRACTED:
            raise RuntimeError("Browser archive exceeds extraction budget")
        for entry in entries:
            name = PurePosixPath(entry.filename)
            mode = entry.external_attr >> 16
            if name.is_absolute() or ".." in name.parts or "\\" in entry.filename or ":" in entry.filename or not name.parts or name.parts[0] != f"chrome-headless-shell-{TARGET}" or stat.S_ISLNK(mode):
                raise RuntimeError("Unsafe browser archive entry")
        # zipfile checks each file's CRC; extraction starts only after all paths were reviewed.
        bundle.extractall(destination)
        for entry in entries:
            if entry.external_attr >> 16 & 0o111 and not entry.is_dir():
                (Path(destination) / entry.filename).chmod(0o755)


def install():
    executable = DESTINATION / BINARY
    record_path = DESTINATION / "installation.json"
    if record_path.is_file() and executable.is_file():
        record = json.loads(record_path.read_text())
        if record.get("url") == URL and record.get("binarySha256") == hashlib.sha256(executable.read_bytes()).hexdigest():
            print(executable)
            return
        raise RuntimeError("Cached browser failed integrity validation; inspect it before reinstalling")
    if DESTINATION.exists():
        raise RuntimeError("Incomplete browser destination already exists; refusing to overwrite")
    CACHE.mkdir(parents=True, exist_ok=True, mode=0o700)
    if CACHE.is_symlink():
        raise RuntimeError("Browser cache may not be a symlink")
    # The archive and extracted data each get a new empty directory; this script stays outside both.
    with tempfile.TemporaryDirectory(prefix="download-", dir=CACHE) as download, tempfile.TemporaryDirectory(prefix="extract-", dir=CACHE) as extracted:
        archive = Path(download) / "browser.zip"
        digest, transport_digest = hashlib.sha256(), hashlib.md5(usedforsecurity=False)
        started = time.monotonic()
        print(f"Downloading fixed Chrome {VERSION} ({TARGET})", file=sys.stderr)
        with urllib.request.urlopen(URL, timeout=30) as response, archive.open("xb") as output:
            length = int(response.headers.get("Content-Length", "0"))
            if length > MAX_ARCHIVE:
                raise RuntimeError("Browser archive exceeds download budget")
            hashes = dict(item.strip().split("=", 1) for item in response.headers.get("x-goog-hash", "").split(",") if "=" in item)
            size = 0
            while chunk := response.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_ARCHIVE or time.monotonic() - started > 240:
                    raise RuntimeError("Browser download exceeded byte or time budget")
                output.write(chunk)
                digest.update(chunk)
                transport_digest.update(chunk)
            if length and size != length:
                raise RuntimeError("Browser archive was truncated")
            if "md5" in hashes and base64.b64encode(transport_digest.digest()).decode() != hashes["md5"]:
                raise RuntimeError("Browser archive transport checksum mismatch")
        unpack_browser(archive, extracted)
        installed = Path(extracted) / BINARY
        if not installed.is_file():
            raise RuntimeError("Expected browser executable is missing")
        (Path(extracted) / "installation.json").write_text(json.dumps({"version": VERSION, "url": URL, "archiveSha256": digest.hexdigest(), "binarySha256": hashlib.sha256(installed.read_bytes()).hexdigest()}, indent=2) + "\n")
        DESTINATION.parent.mkdir(parents=True, exist_ok=True)
        # Publish only the fully extracted, verified directory; no partial cache is reused.
        os.rename(extracted, DESTINATION)
        print(executable)


if __name__ == "__main__":
    install()
