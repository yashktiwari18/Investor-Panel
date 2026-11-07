import { ArrowRight, Coins } from 'lucide-react';
import { Field } from '../common/FormField';

export interface RaiseFundFormProps {
  name: string;
  defaultEmail?: string;
  defaultUniversity?: string;
  defaultProjectName?: string;
  defaultCategory?: string;
  onSubmit: (form: HTMLFormElement) => void;
  onCancel: () => void;
}

export default function RaiseFundForm({
  name,
  defaultEmail,
  defaultUniversity,
  defaultProjectName,
  defaultCategory = 'Agritech',
  onSubmit,
  onCancel,
}: RaiseFundFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e.currentTarget);
      }}
      className="space-y-5"
    >
      {/* Top Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Coins className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">
              Apply for Non-Dilutive Campus Grants & Angel Investment
            </h4>
            <p className="mt-0.5 text-[11px] leading-relaxed text-emerald-800">
              Ideal for creators and innovators who have an idea but lack funds, or need capital to scale an ongoing project. Fill out the application below to connect with active angel syndicates and grant reviewers.
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
          1. Creator & Contact Information
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Creator / Founder Name" name="founder" defaultValue={name} placeholder="e.g. Maya Chen" />
          <Field
            label="Contact Email"
            name="email"
            type="email"
            defaultValue={defaultEmail}
            placeholder="e.g. creator@domain.com"
          />
          <Field
            label="Phone / WhatsApp Contact"
            name="contact"
            type="tel"
            placeholder="e.g. +91 98765 43210"
          />
          <Field
            label="University / Institution / Organization"
            name="university"
            defaultValue={defaultUniversity}
            placeholder="e.g. IIT Bombay, Delhi University, or Independent"
            hint="Optional / Not mandatory"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
          2. Idea & Project Overview
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Idea / Project Name"
            name="name"
            defaultValue={defaultProjectName}
            placeholder="e.g. EcoPack Biomaterials"
          />
          <Field
            label="One tag-line (Optional)"
            name="tagline"
            required={false}
            placeholder="e.g. 100% biodegradable agricultural packaging to replace single-use plastic (Optional)"
          />
          <label className="block text-xs font-semibold text-slate-600">
            Sector Category<span className="ml-1 text-[#b75f59]">*</span>
            <select
              required
              name="category"
              defaultValue={defaultCategory || "Agritech"}
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-[#76a0c6]"
            >
              <option value="Agritech">Agritech</option>
              <option value="Clean Energy">Clean Energy</option>
              <option value="EdTech">EdTech</option>
              <option value="Environment">Environment & CleanTech</option>
              <option value="Healthcare">Healthcare & Bio</option>
              <option value="IoT">IoT & Hardware</option>
              <option value="Retail">Retail & Consumer</option>
              <option value="Service">Software / Service</option>
              <option value="Logistics">Logistics & Supply Chain</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Project Stage<span className="ml-1 text-[#b75f59]">*</span>
            <select
              required
              name="stage"
              defaultValue="Idea / Concept"
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-[#76a0c6]"
            >
              <option value="Idea / Concept">Idea / Concept (Need initial funds to build)</option>
              <option value="Prototype / MVP">Prototype / MVP (Working demo ready)</option>
              <option value="Pilot Testing">Pilot Testing (User feedback stage)</option>
              <option value="Early Revenue">Early Revenue (Paying customers)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
          3. Opportunity, Innovation & Business Model
        </p>
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-600">
            What is your idea or ongoing project?<span className="ml-1 text-[#b75f59]">*</span>
            <textarea
              required
              name="description"
              rows={3}
              minLength={20}
              placeholder="Describe the problem, who experiences it, and how your project or technology solves it."
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            How will it generate revenue or sustain operations?<span className="ml-1 text-[#b75f59]">*</span>
            <textarea
              required
              name="businessModel"
              rows={2}
              placeholder="E.g. Direct sales, subscription, B2B licensing, institutional contracts."
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
            />
          </label>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
          4. Funding Request & Use of Funds
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Funding Requested (in Lakhs INR)"
            name="requestedAmount"
            type="number"
            defaultValue="15"
            placeholder="15"
            hint="e.g. 15 for ₹ 15 Lakhs."
          />
          <Field
            label="Pitch Deck / Demo Video Link (Optional)"
            name="deckUrl"
            type="url"
            placeholder="https://drive.google.com/... or YouTube link"
            hint="Optional link to presentation slides or demo."
          />
        </div>
        <div className="mt-3">
          <label className="block text-xs font-semibold text-slate-600">
            Planned Use of Funds & Key Milestones<span className="ml-1 text-[#b75f59]">*</span>
            <textarea
              required
              name="useOfFunds"
              rows={2}
              placeholder="Explain how this capital will be spent (e.g. 40% prototyping, 30% lab testing, 30% field trials) and what milestone it reaches."
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
        >
          <Coins className="size-4" />
          <span>Submit Fund-Raising Application</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </form>
  );
}
