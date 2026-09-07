/* ==========================================================================
   MECHANISM DIAGRAMS — one per capability.
   ==========================================================================
   SERVICE-PAGE-RESEARCH.md §2 P1: the reference pages' strongest move is that
   every capability block is paired with a drawing of HOW THE THING WORKS —
   an orchestrator with models on an orbit, a Bronze→Silver→Gold refinery —
   rather than a stock illustration. That is the principle taken here; none of
   their drawings is reproduced. These five are ours, drawn from our own
   mechanisms:

     slice      one vertical slice crossing every layer, in production first
     lineage    a dashboard figure traceable back to the row it came from
     deploy     push → plan → deploy → observe, with the rollback arc
     retrieval  a model call wrapped in retrieval, guardrails and evaluation
     merge      two lanes of engineers converging on one repository

   ── THREE CONSTRAINTS, ALL LOAD-BEARING ─────────────────────────────────
   1. NO `id`s, no `<defs>`, no gradients. Every diagram renders TWICE on the
      page — once in the desktop sticky panel and once inline for mobile — so
      any id would be duplicated in the document, and a duplicated gradient id
      resolves to whichever came first. Flat fills and strokes only.
   2. TOKENS, NEVER LITERALS. Colour arrives through Tailwind classes
      (`stroke-border`, `fill-card`, `text-brand` + `fill="currentColor"`), so
      both themes work with no `.dark` branch here. A hex in this file is a
      bug in dark mode.
   3. Text inside SVG must stay ≥ 10px at the rendered size and is set with
      `fill="currentColor"` under a colour class, so it obeys the same
      contrast tokens as body copy.

   The whole SVG is `role="img"` with a written label: a screen-reader user
   gets the mechanism as a sentence, and the capability's own prose repeats
   the same claim, so nothing is only available as a picture.
   ========================================================================== */

function Frame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 560 400"
      role="img"
      aria-label={label}
      className="h-full w-full"
      fill="none"
    >
      {children}
    </svg>
  );
}

/* Shared micro-label. SVG has no `text-transform` shorthand in Tailwind that
   survives into the shadow-free SVG box, so the casing is in the string. */
function Micro({
  x,
  y,
  children,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill="currentColor"
      className="fill-muted-foreground text-[10px] font-bold tracking-[0.14em]"
      style={{ fontSize: 10, letterSpacing: "0.14em" }}
    >
      {children}
    </text>
  );
}

function Label({
  x,
  y,
  children,
  anchor = "start",
  strong,
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
  strong?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill="currentColor"
      className={strong ? "fill-foreground" : "fill-muted-strong"}
      style={{ fontSize: strong ? 14 : 12, fontWeight: strong ? 700 : 500 }}
    >
      {children}
    </text>
  );
}

/* ── 01 · PRODUCT ENGINEERING ──────────────────────────────────────────────
   Four horizontal layers; one narrow vertical column crossing all four is the
   first milestone. The ghost columns to its right are the slices that follow.
   This is the argument of the section drawn: integration risk is paid in
   week two, not in the final month. */
function Slice() {
  const lanes = ["INTERFACE", "SERVICE", "DATA", "DEPLOY"];
  return (
    <Frame label="Four product layers — interface, service, data and deploy — with one narrow vertical slice crossing all four and reaching production, and later slices drawn faintly beside it.">
      {lanes.map((l, i) => {
        const y = 58 + i * 76;
        return (
          <g key={l}>
            <rect
              x={104}
              y={y}
              width={420}
              height={54}
              rx={14}
              className="fill-muted stroke-border"
              strokeWidth={1}
            />
            <Micro x={92} y={y + 32} anchor="end">
              {l}
            </Micro>
          </g>
        );
      })}

      {/* the shipped slice */}
      <rect
        x={132}
        y={48}
        width={78}
        height={302}
        rx={16}
        className="fill-brand/10 stroke-brand"
        strokeWidth={1.5}
      />
      {lanes.map((l, i) => (
        <rect
          key={l}
          x={142}
          y={64 + i * 76}
          width={58}
          height={42}
          rx={10}
          className="fill-brand"
        />
      ))}
      <Micro x={171} y={36} anchor="middle">
        SLICE 01
      </Micro>

      {/* the ones after it */}
      {[240, 330, 420].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={48}
          width={78}
          height={302}
          rx={16}
          className="fill-transparent stroke-border"
          strokeWidth={1}
          strokeDasharray="4 6"
          opacity={0.9 - i * 0.22}
        />
      ))}

      {/* live marker under the slice */}
      <circle cx={171} cy={372} r={5} className="fill-accent" />
      <Label x={186} y={376}>
        in production
      </Label>
    </Frame>
  );
}

