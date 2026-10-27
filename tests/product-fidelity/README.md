# Independent product-rendering reference

These fixtures were captured from the real product components at revision
`033a372f66d5f53bbc8e6b519868238976701c47`. They contain synthetic example data,
the exported read-only DOM, the **original unadapted product CSS**, and selectors
recorded in the independent component browser. They contain no product
application JavaScript, source/dependency inventory, personal filesystem paths,
credentials, or business-service implementation.

`check.cjs` renders this reference at its original fixed desktop viewport in a
separate browser iframe. It compares the actual exported website with that
reference using text, element structure, computed styles, relative geometry, and
pixels. The reference camera places **only the outer iframe** at the measured
product root's document coordinates, then reproduces the actual outer viewport,
DPR, and scroll position. It asserts the resulting iframe viewport coordinates
match the product root. The inner reference body never moves; all inner geometry
and styles must remain identical before and after camera placement. Both full
viewport screenshots receive the same deterministic pixel crop, bounded by the
original canvas and excluding marketing overlays. There is no offset search.
The pixel-difference limit remains 0.5%.

This portable replay deliberately measures original and projected CSS on the
same browser/platform. It does not compare Linux font rasterization with macOS
PNG files. It proves rendering against the frozen real-component capture, not
execution of the current neighboring product checkout or live business E2E.
The no-JS/reduced matrix compares terminal states. Desktop 1440 and mobile 390
also compare all nine actual consumer states after advancing the browser's RAF
clock; the test never injects a reference frame into the consumer. `FIDELITY_WIDTHS`
selects a subset explicitly recorded in the report. Timing, pause behavior and
asynchronous loading/failure boundaries are checked separately by
`scripts/commercial/check-native-demos.cjs`.

Builds and checks never regenerate this baseline. `import-fixture.cjs` is an
explicit review tool and refuses to overwrite an existing fixture directory.
Refresh requires a newly reviewed real-component capture and a deliberate
review of the fixture diff and provenance. Do not substitute website-renderer
output for this reference, or overwrite earlier failed reports to claim success.

The original CSS retains its embedded third-party license notice. Only minimal
rendering inputs belong here; recordings, failed screenshots, full product
bundles, and machine-local audits do not.
