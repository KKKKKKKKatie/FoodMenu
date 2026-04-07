import { AdminShell } from "@/components/admin-shell";
import { createSessionAction } from "@/app/admin/actions";

function defaultDateTimeValue(offsetHours = 0) {
  const date = new Date(Date.now() + offsetHours * 60 * 60 * 1000);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 16);
}

export default function NewSessionPage() {
  return (
    <AdminShell title="Create Ordering Session" description="A session is a focused ordering window, such as a weekend dinner or family meal prep.">
      <form action={createSessionAction} className="form-panel stack">
        <div className="field">
          <label htmlFor="name">Session Name</label>
          <input id="name" name="name" defaultValue="This Week's Menu" required />
        </div>

        <div className="field">
          <label htmlFor="slug">Share URL Slug (optional)</label>
          <input id="slug" name="slug" placeholder="weekend-dinner" />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" placeholder="Example: Saturday dinner, order cutoff Friday at 6:00 PM" />
        </div>

        <div className="field">
          <label htmlFor="startsAt">Start Time</label>
          <input id="startsAt" name="startsAt" type="datetime-local" defaultValue={defaultDateTimeValue()} required />
        </div>

        <div className="field">
          <label htmlFor="endsAt">End Time (optional)</label>
          <input id="endsAt" name="endsAt" type="datetime-local" defaultValue={defaultDateTimeValue(24)} />
        </div>

        <label className="tag">
          <input type="checkbox" name="isActive" defaultChecked /> Activate immediately
        </label>

        <button type="submit">Create Session</button>
      </form>
    </AdminShell>
  );
}
