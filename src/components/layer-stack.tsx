/**
 * LayerStack — the component hierarchy, drawn as a stack.
 *
 * The section this sits in is called "分层" / layers, and the component list is
 * ordered the way a layered architecture is ordered: the control plane at the
 * top, then the runner that drives work, then the pieces that provide the
 * environment, the way in, the way you look at it, and finally the contracts
 * every layer shares. A numbered list states that order; a stack shows it.
 *
 * The figure is derived from `layers` rather than drawn by hand, so the picture
 * cannot drift from the list beneath it. The connectors and the side rail are
 * laid out as markup for the same reason.
 *
 * An earlier version of this drew a two-zone split across a sandbox boundary.
 * That was wrong and it is worth recording why: the sandbox boundary separates
 * the platform from the environment it creates per task, but *none* of these six
 * components is inside that sandbox — the supervisor and the agent sessions are,
 * and they are runtime facts rather than entries in this list. Splitting the list
 * at a fixed offset put `Console` and `Contracts` inside the sandbox, which is
 * plainly false. Anything that groups these components has to derive the
 * grouping from a field that exists, not from their position.
 */

interface Layer {
  name: string;
  responsibility: string;
  authority: string;
}

export function LayerStack({
  layers,
  authorityLabel,
}: {
  layers: Layer[];
  /** Label for the authority slot, e.g. "状态权威". */
  authorityLabel: string;
}) {
  return (
    <figure className="mt-12">
      <ol className="relative">
        {layers.map((layer, index) => (
          <li
            key={layer.name}
            className="group relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[2.75rem_minmax(0,13rem)_minmax(0,1fr)] sm:gap-x-6"
          >
            {/*
              The rail is the stack's spine. It runs the full height of every row
              except the last, where it stops at the node rather than trailing off
              into the whitespace below and implying a seventh layer.
            */}
            <div className="relative flex justify-center">
              <span
                aria-hidden="true"
                className={
                  index === layers.length - 1
                    ? "hidden"
                    : "absolute top-9 bottom-0 w-px bg-rule"
                }
              />
              <span className="fact-sm relative z-10 mt-3 h-6 leading-6 text-ink-4">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="col-start-2 mt-3 text-[0.9375rem] font-semibold leading-snug text-ink sm:col-start-2">
              {layer.name}
            </h3>

            <div className="col-start-2 min-w-0 pb-8 sm:col-start-3">
              <p className="text-[0.875rem] leading-[1.65] text-ink-2">
                {layer.responsibility}
              </p>
              {/*
                Authority is the load-bearing part of each row: the page's own
                argument is that the useful question is not what a component is
                called but which facts it is authoritative for. It gets its own
                labelled slot rather than being folded into the prose.
              */}
              <p className="mt-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="rail-label">{authorityLabel}</span>
                <span className="fact-sm text-ink-3">{layer.authority}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
