import AttendanceAction from './actions/AttendanceAction';
import CalendarAction from './actions/CalendarAction';
import DocumentsAction from './actions/DocumentsAction';
import JourneyAction from './actions/JourneyAction';
import LineageCertAction from './actions/LineageCertAction';
import ParticipationAction from './actions/ParticipationAction';
import ProofOfPubAction from './actions/ProofOfPubAction';
import ShareAction from './actions/ShareAction';
import type { GemRecord, RecordAction } from './RecordGem.types';
import { resolveActions } from './resolveActions';

type Variant = 'card' | 'detail' | 'calendar';

type Props = {
  record: GemRecord;
  variant?: Variant;
};

function renderAction(action: RecordAction) {
  switch (action.id) {
    case 'attendance':
      return (
        <AttendanceAction
          key="attendance"
          title={action.context.title}
          date={action.context.date}
          location={action.context.location}
        />
      );
    case 'calendar':
      return (
        <CalendarAction
          key="calendar"
          title={action.context.title}
          date={action.context.date}
          location={action.context.location}
          isDeadline={action.context.isDeadline}
        />
      );
    case 'share':
      return <ShareAction key="share" title={action.context.title} />;
    case 'participation':
      return (
        <ParticipationAction
          key="participation"
          _id={action.context._id}
          title={action.context.title}
          deadline={action.context.deadline}
          contact={action.context.contact}
        />
      );
    case 'documents':
      return <DocumentsAction key="documents" items={action.context.items} />;
    case 'journey':
      return (
        <JourneyAction
          key="journey"
          slug={action.context.slug}
          _type={action.context._type}
        />
      );
    case 'lineage-cert':
      return (
        <LineageCertAction key="lineage-cert" slug={action.context.slug} />
      );
    case 'proof-of-pub':
      return <ProofOfPubAction key="proof-of-pub" _id={action.context._id} />;
    case 'view-source':
      return (
        <a
          key="view-source"
          href={action.context.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          🔗 View Source
        </a>
      );
    default:
      return null;
  }
}

// card — identity strip + primary action + share
function GemCard({ actions }: { record: GemRecord; actions: RecordAction[] }) {
  const primary = actions.find(
    (a) => a.id === 'attendance' || a.id === 'participation'
  );
  const calendar = actions.find((a) => a.id === 'calendar');
  const share = actions.find((a) => a.id === 'share');

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-3">
      {primary && renderAction(primary)}
      <div className="flex items-center gap-4 pt-1">
        {calendar && renderAction(calendar)}
        {share && renderAction(share)}
      </div>
    </div>
  );
}

// detail — full action set grouped
function GemDetail({ actions }: { actions: RecordAction[] }) {
  if (!actions.length) return null;
  return (
    <div className="space-y-3">
      {actions.map((action) => renderAction(action))}
    </div>
  );
}

// calendar — date + attendance prominent
function GemCalendar({ actions }: { actions: RecordAction[] }) {
  const attendance = actions.find((a) => a.id === 'attendance');
  const calendar = actions.find((a) => a.id === 'calendar');
  const share = actions.find((a) => a.id === 'share');

  return (
    <div className="space-y-3">
      {attendance && renderAction(attendance)}
      <div className="flex items-center gap-4">
        {calendar && renderAction(calendar)}
        {share && renderAction(share)}
      </div>
    </div>
  );
}

export default function RecordGem({ record, variant = 'card' }: Props) {
  const actions = resolveActions(record, new Date());
  if (!actions.length) return null;

  if (variant === 'detail') return <GemDetail actions={actions} />;
  if (variant === 'calendar') return <GemCalendar actions={actions} />;
  return <GemCard record={record} actions={actions} />;
}
