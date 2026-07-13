import { listMockUserPreferenceSettings } from "@chainvigil/risk-core";

const settings = listMockUserPreferenceSettings();

export default function SettingsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">设置</h1>
      <section className="mt-8 space-y-4">
        {settings.map((item) => (
          <div key={item.id} className="border border-emerald-300/14 bg-black/20 p-5 text-emerald-50/75">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
              {item.category} · {item.editableInV0 ? "editable" : "read only"}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white">{item.title}</h2>
            <p className="mt-2 text-sm text-emerald-50/75">{item.valueLabel}</p>
            <p className="mt-3 text-sm leading-6 text-emerald-50/60">{item.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
