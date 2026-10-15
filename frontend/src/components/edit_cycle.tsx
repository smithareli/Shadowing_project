import { useState } from "react";

export type Cycle = {
    start_date:string;
    end_date:string;
    is_current?:boolean;
    is_predicted?:boolean;
}
export function expandRange(start: string, end: string): string[] {
  const days: string[] = [];
  const d = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  while (d <= last) {
    days.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return days;
}
export function useCycleEdit(cycles: Cycle[], backendUrl: string, onSaved: (cycles: Cycle[]) => void) {
    const [editMode, setEditMode] = useState(false);
    const [draft, setDraft] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    const startEditing = () =>{
        const current = cycles.find((c)=> c.is_current);
        setDraft(new Set(current ? expandRange(current.start_date, current.end_date) : []));
        setEditMode(true);
    };
    const toggleDay = (day: string) => {
        setDraft((prev) => {
            const next = new Set(prev);
            if (next.has(day)) next.delete(day);
            else next.add(day);
            return next;
        });
    };
    const cancel = () => setEditMode(false);
    const save = async () => {
        if(draft.size === 0) return;
        setIsSaving(true);
        try {
           const res = await fetch(`${backendUrl}/current-cycle`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cycles: [...draft] }),
           });
           if(!res.ok) throw new Error(`HTTP ${res.status}`);
           const json = await res.json();
           onSaved(json.cycles);
           setEditMode(false);
        } catch (error) {
              console.error('Error saving cycle:', error);
        } finally {
            setIsSaving(false);

        }
    };
    return { editMode, draft, isSaving, startEditing, toggleDay, cancel, save };
}
