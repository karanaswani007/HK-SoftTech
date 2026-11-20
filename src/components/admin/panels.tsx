import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Check, Notice, Panel, Skeleton, fieldClass, useConfirm, useLoader } from "@/components/admin/kit";
import { useAccess } from "@/components/admin/frame";
import {
  addEnquiryNote,
  addMedia,
  deleteDelivery,
  deleteFaq,
  deleteMedia,
  deletePost,
  deleteProgram,
  deleteProject,
  deleteService,
  deleteTestimonial,
  getDashboard,
  getSettingsAdmin,
  listActivity,
  listDelivery,
  listEnquiries,
  listEnquiryNotes,
  listFaqsAdmin,
  listMedia,
  listPostsAdmin,
  listProjectsAdmin,
  listServicesAdmin,
  listTeam,
  listTestimonialsAdmin,
  listTrainingAdmin,
  moveService,
  saveDelivery,
  saveFaq,
  savePost,
  saveProgram,
  saveProject,
  saveService,
  saveSettings,
  saveTestimonial,
  setRole,
  updateEnquiry,
  updateRegistration,
} from "@/lib/hk/admin-fns";
import { LEAD_STATUSES, PROJECT_STATUSES, STAFF_ROLES, statusLabel } from "@/lib/hk/labels";
import { errText } from "@/lib/hk/row";

function run(action: () => Promise<unknown>, reload: () => void) {
  return action()
    .then(() => {
      toast.success("Saved");
      reload();
    })
    .catch((error) => toast.error(errText(error)));
}