/* ── 02 · DATA & ANALYTICS ─────────────────────────────────────────────────
   A figure on a dashboard, and the path back to the row that produced it.
   The single dashed return arrow is the whole point: lineage is a property of
   the pipeline, not a document about it. */
function Lineage() {
  const nodes = [
    { x: 40, label: "Source rows", micro: "INGEST" },
    { x: 190, label: "Modelled", micro: "TRANSFORM" },
    { x: 340, label: "Metric, once", micro: "DEFINITION" },
  ];
  return (
    <Frame label="A dashboard figure traced back through a single metric definition and a transform step to the source rows it came from, with quality checks gating the path.">
      {nodes.map((n, i) => (
        <g key={n.label}>
          <rect
            x={n.x}
            y={120}
            width={130}
            height={92}
            rx={16}
            className="fill-card stroke-border"
            strokeWidth={1}
          />
          <Micro x={n.x + 16} y={146}>
            {n.micro}
          </Micro>
          <Label x={n.x + 16} y={172} strong>
            {n.label}
          </Label>
          {/* three rows of "data" inside the first node only */}
          {i === 0 &&
            [0, 1, 2].map((r) => (
              <rect
                key={r}
                x={n.x + 16}
                y={182 + r * 8}
                width={r === 1 ? 60 : 92}
                height={4}
                rx={2}
                className="fill-teal-600/40"
              />
            ))}
          {i > 0 && (
            <rect
              x={n.x + 16}
              y={182}
              width={98}
              height={4}
              rx={2}
              className="fill-teal-600/40"
            />
          )}
          {i < 2 && (
            <path
              d={`M${n.x + 130} 166 h20`}
              className="stroke-teal-600"
              strokeWidth={1.5}
              markerEnd=""
            />
          )}
        </g>
      ))}

      {/* the dashboard figure */}
      <rect
        x={410}
        y={104}
        width={120}
        height={124}
        rx={18}
        className="fill-card stroke-teal-600"
        strokeWidth={1.5}
      />
      <Micro x={426} y={130}>
        DASHBOARD
      </Micro>
      <text
        x={426}
        y={172}
        fill="currentColor"
        className="fill-foreground"
        style={{ fontSize: 28, fontWeight: 700 }}
      >
        1,284
      </text>
      <Label x={426} y={196}>
        active accounts
      </Label>
      <path d="M390 166 h20" className="stroke-teal-600" strokeWidth={1.5} />

      {/* the return path — lineage */}
      <path
        d="M470 244 v34 H105 v-42"
        className="stroke-teal-600"
        strokeWidth={1.5}
        strokeDasharray="5 5"
      />
      <Micro x={288} y={296} anchor="middle">
        TRACEABLE BACK TO THE ROW
      </Micro>

      {/* quality gate */}
      <rect
        x={196}
        y={40}
        width={168}
        height={40}
        rx={12}
        className="fill-muted stroke-border"
        strokeWidth={1}
      />
      <Label x={280} y={65} anchor="middle">
        quality checks in CI
      </Label>
      <path
        d="M280 80 v34"
        className="stroke-border"
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />
    </Frame>
  );
}

/* ── 03 · CLOUD & DEVOPS ───────────────────────────────────────────────────
   The loop, with the rollback drawn as a first-class arc rather than an
   afterthought — the section's claim is that the client's own team can run
   both directions of it. */
