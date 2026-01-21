import { PRESETS, type Preset } from '@/data/presets'

interface PresetSelectorProps {
  onSelectPreset: (preset: Preset) => void
  availableCountries: string[] // ISO A3 codes available in data
}

export function PresetSelector({ onSelectPreset, availableCountries }: PresetSelectorProps) {
  // Filter presets to only show those where at least one country is available
  const availablePresets = PRESETS.filter((preset) =>
    preset.countries.some((code) => availableCountries.includes(code))
  )

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="font-semibold text-gray-800 mb-3">
        Try a Comparison
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Click to see how Mercator distorts these countries
      </p>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {availablePresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{preset.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 group-hover:text-blue-700 truncate">
                  {preset.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {preset.description}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {availablePresets.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">
          No presets available for loaded countries
        </p>
      )}
    </div>
  )
}
