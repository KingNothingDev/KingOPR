import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ImagePlus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { OPR_LABELS, OprData, OprLanguage, OprPhoto } from '../types/opr';
import { processUploadedImage } from '../utils/imageUtils';

interface OprFormProps {
  data: OprData;
  onChange: (next: OprData) => void;
  onLanguageSwitch: (lang: OprLanguage) => void;
  photoInputRef: React.RefObject<HTMLInputElement | null>;
}

const MAX_PHOTOS = 6;

export const OprForm: React.FC<OprFormProps> = ({
  data,
  onChange,
  onLanguageSwitch,
  photoInputRef,
}) => {
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const labels = OPR_LABELS[data.language];

  const updateField = <K extends keyof OprData>(key: K, value: OprData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const handleLogoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file for the logo.');
      return;
    }
    try {
      setUploadError(null);
      const dataUrl = await processUploadedImage(file, 480, 0.92);
      updateField('logoUrl', dataUrl);
    } catch {
      setUploadError('Could not process logo image.');
    }
  };

  const handlePhotoFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadError(null);

    const remaining = MAX_PHOTOS - data.photos.length;
    if (remaining <= 0) {
      setUploadError('Maximum 6 photos allowed. Remove a photo to add another.');
      return;
    }

    const validFiles = Array.from(fileList)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining);

    if (validFiles.length === 0) {
      setUploadError('Please select valid image files (JPG, PNG, or WebP).');
      return;
    }

    if (fileList.length > remaining) {
      setUploadError(
        `Added ${validFiles.length} photo(s). Maximum limit is ${MAX_PHOTOS} photos.`
      );
    }

    setIsProcessing(true);
    try {
      const processed: OprPhoto[] = await Promise.all(
        validFiles.map(async (file, i) => {
          const dataUrl = await processUploadedImage(file, 1400, 0.86);
          return {
            id: `photo-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
            dataUrl,
            caption: '',
            name: file.name,
          };
        })
      );
      updateField('photos', [...data.photos, ...processed]);
    } catch {
      setUploadError('Failed to process one or more photos.');
    } finally {
      setIsProcessing(false);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (id: string) => {
    updateField(
      'photos',
      data.photos.filter((p) => p.id !== id)
    );
    setUploadError(null);
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= data.photos.length) return;
    const next = [...data.photos];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    updateField('photos', next);
  };

  const updatePhotoCaption = (id: string, caption: string) => {
    updateField(
      'photos',
      data.photos.map((p) => (p.id === id ? { ...p, caption } : p))
    );
  };

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors';

  const labelClass = 'block text-[12px] font-semibold text-slate-700 mb-1.5';

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Compact Form Language Bar */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-[14px] font-bold text-slate-900 leading-tight">
            Report Details
          </h2>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Fill activity details & attach up to 6 photos
          </p>
        </div>

        <div
          className="flex items-center p-0.5 bg-slate-100 rounded-lg shrink-0"
          role="group"
          aria-label="Report language"
        >
          <button
            type="button"
            onClick={() => onLanguageSwitch('bm')}
            className={`px-2.5 py-1 text-[11.5px] font-semibold rounded-md transition-colors whitespace-nowrap ${
              data.language === 'bm'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            BM
          </button>
          <button
            type="button"
            onClick={() => onLanguageSwitch('en')}
            className={`px-2.5 py-1 text-[11.5px] font-semibold rounded-md transition-colors whitespace-nowrap ${
              data.language === 'en'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Scrollable Form Fields */}
      <div className="flex-1 overflow-y-auto workspace-scroll divide-y divide-slate-200/80">
        {/* Section 1: Organization & Logo */}
        <section className="p-5 space-y-3.5">
          <h3 className="text-[13px] font-bold text-slate-900">
            01. Organization & Header
          </h3>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
              {data.logoUrl ? (
                <img
                  src={data.logoUrl}
                  alt="Uploaded logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <Upload className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-slate-800">
                School / Organization Logo
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="px-3 py-1.5 text-[12px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  {data.logoUrl ? 'Change Logo' : 'Upload Logo'}
                </button>
                {data.logoUrl && (
                  <button
                    type="button"
                    onClick={() => updateField('logoUrl', null)}
                    className="px-2.5 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLogoUpload(e.target.files)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-5">
              <label htmlFor="opr-badge" className={labelClass}>
                Header Tag
              </label>
              <input
                id="opr-badge"
                type="text"
                value={data.reportBadge}
                onChange={(e) => updateField('reportBadge', e.target.value)}
                placeholder="OPR 2026"
                className={inputClass}
              />
            </div>
            <div className="col-span-7">
              <label htmlFor="opr-unit" className={labelClass}>
                {labels.organizer}
              </label>
              <input
                id="opr-unit"
                type="text"
                value={data.organizerUnit}
                onChange={(e) => updateField('organizerUnit', e.target.value)}
                placeholder="Unit Kurikulum / Department"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="opr-org" className={labelClass}>
              School / Organization Name
            </label>
            <input
              id="opr-org"
              type="text"
              value={data.organizationName}
              onChange={(e) => updateField('organizationName', e.target.value)}
              placeholder="e.g. Sekolah Kebangsaan Seri Aman"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="opr-org-sub" className={labelClass}>
              School Code / Address (Optional)
            </label>
            <input
              id="opr-org-sub"
              type="text"
              value={data.organizationSub}
              onChange={(e) => updateField('organizationSub', e.target.value)}
              placeholder="e.g. ABA6010 · 34000 Taiping, Perak"
              className={inputClass}
            />
          </div>
        </section>

        {/* Section 2: Activity Details */}
        <section className="p-5 space-y-3.5">
          <h3 className="text-[13px] font-bold text-slate-900">
            02. Activity Information
          </h3>

          <div>
            <label htmlFor="opr-title" className={labelClass}>
              Activity / Program Title
            </label>
            <input
              id="opr-title"
              type="text"
              value={data.activityTitle}
              onChange={(e) => updateField('activityTitle', e.target.value)}
              placeholder="e.g. Pentaksiran Kompetensi dan Literasi (PKL) 2026"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="opr-subtitle" className={labelClass}>
              Short Tagline / Subtitle (Optional)
            </label>
            <input
              id="opr-subtitle"
              type="text"
              value={data.subtitle}
              onChange={(e) => updateField('subtitle', e.target.value)}
              placeholder="One-line summary of the program focus"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="opr-date" className={labelClass}>
                {labels.date}
              </label>
              <input
                id="opr-date"
                type="text"
                value={data.date}
                onChange={(e) => updateField('date', e.target.value)}
                placeholder="17 – 19 Ogos 2026"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="opr-day" className={labelClass}>
                {labels.day}
              </label>
              <input
                id="opr-day"
                type="text"
                value={data.day}
                onChange={(e) => updateField('day', e.target.value)}
                placeholder="Isnin – Rabu"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="opr-time" className={labelClass}>
                {labels.time}
              </label>
              <input
                id="opr-time"
                type="text"
                value={data.time}
                onChange={(e) => updateField('time', e.target.value)}
                placeholder="8.00 pagi – 1.00 tengah hari"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="opr-venue" className={labelClass}>
                {labels.venue}
              </label>
              <input
                id="opr-venue"
                type="text"
                value={data.venue}
                onChange={(e) => updateField('venue', e.target.value)}
                placeholder="Makmal Komputer"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="opr-target" className={labelClass}>
              {labels.targetGroup}
            </label>
            <input
              id="opr-target"
              type="text"
              value={data.targetGroup}
              onChange={(e) => updateField('targetGroup', e.target.value)}
              placeholder="Semua Murid Tahap 2"
              className={inputClass}
            />
          </div>
        </section>

        {/* Section 3: Activity Photos (Up to 6) */}
        <section className="p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-slate-900">
              03. Activity Photos
            </h3>
            <span className="text-[12px] font-mono-tabular text-slate-500">
              {data.photos.length} / {MAX_PHOTOS} attached
            </span>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handlePhotoFiles(e.dataTransfer.files);
            }}
            className={`rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
              isDragging
                ? 'border-slate-900 bg-slate-50'
                : data.photos.length >= MAX_PHOTOS
                ? 'border-slate-200 bg-slate-50/60 opacity-65'
                : 'border-slate-300 bg-slate-50/50 hover:border-slate-400'
            }`}
          >
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handlePhotoFiles(e.target.files)}
            />
            <div className="flex flex-col items-center gap-1.5">
              <ImagePlus className="w-5 h-5 text-slate-500" />
              <p className="text-[12.5px] font-medium text-slate-700 m-0">
                {isProcessing
                  ? 'Processing images...'
                  : data.photos.length >= MAX_PHOTOS
                  ? 'Maximum of 6 photos reached'
                  : 'Drop photos here or select from device'}
              </p>
              <p className="text-[11.5px] text-slate-500 m-0">
                JPG, PNG, WebP · Auto-fitted to any random OPR layout
              </p>
              {data.photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => photoInputRef.current?.click()}
                  className="mt-1.5 px-3.5 py-1.5 text-[12px] font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  Choose Photos ({MAX_PHOTOS - data.photos.length} left)
                </button>
              )}
            </div>
          </div>

          {uploadError && (
            <div className="flex items-center justify-between gap-2 text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <span>{uploadError}</span>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                aria-label="Dismiss message"
                className="text-amber-700 hover:text-amber-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Uploaded Photo Grid */}
          {data.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5">
              {data.photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="rounded-lg border border-slate-200 bg-white overflow-hidden"
                >
                  <div className="relative h-24 bg-slate-100">
                    <img
                      src={photo.dataUrl}
                      alt={photo.caption || `Uploaded photo ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => movePhoto(idx, -1)}
                          title="Move earlier"
                          className="w-6 h-6 rounded-md bg-slate-900/75 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      )}
                      {idx < data.photos.length - 1 && (
                        <button
                          type="button"
                          onClick={() => movePhoto(idx, 1)}
                          title="Move later"
                          className="w-6 h-6 rounded-md bg-slate-900/75 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        title="Remove photo"
                        className="w-6 h-6 rounded-md bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="p-1.5 border-t border-slate-100">
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) =>
                        updatePhotoCaption(photo.id, e.target.value)
                      }
                      placeholder={`Caption #${idx + 1} (optional)`}
                      className="w-full text-[11.5px] text-slate-700 placeholder:text-slate-400 px-1.5 py-0.5 rounded focus:outline-none focus:bg-slate-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 4: Report Summary */}
        <section className="p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-slate-900">
              04. Report Summary
            </h3>
            <span className="text-[11.5px] text-slate-500">
              One line per bullet point
            </span>
          </div>

          <div>
            <label htmlFor="opr-objectives" className={labelClass}>
              {labels.objectives}
            </label>
            <textarea
              id="opr-objectives"
              rows={3}
              value={data.objectives}
              onChange={(e) => updateField('objectives', e.target.value)}
              placeholder="List key objectives (one per line)"
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>

          <div>
            <label htmlFor="opr-implementation" className={labelClass}>
              {labels.implementation}
            </label>
            <textarea
              id="opr-implementation"
              rows={3}
              value={data.implementation}
              onChange={(e) => updateField('implementation', e.target.value)}
              placeholder="Summarize what happened during the activity"
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>

          <div>
            <label htmlFor="opr-impact" className={labelClass}>
              {labels.impact}
            </label>
            <textarea
              id="opr-impact"
              rows={3}
              value={data.impact}
              onChange={(e) => updateField('impact', e.target.value)}
              placeholder="Key outcomes, attendance, or positive impact"
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>

          <div>
            <label htmlFor="opr-reflection" className={labelClass}>
              {labels.reflection}
            </label>
            <textarea
              id="opr-reflection"
              rows={2}
              value={data.reflection}
              onChange={(e) => updateField('reflection', e.target.value)}
              placeholder="Concluding remarks or recommendations"
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>
        </section>

        {/* Section 5: Sign-Off & Footer */}
        <section className="p-5 space-y-3.5">
          <h3 className="text-[13px] font-bold text-slate-900">
            05. Sign-Off & Contact
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="opr-prep-name" className={labelClass}>
                {labels.preparedBy}
              </label>
              <input
                id="opr-prep-name"
                type="text"
                value={data.preparedByName}
                onChange={(e) => updateField('preparedByName', e.target.value)}
                placeholder="Name"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="opr-prep-role" className={labelClass}>
                Position / Role
              </label>
              <input
                id="opr-prep-role"
                type="text"
                value={data.preparedByRole}
                onChange={(e) => updateField('preparedByRole', e.target.value)}
                placeholder="Coordinator / Teacher"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="opr-ver-name" className={labelClass}>
                {labels.verifiedBy} (Optional)
              </label>
              <input
                id="opr-ver-name"
                type="text"
                value={data.verifiedByName}
                onChange={(e) => updateField('verifiedByName', e.target.value)}
                placeholder="Principal / Head"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="opr-ver-role" className={labelClass}>
                Position / Role
              </label>
              <input
                id="opr-ver-role"
                type="text"
                value={data.verifiedByRole}
                onChange={(e) => updateField('verifiedByRole', e.target.value)}
                placeholder="Guru Besar / Director"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="opr-contact" className={labelClass}>
              Footer Contact / Email (Optional)
            </label>
            <input
              id="opr-contact"
              type="text"
              value={data.contactInfo}
              onChange={(e) => updateField('contactInfo', e.target.value)}
              placeholder="school@moe.edu.my · 05-807 6199"
              className={inputClass}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
