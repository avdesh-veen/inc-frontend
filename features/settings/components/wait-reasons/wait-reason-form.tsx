'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { WaitCategory, WaitReason } from '@/features/settings/types';

interface FormData {
  id: string;
  label: string;
  category: WaitCategory;
  pausesSLA: boolean;
  warningDays: number;
  criticalDays: number;
  description: string;
}

export function WaitReasonForm() {
  const editingReasonId: string | null = null;
  /* eslint-disable @typescript-eslint/no-unused-vars -- stub handlers until form is wired */
  const getReasonById = (id: string): WaitReason | null => null;
  const addWaitReason = (reason: Partial<WaitReason>) => {};
  const updateWaitReason = (id: string, updates: Partial<WaitReason>) => {};
  const setEditingReasonId = (id: string | null) => {};
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const isEdit = typeof editingReasonId === 'string' && editingReasonId !== 'new';
  const existingReason = isEdit && editingReasonId ? getReasonById(editingReasonId) : null;
  
  const [formData, setFormData] = useState<FormData>({
    id: existingReason?.id ?? '',
    label: existingReason?.label ?? '',
    category: existingReason?.category ?? 'External',
    pausesSLA: existingReason?.pausesSLA ?? true,
    warningDays: existingReason?.warningDays ?? 0,
    criticalDays: existingReason?.criticalDays ?? 0,
    description: existingReason?.description ?? '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      setErrors((prevErrors) => {
        const updated = { ...prevErrors };
        delete updated[field as string];

        if (field === 'warningDays' || field === 'criticalDays') {
          const warning = field === 'warningDays' ? (value as number) : next.warningDays;
          const critical = field === 'criticalDays' ? (value as number) : next.criticalDays;

          if (critical > 0 && warning > 0 && critical <= warning) {
            updated.criticalDays = 'Critical days must be greater than warning days';
          } else {
            delete updated.criticalDays;
          }
        }

        return updated;
      });

      return next;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.id.trim()) {
      newErrors.id = 'Reason ID is required';
    } else if (!/^[A-Z_]+$/.test(formData.id)) {
      newErrors.id = 'ID must be uppercase with underscores (e.g., WAIT_PAYER_RESPONSE)';
    }

    if (!formData.label.trim()) {
      newErrors.label = 'Display label is required';
    }

    if (formData.warningDays < 1) {
      newErrors.warningDays = 'Warning days must be at least 1';
    }

    if (formData.criticalDays < 1) {
      newErrors.criticalDays = 'Critical days must be at least 1';
    } else if (formData.criticalDays <= formData.warningDays) {
      newErrors.criticalDays = 'Critical days must be greater than warning days';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const reasonData = {
      id: formData.id,
      label: formData.label,
      category: formData.category,
      pausesSLA: formData.pausesSLA,
      warningDays: formData.warningDays,
      criticalDays: formData.criticalDays,
      description: formData.description,
      status: 'Active' as const,
    };

    if (isEdit && existingReason) {
      updateWaitReason(existingReason.id, reasonData);
    } else {
      addWaitReason(reasonData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setEditingReasonId(null)}
              className="p-2 rounded-lg hover:bg-glass-bg text-text-70 hover:text-foreground transition-colors"
              title="Back to list"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {isEdit ? 'Edit Wait Reason' : 'Create Wait Reason'}
              </h2>
              <p className="text-xs text-text-50 mt-0.5">
                Define a wait state that cases can enter during processing
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setEditingReasonId(null)}
              variant="ghost"
              className="bg-glass-bg text-text-70 hover:bg-border-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-600 hover:to-blue-600"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {isEdit ? 'Update Wait Reason' : 'Create Wait Reason'}
            </Button>
          </div>
        </div>

        {/* Form Content - 2 Column Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT COLUMN: Basic Info */}
          <div className="space-y-5">
            <div className="rounded-xl bg-glass-bg border border-border-10 p-4">
              <h3 className="text-sm font-bold text-text-70 mb-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Wait State Identity
              </h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="id" className="text-xs text-text-50 mb-1">
                    Reason ID *
                  </Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => handleChange('id', e.target.value.toUpperCase())}
                    placeholder="e.g., WAIT_PAYER_RESPONSE"
                    disabled={isEdit}
                    className={`bg-glass-bg border-border-10 text-foreground ${
                      errors.id ? 'border-rose-500' : ''
                    }`}
                  />
                  {errors.id && <p className="text-xs text-rose-400 mt-1">{errors.id}</p>}
                  {!isEdit && (
                    <p className="text-[10px] text-text-50 mt-1">
                      Uppercase with underscores (cannot be changed after creation)
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="label" className="text-xs text-text-50 mb-1">
                    Display Label *
                  </Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => handleChange('label', e.target.value)}
                    placeholder="e.g., Awaiting Payer Response"
                    className={`bg-glass-bg border-border-10 text-foreground ${
                      errors.label ? 'border-rose-500' : ''
                    }`}
                  />
                  {errors.label && <p className="text-xs text-rose-400 mt-1">{errors.label}</p>}
                </div>

                <div>
                  <Label htmlFor="description" className="text-xs text-text-50 mb-1">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Explain when this wait state is used..."
                    rows={3}
                    className="bg-glass-bg border-border-10 text-foreground resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="rounded-xl bg-glass-bg border border-border-10 p-4">
              <h3 className="text-sm font-bold text-text-70 mb-3">Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleChange('category', 'external')}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    formData.category === 'External'
                      ? 'bg-amber-500/20 border border-amber-500/50'
                      : 'bg-glass-bg border border-border-10 hover:bg-border-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-amber-300">External Wait</span>
                  </div>
                  <p className="text-xs text-text-50">
                    Waiting on external parties (payer, board, provider)
                  </p>
                </button>

                <button
                  onClick={() => handleChange('category', 'internal')}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    formData.category === 'Internal'
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'bg-glass-bg border border-border-10 hover:bg-border-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-blue-300">Internal Wait</span>
                  </div>
                  <p className="text-xs text-text-50">
                    Internal processes (QA review, approvals, legal review)
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Configuration */}
          <div className="space-y-5">
            {/* SLA Behavior */}
            <div className="rounded-xl bg-glass-bg border border-border-10 p-4">
              <h3 className="text-sm font-bold text-text-70 mb-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                SLA Behavior
              </h3>

              <div className="flex items-center justify-between p-3 rounded-lg bg-glass-bg">
                <div>
                  <Label htmlFor="pausesSLA" className="text-sm text-foreground font-medium">
                    Pauses SLA Clock
                  </Label>
                  <p className="text-xs text-text-50 mt-0.5">
                    {formData.pausesSLA
                      ? 'SLA timer stops while in this wait state'
                      : 'SLA timer continues running'}
                  </p>
                </div>
                <Switch
                  id="pausesSLA"
                  checked={formData.pausesSLA}
                  onCheckedChange={(checked) => handleChange('pausesSLA', checked)}
                />
              </div>

              <p className="text-[10px] text-text-50 mt-3">
                <strong>Tip:</strong> External waits typically pause SLA, internal waits typically
                don&apos;t.
              </p>
            </div>

            {/* Threshold Configuration */}
            <div className="rounded-xl bg-glass-bg border border-border-10 p-4">
              <h3 className="text-sm font-bold text-text-70 mb-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Alert Thresholds
              </h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="warningDays" className="text-xs text-text-50 mb-1">
                    Warning Threshold (days) *
                  </Label>
                  <Input
                    id="warningDays"
                    type="number"
                    min="1"
                    value={formData.warningDays}
                    onChange={(e) => handleChange('warningDays', parseInt(e.target.value, 10) || 0)}
                    onFocus={(e) => e.target.select()}
                    className={`bg-glass-bg border-border-10 text-foreground ${
                      errors.warningDays ? 'border-rose-500' : ''
                    }`}
                  />
                  {errors.warningDays && (
                    <p className="text-xs text-rose-400 mt-1">{errors.warningDays}</p>
                  )}
                  <p className="text-[10px] text-text-50 mt-1">
                    Show amber warning indicator after this many days
                  </p>
                </div>

                <div>
                  <Label htmlFor="criticalDays" className="text-xs text-text-50 mb-1">
                    Critical Threshold (days) *
                  </Label>
                  <Input
                    id="criticalDays"
                    type="number"
                    min={formData.warningDays + 1}
                    value={formData.criticalDays}
                    onChange={(e) => handleChange('criticalDays', parseInt(e.target.value, 10) || 0)}
                    onFocus={(e) => e.target.select()}
                    className={`bg-glass-bg border-border-10 text-foreground ${
                      errors.criticalDays ? 'border-rose-500' : ''
                    }`}
                  />
                  {errors.criticalDays && (
                    <p className="text-xs text-rose-400 mt-1">{errors.criticalDays}</p>
                  )}
                  <p className="text-[10px] text-text-50 mt-1">
                    Must be greater than warning threshold — show red critical indicator after this many days
                  </p>
                </div>
              </div>

              {/* Visual Preview */}
              <div className="mt-4 pt-4 border-t border-border-10">
                <p className="text-[10px] text-text-50 mb-2">Timeline Preview</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-emerald-500/20 rounded-full relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-amber-500/40 rounded-full"
                      style={{
                        width: `${formData.criticalDays > 0 ? (formData.warningDays / formData.criticalDays) * 100 : 0}%`,
                      }}
                    />
                    <div
                      className="absolute top-0 right-0 h-full bg-rose-500/40 rounded-full"
                      style={{
                        width: `${
                          formData.criticalDays > 0
                            ? ((formData.criticalDays - formData.warningDays) / formData.criticalDays) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1 text-[9px]">
                  <span className="text-emerald-400">0d</span>
                  <span className="text-amber-400">{formData.warningDays}d</span>
                  <span className="text-rose-400">{formData.criticalDays}d</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
