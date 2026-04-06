import { AdminShell } from "@/components/admin-shell";
import { createSessionAction } from "@/app/admin/actions";

function defaultDateTimeValue(offsetHours = 0) {
  const date = new Date(Date.now() + offsetHours * 60 * 60 * 1000);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 16);
}

export default function NewSessionPage() {
  return (
    <AdminShell title="创建点单会话" description="会话可以理解成一次集中的点餐窗口，例如周末聚餐或家庭备菜。">
      <form action={createSessionAction} className="form-panel stack">
        <div className="field">
          <label htmlFor="name">会话名称</label>
          <input id="name" name="name" defaultValue="本周菜单" required />
        </div>

        <div className="field">
          <label htmlFor="slug">分享地址标识（可选）</label>
          <input id="slug" name="slug" placeholder="weekend-dinner" />
        </div>

        <div className="field">
          <label htmlFor="description">说明</label>
          <textarea id="description" name="description" placeholder="例如：周六晚餐，周五 18:00 截单" />
        </div>

        <div className="field">
          <label htmlFor="startsAt">开始时间</label>
          <input id="startsAt" name="startsAt" type="datetime-local" defaultValue={defaultDateTimeValue()} required />
        </div>

        <div className="field">
          <label htmlFor="endsAt">结束时间（可选）</label>
          <input id="endsAt" name="endsAt" type="datetime-local" defaultValue={defaultDateTimeValue(24)} />
        </div>

        <label className="tag">
          <input type="checkbox" name="isActive" defaultChecked /> 立即开启
        </label>

        <button type="submit">创建会话</button>
      </form>
    </AdminShell>
  );
}