function readImage(file: File, onLoad: (value: string) => void) {
  if (!file.type.startsWith("image/")) {
    toast.error("Choose an image file.");
    return;
  }
  if (file.size > 900_000) {
    toast.error("Images must be under 900 KB.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => onLoad(String(reader.result ?? ""));
  reader.readAsDataURL(file);
}

export function DashboardPanel() {
  const load = useServerFn(getDashboard);
  const { data, error, loading } = useLoader(() => load());
  if (loading) return <Skeleton />;
  if (error) return <Notice>{error}</Notice>;
  if (!data) return null;
  const days = data.days.length
    ? data.days
    : [{ day: "—", n: 0 }];
  const statuses = LEAD_STATUSES.map(([key, label]) => ({ label, n: Number(data.byStatus[key] ?? 0) }));
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Published services", String(data.publishedServices)],
          ["Published projects", String(data.publishedProjects)],
          ["Active delivery", String(data.activeProjects)],
          ["New leads", data.newLeads === null ? "Restricted" : String(data.newLeads)],
        ].map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-line bg-card p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
          </article>
        ))}
      </div>
      <Notice>Outbound email is not connected. Enquiries are stored in the studio and are not marked as emailed.</Notice>
      {data.canLeads ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Enquiries by status">
            {data.totalEnquiries ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statuses}>
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-25} height={60} textAnchor="end" />
                    <YAxis allowDecimals={false} width={28} />
                    <Tooltip />
                    <Bar dataKey="n" fill="var(--color-accent)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted">No enquiries yet. They appear here when someone uses the contact form.</p>
            )}
          </Panel>
          <Panel title="Last 14 days">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={days}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} width={28} />
                  <Tooltip />
                  <Bar dataKey="n" fill="var(--color-navy)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Recent activity">
          {data.activity.length === 0 ? (
            <p className="text-sm text-muted">No studio actions yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.activity.map((item) => (
                <li key={String(item.id)} className="flex justify-between gap-3 border-b border-line py-2">
                  <span>{String(item.action)}</span>
                  <span className="text-muted">{String(item.record_ref)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        {data.canLeads ? (
          <Panel title={`All enquiries: ${data.totalEnquiries ?? 0}`}>
            {data.recent.length === 0 ? (
              <p className="text-sm text-muted">No leads yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {data.recent.map((item) => (
                  <li key={String(item.id)} className="flex justify-between gap-3">
                    <span>
                      {String(item.id)} · {String(item.name)}
                    </span>
                    <span className="text-muted">{statusLabel(String(item.status))}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        ) : null}
      </div>
    </div>
  );
}

export function ServicesPanel() {
  const load = useServerFn(listServicesAdmin);
  const save = useServerFn(saveService);
  const remove = useServerFn(deleteService);
  const move = useServerFn(moveService);
  const { data, error, loading, reload } = useLoader(() => load());
  const { confirm, dialog } = useConfirm();
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load services."}</Notice>;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {dialog}
      <Panel
        title="Services"
        action={
          <button type="button" className="text-sm font-semibold text-accent" onClick={() => setDraft({ slug: "", category_slug: String(data.categories[0]?.slug ?? ""), name: "", summary: "", body: "", includes: "", featured: false, published: true, sort_order: 10, meta_title: "", meta_description: "", image_url: "", original_slug: "" })}>
            Add
          </button>
        }
      >
        <ul className="max-h-[70vh] space-y-2 overflow-auto">
          {data.services.map((service) => (
            <li key={String(service.slug)} className="flex items-center gap-2 rounded-xl border border-line px-3 py-2">
              <button type="button" className="min-w-0 flex-1 text-left text-sm" onClick={() => setDraft({ ...service, original_slug: service.slug })}>
                <span className="font-medium">{String(service.name)}</span>
                <span className="mt-1 block text-xs text-muted">{service.published ? "Published" : "Hidden"}</span>
              </button>
              <button type="button" className="px-2 text-xs" onClick={() => run(() => move({ data: { slug: String(service.slug), direction: "up" } }), reload)} aria-label="Move up">
                Up
              </button>
              <button type="button" className="px-2 text-xs" onClick={() => run(() => move({ data: { slug: String(service.slug), direction: "down" } }), reload)} aria-label="Move down">
                Down
              </button>
            </li>
          ))}
        </ul>
      </Panel>
      {draft ? (
        <Panel title={draft.original_slug ? "Edit service" : "New service"}>
          <div className="grid gap-3">
            <input className={fieldClass} placeholder="Slug" value={String(draft.slug ?? "")} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} />
            <select className={fieldClass} value={String(draft.category_slug ?? "")} onChange={(event) => setDraft({ ...draft, category_slug: event.target.value })}>
              {data.categories.map((category) => (
                <option key={String(category.slug)} value={String(category.slug)}>
                  {String(category.name)}
                </option>
              ))}
            </select>
            <input className={fieldClass} placeholder="Name" value={String(draft.name ?? "")} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            <textarea className={fieldClass} placeholder="Summary" value={String(draft.summary ?? "")} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} />
            <textarea className={`${fieldClass} min-h-28`} placeholder="Description" value={String(draft.body ?? "")} onChange={(event) => setDraft({ ...draft, body: event.target.value })} />
            <textarea className={fieldClass} placeholder="Included items, one per line" value={String(draft.includes ?? "")} onChange={(event) => setDraft({ ...draft, includes: event.target.value })} />
            <input className={fieldClass} placeholder="Sort order" type="number" value={Number(draft.sort_order ?? 0)} onChange={(event) => setDraft({ ...draft, sort_order: Number(event.target.value) })} />
            <input className={fieldClass} placeholder="SEO title" value={String(draft.meta_title ?? "")} onChange={(event) => setDraft({ ...draft, meta_title: event.target.value })} />
            <textarea className={fieldClass} placeholder="SEO description" value={String(draft.meta_description ?? "")} onChange={(event) => setDraft({ ...draft, meta_description: event.target.value })} />
            <input className={fieldClass} placeholder="Image URL" value={String(draft.image_url ?? "").startsWith("data:") ? "" : String(draft.image_url ?? "")} onChange={(event) => setDraft({ ...draft, image_url: event.target.value })} />
            <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) readImage(file, (image_url) => setDraft({ ...draft, image_url })); }} />
            <div className="flex flex-wrap gap-4">
              <Check label="Featured" checked={Boolean(draft.featured)} onChange={(featured) => setDraft({ ...draft, featured })} />
              <Check label="Published" checked={Boolean(draft.published)} onChange={(published) => setDraft({ ...draft, published })} />
            </div>
            <div className="flex gap-2">
              <button type="button" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent" onClick={() => run(() => save({ data: { ...draft, sort_order: Number(draft.sort_order ?? 0), featured: Boolean(draft.featured), published: Boolean(draft.published) } as never }), reload)}>
                Save
              </button>
              {draft.original_slug ? (
                <button type="button" className="rounded-full border border-line px-4 py-2 text-sm" onClick={() => confirm("Delete this service?", () => run(() => remove({ data: { slug: String(draft.original_slug) } }), () => { setDraft(null); reload(); }))}>
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        </Panel>
      ) : (
        <Notice>Select a service to edit it, or add a new one.</Notice>
      )}
    </div>
  );
}

export function PortfolioPanel() {
  const load = useServerFn(listProjectsAdmin);
  const save = useServerFn(saveProject);
  const remove = useServerFn(deleteProject);
  const { data, error, loading, reload } = useLoader(() => load());
  const { confirm, dialog } = useConfirm();
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load projects."}</Notice>;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {dialog}
      <Panel title="Portfolio" action={<button type="button" className="text-sm font-semibold text-accent" onClick={() => setDraft({ slug: "", title: "", summary: "", body: "", category: "Web", stack: "", project_url: "", github_url: "", image_url: "", featured: false, published: false, sort_order: 50, meta_title: "", meta_description: "", original_slug: "" })}>Add</button>}>
        <ul className="space-y-2">
          {data.map((project) => (
            <li key={String(project.slug)}>
              <button type="button" className="w-full rounded-xl border border-line px-3 py-2 text-left text-sm" onClick={() => setDraft({ ...project, original_slug: project.slug })}>
                {String(project.title)} <span className="text-muted">{project.published ? "· Published" : "· Hidden"}</span>
              </button>
            </li>
          ))}
        </ul>
      </Panel>
      {draft ? (
        <Panel title="Project">
          <div className="grid gap-3">
            {["slug", "title", "category", "stack", "project_url", "github_url", "meta_title"].map((key) => (
              <input key={key} className={fieldClass} placeholder={key.replaceAll("_", " ")} value={String(draft[key] ?? "")} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} />
            ))}
            <textarea className={fieldClass} placeholder="Summary" value={String(draft.summary ?? "")} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} />
            <textarea className={`${fieldClass} min-h-28`} placeholder="Description. Do not invent results." value={String(draft.body ?? "")} onChange={(event) => setDraft({ ...draft, body: event.target.value })} />
            <textarea className={fieldClass} placeholder="SEO description" value={String(draft.meta_description ?? "")} onChange={(event) => setDraft({ ...draft, meta_description: event.target.value })} />
            <input className={fieldClass} type="number" value={Number(draft.sort_order ?? 0)} onChange={(event) => setDraft({ ...draft, sort_order: Number(event.target.value) })} />
            <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) readImage(file, (image_url) => setDraft({ ...draft, image_url })); }} />
            {draft.image_url ? <p className="text-xs text-muted">Image attached. It is shown as the project image, not as a performance claim.</p> : null}
            <Check label="Featured" checked={Boolean(draft.featured)} onChange={(featured) => setDraft({ ...draft, featured })} />
            <Check label="Published" checked={Boolean(draft.published)} onChange={(published) => setDraft({ ...draft, published })} />
            <div className="flex gap-2">
              <button type="button" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent" onClick={() => run(() => save({ data: draft as never }), reload)}>Save</button>
              {draft.original_slug ? <button type="button" className="text-sm" onClick={() => confirm("Delete this project?", () => run(() => remove({ data: { slug: String(draft.original_slug) } }), () => { setDraft(null); reload(); }))}>Delete</button> : null}
            </div>
          </div>
        </Panel>
      ) : <Notice>Projects stay unpublished until you choose to show them. Do not add screenshots you do not have.</Notice>}
    </div>
  );
}

