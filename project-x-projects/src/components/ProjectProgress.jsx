export default function ProjectProgress({ raisedCents = 0, goalCents = null, isDull = false }) {
  const goal = Number(goalCents || 0);
  if (!goal || goal <= 0) return null;

  const raised = Number(raisedCents || 0);
  const pct = Math.max(0, Math.min(100, Math.round((raised / goal) * 100)));

  const raisedText = `$${(raised / 100).toFixed(2)}`;
  const goalText = `$${(goal / 100).toFixed(2)}`;

  return (
    <div className={`ppWrap ${isDull ? "isDull" : ""}`} aria-label="Funding progress">
      <div className="ppTop">
        <div className="ppLabel">Raised</div>
        <div className="ppNums">{raisedText} <span className="ppOf">of {goalText}</span></div>
      </div>

      <div className="ppBar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
        <div className="ppFill" style={{ width: `${pct}%` }} />
      </div>

      <div className="ppFoot">{pct}% funded</div>
    </div>
  );
}