function Deploy() {
  const nodes = [
    { x: 90, y: 96, micro: "ANY ENGINEER", label: "Push" },
    { x: 330, y: 96, micro: "PLANNED", label: "CI checks" },
    { x: 330, y: 258, micro: "YOUR ACCOUNT", label: "Deploy" },
    { x: 90, y: 258, micro: "PAGES A HUMAN", label: "Observe" },
  ];
  return (
    <Frame label="A four-step loop — push, CI checks, deploy into your own cloud account, observe — with a rollback arc labelled one documented command returning from deploy to the previous state.">
      {/* the rail */}
      <rect
        x={130}
        y={78}
        width={300}
        height={220}
        rx={40}
        className="stroke-border"
        strokeWidth={1.5}
        strokeDasharray="6 7"
      />

      {nodes.map((n) => (
        <g key={n.label}>
          <rect
            x={n.x}
            y={n.y}
            width={140}
            height={62}
            rx={16}
            className="fill-card stroke-border"
            strokeWidth={1}
          />
          <Micro x={n.x + 16} y={n.y + 24}>
            {n.micro}
          </Micro>
          <Label x={n.x + 16} y={n.y + 46} strong>
            {n.label}
          </Label>
        </g>
      ))}

      {/* direction arrows on the rail */}
      <path d="M272 90 l10 -6 v12 z" className="fill-brand-light" />
      <path d="M436 196 l-6 -10 h12 z" className="fill-brand-light" />
      <path d="M288 320 l-10 6 v-12 z" className="fill-brand-light" />
      <path d="M124 196 l6 10 h-12 z" className="fill-brand-light" />

      {/* rollback */}
      <path
        d="M330 289 C 250 240, 250 160, 330 138"
        className="stroke-brand-light"
        strokeWidth={1.5}
      />
      <path d="M330 138 l-12 2 6 8 z" className="fill-brand-light" />
      <rect
        x={196}
        y={186}
        width={168}
        height={38}
        rx={12}
        className="fill-brand-light/10 stroke-brand-light"
        strokeWidth={1}
      />
      <Label x={280} y={210} anchor="middle">
        rollback: one command
      </Label>
    </Frame>
  );
}

/* ── 04 · AI INTEGRATION ───────────────────────────────────────────────────
   The demo-versus-shipped distinction, drawn: the model call is the small
   box in the middle, and everything around it — retrieval, guardrails,
   evaluation, cost ceiling — is what makes it survive review. */
function Retrieval() {
  return (
    <Frame label="A workflow step feeding a retrieval index and a model call wrapped in guardrails, with an evaluation harness scoring the output and a cost ceiling applied per call.">
      {/* workflow in */}
      <rect
        x={28}
        y={150}
        width={112}
        height={64}
        rx={16}
        className="fill-card stroke-border"
        strokeWidth={1}
      />
      <Micro x={44} y={176}>
        WORKFLOW
      </Micro>
      <Label x={44} y={198} strong>
        The step
      </Label>
      <path d="M140 182 h34" className="stroke-indigo-600" strokeWidth={1.5} />

      {/* retrieval */}
      <rect
        x={174}
        y={92}
        width={128}
        height={58}
        rx={14}
        className="fill-indigo-600/10 stroke-indigo-600"
        strokeWidth={1}
      />
      <Micro x={190} y={116}>
        YOUR DATA
      </Micro>
      <Label x={190} y={136}>
        retrieval index
      </Label>
      <path
        d="M238 150 v18"
        className="stroke-indigo-600"
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />

      {/* the model call */}
      <rect
        x={174}
        y={168}
        width={128}
        height={64}
        rx={16}
        className="fill-card stroke-indigo-600"
        strokeWidth={1.5}
      />
      <Micro x={190} y={192}>
        GUARDED
      </Micro>
      <Label x={190} y={214} strong>
        model call
      </Label>

      {/* guardrails, drawn as the frame around it */}
      <rect
        x={162}
        y={80}
        width={152}
        height={224}
        rx={22}
        className="stroke-indigo-600"
        strokeWidth={1}
        strokeDasharray="5 6"
      />
      <Micro x={238} y={324} anchor="middle">
        GUARDRAILS BOTH ENDS
      </Micro>

      {/* cost ceiling */}
      <rect
        x={174}
        y={248}
        width={128}
        height={40}
        rx={12}
        className="fill-muted stroke-border"
        strokeWidth={1}
      />
      <Label x={238} y={273} anchor="middle">
        cost ceiling / call
      </Label>

      <path d="M314 182 h34" className="stroke-indigo-600" strokeWidth={1.5} />

      {/* evaluation harness */}
      <rect
        x={348}
        y={110}
        width={184}
        height={144}
        rx={18}
        className="fill-card stroke-border"
        strokeWidth={1}
      />
      <Micro x={368} y={138}>
        EVALUATION HARNESS
      </Micro>
      {[
        ["accuracy", 0.86],
        ["refusals", 0.42],
        ["latency", 0.68],
      ].map(([name, v], i) => (
        <g key={name as string}>
          <Label x={368} y={168 + i * 30}>
            {name as string}
          </Label>
          <rect
            x={438}
            y={158 + i * 30}
            width={74}
            height={6}
            rx={3}
            className="fill-muted"
          />
          <rect
            x={438}
            y={158 + i * 30}
            width={74 * (v as number)}
            height={6}
            rx={3}
            className="fill-indigo-600"
          />
        </g>
      ))}
      {/* the measured verdict feeding back */}
      <path
        d="M440 254 v34 H238 v-0"
        className="stroke-indigo-600"
        strokeWidth={1.5}
        strokeDasharray="5 5"
      />
      <Micro x={340} y={306} anchor="middle">
        A PROMPT CHANGE VS A REGRESSION
      </Micro>
    </Frame>
  );
}

