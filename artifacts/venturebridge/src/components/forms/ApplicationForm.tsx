import { ArrowRight } from 'lucide-react';
import { Field } from '../common/FormField';

export interface ApplicationFormProps {
  name: string;
  defaultEmail?: string;
  defaultUniversity?: string;
  defaultProjectName?: string;
  defaultCategory?: string;
  onSubmit: (form: HTMLFormElement) => void;
  onCancel: () => void;
}

export default function ApplicationForm({
  name,
  defaultEmail,
  defaultUniversity,
  defaultProjectName,
  defaultCategory = 'Retail',
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e.currentTarget);
      }}
      className="space-y-5"
    >
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
          Creator & Project Info
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Founder name" name="founder" defaultValue={name} />
          <Field label="University / College" name="university" defaultValue={defaultUniversity} placeholder="IIT / BITS / DU etc." />
          <Field
            label="Contact email"
            name="email"
            type="email"
            defaultValue={defaultEmail}
            placeholder="founder@college.edu"
          />
          <Field label="Project name" name="name" defaultValue={defaultProjectName} placeholder="Idea / Project name" />
          <Field
            label="One tag-line (Optional)"
            name="tagline"
            required={false}
            placeholder="A clear, memorable sentence (Optional)"
          />
          <label className="block text-xs font-semibold text-slate-600">
            Sector Category<span className="ml-1 text-[#b75f59]">*</span>
            <select
              required
              name="category"
              defaultValue={defaultCategory || "Retail"}
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-[#76a0c6]"
            >
              <option value="Retail">Retail</option>
              <option value="Agritech">Agritech</option>
              <option value="Clean Energy">Clean Energy</option>
              <option value="EdTech">EdTech</option>
              <option value="Environment">Environment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="IoT">IoT</option>
              <option value="Logistics">Logistics</option>
              <option value="Service">Service</option>
            </select>
          </label>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
          The Opportunity & Solution
        </p>
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-600">
            What are you building?<span className="ml-1 text-[#b75f59]">*</span>
            <textarea
              required
              name="description"
              rows={3}
              minLength={20}
              placeholder="Describe the problem, who experiences it, and how your project solves it."
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Business model<span className="ml-1 text-[#b75f59]">*</span>
            <textarea
              required
              name="businessModel"
              rows={2}
              placeholder="How will the project generate revenue or sustain operations?"
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Planned use of funds<span className="ml-1 text-[#b75f59]">*</span>
            <textarea
              required
              name="useOfFunds"
              rows={2}
              placeholder="What key milestone will this funding help reach?"
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
            />
          </label>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Funding requested (in Lakhs)"
          name="requestedAmount"
          type="number"
          placeholder="18"
          hint="e.g. 18 for ₹ 18 Lakhs."
        />
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
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1877f2] px-5 text-xs font-bold text-white transition hover:bg-[#1264ce]"
        >
          <span>List Project</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </form>
  );
}