export function EnquiriesPanel() {
  const load = useServerFn(listEnquiries);
  const update = useServerFn(updateEnquiry);
  const note = useServerFn(addEnquiryNote);
  const notesFn = useServerFn(listEnquiryNotes);
  const { data, error, loading, reload } = useLoader(() => load());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<string>("");
  const [noteBody, setNoteBody] = useState("");
  const notes = useLoader(() => (selected ? notesFn({ data: { id: selected } }) : Promise.resolve([])), selected);
  const filtered = useMemo(() => {
    const rows = data?.enquiries ?? [];
    return rows.filter((row) => {
      const blob = `${row.id} ${row.name} ${row.email} ${row.description}`.toLowerCase();
      if (query && !blob.includes(query.toLowerCase())) return false;
      if (status !== "all" && row.status !== status) return false;
      if (type !== "all" && row.customer_type !== type) return false;
      if (category !== "all" && row.service_category !== category) return false;
      return true;
    });
  }, [data, query, status, type, category]);
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load enquiries."}</Notice>;
  const current = data.enquiries.find((row) => row.id === selected);
  const categories = [...new Set(data.enquiries.map((row) => String(row.service_category)))];
  const types = [...new Set(data.enquiries.map((row) => String(row.customer_type)))];
  function exportCsv() {
    const header = ["id", "name", "email", "phone", "organization", "customer_type", "service_category", "budget", "timeline", "status", "contact_method", "description"];
    const lines = [header.join(",")].concat(
      filtered.map((row) => header.map((key) => `"${String(row[key] ?? "").replaceAll('"', '""')}"`).join(",")),
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "enquiries.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input className={fieldClass} placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className={fieldClass} value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select className={fieldClass} value={type} onChange={(event) => setType(event.target.value)}>
          <option value="all">All customer types</option>
          {types.map((value) => <option key={value}>{value}</option>)}
        </select>
        <select className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((value) => <option key={value}>{value}</option>)}
        </select>
        <button type="button" className="rounded-full border border-line px-4 py-2 text-sm" onClick={exportCsv}>Export CSV</button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="text-xs text-muted">
            <tr>
              {["Reference", "Name", "Type", "Status", "Follow-up"].map((label) => <th key={label} className="px-3 py-2 font-medium">{label}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td className="px-3 py-6 text-muted" colSpan={5}>No enquiries match.</td></tr>
            ) : filtered.map((row) => (
              <tr key={String(row.id)} className="cursor-pointer border-t border-line" onClick={() => setSelected(String(row.id))}>
                <td className="px-3 py-2">{String(row.id)}</td>
                <td className="px-3 py-2">{String(row.name)}</td>
                <td className="px-3 py-2">{String(row.customer_type)}</td>
                <td className="px-3 py-2">{statusLabel(String(row.status))}</td>
                <td className="px-3 py-2">{String(row.follow_up_on ?? "—")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {current ? (
        <Panel title={String(current.id)}>
          <p className="text-sm">{String(current.name)} · {String(current.email)} · {String(current.phone)}</p>
          <p className="mt-2 text-sm text-muted">{String(current.description)}</p>
          <p className="mt-2 text-xs text-muted">Email delivery: {String(current.email_status)}. Organisation: {String(current.organization || "—")}. Budget: {String(current.budget || "—")}. Timeline: {String(current.timeline)}.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <select className={fieldClass} value={String(current.status)} onChange={(event) => run(() => update({ data: { id: String(current.id), status: event.target.value, assignee_id: String(current.assignee_id ?? ""), follow_up_on: String(current.follow_up_on ?? "") } }), reload)}>
              {LEAD_STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select className={fieldClass} value={String(current.assignee_id ?? "")} onChange={(event) => run(() => update({ data: { id: String(current.id), status: String(current.status), assignee_id: event.target.value, follow_up_on: String(current.follow_up_on ?? "") } }), reload)}>
              <option value="">Unassigned</option>
              {data.staff.map((person) => <option key={String(person.user_id)} value={String(person.user_id)}>{String(person.name)}</option>)}
            </select>
            <input className={fieldClass} type="date" value={String(current.follow_up_on ?? "")} onChange={(event) => run(() => update({ data: { id: String(current.id), status: String(current.status), assignee_id: String(current.assignee_id ?? ""), follow_up_on: event.target.value } }), reload)} />
          </div>
          <div className="mt-4">
            <textarea className={fieldClass} placeholder="Internal note" value={noteBody} onChange={(event) => setNoteBody(event.target.value)} />
            <button type="button" className="mt-2 text-sm font-semibold text-accent" onClick={() => run(() => note({ data: { id: String(current.id), body: noteBody } }).then(() => setNoteBody("")), () => notes.reload())}>Add note</button>
            <ul className="mt-3 space-y-2 text-sm">
              {(notes.data ?? []).map((item) => (
                <li key={String(item.id)} className="rounded-xl bg-paper px-3 py-2">
                  <span className="font-medium">{String(item.author)}</span> · {String(item.body)}
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}

export function DeliveryPanel() {
  const load = useServerFn(listDelivery);
  const save = useServerFn(saveDelivery);
  const remove = useServerFn(deleteDelivery);
  const access = useAccess();
  const { data, error, loading, reload } = useLoader(() => load());
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const { confirm, dialog } = useConfirm();
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load delivery."}</Notice>;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {dialog}
      <Panel title="Client projects" action={<button type="button" className="text-sm font-semibold text-accent" onClick={() => setDraft({ title: "", description: "", owner_id: "", status: "planning", progress: 0, deadline: "", notes: "" })}>Add</button>}>
        {data.projects.length === 0 ? <p className="text-sm text-muted">No internal projects yet.</p> : (
          <ul className="space-y-2">
            {data.projects.map((project) => (
              <li key={String(project.id)}>
                <button type="button" className="w-full rounded-xl border border-line px-3 py-2 text-left text-sm" onClick={() => setDraft(project)}>
                  {String(project.title)} · {String(project.progress)}%
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      {draft ? (
        <Panel title="Project record">
          <div className="grid gap-3">
            <input className={fieldClass} placeholder="Title" value={String(draft.title ?? "")} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
            <textarea className={fieldClass} placeholder="Description" value={String(draft.description ?? "")} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            <select className={fieldClass} value={String(draft.status ?? "planning")} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
              {PROJECT_STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select className={fieldClass} value={String(draft.owner_id ?? "")} onChange={(event) => setDraft({ ...draft, owner_id: event.target.value })}>
              <option value="">Unassigned</option>
              {data.owners.map((owner) => <option key={String(owner.user_id)} value={String(owner.user_id)}>{String(owner.name)}</option>)}
            </select>
            <input className={fieldClass} type="number" min={0} max={100} value={Number(draft.progress ?? 0)} onChange={(event) => setDraft({ ...draft, progress: Number(event.target.value) })} />
            <input className={fieldClass} type="date" value={String(draft.deadline ?? "")} onChange={(event) => setDraft({ ...draft, deadline: event.target.value })} />
            <textarea className={fieldClass} placeholder="Internal notes" value={String(draft.notes ?? "")} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
            <div className="flex gap-2">
              <button type="button" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent" onClick={() => run(() => save({ data: { ...draft, progress: Number(draft.progress ?? 0), id: draft.id ? Number(draft.id) : undefined } as never }), reload)}>Save</button>
              {draft.id && ["super_admin", "admin"].includes(access.role) ? <button type="button" className="text-sm" onClick={() => confirm("Delete this internal project?", () => run(() => remove({ data: { id: Number(draft.id) } }), () => { setDraft(null); reload(); }))}>Delete</button> : null}
            </div>
          </div>
        </Panel>
      ) : <Notice>These records are internal. They are not shown on the public website.</Notice>}
    </div>
  );
}

export function TrainingPanel() {
  const load = useServerFn(listTrainingAdmin);
  const save = useServerFn(saveProgram);
  const remove = useServerFn(deleteProgram);
  const update = useServerFn(updateRegistration);
  const access = useAccess();
  const canEdit = ["super_admin", "admin", "editor"].includes(access.role);
  const { data, error, loading, reload } = useLoader(() => load());
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load training."}</Notice>;
  return (
    <div className="space-y-4">
      <Panel title="Programs" action={canEdit ? <button type="button" className="text-sm font-semibold text-accent" onClick={() => setDraft({ slug: "", title: "", summary: "", audience: "", schedule: "", published: true, sort_order: 40, original_slug: "" })}>Add</button> : null}>
        <ul className="space-y-2 text-sm">
          {data.programs.map((program) => (
            <li key={String(program.slug)}>
              <button type="button" className="text-left" onClick={() => canEdit && setDraft({ ...program, original_slug: program.slug })}>{String(program.title)} · {String(program.audience)}</button>
            </li>
          ))}
        </ul>
        {draft && canEdit ? (
          <div className="mt-4 grid gap-2">
            {["slug", "title", "audience", "schedule"].map((key) => <input key={key} className={fieldClass} placeholder={key} value={String(draft[key] ?? "")} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} />)}
            <textarea className={fieldClass} value={String(draft.summary ?? "")} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} />
            <Check label="Published" checked={Boolean(draft.published)} onChange={(published) => setDraft({ ...draft, published })} />
            <div className="flex gap-2">
              <button type="button" className="text-sm font-semibold text-accent" onClick={() => run(() => save({ data: { ...draft, sort_order: Number(draft.sort_order ?? 10), published: Boolean(draft.published) } as never }), reload)}>Save</button>
              {draft.original_slug ? <button type="button" className="text-sm" onClick={() => run(() => remove({ data: { slug: String(draft.original_slug) } }), reload)}>Delete</button> : null}
            </div>
          </div>
        ) : null}
      </Panel>
      {data.canLeads ? (
        <Panel title="Registrations">
          {data.registrations.length === 0 ? <p className="text-sm text-muted">No training registrations yet.</p> : (
            <ul className="space-y-3 text-sm">
              {data.registrations.map((row) => (
                <li key={String(row.id)} className="rounded-xl border border-line p-3">
                  <p className="font-medium">{String(row.name)} · {String(row.program_title)}</p>
                  <p className="text-muted">{String(row.email)} · {String(row.phone)}</p>
                  <select className={`${fieldClass} mt-2`} value={String(row.status)} onChange={(event) => run(() => update({ data: { id: Number(row.id), status: event.target.value } }), reload)}>
                    {["new", "contacted", "confirmed", "closed"].map((value) => <option key={value}>{value}</option>)}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}
    </div>
  );
}

export function TestimonialsPanel() {
  const load = useServerFn(listTestimonialsAdmin);
  const save = useServerFn(saveTestimonial);
  const remove = useServerFn(deleteTestimonial);
  const { data, error, loading, reload } = useLoader(() => load());
  const [draft, setDraft] = useState<Record<string, unknown>>({ author_name: "", author_role: "", quote: "", approved: false, published: false, featured: false });
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load testimonials."}</Notice>;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Approved words only">
        <p className="mb-3 text-sm text-muted">A testimonial is public only when it is both approved and published. Do not invent quotes.</p>
        {data.length === 0 ? <p className="text-sm text-muted">None yet.</p> : data.map((item) => (
          <button key={String(item.id)} type="button" className="mb-2 block w-full rounded-xl border border-line px-3 py-2 text-left text-sm" onClick={() => setDraft(item)}>
            {String(item.author_name)} {item.published ? "· Live" : "· Hidden"}
          </button>
        ))}
      </Panel>
      <Panel title="Edit">
        <div className="grid gap-2">
          <input className={fieldClass} placeholder="Name" value={String(draft.author_name ?? "")} onChange={(event) => setDraft({ ...draft, author_name: event.target.value })} />
          <input className={fieldClass} placeholder="Role" value={String(draft.author_role ?? "")} onChange={(event) => setDraft({ ...draft, author_role: event.target.value })} />
          <textarea className={`${fieldClass} min-h-28`} placeholder="Quote they actually gave" value={String(draft.quote ?? "")} onChange={(event) => setDraft({ ...draft, quote: event.target.value })} />
          <Check label="Approved" checked={Boolean(draft.approved)} onChange={(approved) => setDraft({ ...draft, approved })} />
          <Check label="Published" checked={Boolean(draft.published)} onChange={(published) => setDraft({ ...draft, published })} />
          <Check label="Featured" checked={Boolean(draft.featured)} onChange={(featured) => setDraft({ ...draft, featured })} />
          <div className="flex gap-2">
            <button type="button" className="text-sm font-semibold text-accent" onClick={() => run(() => save({ data: { ...draft, id: draft.id ? Number(draft.id) : undefined, approved: Boolean(draft.approved), published: Boolean(draft.published), featured: Boolean(draft.featured) } as never }), reload)}>Save</button>
            {draft.id ? <button type="button" className="text-sm" onClick={() => run(() => remove({ data: { id: Number(draft.id) } }), reload)}>Delete</button> : null}
          </div>
        </div>
      </Panel>
    </div>
  );
}

export function InsightsPanel() {
  const load = useServerFn(listPostsAdmin);
  const save = useServerFn(savePost);
  const remove = useServerFn(deletePost);
  const { data, error, loading, reload } = useLoader(() => load());
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load articles."}</Notice>;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Articles" action={<button type="button" className="text-sm font-semibold text-accent" onClick={() => setDraft({ slug: "", title: "", excerpt: "", body: "", cover_url: "", category: "Studio", tags: "", status: "draft", meta_title: "", meta_description: "", original_slug: "" })}>Add</button>}>
        {data.map((post) => (
          <button key={String(post.slug)} type="button" className="mb-2 block w-full rounded-xl border border-line px-3 py-2 text-left text-sm" onClick={() => setDraft({ ...post, original_slug: post.slug })}>
            {String(post.title)} · {String(post.status)}
          </button>
        ))}
      </Panel>
      {draft ? (
        <Panel title="Article">
          <div className="grid gap-2">
            {["slug", "title", "category", "tags", "meta_title"].map((key) => <input key={key} className={fieldClass} placeholder={key} value={String(draft[key] ?? "")} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} />)}
            <textarea className={fieldClass} placeholder="Excerpt" value={String(draft.excerpt ?? "")} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} />
            <textarea className={`${fieldClass} min-h-40`} placeholder="Body. Plain paragraphs. No invented claims." value={String(draft.body ?? "")} onChange={(event) => setDraft({ ...draft, body: event.target.value })} />
            <select className={fieldClass} value={String(draft.status ?? "draft")} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) readImage(file, (cover_url) => setDraft({ ...draft, cover_url })); }} />
            <div className="flex gap-2">
              <button type="button" className="text-sm font-semibold text-accent" onClick={() => run(() => save({ data: draft as never }), reload)}>Save</button>
              {draft.original_slug ? <button type="button" className="text-sm" onClick={() => run(() => remove({ data: { slug: String(draft.original_slug) } }), () => { setDraft(null); reload(); })}>Delete</button> : null}
            </div>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}

const COPY_FIELDS = [
  ["hero_label", "Hero label"],
  ["hero_title", "Hero title"],
  ["hero_body", "Hero description"],
  ["about_intro", "About introduction"],
  ["mission", "Mission"],
  ["vision", "Vision"],
  ["founder_name", "Founder name"],
  ["founder_role", "Founder role"],
  ["founder_bio", "Founder introduction"],
  ["cta_title", "Closing heading"],
  ["cta_body", "Closing description"],
  ["footer_blurb", "Footer introduction"],
  ["privacy_body", "Privacy policy"],
  ["terms_body", "Terms"],
] as const;

export function ContentPanel() {
  const load = useServerFn(listFaqsAdmin);
  const saveCopy = useServerFn(saveSettings);
  const save = useServerFn(saveFaq);
  const remove = useServerFn(deleteFaq);
  const { data, error, loading, reload } = useLoader(() => load());
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [faq, setFaq] = useState<Record<string, unknown> | null>(null);
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load content."}</Notice>;
  const current = settings ?? (data.settings as Record<string, unknown>);
  return (
    <div className="space-y-4">
      <Panel title="Website copy">
        <div className="grid gap-3">
          {COPY_FIELDS.map(([key, label]) => (
            <label key={key} className="grid gap-1 text-sm">
              {label}
              <textarea className={fieldClass} value={String(current[key] ?? "")} onChange={(event) => setSettings({ ...current, [key]: event.target.value })} />
            </label>
          ))}
          <button type="button" className="w-fit rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent" onClick={() => run(() => saveCopy({ data: current }), reload)}>Save copy</button>
        </div>
      </Panel>
      <Panel title="FAQs" action={<button type="button" className="text-sm font-semibold text-accent" onClick={() => setFaq({ question: "", answer: "", sort_order: 100, published: true })}>Add</button>}>
        <ul className="space-y-2 text-sm">
          {data.faqs.map((item) => (
            <li key={String(item.id)}>
              <button type="button" onClick={() => setFaq(item)}>{String(item.question)}</button>
            </li>
          ))}
        </ul>
        {faq ? (
          <div className="mt-3 grid gap-2">
            <input className={fieldClass} value={String(faq.question ?? "")} onChange={(event) => setFaq({ ...faq, question: event.target.value })} />
            <textarea className={fieldClass} value={String(faq.answer ?? "")} onChange={(event) => setFaq({ ...faq, answer: event.target.value })} />
            <Check label="Published" checked={Boolean(faq.published)} onChange={(published) => setFaq({ ...faq, published })} />
            <div className="flex gap-2">
              <button type="button" className="text-sm font-semibold text-accent" onClick={() => run(() => save({ data: { ...faq, id: faq.id ? Number(faq.id) : undefined, sort_order: Number(faq.sort_order ?? 0), published: Boolean(faq.published) } as never }), reload)}>Save FAQ</button>
              {faq.id ? <button type="button" className="text-sm" onClick={() => run(() => remove({ data: { id: Number(faq.id) } }), reload)}>Delete</button> : null}
            </div>
          </div>
        ) : null}
      </Panel>
    </div>
  );
}

export function MediaPanel() {
  const load = useServerFn(listMedia);
  const add = useServerFn(addMedia);
  const remove = useServerFn(deleteMedia);
  const { data, error, loading, reload } = useLoader(() => load());
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load media."}</Notice>;
  return (
    <Panel title="Media library">
      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        readImage(file, (data_url) => run(() => add({ data: { name: file.name, data_url } }), reload));
      }} />
      {data.length === 0 ? <p className="mt-4 text-sm text-muted">No files uploaded.</p> : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <li key={String(item.id)} className="rounded-xl border border-line p-2">
              <img src={String(item.data_url)} alt="" className="aspect-video w-full rounded-lg object-cover" />
              <p className="mt-2 truncate text-xs">{String(item.name)}</p>
              <button type="button" className="text-xs text-accent" onClick={() => run(() => remove({ data: { id: Number(item.id) } }), reload)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export function SeoPanel() {
  const load = useServerFn(getSettingsAdmin);
  const save = useServerFn(saveSettings);
  const { data, error, loading, reload } = useLoader(() => load());
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load SEO settings."}</Notice>;
  const current = draft ?? data;
  return (
    <Panel title="Search settings">
      <div className="grid gap-3">
        <label className="grid gap-1 text-sm">Meta title<textarea className={fieldClass} value={String(current.meta_title ?? "")} onChange={(event) => setDraft({ ...current, meta_title: event.target.value })} /></label>
        <label className="grid gap-1 text-sm">Meta description<textarea className={fieldClass} value={String(current.meta_description ?? "")} onChange={(event) => setDraft({ ...current, meta_description: event.target.value })} /></label>
        <label className="grid gap-1 text-sm">Canonical site URL<input className={fieldClass} placeholder="https://www.hksofttech.in" value={String(current.canonical_base ?? "")} onChange={(event) => setDraft({ ...current, canonical_base: event.target.value })} /></label>
        <Check label="Allow indexing" checked={Boolean(current.robots_index)} onChange={(robots_index) => setDraft({ ...current, robots_index })} />
        <p className="text-xs text-muted">Per-page titles live on each service, project and article. The sitemap stays available. Indexing off adds a noindex hint without blocking the public pages.</p>
        <button type="button" className="w-fit rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent" onClick={() => run(() => save({ data: { meta_title: String(current.meta_title ?? ""), meta_description: String(current.meta_description ?? ""), canonical_base: String(current.canonical_base ?? ""), robots_index: Boolean(current.robots_index) } }), reload)}>Save SEO</button>
      </div>
    </Panel>
  );
}

export function TeamPanel() {
  const load = useServerFn(listTeam);
  const save = useServerFn(setRole);
  const access = useAccess();
  const { data, error, loading, reload } = useLoader(() => load());
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load the team."}</Notice>;
  return (
    <Panel title="Roles">
      <p className="mb-3 text-sm text-muted">People appear after they sign in. There is no public admin registration. The first signed-in person becomes super admin if the studio has none.</p>
      <ul className="space-y-3">
        {data.map((person) => (
          <li key={String(person.user_id)} className="flex flex-col gap-2 rounded-xl border border-line p-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium">{String(person.name)}</p>
              <p className="text-muted">{String(person.email)}</p>
            </div>
            <select
              className={fieldClass}
              value={String(person.role)}
              onChange={(event) => run(() => save({ data: { user_id: String(person.user_id), role: event.target.value } }), reload)}
              disabled={access.role !== "super_admin" && access.role !== "admin"}
            >
              <option value="none">No access</option>
              {STAFF_ROLES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function ActivityPanel() {
  const load = useServerFn(listActivity);
  const { data, error, loading } = useLoader(() => load());
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load activity."}</Notice>;
  return (
    <Panel title="Activity">
      {data.length === 0 ? <p className="text-sm text-muted">No actions recorded.</p> : (
        <ul className="divide-y divide-line text-sm">
          {data.map((item) => (
            <li key={String(item.id)} className="grid gap-1 py-3 sm:grid-cols-4">
              <span>{String(item.actor)}</span>
              <span>{String(item.action)}</span>
              <span className="text-muted">{String(item.record_ref)}</span>
              <span className="text-muted">{String(item.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export function SettingsPanel() {
  const load = useServerFn(getSettingsAdmin);
  const save = useServerFn(saveSettings);
  const { data, error, loading, reload } = useLoader(() => load());
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  if (loading) return <Skeleton />;
  if (error || !data) return <Notice>{error ?? "Unable to load settings."}</Notice>;
  const current = draft ?? data;
  const fields = ["company_name", "tagline", "phone", "whatsapp", "email", "address", "hours", "linkedin_url", "instagram_url", "github_url"] as const;
  return (
    <Panel title="Company settings">
      <div className="grid gap-3">
        {fields.map((key) => (
          <label key={key} className="grid gap-1 text-sm">
            {key.replaceAll("_", " ")}
            <input className={fieldClass} value={String(current[key] ?? "")} onChange={(event) => setDraft({ ...current, [key]: event.target.value })} />
          </label>
        ))}
        <button type="button" className="w-fit rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent" onClick={() => run(() => save({ data: Object.fromEntries(fields.map((key) => [key, String(current[key] ?? "")])) }), reload)}>Save settings</button>
      </div>
    </Panel>
  );
}