/* ── 05 · TEAM AUGMENTATION ────────────────────────────────────────────────
   Two lanes converging into one branch — the claim being that there is one
   repository and one review process, not a vendor track reporting in. The
   exit arrow at the right is the 30-day notice, drawn because it is the
   objection everyone has and nobody asks about on the first call. */
function Merge() {
  return (
    <Frame label="Two lanes of engineers, yours and ours, converging into a single repository and review process, with a marked exit thirty days after notice.">
      <Micro x={40} y={96}>
        YOUR ENGINEERS
      </Micro>
      <Micro x={40} y={306}>
        INTERLOID, NAMED IN THE PROPOSAL
      </Micro>

      {/* your lane */}
      <path d="M40 130 H180 C 250 130, 250 200, 320 200" className="stroke-brand" strokeWidth={2} />
      {[60, 110, 160].map((x) => (
        <circle key={x} cx={x} cy={130} r={6} className="fill-card stroke-brand" strokeWidth={2} />
      ))}

      {/* our lane */}
      <path d="M40 270 H180 C 250 270, 250 200, 320 200" className="stroke-accent" strokeWidth={2} />
      {[60, 110, 160].map((x) => (
        <circle key={x} cx={x} cy={270} r={6} className="fill-card stroke-accent" strokeWidth={2} />
      ))}

      {/* the shared trunk */}
      <path d="M320 200 H520" className="stroke-foreground" strokeWidth={2} />
      {[360, 400, 440].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={200}
          r={6}
          className={i % 2 === 0 ? "fill-brand" : "fill-accent"}
        />
      ))}

      <rect
        x={286}
        y={140}
        width={148}
        height={40}
        rx={12}
        className="fill-card stroke-border"
        strokeWidth={1}
      />
      <Label x={360} y={165} anchor="middle">
        one review process
      </Label>
      <path d="M360 180 v14" className="stroke-border" strokeWidth={1.5} strokeDasharray="4 4" />

      {/* the exit */}
      <path d="M480 200 C 500 200, 505 250, 520 262" className="stroke-accent" strokeWidth={2} strokeDasharray="5 5" />
      <circle cx={522} cy={264} r={6} className="fill-card stroke-accent" strokeWidth={2} />
      <Micro x={520} y={296} anchor="end">
        30-DAY NOTICE, EITHER WAY
      </Micro>

      <rect
        x={286}
        y={226}
        width={148}
        height={40}
        rx={12}
        className="fill-muted stroke-border"
        strokeWidth={1}
      />
      <Label x={360} y={251} anchor="middle">
        your repository
      </Label>
    </Frame>
  );
}

const DIAGRAMS: Record<string, () => React.ReactElement> = {
  slice: Slice,
  lineage: Lineage,
  deploy: Deploy,
  retrieval: Retrieval,
  merge: Merge,
};

export default function Diagram({ name }: { name: string }) {
  const D = DIAGRAMS[name];
  return D ? <D /> : null;
}
