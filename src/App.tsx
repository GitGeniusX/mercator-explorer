function App() {
  return (
    <div className="min-h-screen bg-map-water flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Mercator Explorer
        </h1>
        <p className="text-gray-600">
          Interactive demonstration of Mercator projection distortion.
          Drag countries to different latitudes to see their true relative sizes.
        </p>
      </div>
    </div>
  )
}

export default App
