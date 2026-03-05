import { useState } from "react";
import {
  Calendar,
  Loader2,
  X,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DayPicker } from "react-day-picker";

interface BackfillDialogProps {
  onClose: () => void;
  onSubmit: (date: string) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
}

export default function BackfillDialog({
  onClose,
  onSubmit,
  isSubmitting,
  submitError,
}: BackfillDialogProps) {
  const [selected, setSelected] = useState<Date | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const iso = selected.toISOString().split("T")[0];
    await onSubmit(iso);
  };

  const today = new Date();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-white/10 rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Import Historical Videos
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Import older videos from your YouTube channel. Select the start date
          below — we'll process everything from that date to today.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Import videos from this date onwards
            </label>
            <div className="flex justify-center">
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={setSelected}
                disabled={{ after: today }}
                startMonth={new Date(2005, 0)}
                endMonth={today}
                defaultMonth={
                  new Date(today.getFullYear(), today.getMonth() - 1)
                }
                components={{
                  Chevron: ({ orientation }) =>
                    orientation === "left" ? (
                      <ChevronLeft className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ),
                }}
                classNames={{
                  root: "rdp-dark",
                  months: "relative flex flex-col",
                  month_caption: "flex justify-center items-center h-10",
                  caption_label: "text-sm font-semibold text-white",
                  nav: "absolute top-0 left-0 right-0 flex justify-between items-center h-10 z-10",
                  button_previous:
                    "h-10 w-10 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors rounded-lg hover:bg-white/5",
                  button_next:
                    "h-10 w-10 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors rounded-lg hover:bg-white/5",
                  weekdays: "flex",
                  weekday:
                    "w-10 text-center text-xs font-medium text-gray-600 py-2",
                  week: "flex",
                  day: "p-0",
                  day_button:
                    "h-10 w-10 text-sm rounded-lg transition-colors text-gray-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50",
                  selected:
                    "!bg-orange-500 !text-black font-semibold hover:!bg-orange-400",
                  today: "font-bold text-orange-500",
                  disabled:
                    "!text-gray-700 !cursor-not-allowed hover:!bg-transparent",
                  outside: "text-gray-700",
                  month_grid: "",
                }}
              />
            </div>
            {selected && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Importing videos from{" "}
                <span className="text-orange-400 font-medium">
                  {selected.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>{" "}
                to today
              </p>
            )}
          </div>

          {submitError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
              {submitError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !selected}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Import Videos
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs text-gray-500">
            <Info className="inline h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <strong className="text-gray-400">Tip:</strong> This is a one-time
            import. New videos will be automatically processed going forward.
          </p>
        </div>
      </div>
    </div>
  );
}
