"""Exercise the actual installer against inert archive fixtures; never run their contents."""
import importlib.util
from pathlib import Path
import stat
import sys
import tempfile
import unittest
from unittest.mock import patch
import zipfile

SCRIPT = Path(__file__).resolve().parents[2] / "scripts/commercial/install-browser.py"
SPEC = importlib.util.spec_from_file_location("browser_installer", SCRIPT)
INSTALLER = importlib.util.module_from_spec(SPEC)
sys.dont_write_bytecode = True
SPEC.loader.exec_module(INSTALLER)


class BrowserArchiveTests(unittest.TestCase):
    def setUp(self):
        self.download = tempfile.TemporaryDirectory()
        self.extracted = tempfile.TemporaryDirectory()
        self.addCleanup(self.download.cleanup)
        self.addCleanup(self.extracted.cleanup)
        self.archive = Path(self.download.name) / "fixture.zip"
        self.destination = Path(self.extracted.name)

    def archive_with(self, name, mode=stat.S_IFREG | 0o755):
        entry = zipfile.ZipInfo(name)
        entry.create_system = 3
        entry.external_attr = mode << 16
        with zipfile.ZipFile(self.archive, "w") as bundle:
            bundle.writestr(entry, b"inert fixture, not an executable")

    def test_valid_archive_preserves_content_and_executable_mode(self):
        self.archive_with(INSTALLER.BINARY.as_posix())
        INSTALLER.unpack_browser(self.archive, self.destination)
        extracted = self.destination / INSTALLER.BINARY
        self.assertEqual(extracted.read_bytes(), b"inert fixture, not an executable")
        self.assertTrue(extracted.stat().st_mode & 0o111)

    def test_path_escape_absolute_foreign_root_and_windows_paths_rejected(self):
        root = f"chrome-headless-shell-{INSTALLER.TARGET}"
        for name in [f"{root}/../../escape", "/absolute", "foreign/file", f"{root}\\escape", f"{root}/C:escape"]:
            with self.subTest(name=name):
                self.archive_with(name)
                with self.assertRaisesRegex(RuntimeError, "Unsafe browser archive entry"):
                    INSTALLER.unpack_browser(self.archive, self.destination)
                self.assertEqual(list(self.destination.iterdir()), [])

    def test_symlink_rejected_before_extraction(self):
        self.archive_with(INSTALLER.BINARY.as_posix(), stat.S_IFLNK | 0o777)
        with self.assertRaisesRegex(RuntimeError, "Unsafe browser archive entry"):
            INSTALLER.unpack_browser(self.archive, self.destination)
        self.assertEqual(list(self.destination.iterdir()), [])

    def test_expanded_size_budget_rejected_before_extraction(self):
        self.archive_with(INSTALLER.BINARY.as_posix())
        with patch.object(INSTALLER, "MAX_EXTRACTED", 1):
            with self.assertRaisesRegex(RuntimeError, "extraction budget"):
                INSTALLER.unpack_browser(self.archive, self.destination)
        self.assertEqual(list(self.destination.iterdir()), [])

    def test_trickled_download_cannot_hide_deadline_inside_a_filling_read(self):
        elapsed = [0]

        class TrickleResponse:
            headers = {}
            read1_calls = 0

            def __enter__(self):
                return self

            def __exit__(self, *args):
                pass

            def read(self, size):
                # Filling a large read may accept trickled data indefinitely without returning.
                elapsed[0] += 10_000
                return b"x"

            def read1(self, size):
                self.read1_calls += 1
                elapsed[0] += 29
                return b"x"

        response = TrickleResponse()
        with patch.object(INSTALLER, "CACHE", Path(self.download.name) / "cache"), patch.object(INSTALLER, "DESTINATION", self.destination / "published"), patch.object(INSTALLER.urllib.request, "urlopen", return_value=response), patch.object(INSTALLER.time, "monotonic", side_effect=lambda: elapsed[0]):
            with self.assertRaisesRegex(RuntimeError, "time budget"):
                INSTALLER.install()
        self.assertLessEqual(elapsed[0], 270, "240-second budget plus at most one 30-second socket read")
        self.assertGreater(response.read1_calls, 0)
        self.assertFalse((self.destination / "published").exists())

    def test_corrupt_archive_crc_rejected(self):
        self.archive_with(INSTALLER.BINARY.as_posix())
        data = bytearray(self.archive.read_bytes())
        data[data.index(b"inert fixture")] ^= 1
        self.archive.write_bytes(data)
        with self.assertRaises(zipfile.BadZipFile):
            INSTALLER.unpack_browser(self.archive, self.destination)


if __name__ == "__main__":
    unittest.main()
