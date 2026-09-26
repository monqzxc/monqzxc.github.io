"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch, type UseFormReturn } from "react-hook-form";
import { ArrowLeft, ArrowUpRight, Download, FileText, LoaderCircle, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { blankCv, blankEntry, monCv, type CvData } from "@/lib/cv-data";
import type { CvPage } from "@/lib/cv-pdf";

type Group = "experience" | "education" | "training" | "awards";
function Entries({ group, form, singular }: { group: Group; form: UseFormReturn<CvData>; singular: string }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: group });
  return <div className="cv-entries">
    {fields.length === 0 && <p className="cv-empty">No {group === "awards" ? "recognition" : group} added. Empty sections stay off your CV.</p>}
    {fields.map((field, index) => <fieldset className="cv-entry" key={field.id}>
      <legend>{singular} {index + 1}</legend>
      <Button type="button" variant="ghost" size="icon" className="cv-remove" aria-label={`Remove ${singular.toLowerCase()} ${index + 1}`} onClick={() => remove(index)}><Trash2 /></Button>
      <div className="cv-field"><Label htmlFor={`${group}-${field.id}-title`}>{group === "experience" ? "Job title" : group === "education" ? "Degree or qualification" : "Title"}</Label><Input id={`${group}-${field.id}-title`} maxLength={160} {...form.register(`${group}.${index}.title`)} /></div>
      <div className="cv-field"><Label htmlFor={`${group}-${field.id}-org`}>{group === "experience" ? "Employer" : group === "education" ? "School or university" : "Organization"}</Label><Input id={`${group}-${field.id}-org`} maxLength={200} {...form.register(`${group}.${index}.organization`)} /></div>
      <div className="cv-field"><Label htmlFor={`${group}-${field.id}-period`}>{group === "training" ? "Date and duration" : "Dates"}</Label><Input id={`${group}-${field.id}-period`} placeholder={group === "experience" ? "January 2023 - Present" : "2024"} maxLength={100} {...form.register(`${group}.${index}.period`)} /></div>
      <div className="cv-field"><Label htmlFor={`${group}-${field.id}-details`}>Highlights <span className="cv-optional">optional</span></Label><Textarea id={`${group}-${field.id}-details`} rows={3} maxLength={4000} placeholder="One achievement or detail per line" {...form.register(`${group}.${index}.details`)} /></div>
    </fieldset>)}
    <Button type="button" variant="outline" className="cv-add" disabled={fields.length >= 20} onClick={() => append(blankEntry())}><Plus />Add {singular.toLowerCase()}</Button>
    {fields.length >= 20 && <p className="cv-hint">You can add up to 20 entries per section.</p>}
  </div>;
}
function PaperPreview({ pages }: { pages: CvPage[] }) {
  return <div className="cv-papers">{pages.map((page, index) => <svg key={index} className="cv-paper" viewBox="0 0 595.28 841.89" role="img" aria-label={`CV preview, page ${index + 1} of ${pages.length}`}>
    <title>CV preview, page {index + 1} of {pages.length}</title><rect width="595.28" height="841.89" fill="white" />
    {page.map((op, i) => op.kind === "line" ? <line key={i} x1={op.x} y1={op.y} x2={op.x2} y2={op.y2} stroke={op.color} strokeWidth={op.width} /> : <text key={i} x={op.x} y={op.y} fill={op.color} fontSize={op.size} fontFamily="CV Sans, sans-serif" fontWeight={op.bold ? 600 : 400} letterSpacing={op.spacing}>{op.text}</text>)}
  </svg>)}</div>;
}
export default function CvBuilder() {
  const form = useForm<CvData>({ defaultValues: monCv, mode: "onTouched" });
  const values = useWatch({ control: form.control }) as CvData;
  const [pages, setPages] = useState<CvPage[]>([]);
  const [previewError, setPreviewError] = useState("");
  const [exportStatus, setExportStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [exportFile, setExportFile] = useState<{url: string; filename: string} | null>(null);
  const downloadUrl = useRef<string | null>(null);
  useEffect(() => () => { if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current); }, []);
  const [updating, setUpdating] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [widePreview, setWidePreview] = useState(false);
  const id = useId();
  const previewRef = useRef<HTMLElement>(null);
  const { register, formState: { errors } } = form;
  useEffect(() => {
    let cancelled = false;
    setUpdating(true); setExportStatus(""); setExportFile(null);
    const timer = setTimeout(async () => {
      try {
        const { createCvDocument } = await import("@/lib/cv-pdf");
        const result = await createCvDocument(values);
        if (!cancelled) { setPages(result.pages); setPreviewError(""); }
      } catch (error) { if (!cancelled) { setPages([]); setPreviewError(error instanceof Error ? error.message : "Could not build the preview. Try again."); } }
      finally { if (!cancelled) setUpdating(false); }
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [values]);
  async function download(data: CvData) {
    setBusy(true); setExportStatus("");
    try {
      const { createCvDocument } = await import("@/lib/cv-pdf");
      const result = await createCvDocument(data);
      if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current);
      const url = URL.createObjectURL(result.doc.output("blob"));
      downloadUrl.current = url;
      setExportFile({ url, filename: result.filename });
      const link = document.createElement("a");
      link.href = url; link.download = result.filename;
      document.body.appendChild(link); link.click(); link.remove();
      setExportStatus("Your PDF is ready.");
    } catch (error) { setExportStatus(error instanceof Error ? error.message : "The PDF could not be exported. Please try again."); }
    finally { setBusy(false); }
  }
  function resetCv() {
    form.reset(blankCv()); setActiveTab("profile"); setExportStatus("");
    requestAnimationFrame(() => form.setFocus("name"));
  }
  const simple = (name: "name" | "role" | "email" | "phone" | "location" | "website", label: string, placeholder: string, required = false) => <div className="cv-field">
    <Label htmlFor={`${id}-${name}`}>{label}{!required && <span className="cv-optional">optional</span>}</Label>
    <Input id={`${id}-${name}`} placeholder={placeholder} type={name === "email" ? "email" : name === "phone" ? "tel" : "text"} autoComplete="off" maxLength={name === "name" ? 100 : 160} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${id}-${name}-error` : undefined} {...register(name, { validate: value => !required || !!value.trim() || `Add your ${label.toLowerCase()}.`, ...(name === "email" ? { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." } } : {}) })} />
    {errors[name] && <p className="cv-field-error" id={`${id}-${name}-error`}>{errors[name]?.message}</p>}
  </div>;
  return <div className="cv-studio">
    <a className="skip-link" href="#cv-editor">Skip to CV editor</a>
    <header className="cv-topbar"><a className="wordmark" href="/" aria-label="Mon portfolio"><strong>mon<span>.</span></strong><span className="cv-studio-name">CV STUDIO</span></a><a className="cv-back" href="/"><ArrowLeft size={16} />Back to portfolio</a></header>
    <main className="cv-workspace">
      <div className="cv-workspace-heading"><div><span className="eyebrow">YOUR NEXT CHAPTER</span><h1>A CV, made yours.</h1><p>Edit Mon’s example or start with a blank page.</p></div><a className="cv-owner-download" href="/cv/Anthony-Cabigayan-CV.pdf" download><FileText size={17} /><span>Download Mon’s CV<small>Software Engineer · PDF</small></span><ArrowUpRight size={16} /></a></div>
      <form noValidate onSubmit={form.handleSubmit(download, invalid => { setActiveTab("profile"); requestAnimationFrame(() => form.setFocus(invalid.name ? "name" : invalid.role ? "role" : "email")); })}>
        <div className="cv-toolbar"><div className="cv-private"><ShieldCheck size={16} /><span>Your details stay in this browser.</span></div><div className="cv-toolbar-actions">
          <AlertDialog><AlertDialogTrigger asChild><Button type="button" variant="outline" className="cv-reset">Start my CV</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Start a new CV?</AlertDialogTitle><AlertDialogDescription>This clears the current editor. Download your PDF first if you want to keep your changes.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep editing</AlertDialogCancel><AlertDialogAction onClick={resetCv}>Start blank</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
          <Button type="button" variant="outline" className="cv-mobile-preview" onClick={() => previewRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}>Preview</Button>
          <Button type="submit" className="cv-export" disabled={busy || !!previewError}>{busy ? <LoaderCircle className="cv-spinner" /> : <Download />}{busy ? "Exporting…" : "Export PDF"}</Button>
        </div></div>
        <div className="cv-export-status"><span role="status">{exportStatus}</span>{exportFile && <a href={exportFile.url} download={exportFile.filename}>Download PDF again <Download size={13} /></a>}</div>
        <div className="cv-layout">
          <section id="cv-editor" className="cv-editor" aria-label="CV editor">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="cv-tabs" aria-label="CV sections"><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="experience">Experience</TabsTrigger><TabsTrigger value="education">Education</TabsTrigger><TabsTrigger value="extras">Extras</TabsTrigger></TabsList>
              <TabsContent value="profile" className="cv-panel"><div className="cv-panel-heading"><h2>Make an introduction.</h2><p>Your name and title are required. Everything else is up to you.</p></div>
                {simple("name", "Full name", "Your full name", true)}{simple("role", "Professional title", "Software Engineer", true)}
                <div className="cv-field-row">{simple("email", "Email", "you@example.com")}{simple("phone", "Phone", "+63 …")}</div>
                {simple("location", "Location", "City, Country")}{simple("website", "Website or LinkedIn", "your-portfolio.com")}
                <div className="cv-field"><Label htmlFor={`${id}-summary`}>Profile summary <span className="cv-optional">optional</span></Label><Textarea id={`${id}-summary`} rows={5} maxLength={2000} placeholder="What you do, what you bring, and the work you care about." {...register("summary")} /></div>
                <div className="cv-field"><Label htmlFor={`${id}-skills`}>Skills <span className="cv-optional">optional</span></Label><Textarea id={`${id}-skills`} rows={4} maxLength={2000} placeholder="One skill or group per line" {...register("skills")} /></div>
              </TabsContent>
              <TabsContent value="experience" className="cv-panel"><div className="cv-panel-heading"><h2>Show your experience.</h2><p>Start with your most recent role. Include freelance work, too.</p></div><Entries group="experience" form={form} singular="Role" /></TabsContent>
              <TabsContent value="education" className="cv-panel"><div className="cv-panel-heading"><h2>Build on your foundations.</h2><p>Add your qualifications, starting with the most recent.</p></div><Entries group="education" form={form} singular="Qualification" /></TabsContent>
              <TabsContent value="extras" className="cv-panel"><div className="cv-panel-heading"><h2>The rest of your story.</h2><p>Include the credentials and interests that matter to you.</p></div>
                <div className="cv-field"><Label htmlFor={`${id}-eligibility`}>Eligibility or certifications</Label><Textarea id={`${id}-eligibility`} rows={3} maxLength={2000} {...register("eligibility")} /></div>
                <div className="cv-field"><Label htmlFor={`${id}-interests`}>Interests</Label><Textarea id={`${id}-interests`} rows={2} maxLength={1000} {...register("interests")} /></div>
                <h3 className="cv-subheading">Recognition</h3><Entries group="awards" form={form} singular="Recognition" />
                <h3 className="cv-subheading">Professional development</h3><Entries group="training" form={form} singular="Course" />
              </TabsContent>
            </Tabs>
            <p className="cv-session-note">Your draft stays in this tab. Export it before leaving or refreshing.</p>
          </section>
          <section ref={previewRef} className={`cv-preview ${widePreview ? "cv-preview-zoom" : ""}`} aria-label="Live CV preview"><div className="cv-preview-heading"><div><span className="cv-preview-label">LIVE PREVIEW</span><span className="cv-page-count" role="status">{updating ? "Updating…" : `${pages.length} ${pages.length === 1 ? "page" : "pages"} · A4`}</span></div><Button type="button" variant="ghost" size="sm" onClick={() => setWidePreview(!widePreview)} aria-pressed={widePreview}>{widePreview ? "Fit page" : "Zoom in"}</Button></div>
            {previewError ? <div className="cv-preview-error" role="alert"><FileText /><p>{previewError}</p><Button type="button" variant="outline" onClick={() => form.reset(form.getValues())}>Try again</Button></div> : pages.length ? <PaperPreview pages={pages} /> : <div className="cv-preview-loading"><LoaderCircle className="cv-spinner" />Preparing your preview…</div>}
            <p className="cv-preview-note">Clean type. Selectable text. Ready to send.</p>
          </section>
        </div>
      </form>
    </main>
    <footer className="cv-footer"><span>Made with care by Mon.</span><a href="/">Back to portfolio <ArrowUpRight size={14} /></a></footer>
  </div>;
}
